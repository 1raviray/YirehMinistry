/* =========================================================
   YIREH MINISTRY
   NODE.JS BACKEND

   FEATURES
   ---------------------------------------------------------
   - Express server
   - Helmet security
   - CORS
   - Rate limiting
   - Gmail API OAuth
   - Gmail API email sending
   - Anthems submission + attachments
   - Razorpay donation order creation
   - Razorpay payment verification
   - Razorpay webhook verification
========================================================= */

"use strict";


/* =========================================================
   DEPENDENCIES
========================================================= */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");

require("dotenv").config();


/* =========================================================
   APP
========================================================= */

const app = express();


/* =========================================================
   PORT
========================================================= */

const PORT =
    process.env.PORT || 10000;


/* =========================================================
   GMAIL
========================================================= */

const GMAIL_USER =
    process.env.GMAIL_USER ||
    "mylogin00000@gmail.com";


/* =========================================================
   GOOGLE OAUTH FILES
========================================================= */

const CREDENTIALS_PATH =
    path.join(
        __dirname,
        "credentials.json"
    );


const TOKEN_PATH =
    path.join(
        __dirname,
        "token.json"
    );


const REDIRECT_URI =
    "http://localhost:10000/oauth2callback";


const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];


/* =========================================================
   RAZORPAY CONFIGURATION
========================================================= */

const RAZORPAY_KEY_ID =
    process.env.RAZORPAY_KEY_ID;


const RAZORPAY_KEY_SECRET =
    process.env.RAZORPAY_KEY_SECRET;


const RAZORPAY_WEBHOOK_SECRET =
    process.env.RAZORPAY_WEBHOOK_SECRET;

    console.log(
        "Razorpay Key ID:",
        RAZORPAY_KEY_ID
    );
    
    console.log(
        "Razorpay Secret loaded:",
        Boolean(RAZORPAY_KEY_SECRET)
    );

let razorpay = null;


if (
    RAZORPAY_KEY_ID &&
    RAZORPAY_KEY_SECRET
) {

    razorpay =
        new Razorpay({

            key_id:
                RAZORPAY_KEY_ID,

            key_secret:
                RAZORPAY_KEY_SECRET

        });

} else {

    console.warn(
        "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env."
    );
}


/* =========================================================
   TEMPORARY RAZORPAY ORDER STORE

   IMPORTANT:
   This is only for testing.

   Replace with a database before production.
========================================================= */

const razorpayOrders =
    new Map();


/* =========================================================
   FILE LIMITS
========================================================= */

const MAX_FILE_SIZE =
    10 * 1024 * 1024; // 10 MB per file


const MAX_TOTAL_FILES =
    18 * 1024 * 1024; // 18 MB combined


/* =========================================================
   SECURITY
========================================================= */

app.use(
    helmet()
);


/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [

    "http://127.0.0.1:5500",

    "http://localhost:5500",
    "https://1raviray.github.io/"

];


app.use(
    cors({

        origin: function (
            origin,
            callback
        ) {

            /*
               Allow requests from tools such as
               Postman/curl that don't send Origin.
            */

            if (!origin) {

                return callback(
                    null,
                    true
                );
            }


            if (
                allowedOrigins.includes(
                    origin
                )
            ) {

                return callback(
                    null,
                    true
                );
            }


            return callback(
                new Error(
                    "CORS origin not allowed."
                )
            );
        },


        methods: [
            "GET",
            "POST"
        ]

    })
);


/* =========================================================
   RAZORPAY WEBHOOK

   IMPORTANT:
   This MUST be registered before express.json()
   because the raw request body is required to verify
   Razorpay's webhook signature.
========================================================= */

