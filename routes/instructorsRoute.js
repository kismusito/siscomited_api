const express = require("express");
const router = express.Router();
const upload = require("../controllers/uploads/xmlControllerUpload");
const { verifyMiddleware } = require("../middlewares/verifyMiddleware");
const { uploadInstructors } = require("../controllers/instructorController");

router
    .post("/uploadInstructors", verifyMiddleware, upload.single("fileUpload"), uploadInstructors);

module.exports = router;
