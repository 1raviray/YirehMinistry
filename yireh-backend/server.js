/* =========================================================
   YIREH MINISTRY BACKEND
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
   
   const app = express();
   
   /* =========================================================
      SERVER
      ========================================================= */
   
   const PORT = Number(process.env.PORT) || 10000;
   
   app.set("trust proxy", 1);
   app.disable("x-powered-by");
   
   /* =========================================================
      SECURITY
      ========================================================= */
   
   app.use(
     helmet({
       crossOriginResourcePolicy: false,
     })
   );
   
   /* =========================================================
      CORS
      ========================================================= */
   
   const allowedOrigins = new Set([
     "http://127.0.0.1:5500",
     "http://localhost:5500",
   
     "http://127.0.0.1:3000",
     "http://localhost:3000",
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
           Requests from Postman, curl and server-to-server
           requests may not contain an Origin header.
         */
         if (!origin) {
           return callback(null, true);
         }
   
         if (allowedOrigins.has(origin)) {
           return callback(null, true);
         }
   
         console.warn("Blocked CORS origin:", origin);
   
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
   
       credentials: false,
     })
   );
   
   /* =========================================================
      RAZORPAY CONFIGURATION
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
       "Razorpay: NOT configured"
     );
   }
   
   /*
      Temporary in-memory order store.
   
      IMPORTANT:
      This is suitable for testing.
      For production, use a database.
   */
   const razorpayOrders = new Map();
   
   /* =========================================================
      LIMITS
      ========================================================= */
   
   const MAX_FILE_SIZE =
     10 * 1024 * 1024;
   
   const MAX_TOTAL_FILES =
     18 * 1024 * 1024;
   
   /* =========================================================
      GOOGLE / GMAIL CONFIGURATION
      ========================================================= */
   
   /*
      Preferred production configuration:
   
      GMAIL_USER=yourgmail@gmail.com
      GOOGLE_CLIENT_ID=...
      GOOGLE_CLIENT_SECRET=...
      GOOGLE_REDIRECT_URI=https://your-service.onrender.com/oauth2callback
      GOOGLE_REFRESH_TOKEN=...
   
      The code also supports credentials.json/token.json
      for local testing.
   */
   
   const GMAIL_USER =
     process.env.GMAIL_USER ||
     process.env.MAIL_TO ||
     "";
   
   const GMAIL_TO =
     process.env.MAIL_TO ||
     GMAIL_USER;
   
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
     process.env.GOOGLE_REDIRECT_URI ||
     `http://localhost:${PORT}/oauth2callback`;
   
   const SCOPES = [
     "https://www.googleapis.com/auth/gmail.send",
   ];
   
   /* =========================================================
      GOOGLE OAUTH CLIENT
      ========================================================= */
   
   function getOAuthClient() {
   
     let clientId =
       process.env.GOOGLE_CLIENT_ID ||
       "";
   
     let clientSecret =
       process.env.GOOGLE_CLIENT_SECRET ||
       "";
   
     /*
        If environment variables are not available,
        fall back to credentials.json.
     */
   
     if (
       (!clientId || !clientSecret) &&
       fs.existsSync(CREDENTIALS_PATH)
     ) {
   
       try {
   
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
   
         if (config) {
           clientId =
             config.client_id || clientId;
   
           clientSecret =
             config.client_secret ||
             clientSecret;
         }
   
       } catch (error) {
   
         throw new Error(
           "credentials.json is invalid."
         );
       }
     }
   
     if (!clientId || !clientSecret) {
       throw new Error(
         "Google OAuth credentials are not configured."
       );
     }
   
     return new google.auth.OAuth2(
       clientId,
       clientSecret,
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
        PRODUCTION:
        Use refresh token from Render environment.
     */
   
     if (
       process.env.GOOGLE_REFRESH_TOKEN
     ) {
   
       client.setCredentials({
         refresh_token:
           process.env.GOOGLE_REFRESH_TOKEN,
       });
   
       return client;
     }
   
     /*
        LOCAL:
        Fall back to token.json.
     */
   
     if (
       fs.existsSync(TOKEN_PATH)
     ) {
   
       try {
   
         const token =
           JSON.parse(
             fs.readFileSync(
               TOKEN_PATH,
               "utf8"
             )
           );
   
         client.setCredentials(token);
   
         return client;
   
       } catch (error) {
   
         throw new Error(
           "token.json is invalid."
         );
       }
     }
   
     return null;
   }
   
   /* =========================================================
      NODEMAILER MIME TRANSPORT
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
   
     if (!GMAIL_USER) {
       throw new Error(
         "GMAIL_USER is not configured."
       );
     }
   
     if (!GMAIL_TO) {
       throw new Error(
         "MAIL_TO is not configured."
       );
     }
   
     const auth =
       getAuthenticatedClient();
   
     if (!auth) {
       throw new Error(
         "Gmail authorization has not been completed."
       );
     }
   
     const mailOptions = {
   
       from: GMAIL_USER,
   
       to: GMAIL_TO,
   
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
       !Buffer.isBuffer(info.message)
     ) {
       throw new Error(
         "Failed to generate email."
       );
     }
   
     const encodedMessage =
       info.message
         .toString("base64")
         .replace(/\+/g, "-")
         .replace(/\//g, "_")
         .replace(/=+$/, "");
   
     const gmail =
       google.gmail({
         version: "v1",
         auth,
       });
   
     await gmail.users.messages.send({
       userId: "me",
   
       requestBody: {
         raw: encodedMessage,
       },
     });
   }
   
   /* =========================================================
      RAZORPAY WEBHOOK
      IMPORTANT:
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
   
         const receivedBuffer =
           Buffer.from(
             receivedSignature,
             "utf8"
           );
   
         const expectedBuffer =
           Buffer.from(
             expectedSignature,
             "utf8"
           );
   
         if (
           receivedBuffer.length !==
           expectedBuffer.length
         ) {
   
           return res
             .status(400)
             .send(
               "Invalid signature."
             );
         }
   
         const valid =
           crypto.timingSafeEqual(
             expectedBuffer,
             receivedBuffer
           );
   
         if (!valid) {
   
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
   
   const formLimiter =
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
      ALLOWED AUDIO FILES
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
      ALLOWED SUPPORT FILES
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
   
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
       .test(value);
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
      HOME
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
       });
     }
   );
   
   /* =========================================================
      GOOGLE AUTH
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
   
         res.redirect(
           authUrl
         );
   
       } catch (error) {
   
         console.error(
           "Google auth error:",
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
            Save locally.
   
            On Render, preferably use
            GOOGLE_REFRESH_TOKEN instead.
         */
   
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
     <meta
       name="viewport"
       content="width=device-width, initial-scale=1.0"
     >
     <title>
       Yireh Ministry - Gmail Connected
     </title>
   
     <style>
       body {
         margin: 0;
         min-height: 100vh;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #ededed;
         font-family: Arial, sans-serif;
         color: #222;
       }
   
       .box {
         max-width: 520px;
         margin: 20px;
         padding: 40px;
         background: #fff;
         border-radius: 16px;
         text-align: center;
         box-shadow:
           0 10px 30px rgba(0,0,0,.08);
       }
   
       h1 {
         margin-top: 0;
       }
     </style>
   </head>
   
   <body>
   
     <div class="box">
   
       <h1>
         Gmail connected successfully
       </h1>
   
       <p>
         Yireh Ministry backend is now authorized.
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
     async (req, res) => {
   
       try {
   
         await sendGmailMessage({
   
           subject:
             "Yireh Ministry Backend Test",
   
           text:
             "This is a test email from the Yireh Ministry backend.\n\nGmail API OAuth is working correctly.",
         });
   
         return res.json({
   
           success: true,
   
           message:
             "Test email sent successfully.",
         });
   
       } catch (error) {
   
         console.error(
           "Gmail test error:",
           error
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
      =========================================================
   
      POST:
   
      /api/contact
   
      JSON:
   
      {
        fullName,
        email,
        phone,
        subject,
        message
      }
   
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
   
         /* REQUIRED */
   
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
   
         /* EMAIL */
   
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
   Yireh Ministry Website Contact
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
           error
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
      =========================================================
   
      IMPORTANT:
   
      Both URLs are supported:
   
      /api/event-register
      /api/events/register
   
      Therefore your existing frontend does not
      need to be changed.
   
      JSON:
   
      {
        eventName,
        fullName,
        phone,
        email,
        city,
        seats
      }
   
      ========================================================= */
   
   async function handleEventRegistration(
     req,
     res
   ) {
   
     try {
   
       const eventName =
         cleanText(
           req.body.eventName,
           200
         );
   
       const fullName =
         cleanText(
           req.body.fullName,
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
           req.body.city,
           120
         );
   
       const seats =
         Number(
           req.body.seats
         );
   
       /* =====================================================
          REQUIRED FIELDS
          ===================================================== */
   
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
   
       /* =====================================================
          EMAIL
          ===================================================== */
   
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
   
       /* =====================================================
          SEATS
          ===================================================== */
   
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
   
       /* =====================================================
          EMAIL BODY
          ===================================================== */
   
       const body = `
   Yireh Ministry Event Registration
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
   
       /* =====================================================
          SEND EMAIL
          ===================================================== */
   
       await sendGmailMessage({
   
         subject:
           `Event Registration - ${eventName} - ${fullName}`,
   
         text: body,
   
         replyTo: email,
       });
   
       /* =====================================================
          SUCCESS
          ===================================================== */
   
       return res
         .status(200)
         .json({
   
           success: true,
   
           message:
             "Your event registration has been submitted successfully.",
         });
   
     } catch (error) {
   
       console.error(
         "Event registration error:",
         error
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
   
   /*
      CURRENT FRONTEND URL
      --------------------
   
      POST /api/event-register
   */
   
   app.post(
     "/api/event-register",
     eventLimiter,
     handleEventRegistration
   );
   
   /*
      OLD / ALTERNATIVE URL
      ---------------------
   
      POST /api/events/register
   */
   
   app.post(
     "/api/events/register",
     eventLimiter,
     handleEventRegistration
   );
   
   /* =========================================================
      CREATE RAZORPAY DONATION ORDER
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
   
         /* ===================================================
            AMOUNT
            =================================================== */
   
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
   
         /* ===================================================
            EMAIL
            =================================================== */
   
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
   
         /* ===================================================
            CREATE ORDER
            =================================================== */
   
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
   
         /* ===================================================
            STORE ORDER
            =================================================== */
   
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
   
         /* ===================================================
            RESPONSE
            =================================================== */
   
         return res.json({
   
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
           error
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
      VERIFY RAZORPAY PAYMENT
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
   
         const expectedBuffer =
           Buffer.from(
             expectedSignature
           );
   
         const receivedBuffer =
           Buffer.from(
             razorpay_signature
           );
   
         if (
           expectedBuffer.length !==
           receivedBuffer.length
         ) {
   
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
             expectedBuffer,
             receivedBuffer
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
   
         return res.json({
   
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
           error
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
      =========================================================
   
      POST:
   
      /api/anthems
   
      multipart/form-data
   
      Fields:
   
      fullName
      location
      phone
      lyrics
      submissionType
   
      Files:
   
      tuneFile
      supportFile
   
      ========================================================= */
   
   app.post(
     "/api/anthems",
   
     formLimiter,
   
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
   
         /* ===================================================
            REQUIRED
            =================================================== */
   
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
             ?. [0] ||
           null;
   
         const support =
           req.files
             ?.supportFile
             ?. [0] ||
           null;
   
         /* ===================================================
            TOTAL SIZE
            =================================================== */
   
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
   
         /* ===================================================
            TUNE REQUIRED
            =================================================== */
   
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
   
         /* ===================================================
            AUDIO VALIDATION
            =================================================== */
   
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
   
         /* ===================================================
            SUPPORT FILE VALIDATION
            =================================================== */
   
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
   
         /* ===================================================
            EMAIL ATTACHMENTS
            =================================================== */
   
         const attachments = [];
   
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
   
         /* ===================================================
            SUBJECT
            =================================================== */
   
         const subject =
           `Anthems Season 1 - ${
             submissionType === "tune"
               ? "Lyrics & Tune"
               : "Lyrics"
           } - ${fullName}`;
   
         /* ===================================================
            EMAIL BODY
            =================================================== */
   
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
   
   This submission was received through the Yireh Ministry website.
         `.trim();
   
         /* ===================================================
            SEND EMAIL
            =================================================== */
   
         await sendGmailMessage({
   
           subject,
   
           text: body,
   
           attachments,
         });
   
         /* ===================================================
            SUCCESS
            =================================================== */
   
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
           error
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
      =========================================================
   
      VERY IMPORTANT:
   
      If the frontend calls a wrong API URL,
      return JSON instead of HTML.
   
      This prevents:
   
      SyntaxError:
      JSON.parse: unexpected character
   
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
         error
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
             error.message ||
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
         "========================================"
       );
   
       console.log(
         `Yireh backend running on port ${PORT}`
       );
   
       console.log(
         `Local: http://localhost:${PORT}`
       );
   
       console.log(
         `Health: http://localhost:${PORT}/api/health`
       );
   
       console.log(
         `Google OAuth callback: ${REDIRECT_URI}`
       );
   
       console.log(
         `Gmail user: ${GMAIL_USER || "NOT CONFIGURED"}`
       );
   
       console.log(
         `Gmail recipient: ${GMAIL_TO || "NOT CONFIGURED"}`
       );
   
       console.log(
         `Razorpay: ${
           razorpay
             ? "CONFIGURED"
             : "NOT CONFIGURED"
         }`
       );
   
       console.log(
         "========================================"
       );
     }
   );