app.post(
    "/api/donate/webhook",

    express.raw({
        type:
            "application/json"
    }),

    function (
        req,
        res
    ) {

        try {

            if (
                !RAZORPAY_WEBHOOK_SECRET
            ) {

                console.error(
                    "Razorpay webhook secret is missing."
                );


                return res
                    .status(500)
                    .send(
                        "Webhook secret not configured."
                    );
            }


            const receivedSignature =
                req.headers[
                    "x-razorpay-signature"
                ];


            if (
                !receivedSignature
            ) {

                return res
                    .status(400)
                    .send(
                        "Missing webhook signature."
                    );
            }


            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        RAZORPAY_WEBHOOK_SECRET
                    )
                    .update(
                        req.body
                    )
                    .digest(
                        "hex"
                    );


            const signaturesMatch =
                expectedSignature.length ===
                    receivedSignature.length &&
                crypto.timingSafeEqual(
                    Buffer.from(
                        expectedSignature
                    ),
                    Buffer.from(
                        receivedSignature
                    )
                );


            if (
                !signaturesMatch
            ) {

                console.error(
                    "Invalid Razorpay webhook signature."
                );


                return res
                    .status(400)
                    .send(
                        "Invalid signature."
                    );
            }


            const event =
                JSON.parse(
                    req.body.toString(
                        "utf8"
                    )
                );


            console.log(
                `Razorpay webhook received: ${event.event}`
            );


            /* ---------------------------------------------
               PAYMENT CAPTURED
            --------------------------------------------- */

            if (
                event.event ===
                "payment.captured"
            ) {

                const payment =
                    event
                        .payload
                        ?.payment
                        ?.entity;


                if (payment) {

                    console.log(
                        "Payment captured:",
                        {

                            paymentId:
                                payment.id,

                            orderId:
                                payment.order_id,

                            amount:
                                payment.amount,

                            currency:
                                payment.currency

                        }
                    );


                    /*
                       FUTURE DATABASE:
                       Save the donation here.
                    */
                }
            }


            /* ---------------------------------------------
               ORDER PAID
            --------------------------------------------- */

            if (
                event.event ===
                "order.paid"
            ) {

                const order =
                    event
                        .payload
                        ?.order
                        ?.entity;


                if (order) {

                    console.log(
                        "Order paid:",
                        order.id
                    );
                }
            }


            return res
                .status(200)
                .json({

                    received:
                        true

                });

        } catch (error) {

            console.error(
                "Razorpay webhook error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Webhook processing failed."
                );
        }
    }
);


/* =========================================================
   JSON
========================================================= */

app.use(
    express.json({

        limit:
            "1mb"

    })
);


/* =========================================================
   RATE LIMIT
========================================================= */

const formLimiter =
    rateLimit({

        windowMs:
            15 * 60 * 1000,

        max:
            10,

        standardHeaders:
            true,

        legacyHeaders:
            false,

        message: {

            success:
                false,

            message:
                "Too many submissions. Please try again later."

        }

    });


/* =========================================================
   MULTER
========================================================= */

const upload =
    multer({

        storage:
            multer.memoryStorage(),

        limits: {

            fileSize:
                MAX_FILE_SIZE,

            files:
                2

        }

    });


/* =========================================================
   ALLOWED AUDIO TYPES
========================================================= */

const allowedTuneTypes =
    new Set([

        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/aac",
        "audio/ogg",
        "audio/webm"

    ]);


const allowedTuneExtensions =
    new Set([

        ".mp3",
        ".wav",
        ".m4a",
        ".aac",
        ".ogg",
        ".webm"

    ]);


/* =========================================================
   ALLOWED SUPPORT FILE TYPES
========================================================= */

const allowedSupportTypes =
    new Set([

        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "application/pdf"

    ]);


const allowedSupportExtensions =
    new Set([

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".heic",
        ".pdf"

    ]);


/* =========================================================
   GOOGLE OAUTH CLIENT
========================================================= */

function getOAuthClient() {

    if (
        !fs.existsSync(
            CREDENTIALS_PATH
        )
    ) {

        throw new Error(
            "credentials.json was not found."
        );
    }


    const credentials =
        JSON.parse(
            fs.readFileSync(
                CREDENTIALS_PATH,
                "utf8"
            )
        );


    const config =
        credentials.web ||
        credentials.installed;


    if (!config) {

        throw new Error(
            "Invalid Google OAuth credentials."
        );
    }


    return new google.auth.OAuth2(

        config.client_id,

        config.client_secret,

        REDIRECT_URI

    );
}


/* =========================================================
   AUTHENTICATED GMAIL CLIENT
========================================================= */

