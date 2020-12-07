const nodemailer = require("nodemailer");
require("dotenv").config();

async function Mail(template) {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    console.log({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const destinatary = await transport.sendMail({
        from: '"Siscomited " ' + process.env.EMAIL,
        to: template.mails,
        subject: template.subject,
        attachments: template.archives ? template.archives : [],
        html: template.message,
    });

    return {
        response: destinatary.messageId,
    };
}

module.exports = Mail;
