import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { getPhoneOtpPost } from "../../utils/Constants";
import { useForm } from "react-hook-form";
import "./PhoneVerify.css";
const PhoneVerify = () => {
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
      const response = await axios.post(getPhoneOtpPost, data);
      const mobilNumber = response.data.phone.mobile;
      console.log(response.data.phone.mobile);

      setTimeout(() => {
        navigate(`/phoneOtp?mobile=${mobilNumber}`);
      }, 2000);

      toast.success("OTP Send  successful!", {
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
      <h1> Enter Mobile Number</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Mobile:</label>
          <input
            {...register("mobile", { maxLength: 10, pattern: /^[0-9+\-]+$/ })}
          />
          {errors.mobile && <span>Invalid mobile number.</span>}
          {errors.genre?.type === "maxLength" && (
            <span style={{ color: "red" }}>
              Genre must less than 10 Character
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

export default PhoneVerify;
