const nodemailer = require("nodemailer")
const fs = require("fs")
const path = require("path")
require("dotenv").config()


const sendEmailService =async (email, code) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      // Đọc template HTML
      const templatePath = path.join(__dirname, "../../template/emailTemplate.html")
      let htmlTemplate = fs.readFileSync(templatePath, "utf-8")
      
      // Thay thế {code} bằng mã xác minh
      htmlTemplate = htmlTemplate.replace("{code}", code)
      
      const info = await transporter.sendMail({
        from: '"Skill Exchange" <skillexchange0104@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Your verified code", // Subject line
        html: htmlTemplate, // HTML body
      });
}

module.exports = {sendEmailService}