"use strict";

/* =========================================================
   YIREH MINISTRY
   NODE.JS BACKEND
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

app.set("trust proxy", 1);
app.disable("x-powered-by");

/* =========================================================
   PORT
   ========================================================= */

const PORT = Number(process.env.PORT) || 10000;

/* =========================================================
   GMAIL
   ========================================================= */

const GMAIL_USER =
  process.env.GMAIL_USER || "mylogin00000@gmail.com";

/*
   Recommended:

   Put the fresh Gmail refresh token in Render:

   GMAIL_REFRESH_TOKEN=your_new_refresh_token

   The token.json method is also supported.
*/

/* =========================================================
   GOOGLE OAUTH FILES
   ========================================================= */

const CREDENTIALS_PATH =
  process.env.RENDER
    ? "/etc/secrets/credentials.json"
    : path.join(__dirname, "credentials.json");

const TOKEN_PATH =
  process.env.RENDER
    ? "/etc/secrets/token.json"
    : path.join(__dirname, "token.json");

/* =========================================================
   GOOGLE OAUTH REDIRECT URI
   ========================================================= */

const REDIRECT_URI =
  process.env.RENDER
    ? "https://yirehministry.onrender.com/oauth2callback"
    : "http://localhost:10000/oauth2callback";

/* =========================================================
   GOOGLE SCOPES
   ========================================================= */

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
];

/* =========================================================
   RAZORPAY
   ========================================================= */

const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || "";

const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || "";

const RAZORPAY_WEBHOOK_SECRET =
  process.env.RAZORPAY_WEBHOOK_SECRET || "";

let razorpay = null;

if (
  RAZORPAY_KEY_ID &&
  RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  console.log("Razorpay: configured");
} else {
  console.warn(
    "Razorpay: not configured"
  );
}

/* =========================================================
   TEMPORARY RAZORPAY ORDER STORE
   ========================================================= */

const razorpayOrders = new Map();

/* =========================================================
   FILE LIMITS
   ========================================================= */

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const MAX_TOTAL_FILES =
  18 * 1024 * 1024;

/* =========================================================
   CORS
   ========================================================= */

const allowedOrigins =
  new Set([
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://1raviray.github.io",
  ]);

if (process.env.FRONTEND_URL) {
  allowedOrigins.add(
    process.env.FRONTEND_URL.replace(/\/$/, "")
  );
}

app.use(
  cors({
    origin(origin, callback) {
      /*
         Allow requests with no Origin header
         such as curl/Postman.
      */

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS origin not allowed.")
      );
    },

    methods: [
      "GET",
      "POST",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================================
   HELMET
   ========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =========================================================
   RAZORPAY WEBHOOK
   MUST COME BEFORE express.json()
   ========================================================= */

app.post(
  "/api/donate/webhook",

  express.raw({
    type: "application/json",
  }),

  (req, res) => {
    try {
      if (!RAZORPAY_WEBHOOK_SECRET) {
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

      if (!receivedSignature) {
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
          .update(req.body)
          .digest("hex");

      const signatureMatches =
        expectedSignature.length ===
        receivedSignature.length;

      if (!signatureMatches) {
        return res
          .status(400)
          .send("Invalid signature.");
      }

      const valid =
        crypto.timingSafeEqual(
          Buffer.from(
            expectedSignature,
            "utf8"
          ),
          Buffer.from(
            receivedSignature,
            "utf8"
          )
        );

      if (!valid) {
        return res
          .status(400)
          .send("Invalid signature.");
      }

      const event =
        JSON.parse(
          req.body.toString("utf8")
        );

      console.log(
        "Razorpay webhook:",
        event.event
      );

      if (
        event.event ===
        "payment.captured"
      ) {
        const payment =
          event.payload
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
                payment.currency,
            }
          );
        }
      }

      if (
        event.event ===
        "order.paid"
      ) {
        const order =
          event.payload
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
          received: true,
        });
    } catch (error) {
      console.error(
        "Razorpay webhook error:",
        error.message
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
   BODY PARSERS
   ========================================================= */

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/* =========================================================
   RATE LIMITERS
   ========================================================= */

const contactLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 8,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many contact submissions. Please try again later.",
    },
  });

const eventLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many registration attempts. Please try again later.",
    },
  });

const anthemLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many submissions. Please try again later.",
    },
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

      files: 2,
    },
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
    "audio/webm",
  ]);

const allowedTuneExtensions =
  new Set([
    ".mp3",
    ".wav",
    ".m4a",
    ".aac",
    ".ogg",
    ".webm",
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
    "application/pdf",
  ]);

const allowedSupportExtensions =
  new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".heic",
    ".pdf",
  ]);

/* =========================================================
   HELPERS
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

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

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
   GOOGLE OAUTH CLIENT
   ========================================================= */

function getOAuthClient() {
  if (
    !fs.existsSync(
      CREDENTIALS_PATH
    )
  ) {
    throw new Error(
      `credentials.json was not found at ${CREDENTIALS_PATH}`
    );
  }

  let credentials;

  try {
    credentials =
      JSON.parse(
        fs.readFileSync(
          CREDENTIALS_PATH,
          "utf8"
        )
      );
  } catch (error) {
    throw new Error(
      "Unable to read credentials.json."
    );
  }

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

  /*
     BEST METHOD FOR RENDER

     Render environment variable:

     GMAIL_REFRESH_TOKEN

     This avoids depending on a writable filesystem.
  */

  if (
    process.env.GMAIL_REFRESH_TOKEN
  ) {
    client.setCredentials({
      refresh_token:
        process.env.GMAIL_REFRESH_TOKEN.trim(),
    });

    return client;
  }

  /*
     FALLBACK:
     token.json

     Local:
       ./token.json

     Render:
       /etc/secrets/token.json
  */

  if (
    !fs.existsSync(
      TOKEN_PATH
    )
  ) {
    return null;
  }

  let token;

  try {
    token =
      JSON.parse(
        fs.readFileSync(
          TOKEN_PATH,
          "utf8"
        )
      );
  } catch (error) {
    throw new Error(
      "Unable to read token.json."
    );
  }

  if (
    !token ||
    !token.refresh_token
  ) {
    throw new Error(
      "token.json does not contain a refresh token."
    );
  }

  client.setCredentials(
    token
  );

  return client;
}

/* =========================================================
   NODEMAILER MIME GENERATOR
   IMPORTANT:
   Nodemailer does NOT send SMTP.
   It only builds the MIME message.
   ========================================================= */

const mimeTransport =
  nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
  });

/* =========================================================
   SEND EMAIL THROUGH GMAIL API
   ========================================================= */

async function sendGmailMessage({
  subject,
  text,
  attachments = [],
  replyTo = null,
}) {
  const auth =
    getAuthenticatedClient();

  if (!auth) {
    throw new Error(
      "Gmail authorization has not been completed."
    );
  }

  const mailOptions = {
    from: GMAIL_USER,
    to: GMAIL_USER,

    subject:
      cleanText(
        subject,
        200
      ),

    text,

    attachments,
  };

  if (
    replyTo &&
    isEmail(replyTo)
  ) {
    mailOptions.replyTo =
      replyTo;
  }

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

  const encodedMessage =
    info.message
      .toString("base64")
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

  const gmail =
    google.gmail({
      version: "v1",
      auth,
    });

  try {
    await gmail.users.messages.send({
      userId: "me",

      requestBody: {
        raw:
          encodedMessage,
      },
    });
  } catch (error) {
    /*
       Important Gmail OAuth error handling.
    */

    const reason =
      error.response
        ?.data
        ?.error;

    const description =
      error.response
        ?.data
        ?.error_description;

    if (
      reason ===
      "invalid_grant"
    ) {
      throw new Error(
        "Gmail authorization expired or was revoked. Re-authorize Google Gmail and update GMAIL_REFRESH_TOKEN or token.json."
      );
    }

    if (
      description
    ) {
      throw new Error(
        `Gmail API error: ${description}`
      );
    }

    throw error;
  }
}

/* =========================================================
   ROOT
   ========================================================= */

app.get(
  "/",
  (req, res) => {
    res.send(
      "Yireh Ministry backend is running."
    );
  }
);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Yireh backend is running.",

      gmailUser:
        GMAIL_USER,

      redirectUri:
        REDIRECT_URI,

      gmailRefreshTokenConfigured:
        Boolean(
          process.env
            .GMAIL_REFRESH_TOKEN
        ),

      tokenFileExists:
        fs.existsSync(
          TOKEN_PATH
        ),

      razorpayConfigured:
        Boolean(
          razorpay
        ),
    });
  }
);

