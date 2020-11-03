const express = require("express");
const router = express.Router();
const { verifyMiddleware } = require("../middlewares/verifyMiddleware");
const {
    register,
    getRoleInfo,
    searchUsers,
    searchUser,
    editUserSearch,
    getCitations,
    getSelectedCitation,
    uploadNewCitationStatus,
    updatePassword,
} = require("../controllers/userController");
const upload = require("../controllers/uploads/pdfControllerUpload");

router
    .post("/register", verifyMiddleware, register)
    .post("/getRoleInfo", verifyMiddleware, getRoleInfo)
    .post("/searchUsers", verifyMiddleware, searchUsers)
    .post("/searchUser", verifyMiddleware, searchUser)
    .post("/editUser", verifyMiddleware, editUserSearch)
    .post("/getCitations", verifyMiddleware, getCitations)
    .post("/getSelectedCitation", verifyMiddleware, getSelectedCitation)
    .post("/updatePassword", verifyMiddleware, updatePassword)
    .post(
        "/uploadNewCitationStatus",
        verifyMiddleware,
        upload.single("newFileToUpload"),
        uploadNewCitationStatus
    );

module.exports = router;
