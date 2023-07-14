
const express = require("express");
const {
  UserSignup,
  userLogin,
  emailOtpLogin,
  emailOtpSend,
  getPhoneOtpPost,
  submitOtpPhone

} = require("../controllers/user");
const { User } = require("../models/user");
const router = express.Router();

router.post("/", UserSignup);
router.post("/login", userLogin);
//email
router.post("/emailOtpLogin", emailOtpLogin);
router.post("/emailOtpSend", emailOtpSend);
//phone
router.post('/getPhoneOtpPost',getPhoneOtpPost);
router.post('/submitOtpPhone/:id',submitOtpPhone);


module.exports = router;
