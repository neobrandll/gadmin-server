const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const errorHandler = require('./error');

const sendEmail = async (email, subject, body) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = await oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ganappneobrandll@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: '"Gadmin" <ganappneobrandll@gmail.com>',
      to: email,
      subject: subject,
      generateTextFromHTML: true,
      html: `<b>${body}</b>`
    };

    const info = await smtpTransport.sendMail(mailOptions);
    if (info) {
      console.log(info);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
