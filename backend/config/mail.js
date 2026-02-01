const nodemailer = require("nodemailer");

let transporter;

// Create Ethereal test account
(async () => {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  console.log("📧 Ethereal Email Ready");
  console.log("User:", testAccount.user);
})();

const sendEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: '"Online Voting System" <no-reply@voting.com>',
    to,
    subject,
    text
  });

  console.log("🔗 Email Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
