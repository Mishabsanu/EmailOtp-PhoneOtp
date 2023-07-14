import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { submitOtpPhone } from "../../utils/Constants";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const PhoneOtp = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  // Access URL parameters
  const mobile = searchParams.get("mobile");
  console.log(mobile);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = submitOtpPhone;
      const response = await axios.post(`${url}/${mobile}`, data);
      console.log(response);

      setTimeout(() => {
        navigate("/", { phoneOtp: data.phoneOtp });
      }, 2000);
      toast.success("OTP Login successfully!", {
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
      <h1>Enter OTP Number </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Phone OTP:</label>
          <input
            type="text"
            {...register("phoneOtp", { maxLength: 6, required: true })}
          />
          {errors.phoneOtp?.type === "maxLength" && (
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

export default PhoneOtp;
