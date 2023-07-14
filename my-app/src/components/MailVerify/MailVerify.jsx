import React, { useState } from "react";
import OTPInput from "otp-input-react";
import "./MailVerify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { emailOtpLogin, otplogin } from "../../utils/Constants";
import { useForm } from "react-hook-form";
const MailVerify = () => {
  const [typeOtp, setTypeOtp] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(emailOtpLogin, data);
      console.log(response);

      setTimeout(() => {
        navigate("/");
      }, 2000);

      toast.success("OTP Login successful!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Enter Mail OTP</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email OTP:</label>
          <input
            type="text"
            {...register("emailOtp", { maxLength: 6, required: true })}
          />
          {errors.emailOtp?.type === "maxLength" && (
            <span style={{ color: "red" }}>
              Genre must less than 6 Character
            </span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
      {error && <div className="error_msg">{error}</div>}
    </div>
  );
};

export default MailVerify;