/* =========================================================
   GOOGLE AUTH START
   ========================================================= */

app.get(
  "/auth/google",
  (req, res) => {
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
            SCOPES,
        });

      return res.redirect(
        authUrl
      );
    } catch (error) {
      console.error(
        "Google auth start error:",
        error.message
      );

      return res
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
  async (req, res) => {
    try {
      const {
        code,
        error,
      } = req.query;

      if (error) {
        return res
          .status(400)
          .send(
            `Google authorization failed: ${cleanText(
              error,
              300
            )}`
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
        tokens,
      } =
        await client.getToken(
          code
        );

      client.setCredentials(
        tokens
      );

      /*
         LOCAL

         We can save token.json.
      */

      if (
        !process.env.RENDER
      ) {
        fs.writeFileSync(
          TOKEN_PATH,
          JSON.stringify(
            tokens,
            null,
            2
          ),
          "utf8"
        );

        return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Yireh Ministry - Gmail Connected</title>
<style>
body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#ededed;
  font-family:Arial,sans-serif;
}
.box{
  max-width:560px;
  margin:20px;
  padding:40px;
  background:#fff;
  border-radius:18px;
  box-shadow:0 12px 35px rgba(0,0,0,.10);
  text-align:center;
}
h1{
  margin-top:0;
}
</style>
</head>
<body>
<div class="box">
<h1>Gmail connected successfully</h1>
<p>Your local Yireh Ministry backend is now authorized.</p>
<p>You can close this window.</p>
</div>
</body>
</html>
        `);
      }

      /*
         RENDER

         /etc/secrets is a mounted secret location.
         Instead of attempting to write there, tell the user
         to save the fresh refresh token as:

         GMAIL_REFRESH_TOKEN

         in Render Environment Variables.
      */

      const refreshToken =
        tokens.refresh_token;

      if (!refreshToken) {
        return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gmail Authorization</title>
<style>
body{
  font-family:Arial,sans-serif;
  background:#f3f3f3;
  margin:0;
  padding:30px;
}
.box{
  max-width:800px;
  margin:30px auto;
  background:white;
  padding:30px;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}
code{
  word-break:break-all;
}
</style>
</head>
<body>
<div class="box">
<h1>Google authorization completed</h1>
<p>
Google did not return a new refresh token.
</p>
<p>
Revoke the existing authorization and run
Google authorization again with
<code>prompt=consent</code>.
</p>
</div>
</body>
</html>
        `);
      }

      /*
         IMPORTANT:
         Do not log the refresh token.
      */

      console.log(
        "Google OAuth authorization completed on Render."
      );

      return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Yireh Ministry - Gmail Connected</title>
<style>
body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#ededed;
  font-family:Arial,sans-serif;
}
.box{
  width:min(700px,calc(100% - 40px));
  padding:36px;
  background:white;
  border-radius:18px;
  box-shadow:0 12px 35px rgba(0,0,0,.10);
}
h1{
  margin-top:0;
}
.notice{
  padding:16px;
  background:#f6f6f6;
  border-radius:12px;
  line-height:1.6;
}
</style>
</head>
<body>
<div class="box">
<h1>Gmail authorization successful</h1>

<p>
Google has authorized Yireh Ministry.
</p>

<div class="notice">
<strong>Next step on Render:</strong><br>
Add the new refresh token returned by Google as the Render environment variable:
<br><br>
<code>GMAIL_REFRESH_TOKEN</code>
<br><br>
Then redeploy the service.
</div>

<p>
Do not publish or share the refresh token.
</p>

</div>
</body>
</html>
      `);
    } catch (error) {
      console.error(
        "OAuth callback error:",
        error.message
      );

      return res
        .status(500)
        .send(
          "Google authorization failed. Check the Render logs."
        );
    }
  }
);

/* =========================================================
   TEST GMAIL
   ========================================================= */

app.get(
  "/api/test-gmail",
  async (req, res) => {
    try {
      await sendGmailMessage({
        subject:
          "Yireh Ministry Backend Test",

        text:
          [
            "This is a test email from the Yireh Ministry Node.js backend.",
            "",
            "Gmail API OAuth is working correctly.",
          ].join("\n"),
      });

      return res.json({
        success: true,

        message:
          "Test email sent successfully.",
      });
    } catch (error) {
      console.error(
        "Gmail test error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to send test email.",
        });
    }
  }
);

/* =========================================================
   CONTACT FORM
   ========================================================= */

app.post(
  "/api/contact",

  contactLimiter,

  async (req, res) => {
    try {
      const fullName =
        cleanText(
          req.body.fullName,
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
          40
        );

      const subjectInput =
        cleanText(
          req.body.subject,
          200
        );

      const message =
        cleanText(
          req.body.message,
          10000
        );

      if (
        !fullName ||
        !email ||
        !message
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please complete your name, email, and message.",
          });
      }

      if (
        !isEmail(email)
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a valid email address.",
          });
      }

      const subject =
        subjectInput ||
        `Website Contact - ${fullName}`;

      const body = `
YIREH MINISTRY
WEBSITE CONTACT
========================================

Full Name:
${fullName}

Email:
${email}

Phone:
${phone || "Not provided"}

Subject:
${subject}

Message:
${message}

========================================
This message was submitted through the Yireh Ministry website.
      `.trim();

      await sendGmailMessage({
        subject,
        text: body,
        replyTo: email,
      });

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Your message has been sent successfully.",
        });
    } catch (error) {
      console.error(
        "Contact submission error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to send your message. Please try again.",
        });
    }
  }
);

/* =========================================================
   EVENT REGISTRATION
   POST /api/event-register
   ========================================================= */

app.post(
  "/api/event-register",

  eventLimiter,

  async (req, res) => {
    try {
      console.log(
        "EVENT REGISTRATION REQUEST:",
        {
          eventName:
            req.body?.eventName,

          fullName:
            req.body?.fullName,

          email:
            req.body?.email,

          phone:
            req.body?.phone,

          city:
            req.body?.city,

          seats:
            req.body?.seats,
        }
      );

      const eventName =
        cleanText(
          req.body.eventName,
          200
        );

      const fullName =
        cleanText(
          req.body.fullName ||
          req.body.name,
          120
        );

      const phone =
        cleanText(
          req.body.phone,
          40
        );

      const email =
        cleanText(
          req.body.email,
          200
        ).toLowerCase();

      const city =
        cleanText(
          req.body.city ||
          req.body.location,
          120
        );

      const seats =
        Number(
          req.body.seats
        );

      /* -----------------------------------------
         REQUIRED FIELDS
         ----------------------------------------- */

      if (
        !eventName ||
        !fullName ||
        !phone ||
        !email ||
        !city
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please complete all required registration fields.",
          });
      }

      /* -----------------------------------------
         EMAIL
         ----------------------------------------- */

      if (
        !isEmail(email)
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a valid email address.",
          });
      }

      /* -----------------------------------------
         PHONE
         ----------------------------------------- */

      const phoneDigits =
        phone.replace(
          /\D/g,
          ""
        );

      if (
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a valid phone number.",
          });
      }

      /* -----------------------------------------
         SEATS
         ----------------------------------------- */

      if (
        !Number.isInteger(
          seats
        ) ||
        seats < 1 ||
        seats > 20
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please select between 1 and 20 seats.",
          });
      }

      /* -----------------------------------------
         EMAIL BODY
         ----------------------------------------- */

      const body = `
YIREH MINISTRY
EVENT REGISTRATION
========================================

Event Name:
${eventName}

Full Name:
${fullName}

Phone / WhatsApp:
${phone}

Email:
${email}

City:
${city}

Seats:
${seats}

========================================
This registration was submitted through the Yireh Ministry website.
      `.trim();

      /* -----------------------------------------
         SEND TO MINISTRY
         ----------------------------------------- */

      await sendGmailMessage({
        subject:
          `Event Registration - ${eventName} - ${fullName}`,

        text:
          body,

        replyTo:
          email,
      });

      /* -----------------------------------------
         CONFIRMATION EMAIL TO USER
         ----------------------------------------- */

      try {
        const confirmationBody = `
Dear ${fullName},

Thank you for registering for:

${eventName}

Your registration details:

Name:
${fullName}

Phone / WhatsApp:
${phone}

Email:
${email}

City:
${city}

Seats:
${seats}

We have successfully received your registration.

We look forward to seeing you.

Yireh Ministry
        `.trim();

        /*
           Important:
           This requires Gmail to send from GMAIL_USER.
        */

        const confirmationAuth =
          getAuthenticatedClient();

        if (
          confirmationAuth
        ) {
          const info =
            await mimeTransport.sendMail({
              from:
                GMAIL_USER,

              to:
                email,

              subject:
                `Registration Confirmed - ${eventName}`,

              text:
                confirmationBody,
            });

          const encodedMessage =
            info.message
              .toString("base64")
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

          const gmail =
            google.gmail({
              version: "v1",
              auth:
                confirmationAuth,
            });

          await gmail.users.messages.send({
            userId: "me",

            requestBody: {
              raw:
                encodedMessage,
            },
          });
        }
      } catch (confirmationError) {
        console.error(
          "Registration confirmation email error:",
          confirmationError.message
        );

        /*
           Do not fail the registration.
           Ministry notification already succeeded.
        */
      }

      console.log(
        "Event registration completed:",
        {
          eventName,
          fullName,
          email,
          seats,
        }
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            `Your registration for ${eventName} has been received successfully.`,
        });
    } catch (error) {
      console.error(
        "EVENT REGISTRATION ERROR:",
        error.message
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to submit your registration. Please try again.",
        });
    }
  }
);

/* =========================================================
   RAZORPAY CREATE DONATION ORDER
   ========================================================= */

app.post(
  "/api/donate/create-order",

  async (req, res) => {
    try {
      if (!razorpay) {
        return res
          .status(503)
          .json({
            success: false,

            message:
              "Razorpay is not configured on the server.",
          });
      }

      const amount =
        Number(
          req.body.amount
        );

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
          40
        );

      if (
        !Number.isFinite(
          amount
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a valid donation amount.",
          });
      }

      if (
        amount < 10
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Minimum donation amount is ₹10.",
          });
      }

      if (
        amount > 500000
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Donation amount is too large.",
          });
      }

      if (
        email &&
        !isEmail(email)
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a valid email address.",
          });
      }

      const amountInPaise =
        Math.round(
          amount * 100
        );

      const receipt =
        `yireh_donation_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      const order =
        await razorpay.orders.create({
          amount:
            amountInPaise,

          currency:
            "INR",

          receipt,

          notes: {
            purpose:
              "Yireh Ministry Donation",

            donorName:
              name,

            donorEmail:
              email,

            donorPhone:
              phone,
          },
        });

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

          createdAt:
            new Date(),
        }
      );

      return res
        .status(200)
        .json({
          success: true,

          keyId:
            RAZORPAY_KEY_ID,

          orderId:
            order.id,

          amount:
            order.amount,

          currency:
            order.currency,
        });
    } catch (error) {
      console.error(
        "Razorpay order creation error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to create donation order.",
        });
    }
  }
);

