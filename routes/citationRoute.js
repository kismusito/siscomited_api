const express = require("express");
const router = express.Router();
const { verifyMiddleware } = require("../middlewares/verifyMiddleware");
const { generateCitation } = require("../controllers/generatePDFController");

router
    .post("/generateCitation", verifyMiddleware, generateCitation);

module.exports = router;
