export const template = (verificationLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tripper Email Verification</title>
  <style>
    body {
      font-family: 'Poppins', Arial, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 40px 30px;
      box-shadow: 0 6px 15px rgba(0,0,0,0.08);
      text-align: center;
      background-image: url('https://img.freepik.com/free-vector/plane-air-travel-concept_23-2147494449.jpg?t=st=1729607204~exp=1729610804~hmac=b4a9f22ad1d49b05682bff1a76b6823c1a035dfeb4e486be10b6c32e1b2a5a8b&w=1380');
      background-size: cover;
      background-position: center;
    }
    .overlay {
      background-color: rgba(255, 255, 255, 0.92);
      border-radius: 12px;
      padding: 30px;
    }
    .logo {
      margin-bottom: 20px;
    }
    .logo img {
      width: 120px;
      height: auto;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #2b2d42;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 25px;
      color: #444;
    }
    .btn {
      display: inline-block;
      padding: 14px 30px;
      background: linear-gradient(135deg, #ff7b54, #ffb26b);
      color: #fff !important;
      text-decoration: none;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background: linear-gradient(135deg, #ff9a3c, #ffc56b);
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="overlay">
      <div class="logo">
        <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Tripper Logo" />
      </div>
      <h1>Welcome to Tripper 🌍</h1>
      <p>Thanks for joining Tripper — your gateway to unique stays and unforgettable journeys!  
      Please confirm your email to activate your account and start exploring.</p>
      <a href="${verificationLink}" class="btn" target="_blank">Verify My Email</a>
      <p>If you didn’t create a Tripper account, please dont ignore this message.</p>
      <div class="footer">
        © ${new Date().getFullYear()} Tripper Inc. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;
};