/* =========================================================
   RAZORPAY VERIFY PAYMENT
   ========================================================= */

app.post(
  "/api/donate/verify",

  async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Incomplete payment verification data.",
          });
      }

      if (
        !RAZORPAY_KEY_SECRET
      ) {
        return res
          .status(503)
          .json({
            success: false,

            message:
              "Razorpay verification is not configured.",
          });
      }

      const storedOrder =
        razorpayOrders.get(
          razorpay_order_id
        );

      if (!storedOrder) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Payment order could not be verified.",
          });
      }

      const signatureBody =
        `${storedOrder.orderId}|${razorpay_payment_id}`;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            RAZORPAY_KEY_SECRET
          )
          .update(
            signatureBody
          )
          .digest("hex");

      const validLength =
        expectedSignature.length ===
        razorpay_signature.length;

      if (!validLength) {
        storedOrder.status =
          "verification_failed";

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Payment verification failed.",
          });
      }

      const valid =
        crypto.timingSafeEqual(
          Buffer.from(
            expectedSignature,
            "utf8"
          ),
          Buffer.from(
            razorpay_signature,
            "utf8"
          )
        );

      if (!valid) {
        storedOrder.status =
          "verification_failed";

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Payment verification failed.",
          });
      }

      storedOrder.status =
        "signature_verified";

      storedOrder.paymentId =
        razorpay_payment_id;

      storedOrder.verifiedAt =
        new Date();

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Donation payment verified successfully.",

          paymentId:
            razorpay_payment_id,

          orderId:
            razorpay_order_id,
        });
    } catch (error) {
      console.error(
        "Razorpay verification error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to verify payment.",
        });
    }
  }
);

