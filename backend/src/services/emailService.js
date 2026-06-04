const nodemailer = require("nodemailer");

// Mask password helper
const maskString = (str) => {
  if (!str) return "not set";
  if (str.length <= 4) return "****";
  return str.slice(0, 2) + "****" + str.slice(-2);
};

// 6. Log exact SMTP configuration being used (mask password)
const smtpConfig = {
  host: process.env.SMTP_HOST || "not set (using mock)",
  port: process.env.SMTP_PORT || "not set",
  secure: process.env.SMTP_SECURE || "not set",
  user: process.env.SMTP_USER || "not set",
  pass: maskString(process.env.SMTP_PASS),
  tls: { rejectUnauthorized: false },
};
console.log("[EmailService] Initializing with SMTP config:", JSON.stringify(smtpConfig, null, 2));

let transporter;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  console.log("[EmailService] Creating standard nodemailer SMTP transporter...");
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  
  // 3. Log transporter.verify() on startup
  console.log("[EmailService] Performing transporter connection verify check on startup...");
  transporter.verify((error, success) => {
    if (error) {
      console.error("[EmailService] Transporter startup verification check FAILED:", error.message);
      if (error.stack) {
        console.error("[EmailService] Transporter verify error stack trace:\n", error.stack);
      }
    } else {
      console.log("[EmailService] Transporter startup check succeeded. Ready to deliver messages.");
    }
  });
} else {
  console.log("[EmailService] SMTP credentials not fully set. Initializing mock console transporter.");
  // Mock console transporter for development/testing
  transporter = {
    verify: async () => {
      console.log("[EmailService] Mock verify check called (always passes)");
      return true;
    },
    sendMail: async (options) => {
      console.log("\n---------------- FAATTSOO EMAIL SENT (MOCK) ----------------");
      console.log(`To:      ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      // Parse link from HTML
      const match = options.html.match(/href="([^"]+)"/);
      if (match) {
        console.log(`Link:    ${match[1]}`);
      }
      console.log("------------------------------------------------------------\n");
      return { messageId: "mock-id-" + Date.now() };
    },
  };
}

exports.sendVerificationEmail = async (user, token) => {
  // 1. Log before sendVerificationEmail()
  console.log(`[EmailService] sendVerificationEmail() called. Recipient: ${user.email}, Token: ${token}`);
  
  const verifyUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your FAATTSOO Account</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background-color: #F7F1EA;
          margin: 0;
          padding: 0;
          color: #2B1D12;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E6DDD5;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(74, 42, 21, 0.08);
        }
        .header {
          background-color: #4A2A15;
          padding: 30px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #F7F1EA;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #4A2A15;
        }
        .btn-container {
          text-align: center;
          margin: 30px 0;
        }
        .btn {
          display: inline-block;
          background-color: #8B5A2B;
          color: #FFFFFF !important;
          padding: 14px 28px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: 1px;
        }
        .footer {
          background-color: #FBF7F1;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #7B6A5D;
          border-top: 1px solid #E6DDD5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo">FAATTSOO</span>
        </div>
        <div class="content">
          <h2 class="title">Verify Your Email Address</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for registering with FAATTSOO. To complete your account registration and secure your discovery experience, please verify your email address by clicking the button below:</p>
          <div class="btn-container">
            <a href="${verifyUrl}" class="btn">Verify Account</a>
          </div>
          <p>This verification link will expire in 24 hours. If you did not sign up for a FAATTSOO account, you can safely ignore this email.</p>
          <p>Best regards,<br>The FAATTSOO Team</p>
        </div>
        <div class="footer">
          &copy; 2026 FAATTSOO. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // 3. Log transporter.verify() before sending
    console.log("[EmailService] Verifying transporter connection before sending mail...");
    if (typeof transporter.verify === "function") {
      if (transporter.verify.constructor.name === "AsyncFunction") {
        await transporter.verify();
      } else {
        await new Promise((resolve, reject) => {
          transporter.verify((err, success) => {
            if (err) reject(err);
            else resolve(success);
          });
        });
      }
      console.log("[EmailService] Transporter connection verification verified successfully.");
    }

    console.log("[EmailService] Calling transporter.sendMail()...");
    // 4. Log transporter.sendMail() result
    const result = await transporter.sendMail({
      from: `"FAATTSOO" <noreply@faattsoo.local>`,
      to: user.email,
      subject: "Verify your FAATTSOO Account",
      html,
    });
    console.log("[EmailService] transporter.sendMail() succeeded. Result:", JSON.stringify(result, null, 2));

    // 2. Log after sendVerificationEmail()
    console.log(`[EmailService] sendVerificationEmail() completed successfully for: ${user.email}`);
  } catch (error) {
    // 5. Log caught exception stack trace
    console.error("[EmailService] sendVerificationEmail() FAILED with error:", error.message);
    if (error.stack) {
      console.error("[EmailService] Stack trace:\n", error.stack);
    }
    throw error;
  }
};
