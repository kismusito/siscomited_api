const generatePDF = {};
const pdf = require("html-pdf");
const Appretice = require("../models/Appretice");
const Citations = require("../models/Citations");
const Solicity = require("../models/Solocity");
const Template = require("../models/Template");
const MotivesOrProhibitions = require("../models/MotivesOrProhibitions");
const User = require("../models/User");
const domain = require("../config/domain");

function generateRamdomPDF(n) {
    let ramdomCode = "";
    const posibleCharacters = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i <= n; i++) {
        const generate = Math.random() * (1, posibleCharacters.length) + 1;
        ramdomCode += posibleCharacters.charAt(generate);
    }
    ramdomCode += ".pdf";
    return ramdomCode;
}

async function generatePDFLayout(
    appreticesSelected,
    leader,
    date,
    hour,
    meetingLink,
    template,
    motive
) {
    const appretices = appreticesSelected;

    const dateSelected = new Date(date);
    const hourSelected = new Date(hour);
    const convertedHour =
        hourSelected.getHours() +
        ":" +
        (hourSelected.getMinutes() < 10
            ? "0" + hourSelected.getMinutes()
            : hourSelected.getMinutes()) +
        (hourSelected.getHours() <= 12 ? " AM" : " PM");

    var month = "";
    switch (dateSelected.getMonth() + 1) {
        case 1:
            month = "Enero";
            break;
        case 2:
            month = "Febrero";
            break;
        case 3:
            month = "Marzo";
            break;
        case 4:
            month = "Abril";
            break;
        case 5:
            month = "Mayo";
            break;
        case 6:
            month = "Junio";
            break;
        case 7:
            month = "Julio";
            break;
        case 8:
            month = "Agosto";
            break;
        case 9:
            month = "Septiembre";
            break;
        case 10:
            month = "Octubre";
            break;
        case 11:
            month = "Noviembre";
            break;
        case 12:
            month = "Diciembre";
            break;
    }

    const fichas = appretices.map((f) => {
        return f.ficha;
    });
    const uniqFichas = new Set(fichas);

    const sedes = appretices.map((f) => {
        return f.sede;
    });
    const uniqSedes = new Set(sedes);

    let appreticesHtml = "<ul style='list-style: none; margin:0; padding:0'>";
    appretices.map((appretice) => {
        appreticesHtml += "<li style='margin: 10px 0'>";
        appreticesHtml += "<div>" + appretice.name + "</div>";
        appreticesHtml += "<div>" + appretice.document + "</div>";
        appreticesHtml += "<div>" + appretice.email + "</div>";
        appreticesHtml += "<div>" + appretice.phone + "</div>";
        if ([...uniqFichas].length > 1) {
            appreticesHtml += "<div>Ficha: " + appretice.ficha + "</div>";
        }

        if ([...uniqSedes].length > 1) {
            appreticesHtml += "<div>Sede: " + appretice.sede + "</div>";
        }
        appreticesHtml += "</li>";
    });

    if ([...uniqFichas].length == 1) {
        appreticesHtml += "<li>Ficha: " + [...uniqFichas][0] + "</li>";
    }

    if ([...uniqSedes].length == 1) {
        appreticesHtml += "<li>Sede: " + [...uniqSedes][0] + "</li>";
    }
    appreticesHtml += "<ul>";

    appreticesHtml += "<br>";

    const leaderName = leader.first_name + " " + leader.last_name;
    const meetingDate =
        dateSelected.getDate() +
        " de " +
        month +
        " de " +
        dateSelected.getFullYear() +
        " a las " +
        convertedHour;
    const getTemplate = await Template.findById(template);

    const htmlGet = getTemplate.template
        .replace("%{appreticesHtml}", appreticesHtml)
        .replace("%{meetingLink}", meetingLink)
        .replace("%{leader}", leaderName)
        .replace("%{motivo_o_prohibicion}", motive.description)
        .replace("%{date}", meetingDate);

    return htmlGet;
}

