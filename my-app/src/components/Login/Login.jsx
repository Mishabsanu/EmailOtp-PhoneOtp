import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { loginPost } from "../../utils/Constants";
import axios from "../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLogin } from "../../Redux/store";
const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = loginPost;
      const res = await axios.post(url, data);
      dispatch(setLogin({ user: res.data.user, token: res.data.token }));
      console.log(res, "res");
      setTimeout(() => {
        navigate("/");
      }, 2000);
      toast.success("Login successful!", {
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
  };

  return (
    <div>
      <h1>LOGIN </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>UserID:</label>
          <input
            placeholder="ENTER UserId"
            {...register("mobile", { required: true })}
          />
          {errors.name && <span>mobile is required.</span>}
        </div>

        <div>
          <label>password:</label>
          <input
            placeholder="ENTER Password"
            {...register("password", { required: true })}
          />
          {errors.mobile && <span>password is required.</span>}
        </div>
        <button type="submit">LOGIN</button>
      </form>
      {error && <div className="error_msg">{error}</div>}
      <ToastContainer />
      <div className="btndiv">
        <Link style={{ textDecoration: "none" }} to={"/sendPhoneOtp"}>
          <span>
            <button className="BTN">PHONE OTP LOGIN </button>
          </span>
        </Link>
        <Link style={{ textDecoration: "none" }} to={"/mailOtp"}>
          {" "}
          <span>
            <button className="BTN">MAIL OTP LOGIN</button>
          </span>
        </Link>
      </div>
        <span>
        Don't have an account? <Link style={{textDecoration:"none"}} to="/signup">Signup</Link>
      </span>
    </div>
  );
};

export default Login;
