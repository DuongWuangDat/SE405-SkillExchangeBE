const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const sendEmailService = async (email, code) => {
  console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  // Đọc template HTML
  const templatePath = path.join(
    __dirname,
    "../../template/emailTemplate.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  // Thay thế {code} bằng mã xác minh
  htmlTemplate = htmlTemplate.replace("{code}", code);

  const info = await transporter.sendMail({
    from: '"Skill Exchange" <skillexchange0104@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Your verified code", // Subject line
    html: htmlTemplate, // HTML body
  });
};

// Send account suspension/deletion notification email (async, doesn't crash if fails)
const sendAccountActionEmail = (
  userEmail,
  username,
  actionType,
  reason = null
) => {
  // Run async without waiting, catch errors silently
  setTimeout(async () => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
      });

      // Read template HTML
      const templatePath = path.join(
        __dirname,
        "../../template/accountSuspensionTemplate.html"
      );
      let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

      // Prepare template data based on action type
      const supportEmail = "skillexchange0104@gmail.com";
      const actionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      let actionTitle, description, reasonSection;

      if (actionType === "banned") {
        actionTitle = "Your Account Has Been Suspended";
        description =
          "Your account has been temporarily suspended due to violations of our community guidelines. You will not be able to access your account until this suspension is lifted. Please contact our support team if you wish to appeal this decision.";
        reasonSection = reason
          ? `
                    <div class="info-section">
                        <h3>Reason for Suspension</h3>
                        <div class="info-item">
                            <span style="color: #333; font-size: 15px;">${reason}</span>
                        </div>
                    </div>
                `
          : "";
      } else if (actionType === "deleted") {
        actionTitle = "Your Account Has Been Deleted";
        description =
          "Your account has been deleted from our platform. All your data and information have been marked for removal. If you believe this was done in error or wish to restore your account, please contact our support team as soon as possible.";
        reasonSection = "";
      }

      // Replace template variables
      htmlTemplate = htmlTemplate.replace(/{actionType}/g, actionTitle);
      htmlTemplate = htmlTemplate.replace(/{username}/g, username);
      htmlTemplate = htmlTemplate.replace(/{email}/g, userEmail);
      htmlTemplate = htmlTemplate.replace(/{actionDate}/g, actionDate);
      htmlTemplate = htmlTemplate.replace(/{description}/g, description);
      htmlTemplate = htmlTemplate.replace(/{reasonSection}/g, reasonSection);
      htmlTemplate = htmlTemplate.replace(/{supportEmail}/g, supportEmail);

      await transporter.sendMail({
        from: '"Skill Exchange" <skillexchange0104@gmail.com>',
        to: userEmail,
        subject: `Important: ${actionTitle}`,
        html: htmlTemplate,
      });

      console.log(
        `[Email Service] Successfully sent ${actionType} notification to ${userEmail}`
      );
    } catch (error) {
      // Log error but don't crash the application
      console.error(
        `[Email Service] Failed to send ${actionType} email to ${userEmail}:`,
        error.message
      );
    }
  }, 0);
};

module.exports = { sendEmailService, sendAccountActionEmail };