function generatePDFLayoutMinutes(appreticesSelected, date, hour, content) {
    const appretices = appreticesSelected;

    const dateSelected = new Date(date);
    const hourSelected = new Date(hour);
    const convertedHour =
        hourSelected.getHours() +
        ":" +
        (hourSelected.getMinutes() < 10
            ? "0" + hourSelected.getMinutes()
            : hourSelected.getMinutes()) +
        (hourSelected.getHours() <= 12 ? " AM" : " PM");

    var month = "";
    switch (dateSelected.getMonth() + 1) {
        case 1:
            month = "Enero";
            break;
        case 2:
            month = "Febrero";
            break;
        case 3:
            month = "Marzo";
            break;
        case 4:
            month = "Abril";
            break;
        case 5:
            month = "Mayo";
            break;
        case 6:
            month = "Junio";
            break;
        case 7:
            month = "Julio";
            break;
        case 8:
            month = "Agosto";
            break;
        case 9:
            month = "Septiembre";
            break;
        case 10:
            month = "Octubre";
            break;
        case 11:
            month = "Noviembre";
            break;
        case 12:
            month = "Diciembre";
            break;
    }

    const fichas = appretices.map((f) => {
        return f.ficha;
    });
    const uniqFichas = new Set(fichas);

    const sedes = appretices.map((f) => {
        return f.sede;
    });
    const uniqSedes = new Set(sedes);

    let appreticesHtml = "<ul style='list-style: none; margin:0; padding:0'>";
    appretices.map((appretice) => {
        appreticesHtml += "<li style='margin: 10px 0'>";
        appreticesHtml += "<div>" + appretice.name + "</div>";
        appreticesHtml += "<div>" + appretice.document + "</div>";
        if ([...uniqFichas].length > 1) {
            appreticesHtml += "<div>Ficha: " + appretice.ficha + "</div>";
        }

        if ([...uniqSedes].length > 1) {
            appreticesHtml += "<div>Sede: " + appretice.sede + "</div>";
        }
        appreticesHtml += "</li>";
    });

    if ([...uniqFichas].length == 1) {
        appreticesHtml += "<li>Ficha: " + [...uniqFichas][0] + "</li>";
    }

    if ([...uniqSedes].length == 1) {
        appreticesHtml += "<li>Sede: " + [...uniqSedes][0] + "</li>";
    }
    appreticesHtml += "<ul>";

    appreticesHtml += "<br>";

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <body style="font-family: Arial, Helvetica, sans-serif; font-size: .8em">
        <div style="width: 100%; border: 1px solid #D4D4D4;">
            <div style="border-bottom: 1px solid #D4D4D4; text-align: center;">
                <span>ACTA Voceros</span>
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; padding: 5px 0 20px 5px;">
                <strong>NOMBRE DEL COMITÉ O DE LA REUNIÓN: <span>Comité de Evaluación y Seguimiento</span></strong>
            </div>
    
            <table style="width: 100%; border-bottom: 1px solid #D4D4D4;">
                <tr style="width: 100%;">
                    <td style="width: 55%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">CIUDAD Y FECHA: Itagui, <br> 15 de Mayo de 2020</td>
                <td style=" width: 20%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">HORA INICIO: 1:45 P.M
                    </td>
                    <td style="width: 20%; padding: 5px 0 20px 5px;">HORA FIN:</td>
                </tr>
            </table>
    
            <table style="width: 100%; border-bottom: 1px solid #D4D4D4;">
                <tr style="width: 100%;">
                    <td style="width: 57.7%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;">LUGAR: Sala VIRTUAL
                    </td>
                    <td style=" border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;">DIRECCIÓN GENERAL / REGIONAL /
                        CENTRO</td>
                </tr>
            </table>
    
            <div style="border-bottom: 1px solid #D4D4D4; padding: 5px 0 20px 5px;">
                <strong>TEMA (S):</strong>
    
                <ul>
                    <li>Inconformidades con la formación: coordinadores</li>
                    <li>Inconformidades con la formación: coordinadores</li>
                    <li>Inconformidades con la formación: coordinadores</li>
                    <li>Inconformidades con la formación: coordinadores</li>
                </ul>
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; padding: 5px 0 20px 5px;">
                <strong>OBJETIVO(S) DE LA REUNIÓN:</strong> <br>
                <span>Dar respuesta a las preguntas más frecuentes de los aprendices al equipo administrativo y de
                    coordinadores</span>
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; text-align: center; padding: 5px 0;">
                <span>DESARROLLO DE LA REUNIÓN</span>
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; padding: 5px 0 20px 5px;">
                ${content}
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; padding: 5px 0 20px 5px;">
            </div>
    
            <div style="border-bottom: 1px solid #D4D4D4; text-align: center; padding: 5px 0;">
                <span>COMPROMISOS</span>
            </div>
    
            <table style="width: 100%; border-bottom: 1px solid #D4D4D4;">
                <tr style="width: 100%;">
                    <td style="width: 55%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">ACTIVIDAD</td>
               <td style=" width: 20%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">RESPONSABLE</td>
                    <td style="width: 20%; padding: 5px 0 20px 5px;">FECHA</td>
                </tr>
            </table>
    
            <table style="width: 100%; border-bottom: 1px solid #D4D4D4;">
                <tr style="width: 100%;">
                    <td style="width: 55%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">s</td>
                <td style=" width: 20%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">s</td>
                    <td style="width: 20%; padding: 5px 0 20px 5px;">s</td>
                </tr>
            </table>
    
            <table style="width: 100%; border-bottom: 1px solid #D4D4D4;">
                <tr style="width: 100%;">
                    <td style="width: 55%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">s</td>
               <td style=" width: 20%; border-right: 1px solid #D4D4D4;padding: 5px 0 20px 5px;"">s</td>
                    <td style="width: 20%; padding: 5px 0 20px 5px;">s</td>
                </tr>
            </table>
    
            <div style="border-bottom: 1px solid #D4D4D4; text-align: center; padding: 5px 0;">
                ${appreticesHtml}
            </div>
    
        </div>
    </body>
    
    </html>
    `;

    return html;
}

function getFormationPrograms(programs) {
    let programData = {
        ficha: "",
        sede: "",
    };
    programs.map((pro, i) => {
        programData.ficha += pro.ficha + (i != 1 ? " - " : "");
        programData.sede += pro.sede + (i != 1 ? " - " : "");
    });
    return programData;
}

async function getInfoByAppretice(ID) {
    const userGet = await Appretice.findOne({ _id: ID });
    const getProgramInfo = getFormationPrograms(userGet.programas_formacion);
    const userProgramInfo = {
        name: userGet.nombre + " " + userGet.primer_apellido,
        document: userGet.numero_documento,
        ficha: getProgramInfo.ficha,
        sede: getProgramInfo.sede,
        email: userGet.email,
        phone: userGet.phone,
    };

    return userProgramInfo;
}

async function getAppreticesInfo(appretices) {
    let allUserData = [];
    for (i in appretices) {
        const getInfo = await getInfoByAppretice(appretices[i].appreticeID);
        allUserData.push(getInfo);
    }
    return allUserData;
}

generatePDF.generateCitation = async (req, res) => {
    const {
        solicityID,
        citationDate,
        citationHour,
        citationLink,
        template,
        description,
    } = req.body;
    if (solicityID) {
        const solicity = await Solicity.findById(solicityID);
        if (solicity) {
            const getAppretices = await getAppreticesInfo(JSON.parse(solicity.appretices));
            const motive = await MotivesOrProhibitions.findById(solicity.motiveOrProhibition);
            const leader = await User.findById(solicity.userID);
            const html = await generatePDFLayout(
                getAppretices,
                leader,
                citationDate,
                citationHour,
                citationLink,
                template,
                motive
            );
            const pdfNameRamdom = generateRamdomPDF(40);
            pdf.create(html).toFile("assets/Citations/" + pdfNameRamdom, (err, resoponse) => {
                if (err) {
                    return res.json({
                        status: false,
                        message: "PDF error",
                    });
                } else {
                    const saveCitation = new Citations({
                        userID: req.userID,
                        pdfLink: pdfNameRamdom,
                        description: description,
                        solicity: solicityID,
                    });

                    saveCitation.lastChange = saveCitation._id;
                    saveCitation.parentID = saveCitation._id;

                    if (saveCitation.save()) {
                        return res.json({
                            status: true,
                            pdfLink: domain + "Citations/" + pdfNameRamdom,
                            message: "PDF Generated",
                        });
                    } else {
                        return res.json({
                            status: false,
                            message: "PDF error",
                        });
                    }
                }
            });
        } else {
            return res.json({
                status: false,
                message: "Ha ocurrido un error",
            });
        }
    } else {
        return res.json({
            status: false,
            message: "El id es requerido",
        });
    }
};

generatePDF.generateMinute = async (req, res) => {
    const { appretices, date, hour, content } = req.body;
    const getAppretices = await getAppreticesInfo(appretices);
    const html = generatePDFLayoutMinutes(getAppretices, date, hour, content);
    const pdfNameRamdom = generateRamdomPDF(40);

    pdf.create(html).toFile("assets/Minutes/Voceros/" + pdfNameRamdom, (err, resoponse) => {
        if (err) {
            return res.json({
                status: false,
                message: "PDF error",
            });
        } else {
            const saveCitation = new Citations({
                userID: req.userID,
                pdfLink: pdfNameRamdom,
                description: "Acta generated",
            });

            saveCitation.lastChange = saveCitation._id;
            saveCitation.parentID = saveCitation._id;

            if (saveCitation.save()) {
                return res.json({
                    status: true,
                    pdfLink: domain + "Minutes/Voceros/" + pdfNameRamdom,
                    message: "PDF Generated",
                });
            } else {
                return res.json({
                    status: false,
                    message: "PDF error",
                });
            }
        }
    });
};

module.exports = generatePDF;