/* =========================================================
   ANTHEMS SUBMISSION
   ========================================================= */

app.post(
  "/api/anthems",

  anthemLimiter,

  upload.fields([
    {
      name: "tuneFile",
      maxCount: 1,
    },
    {
      name: "supportFile",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {
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

      if (
        !fullName ||
        !location ||
        !phone ||
        !lyrics
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please complete all required fields.",
          });
      }

      const tune =
        req.files
          ?.tuneFile
          ?.[0] ||
        null;

      const support =
        req.files
          ?.supportFile
          ?.[0] ||
        null;

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
            success: false,

            message:
              "The combined attachment size must not exceed 18 MB.",
          });
      }

      /* -----------------------------------------
         TUNE REQUIRED
         ----------------------------------------- */

      if (
        submissionType ===
          "tune" &&
        !tune
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please attach your tune/audio file.",
          });
      }

      /* -----------------------------------------
         AUDIO VALIDATION
         ----------------------------------------- */

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
              success: false,

              message:
                "Invalid audio file. Please use MP3, WAV, M4A, AAC, OGG, or WebM.",
            });
        }
      }

      /* -----------------------------------------
         SUPPORT FILE VALIDATION
         ----------------------------------------- */

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
              success: false,

              message:
                "Supporting file must be JPG, PNG, WEBP, HEIC, or PDF.",
            });
        }
      }

      /* -----------------------------------------
         EMAIL ATTACHMENTS
         ----------------------------------------- */

      const attachments =
        [];

      if (tune) {
        attachments.push({
          filename:
            path.basename(
              tune.originalname
            ),

          content:
            tune.buffer,

          contentType:
            tune.mimetype,
        });
      }

      if (support) {
        attachments.push({
          filename:
            path.basename(
              support.originalname
            ),

          content:
            support.buffer,

          contentType:
            support.mimetype,
        });
      }

      /* -----------------------------------------
         SUBJECT
         ----------------------------------------- */

      const subject =
        `Anthems Season 1 - ${
          submissionType === "tune"
            ? "Lyrics & Tune"
            : "Lyrics"
        } - ${fullName}`;

      /* -----------------------------------------
         BODY
         ----------------------------------------- */

      const body = `
ANTHEMS SEASON 1 SUBMISSION
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

This submission was received through the Yireh Ministry website.
      `.trim();

      await sendGmailMessage({
        subject,

        text:
          body,

        attachments,
      });

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Your anthem submission was sent successfully.",
        });
    } catch (error) {
      console.error(
        "Anthem submission error:",
        error.message
      );

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Each attachment must be 10 MB or smaller.",
          });
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to submit your anthem. Please try again.",
        });
    }
  }
);

