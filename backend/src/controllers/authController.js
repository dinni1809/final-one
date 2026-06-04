const authService = require("../services/authService");
const response = require("../utils/responseHandler");

exports.register = async (req, res, next) => {
  try {
    response.created(res, await authService.register(req.body));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    response.ok(res, await authService.login(req.body));
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    response.ok(res, await authService.googleLogin(req.body));
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res) => response.ok(res, { user: req.user });

exports.updateProfile = async (req, res, next) => {
  try {
    response.ok(res, await authService.updateProfile(req.user._id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.logout = (_req, res) =>
  response.ok(res, { message: "Logged out successfully" });

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Account Verified - FAATTSOO</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            background-color: #F7F1EA;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            color: #2B1D12;
          }
          .card {
            background-color: #FFFFFF;
            padding: 40px;
            border-radius: 12px;
            border: 1px solid #E6DDD5;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 8px 24px rgba(74, 42, 21, 0.08);
          }
          .icon {
            font-size: 56px;
            color: #5B6F25;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 24px;
            color: #4A2A15;
            margin-bottom: 12px;
          }
          p {
            font-size: 15px;
            color: #7B6A5D;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #8B5A2B;
            text-transform: uppercase;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✓</div>
          <h1>Verification Successful!</h1>
          <p>Your FAATTSOO account has been successfully verified. You can now return to the mobile app and log in normally.</p>
          <div class="brand">FAATTSOO</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.setHeader("Content-Type", "text/html");
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verification Error - FAATTSOO</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            background-color: #F7F1EA;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            color: #2B1D12;
          }
          .card {
            background-color: #FFFFFF;
            padding: 40px;
            border-radius: 12px;
            border: 1px solid #E6DDD5;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 8px 24px rgba(74, 42, 21, 0.08);
          }
          .icon {
            font-size: 56px;
            color: #B04731;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 24px;
            color: #4A2A15;
            margin-bottom: 12px;
          }
          p {
            font-size: 15px;
            color: #7B6A5D;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #8B5A2B;
            text-transform: uppercase;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✗</div>
          <h1>Verification Link Invalid</h1>
          <p>${error.message || "This verification link is invalid or has expired. Please log in to the mobile app to request a new verification email."}</p>
          <div class="brand">FAATTSOO</div>
        </div>
      </body>
      </html>
    `);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const result = await authService.resendVerification(req.body.identifier || req.body.email);
    response.ok(res, result);
  } catch (error) {
    next(error);
  }
};

exports.sendVerification = async (req, res, next) => {
  try {
    const result = await authService.resendVerification(req.user.email);
    response.ok(res, result);
  } catch (error) {
    next(error);
  }
};