function getAuthenticatedClient() {

    const client =
        getOAuthClient();


    if (
        !fs.existsSync(
            TOKEN_PATH
        )
    ) {

        return null;
    }


    const token =
        JSON.parse(
            fs.readFileSync(
                TOKEN_PATH,
                "utf8"
            )
        );


    client.setCredentials(
        token
    );


    return client;
}


/* =========================================================
   TEXT CLEANING
========================================================= */

function cleanText(
    value,
    maxLength = 5000
) {

    if (
        typeof value !==
        "string"
    ) {

        return "";
    }


    return value

        .replace(
            /\u0000/g,
            ""
        )

        .replace(
            /\r\n/g,
            "\n"
        )

        .replace(
            /\r/g,
            "\n"
        )

        .trim()

        .slice(
            0,
            maxLength
        );
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isEmail(
    value
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            value
        );
}


/* =========================================================
   FILE EXTENSION
========================================================= */

function getExtension(
    filename
) {

    return path
        .extname(
            filename || ""
        )
        .toLowerCase();
}


/* =========================================================
   NODEMAILER MIME TRANSPORT

   NOTE:
   This does NOT send through SMTP.

   It only creates the MIME message.
========================================================= */

const mimeTransport =
    nodemailer.createTransport({

        streamTransport:
            true,

        buffer:
            true

    });


/* =========================================================
   SEND GMAIL MESSAGE
========================================================= */

async function sendGmailMessage({
    subject,
    text,
    attachments = [],
    replyTo = null
}) {

    const auth =
        getAuthenticatedClient();


    if (!auth) {

        throw new Error(
            "Gmail authorization has not been completed."
        );
    }


    const mailOptions = {

        from:
            GMAIL_USER,

        to:
            GMAIL_USER,

        subject:
            subject,

        text:
            text,

        attachments:
            attachments

    };


    if (
        replyTo &&
        isEmail(
            replyTo
        )
    ) {

        mailOptions.replyTo =
            replyTo;
    }


    /* -----------------------------------------------
       Generate MIME message
    ------------------------------------------------ */

    const info =
        await mimeTransport.sendMail(
            mailOptions
        );


    if (
        !info.message ||
        !Buffer.isBuffer(
            info.message
        )
    ) {

        throw new Error(
            "Failed to generate MIME message."
        );
    }


    /* -----------------------------------------------
       Convert MIME to base64url
    ------------------------------------------------ */

    const encodedMessage =
        info.message
            .toString(
                "base64"
            )

            .replace(
                /\+/g,
                "-"
            )

            .replace(
                /\//g,
                "_"
            )

            .replace(
                /=+$/,
                ""
            );


    /* -----------------------------------------------
       Gmail API
    ------------------------------------------------ */

    const gmail =
        google.gmail({

            version:
                "v1",

            auth:
                auth

        });


    await gmail.users.messages.send({

        userId:
            "me",

        requestBody: {

            raw:
                encodedMessage

        }

    });

}

/* =========================================================
   SEND DONATION RECEIPT
========================================================= */

async function sendDonationReceipt(
    donation
) {

    if (!donation) {
        return;
    }


    const donorEmail =
        donation.donorEmail;


    if (
        !donorEmail ||
        !isEmail(donorEmail)
    ) {

        throw new Error(
            "Donor email address is invalid."
        );
    }


    const amountInRupees =
        (
            donation.amount / 100
        ).toFixed(2);


    const paymentDate =
        donation.verifiedAt
            ? new Date(
                donation.verifiedAt
            ).toLocaleString(
                "en-IN",
                {
                    dateStyle:
                        "long",

                    timeStyle:
                        "short",

                    timeZone:
                        "Asia/Kolkata"
                }
            )
            : new Date().toLocaleString(
                "en-IN",
                {
                    dateStyle:
                        "long",

                    timeStyle:
                        "short",

                    timeZone:
                        "Asia/Kolkata"
                }
            );


    const subject =
        "Yireh Ministry - Donation Confirmation";


    const body = `

Dear ${donation.donorName || "Donor"},

Thank you for your generous donation to Yireh Ministry.

Your payment has been successfully received.

========================================

Donation Amount:
₹${amountInRupees}

Payment ID:
${donation.paymentId}

Order ID:
${donation.orderId}

Payment Date:
${paymentDate}

Payment Status:
Successful

========================================

Your support means a great deal to the ministry.

May God bless you for your generosity and support.

Yireh Ministry

This is an automated donation confirmation email.

    `.trim();


    /*
       IMPORTANT:
       Reply-to is the donor's email, but the
       email itself is sent through your Gmail API.
    */

    await sendGmailMessage({

        subject:
            subject,

        text:
            body,

        replyTo:
            donorEmail

    });

}


