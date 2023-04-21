const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bharath.kesineni@brainvire.com",
    pass: "Brain@2023",
  },
});

module.exports.send = async (to, subject, text) => {
  await transporter.sendMail({
    from: "bharath.kesineni@brainvire.com", // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html: `<b>${text}</b>`, // html body
  });
};
