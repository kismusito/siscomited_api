const express = require("express");
const router = express.Router();
const upload = require("../controllers/uploads/xmlControllerUpload");
const { verifyMiddleware } = require("../middlewares/verifyMiddleware");
const { getAppreticeInfo, saveAppreticeInfo , searchAppretice , searchAppretices , uploadAppretices} = require("../controllers/appreticeController");

router
    .post("/getAppreticeInfo", verifyMiddleware, getAppreticeInfo)
    .post("/saveAppreticeInfo", verifyMiddleware, saveAppreticeInfo)
    .post("/uploadAppretices", verifyMiddleware, upload.single("fileUpload"), uploadAppretices)
    .post("/searchAppretice", verifyMiddleware, searchAppretice)
    .post("/searchAppretices", verifyMiddleware, searchAppretices);

module.exports = router;
