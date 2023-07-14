import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Signup.css";
import { signUpPost } from "../../utils/Constants";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const url = signUpPost;
      const res = await axios.post(url, data);
      console.log(res, "data");
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      toast.success("Signup successful!", {
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
      <h1>SIGNUP </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input {...register("name", { required: true })} />
          {errors.name && <span>Name is required.</span>}
        </div>

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

        <div>
          <label>Email:</label>
          <input {...register("email", { pattern: /^\S+@\S+$/i })} />
          {errors.email && <span>Invalid email address.</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error_msg">{error}</div>}
      <ToastContainer />
      <span>
        Don't have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  );
};

export default Signup;
