const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
const { BASEURL } = require("../utils/common.js");

// render template
const template = async (req, templateName, data, next) => {
  try {
    // template path
    const templatePath = path.join(
      __dirname,
      "../templates",
      templateName + ".html"
    );

    // check template exist or not
    if (!fs.existsSync(templatePath)) {
      throw new Error("Email template not found " + templatePath);
    }

    // render data
    let templateData = {};
    if (templateName == "forgotPassword") {
      // reset password link
      let resetPasswordLink =
        (await BASEURL(req)) + "?token=" + data.resetToken;
      templateData = {
        userName: data.name,
        resetPasswordLink: resetPasswordLink,
      };
    }

    // read email template
    const emailTemplate = fs.readFileSync(templatePath, "utf-8");

    // send dynamic data to email template
    const renderedEmail = ejs.render(emailTemplate, templateData);

    // return template
    return renderedEmail;
  } catch (error) {
    next(error);
  }
};

// mail auth user/password
const mailer = {
  user: "support@amnius.us",
  pass: "jmcvzvzyfruqdkje",
};

// send email common function
const sendEmail = async (email, subject, html, next) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: mailer,
    });

    const mailData = {
      from: mailer.user,
      to: email,
      subject: subject,
      html: html,
    };
    const result = await transporter.sendMail(mailData);

    if (!result) {
      throw new Error(result);
    }
    return true;
  } catch (error) {
    next(error);
  }
};

// forgot password mail
const forgotPasswordMail = async (req, user, next) => {
  try {
    const subject = "Reset Password";
    const templateName = "forgotPassword";
    const html = await template(req, templateName, user, next);
    const mail = await sendEmail(user.email, subject, html, next);
    if (!mail) {
      throw new Error(mail);
    }
    return true;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgotPasswordMail,
};
