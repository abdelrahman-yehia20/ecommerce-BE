import { createTransport } from "nodemailer";

export const sendEmail = async ({ to = '', subject = '', html = '', attachments = [] }) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.emailSender,
      pass: process.env.password,
    },
  });

  const info = await transporter.sendMail({
    from: `"Maddison Foo Koch 👻" <${process.env.emailSender}>`,
    to,
    subject,
    html,
    attachments
  });

  console.log("Message sent: %s", info);
  if (info?.accepted?.length > 0) {

  }

}


// import nodemailer from "nodemailer"

// export const sendEmail = async (to, subject, html) => {

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "abdddyehaaa@gmail.com",
//       pass: "rvjwxilfljgoroww",
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"yehia 👻" <abdddyehaaa@gmail.com>',
//     to: to ? to : "",
//     subject: subject ? subject : "hi ✌",
//     html: html ? html : "hello ✌",
//   });

//   console.log(info);

//   if (info.accepted.length) {
//     return true
//   }
//   return false

// }