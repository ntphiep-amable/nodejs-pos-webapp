const nodemailer = require('nodemailer');
const crypto = require('crypto');
const token = require('./token.model');
const mongoose = require('mongoose');

// connect to database
const connect = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('\nConnect to DB successfully !!!');
    } catch (error) {
      console.log('\nConnect to DB failed !!!');
      console.log(error);
    }
  };

// const app = express();
// const port = 3000;

// Tạo mã hash hoặc mã token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Tạo đường link với mã token
const generateLink = (token) => {
  return `http://localhost:4000/verify?token=${token}`;
};

// Thời gian hiệu lực của đường link (1 phút)
const expirationTime = 60 * 1000; // 1 phút

const html = `
http://localhost:4000
`;

// Gửi email
const sendEmail = async (recipientEmail) => {
  let createToken = (id) => {
    let token = crypto.randomBytes(32).toString('hex');
    let hash = crypto.createHash('sha256').update(token).digest('hex');
    let tokenObj = {
      token: hash,
      userId: id,
      createdAt: new Date().getTime(),
    };
    // add token to database

    return tokenObj;
  };
  let tokenObj = await createToken(recipientEmail);
  connect().then(() => {
    token.create(tokenObj, (err, token) => {
      if (err) {
        console.log(err);
      } else {
        console.log(token);
      }
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'nodejsadmtest@gmail.com',
      pass: 'mkrz svbx fekp dqyz',
    },
  });

  const mailOptions = {
    from: 'nodejsadmtest@gmail.com',
    to: recipientEmail,
    subject: 'Subject of your email',
    html: generateLink(tokenObj.token),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// let startTime = new Date().getTime();
// Gọi hàm sendEmail với địa chỉ email của người nhận
sendEmail('hiepghast23@gmail.com');
