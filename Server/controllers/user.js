var Loginvalidate = require("../utils/validate");
const { User, validate } = require("../models/user");
const userotp = require("../models/userOtp");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const verifySid = process.env.verifySid
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require("twilio")(accountSid, authToken);


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAIL_USER,
    pass: process.env.NODEMAIL_PASS,
  },
});
module.exports = {

  UserSignup: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
     
      if (user)
        return res
          .status(409)
          .send({ message: "User with given email already Exist!" });
      await new User({ ...req.body}).save();
    
      res.status(201).send({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { mobile, password } = req.body;
      const user = await User.findOne({ mobile});
      console.log(user,'user');
      if (!user) {
        return res.status(401).send({ message: "Invalid mobile or password" });
      }
      const expectedPassword = `${user.name}${user.mobile.slice(-5)}`;
      if (password !== expectedPassword) {
        return res.status(401).send({ message: "Invalid mobile or password" });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(expectedPassword,salt);
      console.log(hashPassword);
      const objectId = mongoose.Types.ObjectId(user._id);
     
      await User.updateOne(
        {_id : objectId},
        {$set:{password:hashPassword}}
        );

      console.log(expectedPassword,'expectedPassword');
      var token = user.generateAuthToken();
      res.status(200).json({ user,token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  emailOtpSend: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Please enter your email" });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const existEmail = await userotp.findOne({ email: email });
        if (existEmail) {
          const updateData = await userotp.findByIdAndUpdate(
            { _id: existEmail._id },
            {
              otp: OTP,
            },
            { new: true }
          );
          await updateData.save();

          const mailOptions = {
            from: process.env.Email,
            to: email,
            subject: "Sending Email for Otp Validation",
            text: `OTP:-${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              res.status(400).json({ message: "Email not Send" });
            } else {
              res
                .status(200)
                .json({ message: "Email sent Successfully", otp: OTP });
            }
          });
        } else {
          const saveOtpData = new userotp({ email, otp: OTP });
          await saveOtpData.save();
          const mailOptions = {
            from: process.env.NODEMAIL_USER,
            to: email,
            subject: "Sending Email for Otp Validation",
            text: `OTP:-${OTP}`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              res.status(400).json({ message: "Email not Send" });
            } else {
              res
                .status(200)
                .json({ message: "Email sent Successfullyy", otp: OTP });
            }
          });
        }
      } else {
        res.status(400).json({ message: "This user is not exist in our db" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid Details", error });
    }
  },

  emailOtpLogin: async (req, res) => {
    try {
      const Otpemail = req.body.emailOtp;
      var user = await userotp.findOne({ 
        otp: Otpemail });
      console.log(user);
      if (!user)
        return res.status(401).send({ message: "Invalid Email or Password" });
      res.status(200).json({user });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  
  getPhoneOtpPost: async (req, res) => {
    try {
      const mobile = req.body.mobile;
      if (!mobile) {
        res.status(400).json({ message: "Please enter your phone" });
        return;
      }
      const phone = await User.findOne({ mobile: req.body.mobile });
    if (!phone) {
      res.status(400).json({ message: "Invalid phone number" });
      return;
    }
      client.verify.v2
  .services(verifySid)
  .verifications.create({ to: `+91${phone.mobile}`, channel: "sms" })
  res.status(200).json({ phone,message: "OTP verification successful" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid Details" });
    }
  },

  submitOtpPhone: async (req, res) => {
    const mobile=req.params.id
    const otpCode=req.body.phoneOtp
    client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91${mobile}`, code: otpCode })
    try {
      res.status(200).json({ message: "OTP verification successful" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid Details", error });
    }
  },

};