/* =========================================================
   HOME
========================================================= */

app.get(
    "/",
    function (
        req,
        res
    ) {

        res.send(
            "Yireh Ministry backend is running."
        );

    }
);


/* =========================================================
   HEALTH
========================================================= */

app.get(
    "/api/health",
    function (
        req,
        res
    ) {

        res.json({

            success:
                true,

            message:
                "Yireh backend is running."

        });

    }
);


/* =========================================================
   GOOGLE AUTH
========================================================= */

app.get(
    "/auth/google",
    function (
        req,
        res
    ) {

        try {

            const client =
                getOAuthClient();


            const authUrl =
                client.generateAuthUrl({

                    access_type:
                        "offline",

                    prompt:
                        "consent",

                    scope:
                        SCOPES

                });


            res.redirect(
                authUrl
            );

        } catch (error) {

            console.error(
                "Google auth start error:",
                error
            );


            res
                .status(500)
                .send(
                    "Unable to start Google authentication."
                );
        }

    }
);


/* =========================================================
   GOOGLE OAUTH CALLBACK
========================================================= */

app.get(
    "/oauth2callback",
    async function (
        req,
        res
    ) {

        try {

            const {
                code,
                error
            } = req.query;


            if (error) {

                return res
                    .status(400)
                    .send(
                        `Google authorization failed: ${error}`
                    );
            }


            if (!code) {

                return res
                    .status(400)
                    .send(
                        "Authorization code is missing."
                    );
            }


            const client =
                getOAuthClient();


            const {
                tokens
            } =
                await client.getToken(
                    code
                );


            client.setCredentials(
                tokens
            );


            fs.writeFileSync(

                TOKEN_PATH,

                JSON.stringify(
                    tokens,
                    null,
                    2
                )

            );


            res.send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <title>
                        Yireh Ministry
                    </title>

                    <style>

                        body {

                            margin: 0;

                            min-height:
                                100vh;

                            display:
                                flex;

                            align-items:
                                center;

                            justify-content:
                                center;

                            background:
                                #ededed;

                            font-family:
                                Arial,
                                sans-serif;

                            color:
                                #222;

                        }


                        .box {

                            text-align:
                                center;

                            padding:
                                40px;

                        }

                    </style>

                </head>


                <body>

                    <div class="box">

                        <h1>
                            Gmail connected successfully
                        </h1>

                        <p>
                            Yireh Ministry backend
                            is now authorized.
                        </p>

                        <p>
                            You can close this window.
                        </p>

                    </div>

                </body>

                </html>

            `);

        } catch (error) {

            console.error(
                "OAuth callback error:",
                error
            );


            res
                .status(500)
                .send(
                    "Google authorization failed."
                );
        }

    }
);


/* =========================================================
   TEST GMAIL
========================================================= */

app.get(
    "/api/test-gmail",
    async function (
        req,
        res
    ) {

        try {

            await sendGmailMessage({

                subject:
                    "Yireh Ministry Backend Test",

                text:
                    `
This is a test email from the
Yireh Ministry Node.js backend.

Gmail API OAuth is working correctly.
                    `.trim()

            });


            res.json({

                success:
                    true,

                message:
                    "Test email sent successfully."

            });

        } catch (error) {

            console.error(
                "Gmail test error:",
                error
            );


            res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Unable to send test email."

                });
        }

    }
);


/* =========================================================
   RAZORPAY
   CREATE DONATION ORDER
========================================================= */

/* =========================================================
   CREATE RAZORPAY DONATION ORDER
========================================================= */

app.post(
    "/api/donate/create-order",
    async function (req, res) {

        try {

            if (!razorpay) {

                return res
                    .status(503)
                    .json({
                        success: false,
                        message:
                            "Razorpay is not configured on the server."
                    });
            }


            /* ---------------------------------------------
               DONOR DETAILS
            --------------------------------------------- */

            const name =
                cleanText(
                    req.body.name,
                    120
                );


            const email =
                cleanText(
                    req.body.email,
                    200
                ).toLowerCase();


            const phone =
                cleanText(
                    req.body.phone,
                    30
                );


            /* ---------------------------------------------
               VALIDATE EMAIL
            --------------------------------------------- */

            if (
                !email ||
                !isEmail(email)
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Please enter a valid email address."
                    });
            }


            /* ---------------------------------------------
               AMOUNT
            --------------------------------------------- */

            const amount =
                Number(
                    req.body.amount
                );


            if (
                !Number.isFinite(amount)
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Please enter a valid donation amount."
                    });
            }


            /* ---------------------------------------------
               MINIMUM
            --------------------------------------------- */

            if (amount < 10) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Minimum donation amount is ₹10."
                    });
            }


            /* ---------------------------------------------
               MAXIMUM
            --------------------------------------------- */

            if (amount > 500000) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Donation amount is too large."
                    });
            }


            /* ---------------------------------------------
               RUPEES → PAISE
            --------------------------------------------- */

            const amountInPaise =
                Math.round(
                    amount * 100
                );


            /* ---------------------------------------------
               RECEIPT
            --------------------------------------------- */

            const receipt =
                `yireh_donation_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 8)}`;


            /* ---------------------------------------------
               CREATE ORDER
            --------------------------------------------- */

            const order =
                await razorpay.orders.create({

                    amount:
                        amountInPaise,

                    currency:
                        "INR",

                    receipt:
                        receipt,

                    notes: {

                        purpose:
                            "Yireh Ministry Donation",

                        donorName:
                            name,

                        donorEmail:
                            email,

                        donorPhone:
                            phone

                    }

                });


            /* ---------------------------------------------
               STORE DONOR DETAILS

               Temporary storage for testing.
            --------------------------------------------- */

            razorpayOrders.set(
                order.id,
                {

                    orderId:
                        order.id,

                    amount:
                        order.amount,

                    currency:
                        order.currency,

                    receipt:
                        order.receipt,

                    donorName:
                        name,

                    donorEmail:
                        email,

                    donorPhone:
                        phone,

                    status:
                        "created",

                    emailSent:
                        false,

                    createdAt:
                        new Date()

                }
            );


            /* ---------------------------------------------
               RESPONSE
            --------------------------------------------- */

            return res.json({

                success:
                    true,

                keyId:
                    RAZORPAY_KEY_ID,

                orderId:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency

            });

        } catch (error) {

            console.error(
                "Razorpay order creation error:",
                error
            );


            return res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Unable to create donation order."

                });

        }

    }
);


/* =========================================================
   RAZORPAY
   VERIFY PAYMENT
========================================================= */

/* =========================================================
   VERIFY RAZORPAY PAYMENT

   EMAIL IS SENT ONLY WHEN RAZORPAY CONFIRMS
   THE PAYMENT AS CAPTURED.
========================================================= */

app.post(
    "/api/donate/verify",
    async function (req, res) {

        try {

            const {

                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature

            } = req.body;


            /* ---------------------------------------------
               REQUIRED FIELDS
            --------------------------------------------- */

            if (
                !razorpay_payment_id ||
                !razorpay_order_id ||
                !razorpay_signature
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Incomplete payment verification data."

                    });
            }


            /* ---------------------------------------------
               FIND ORDER
            --------------------------------------------- */

            const donation =
                razorpayOrders.get(
                    razorpay_order_id
                );


            if (!donation) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Payment order could not be verified."

                    });
            }


            /* ---------------------------------------------
               SIGNATURE VERIFICATION
            --------------------------------------------- */

            const signatureBody =
                `${donation.orderId}|${razorpay_payment_id}`;


            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        RAZORPAY_KEY_SECRET
                    )
                    .update(
                        signatureBody
                    )
                    .digest(
                        "hex"
                    );


            const signaturesMatch =
                expectedSignature.length ===
                    razorpay_signature.length &&
                crypto.timingSafeEqual(

                    Buffer.from(
                        expectedSignature
                    ),

                    Buffer.from(
                        razorpay_signature
                    )

                );


            if (
                !signaturesMatch
            ) {

                donation.status =
                    "verification_failed";


                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Payment verification failed."

                    });
            }


            /* ---------------------------------------------
               FETCH ACTUAL PAYMENT FROM RAZORPAY
            --------------------------------------------- */

            const payment =
                await razorpay.payments.fetch(
                    razorpay_payment_id
                );


            console.log(
                "Razorpay payment status:",
                payment.status
            );


            /* ---------------------------------------------
               ONLY CAPTURED PAYMENTS
            --------------------------------------------- */

            if (
                payment.status !==
                "captured"
            ) {

                donation.status =
                    payment.status;


                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Payment has not been captured yet."

                    });
            }


            /* ---------------------------------------------
               PAYMENT CONFIRMED
            --------------------------------------------- */

            donation.status =
                "captured";


            donation.paymentId =
                razorpay_payment_id;


            donation.verifiedAt =
                new Date();


            /* ---------------------------------------------
               SEND EMAIL
            --------------------------------------------- */

            if (
                !donation.emailSent
            ) {

                try {

                    await sendDonationReceipt(
                        donation
                    );


                    donation.emailSent =
                        true;


                    donation.emailSentAt =
                        new Date();


                    console.log(
                        "Donation receipt email sent to:",
                        donation.donorEmail
                    );

                } catch (emailError) {

                    /*
                       Payment is still successful.

                       Do NOT tell the donor that the
                       payment itself failed just because
                       the email failed.
                    */

                    console.error(
                        "Donation email error:",
                        emailError
                    );

                }
            }


            /* ---------------------------------------------
               RESPONSE
            --------------------------------------------- */

            return res.json({

                success:
                    true,

                message:
                    "Donation payment verified successfully.",

                paymentId:
                    razorpay_payment_id,

                orderId:
                    razorpay_order_id,

                emailSent:
                    donation.emailSent

            });

        } catch (error) {

            console.error(
                "Razorpay verification error:",
                error
            );


            return res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Unable to verify payment."

                });
        }

    }
);


/* =========================================================
   ANTHEMS SUBMISSION
========================================================= */

app.post(

    "/api/anthems",

    formLimiter,

    upload.fields([

        {

            name:
                "tuneFile",

            maxCount:
                1

        },

        {

            name:
                "supportFile",

            maxCount:
                1

        }

    ]),

    async function (
        req,
        res
    ) {

        try {

            /* ---------------------------------------------
               TEXT FIELDS
            --------------------------------------------- */

            const fullName =
                cleanText(
                    req.body.fullName,
                    120
                );


            const location =
                cleanText(
                    req.body.location,
                    200
                );


            const phone =
                cleanText(
                    req.body.phone,
                    40
                );


            const lyrics =
                cleanText(
                    req.body.lyrics,
                    30000
                );


            const submissionType =
                req.body.submissionType ===
                "tune"
                    ? "tune"
                    : "lyrics";


            /* ---------------------------------------------
               REQUIRED
            --------------------------------------------- */

            if (
                !fullName ||
                !location ||
                !phone ||
                !lyrics
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Please complete all required fields."

                    });
            }


            /* ---------------------------------------------
               FILES
            --------------------------------------------- */

            const tune =
                req.files?.tuneFile?.[0] ||
                null;


            const support =
                req.files?.supportFile?.[0] ||
                null;


            /* ---------------------------------------------
               TOTAL SIZE
            --------------------------------------------- */

            const totalSize =
                (tune?.size || 0) +
                (support?.size || 0);


            if (
                totalSize >
                MAX_TOTAL_FILES
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "The combined attachment size must not exceed 18 MB."

                    });
            }


            /* ---------------------------------------------
               TUNE REQUIRED FOR TUNE SUBMISSIONS
            --------------------------------------------- */

            if (
                submissionType === "tune" &&
                !tune
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Please attach your tune/audio file."

                    });
            }


            /* ---------------------------------------------
               AUDIO VALIDATION
            --------------------------------------------- */

            if (tune) {

                const extension =
                    getExtension(
                        tune.originalname
                    );


                const validType =
                    allowedTuneTypes.has(
                        tune.mimetype
                    );


                const validExtension =
                    allowedTuneExtensions.has(
                        extension
                    );


                if (
                    !validType ||
                    !validExtension
                ) {

                    return res
                        .status(400)
                        .json({

                            success:
                                false,

                            message:
                                "Invalid audio file. Please use MP3, WAV, M4A, AAC, OGG, or WebM."

                        });
                }
            }


            /* ---------------------------------------------
               SUPPORT FILE VALIDATION
            --------------------------------------------- */

            if (support) {

                const extension =
                    getExtension(
                        support.originalname
                    );


                const validType =
                    allowedSupportTypes.has(
                        support.mimetype
                    );


                const validExtension =
                    allowedSupportExtensions.has(
                        extension
                    );


                if (
                    !validType ||
                    !validExtension
                ) {

                    return res
                        .status(400)
                        .json({

                            success:
                                false,

                            message:
                                "Supporting file must be JPG, PNG, WEBP, HEIC, or PDF."

                        });
                }
            }


            /* ---------------------------------------------
               ATTACHMENTS
            --------------------------------------------- */

            const attachments = [];


            if (tune) {

                attachments.push({

                    filename:
                        tune.originalname,

                    content:
                        tune.buffer,

                    contentType:
                        tune.mimetype

                });
            }


            if (support) {

                attachments.push({

                    filename:
                        support.originalname,

                    content:
                        support.buffer,

                    contentType:
                        support.mimetype

                });
            }


            /* ---------------------------------------------
               SUBJECT
            --------------------------------------------- */

            const subject =
                `Anthems Season 1 - ${
                    submissionType === "tune"
                        ? "Lyrics & Tune"
                        : "Lyrics"
                } - ${fullName}`;


            /* ---------------------------------------------
               EMAIL BODY
            --------------------------------------------- */

            const body = `

Anthems Season 1 Submission

========================================

Submission Type:
${
    submissionType === "tune"
        ? "Lyrics & Tune"
        : "Lyrics Only"
}

Full Name:
${fullName}

Where are you from:
${location}

Phone Number:
${phone}

========================================

Lyrics:

${lyrics}

========================================

Tune:
${
    tune
        ? tune.originalname
        : "Not attached"
}

Supporting File:
${
    support
        ? support.originalname
        : "None"
}

========================================

This submission was received through
the Yireh Ministry website.

            `.trim();


            /* ---------------------------------------------
               SEND EMAIL
            --------------------------------------------- */

            await sendGmailMessage({

                subject:
                    subject,

                text:
                    body,

                attachments:
                    attachments

            });


            /* ---------------------------------------------
               RESPONSE
            --------------------------------------------- */

            return res
                .status(200)
                .json({

                    success:
                        true,

                    message:
                        "Your anthem submission was sent successfully."

                });

        } catch (error) {

            console.error(
                "Anthem submission error:",
                error
            );


            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res
                    .status(400)
                    .json({

                        success:
                            false,

                        message:
                            "Each attachment must be 10 MB or smaller."

                    });
            }


            return res
                .status(500)
                .json({

                    success:
                        false,

                    message:
                        "Unable to submit your anthem. Please try again."

                });
        }

    }

);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
    function (
        error,
        req,
        res,
        next
    ) {

        console.error(
            error
        );


        if (
            error.code ===
            "LIMIT_FILE_SIZE"
        ) {

            return res
                .status(400)
                .json({

                    success:
                        false,

                    message:
                        "Each attachment must be 10 MB or smaller."

                });
        }


        return res
            .status(500)
            .json({

                success:
                    false,

                message:
                    "Something went wrong."

            });
    }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(

    PORT,

    "0.0.0.0",

    function () {

        console.log(
            `Yireh backend running on port ${PORT}`
        );


        console.log(
            `http://localhost:${PORT}`
        );

    }

);