/* =========================================================
   API 404 HANDLER
   ========================================================= */

app.use(
  (req, res) => {
    if (
      req.path.startsWith(
        "/api/"
      )
    ) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            `API route not found: ${req.method} ${req.path}`,
        });
    }

    return res
      .status(404)
      .send(
        "Page not found."
      );
  }
);

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Global server error:",
      error.message
    );

    if (
      res.headersSent
    ) {
      return next(
        error
      );
    }

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Each attachment must be 10 MB or smaller.",
        });
    }

    if (
      error.message ===
      "CORS origin not allowed."
    ) {
      return res
        .status(403)
        .json({
          success: false,

          message:
            "CORS origin not allowed.",
        });
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Something went wrong on the server.",
      });
  }
);

/* =========================================================
   START SERVER
   ========================================================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Yireh backend running on port ${PORT}`
    );

    console.log(
      `Google OAuth callback: ${REDIRECT_URI}`
    );

    console.log(
      `Gmail user: ${GMAIL_USER}`
    );

    console.log(
      `Gmail token env configured: ${
        Boolean(
          process.env.GMAIL_REFRESH_TOKEN
        )
      }`
    );

    console.log(
      `Credentials file: ${CREDENTIALS_PATH}`
    );

    console.log(
      `Token file: ${TOKEN_PATH}`
    );

    console.log(
      `Razorpay configured: ${
        Boolean(razorpay)
      }`
    );
  }
);