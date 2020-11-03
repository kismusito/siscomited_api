const express = require("express");
const router = express.Router();
const { verifyMiddleware } = require("../middlewares/verifyMiddleware");
const {
    createMail,
    createMailType,
    getAllMailTypes,
    getAllMails,
    updateMail,
    updateMailType,
    deleteMail,
    deleteMailType,
} = require("../controllers/mailController");

router
    .get("/getAllMailTypes", verifyMiddleware, getAllMailTypes)
    .get("/getAllMails", verifyMiddleware, getAllMails)
    .post("/createMailType", verifyMiddleware, createMailType)
    .post("/createMail", verifyMiddleware, createMail)
    .put("/updateMailType", verifyMiddleware, updateMailType)
    .put("/updateMail", verifyMiddleware, updateMail)
    .delete("/deleteMailType", verifyMiddleware, deleteMailType)
    .delete("/deleteMail", verifyMiddleware, deleteMail);

module.exports = router;
