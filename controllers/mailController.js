const mailMethods = {};
const nodemailer = require("nodemailer");
const MailType = require("../models/MailType");
const Mail = require("../models/Mail");
require("dotenv").config();

mailMethods.test = async (req, res) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const destinatary = await transport.sendMail({
        from: '"Ciscomited 👻" <kismuteama@gmail.com>',
        to: "kismu35891@gmail.com",
        subject: "Test email",
        attachments: [
            {
                filename: "test.pdf",
                path:
                    "http://localhost:4000/Minutes/voceros/U2D33LC9GDEYOUU32O2JDJC66U4UHA5GNUJGA8AC.pdf",
            },
        ],
        text: "This is a test message",
        html: "<b>Hello world?</b>",
    });

    return res.json({
        response: destinatary.messageId,
    });
};

mailMethods.createMailType = async (req, res) => {
    const { name, permit } = req.body;
    if (name && permit) {
        const mailType = new MailType({
            name,
            permit,
        });

        if (await mailType.save()) {
            return res.status(200).json({
                status: true,
                message: "El tipo fue creado correctamente",
            });
        } else {
            return res.status(400).json({
                status: false,
                message:
                    "Ha ocurrido un error mientras se creaba el tipo de mail, por favor intentalo de nuevo",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Todos los campos son requeridos",
        });
    }
};

mailMethods.getAllMailTypes = async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            types: await MailType.find(),
            message: "Se han encontrado tipos de mail",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error, intentalo de nuevo",
        });
    }
};

mailMethods.createMail = async (req, res) => {
    const { name, mails, mailType } = req.body;
    if (name && mails && mailType) {
        const mail = new Mail({
            name,
            mails,
            mailType,
        });

        if (await mail.save()) {
            return res.status(200).json({
                status: true,
                message: "Se ha creado correctamente el email",
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Ha ocurrido un error por favor intentalo de nuevo",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Todos los campos son requeridos",
        });
    }
};

mailMethods.getAllMails = async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            types: await Mail.find(),
            message: "Se han encontrado emails",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error, intentalo de nuevo",
        });
    }
};

mailMethods.updateMailType = async (req, res) => {
    const { mailTypeID, name, permit } = req.body;
    if (mailTypeID) {
        try {
            const mailType = await MailType.findById(mailTypeID);
            const updated = await mailType.updateOne({
                $set: {
                    name,
                    permit,
                },
            });

            if (updated) {
                return res.status(200).json({
                    status: true,
                    message: "El tipo fue actualizado correctamente",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error intentalo nuevamente",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error,
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "El id es requerido",
        });
    }
};

mailMethods.updateMail = async (req, res) => {
    const { mailID, mailTypeID, name, mails } = req.body;
    if (mailID) {
        try {
            const mail = await Mail.findById(mailID);
            const updated = await mail.updateOne({
                $set: {
                    mailTypeID,
                    name,
                    mails,
                },
            });

            if (updated) {
                return res.status(200).json({
                    status: true,
                    message: "El mail fue actualizado correctamente",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error intentalo nuevamente",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error,
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "El id es requerido",
        });
    }
};

mailMethods.deleteMailType = async (req, res) => {
    const { mailTypeID } = req.body;

    if (mailTypeID) {
        try {
            const removed = await MailType.findById(mailTypeID);
            if (removed.remove()) {
                return res.status(200).json({
                    status: true,
                    message: "El tipo de mail fue eliminado correctamente",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error intentalo nuevamente",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error,
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "El id es requerido",
        });
    }
};

mailMethods.deleteMail = async (req, res) => {
    const { mailID } = req.body;

    if (mailID) {
        try {
            const removed = await Mail.findById(mailID);
            if (removed.remove()) {
                return res.status(200).json({
                    status: true,
                    message: "El mail fue eliminado correctamente",
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Ha ocurrido un error intentalo nuevamente",
                });
            }
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error,
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "El id es requerido",
        });
    }
};

module.exports = mailMethods;
