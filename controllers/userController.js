const userMethods = {};
const User = require("../models/User");
const Rol = require("../models/Rol");
const Citation = require("../models/Citations");
const domain = require("../config/domain");

async function getRole(roleID) {
    const getRole = await Rol.findById({ _id: roleID }, { role_name: true, capacity: true });
    return getRole;
}

async function verifyUsername(user) {
    const searchUser = await User.findOne({ username: user });
    if (searchUser) {
        return true;
    } else {
        return false;
    }
}

async function verifyEmail(email) {
    const searchEmail = await User.findOne({ email: email });
    if (searchEmail) {
        return true;
    } else {
        return false;
    }
}

userMethods.register = async (req, res) => {
    const { firstName, lastName, username, email, password, rol } = req.body;
    const newUser = new User({
        username: username,
        password: password,
        email: email,
        first_name: firstName,
        last_name: lastName,
        user_role: rol,
    });
    newUser.password = await newUser.encryptPassword(password);

    const verifyUser = await verifyUsername(newUser.username);
    if (!verifyUser) {
        const verifyEmailAddress = await verifyEmail(newUser.email);
        if (!verifyEmailAddress) {
            if (newUser.save()) {
                return res.json({
                    status: true,
                    message: "El usuario ha sido registrado de manera exitosa",
                });
            } else {
                return res.json({
                    status: false,
                    type: "general",
                    message: "Ha ocurrido un error, intentalo de nuevo",
                });
            }
        } else {
            return res.json({
                status: false,
                type: "email",
                message: "El email no esta disponible",
            });
        }
    } else {
        return res.json({
            status: false,
            type: "username",
            message: "El nombre de usuario no esta disponible",
        });
    }
};

userMethods.getRoleInfo = async (req, res) => {
    const { rol } = req.body;
    const getRoleInfo = await getRole(rol);
    if (getRoleInfo) {
        return res.json({
            status: true,
            rolInfo: getRoleInfo,
        });
    } else {
        return res.json({
            status: false,
            rolInfo: "No rol found",
        });
    }
};

userMethods.searchUsers = async (req, res) => {
    const { searchValue, type } = req.body;

    if (searchValue.length === 0) {
        return res.json({
            status: false,
            message: "No se encontraron usuarios",
        });
    }

    switch (type) {
        case "user":
            const searchUsername = await User.find(
                { username: { $regex: searchValue, $options: "i" } },
                { username: true, email: true, profilePicture: true }
            );
            return res.json({
                status: true,
                users: searchUsername,
                message: "Se encontraron usuarios",
            });
        case "email":
            const searchEmail = await User.find(
                { email: { $regex: searchValue, $options: "i" } },
                { username: true, email: true, profilePicture: true }
            );
            return res.json({
                status: true,
                users: searchEmail,
                message: "Se encontraron usuarios",
            });
        default:
            return res.json({
                status: false,
                message: "No se encontraron usuarios",
            });
    }
};

userMethods.searchUser = async (req, res) => {
    const { userSearchID } = req.body;

    if (userSearchID) {
        const getUser = await User.findOne(
            { _id: userSearchID },
            { username: true, email: true, first_name: true, last_name: true }
        );

        if (getUser) {
            return res.json({
                status: true,
                userInfo: getUser,
                message: "Se ha encontrado la información",
            });
        } else {
            return res.json({
                status: false,
                message: "No se encontro información",
            });
        }
    } else {
        return res.json({
            status: false,
            message: "No se encontro información",
        });
    }
};

userMethods.editUserSearch = async (req, res) => {
    const { userID, username, email, firstName, lastName } = req.body;

    const getUserSearch = await User.findOne({ _id: userID });

    if (getUserSearch) {
        if (username !== getUserSearch.username) {
            const verifyUser = await verifyUsername(username);
            if (verifyUser) {
                return res.json({
                    status: false,
                    errorText: "user",
                    message: "El usuario ya se encuentra en uso",
                });
            } else {
                const updateUsername = await getUserSearch.update({
                    username: username,
                });
                if (!updateUsername) {
                    return res.json({
                        status: false,
                        errorText: "update",
                        message: "Hubo un error al actualizar tus datos",
                    });
                }
            }
        }

        if (email !== getUserSearch.email) {
            const verifyMail = await verifyEmail(email);
            if (verifyMail) {
                return res.json({
                    status: false,
                    errorText: "email",
                    message: "El email ya se encuentra en uso",
                });
            } else {
                const updateEmail = await getUserSearch.update({
                    email: email,
                });
                if (!updateEmail) {
                    return res.json({
                        status: false,
                        errorText: "update",
                        message: "Hubo un error al actualizar tus datos",
                    });
                }
            }
        }

        const updateUser = await getUserSearch.update({
            first_name: firstName,
            last_name: lastName,
        });

        if (updateUser) {
            return res.json({
                status: true,
                message: "El usuario ha sido actualizado",
            });
        } else {
            return res.json({
                status: false,
                message: "Ha ocurrido un error, intentalo de nuevo.",
            });
        }
    } else {
        return res.json({
            status: false,
            message: "Ha ocurrido un error, intentalo de nuevo.",
        });
    }
};

