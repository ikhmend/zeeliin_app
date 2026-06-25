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
    text: `Ok nuuts ugee martchihsan uu? ok iishee or: ${resetLink}`,
    html: `
      <p>ene holboos deer dar</p>
      <a href="${resetLink}">Нууц үг сэргээх</a>
      <p>15 minutiin dotor solioroi ok.</p>
    `,
  });
}