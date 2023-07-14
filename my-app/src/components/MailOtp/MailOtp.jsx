import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./MailOtp.css";
import { emailOtpSend } from "../../utils/Constants";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MailOtp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = emailOtpSend;
      const response = await axios.post(url, data);
      console.log(response);

      setTimeout(() => {
        navigate("/sendMailOtp", { email: data.email });
      }, 2000);
      toast.success("OTP sent successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }

    console.log(data);
  };

  return (
    <div>
      <h1>Enter Mail  </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input {...register("email", { pattern: /^\S+@\S+$/i })} />
          {errors.email && <span>Invalid email address.</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
      {error && <div className="error_msg">{error}</div>}
    </div>
  );
};

export default MailOtp;