function getMonth(n) {
    switch (n + 1) {
        case 1:
            return "Enero";
        case 2:
            return "Febrero";
        case 3:
            return "Marzo";
        case 4:
            return "Abril";
        case 5:
            return "Mayo";
        case 6:
            return "Junio";
        case 7:
            return "Julio";
        case 8:
            return "Agosto";
        case 9:
            return "Septiembre";
        case 10:
            return "Octubre";
        case 11:
            return "Noviembre";
        case 12:
            return "Diciembre";
        default:
            return "Null";
    }
}

function convertToDate(data) {
    let allDates = [];
    data.map((d) => {
        const aD = new Date(d.createdAt);
        const dateFormat =
            aD.getDate() + " de " + getMonth(aD.getMonth()) + " del " + aD.getFullYear();
        if (d._id == d.parentID) {
            allDates.push({
                _id: d._id,
                date: dateFormat,
                description: d.description,
            });
        }
    });
    return allDates;
}

userMethods.getCitations = async (req, res) => {
    const userID = req.userID;
    const getCitations = await Citation.find(
        { userID: userID },
        { createdAt: true, description: true, parentID: true }
    );
    if (getCitations) {
        return res.json({
            status: true,
            citations: convertToDate(getCitations),
        });
    } else {
        return res.json({
            status: false,
            message: "Error",
        });
    }
};

async function getCitationsChildrens(citationID) {
    const citationsSearched = await Citation.find({ parentID: citationID._id });
    citationsSearched.map((citation) => {
        citation.pdfLink = domain + "Citations/" + citation.pdfLink;
    });
    return citationsSearched;
}

userMethods.getSelectedCitation = async (req, res) => {
    const { citation } = req.body;
    const citationSearch = await Citation.findOne({ _id: citation });
    if (citationSearch) {
        const citationsChildren = await getCitationsChildrens(citationSearch);
        return res.json({
            status: true,
            parent: citationSearch,
            citations: citationsChildren,
        });
    } else {
        return res.json({
            status: false,
            message: "Not found",
        });
    }
};

async function updateLastChange(citationID, newID) {
    const isUpdate = await Citation.findByIdAndUpdate(citationID, {
        $set: { lastChange: newID.toString() },
    });
    if (isUpdate) {
        return true;
    } else {
        return false;
    }
}

userMethods.uploadNewCitationStatus = async (req, res) => {
    const citationID = req.headers["citationid"];
    if (citationID) {
        const saveCitation = new Citation({
            userID: req.userID,
            parentID: citationID,
            pdfLink: req.file.filename,
            lastChange: citationID,
            description: "Is a change",
        });

        if (saveCitation.save()) {
            const isUpdate = await updateLastChange(citationID, saveCitation._id);
            if (isUpdate) {
                return res.json({
                    status: true,
                    message: "Se ha publicado el nuevo cambio",
                });
            } else {
                saveCitation.remove();
            }
        } else {
            return res.json({
                status: false,
                message: "Citation ID not found",
            });
        }
    } else {
        return res.json({
            status: false,
            message: "Citation ID not found",
        });
    }
};

userMethods.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const getUser = await User.findById(req.userID);
    if (getUser) {
        const confirmPasswordBD = await getUser.confirmPassword(currentPassword);
        if (confirmPasswordBD) {
            if (newPassword === confirmPassword) {
                const passwordEncrypt = await getUser.encryptPassword(newPassword);
                const updated = await getUser.updateOne({
                    $set: {
                        password: passwordEncrypt,
                    },
                });

                if (updated) {
                    return res.status(200).json({
                        status: true,
                        message: "Tu contraseña ha sido actualizada correctamente",
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        type: "general",
                        message: "Ha ocurrido un error intentalo de nuevo",
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    type: "math",
                    message: "Las constraseñas no coinciden",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                type: "current",
                message: "Tu contraseña no coincide",
            });
        }
    }
};

module.exports = userMethods;
