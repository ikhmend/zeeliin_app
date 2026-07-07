import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export async function sendPasswordResetEmail(email, resetLink) {
  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Нууц үг сэргээх",
    text: `Нууц үгээ сэргээхийн тулд дараах холбоосоор 15 минутын дотор орно уу: ${resetLink}`,
    html: `
      <p>Нууц үгээ сэргээхийн тулд дараах холбоос дээр дарна уу.</p>
      <a href="${resetLink}">Нууц үг сэргээх</a>
      <p>Энэ холбоос 15 минутын хугацаанд хүчинтэй.</p>
    `,
  });
}

export async function sendPasswordSetupEmail(email, setupLink) {
  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Бүртгэл баталгаажуулах",
    text: `Бүртгэлээ баталгаажуулж нууц үгээ үүсгэхийн тулд дараах холбоосоор орно уу: ${setupLink}`,
    html: `
      <p>Бүртгэлээ баталгаажуулж нууц үгээ үүсгэхийн тулд дараах холбоос дээр дарна уу.</p>
      <a href="${setupLink}">Нууц үг үүсгэх</a>
      <p>Нууц үг үүсгэсний дараа вебсайт руу буцаж нэвтэрнэ үү.</p>
    `,
  });
}
