const WelcomeEmail = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to myAfnai Real Estate!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #003366; /* Primary myAfnai Real Estate color */
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .email-body {
      padding: 20px;
    }
    .email-body h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #003366;
    }
    .email-body p {
      font-size: 16px;
      line-height: 1.6;
    }
    .cta-button {
      display: block;
      width: 200px;
      text-align: center;
      background-color: #003366;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 12px;
      border-radius: 5px;
      margin: 20px auto;
    }
    .email-footer {
      background-color: #f4f4f9;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to myAfnai Real Estate</h1>
    </div>
    <div class="email-body">
      <h1>Dear ${name},</h1>
      <p>We’re thrilled to welcome you to myAfnai Real Estate – your trusted partner in finding your perfect property.</p>
      <p>At myAfnai Real Estate, you can explore premium listings, discover your dream home, and get expert advice on buying, selling, or renting properties.</p>
      <p>Our team is dedicated to making your real estate journey smooth, transparent, and successful.</p>
      <a href="https://myafnai.com/login" class="cta-button">Get Started</a>
      <p>If you have any questions or need assistance, please reach out to our support team. We’re always here to help.</p>
      <p>Thank you for choosing myAfnai Real Estate. We’re excited to be part of your property journey!</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} myAfnai Real Estate. All rights reserved.</p>
      <p>Need help? Contact us at support@myafnai.com</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = WelcomeEmail;
