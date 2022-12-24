import React, { useReducer, useState } from "react";
import "./Login.css";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";

const intialFormState = {
  pass: "",
  passIsValid: false,
  email: "",
  emailIsValid: false,
  formIsValid: false,
};

const formReducer = (state, action) => {
  if (action.type === "EMAIL_CHANGE") {
    let x =
      action.data.includes("@") &&
      action.data.length >= 10 &&
      action.data[0] !== "@";
    return {
      ...state,
      email: action.data,
      emailIsValid: x,
      formIsValid: state.passIsValid && x,
    };
  } else if (action.type === "PASS_CHANGE") {
    let x = action.data.length >= 6 && action.data.length <= 30;
    return {
      ...state,
      pass: action.data,
      passIsValid: x,
      formIsValid: x && state.emailIsValid,
    };
  }
  return intialFormState;
};

function Register() {
  const [formState, dispatchForm] = useReducer(formReducer, intialFormState);
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  async function formHandler(e) {
    e.preventDefault();
    let data = await axios.post(`${CONSTANTS.ip}/api/login`, {
      email: formState.email,
      password: formState.pass,
    });

    if (data.data.status === "ok") {
      window.location.href = "/home";
    }
  }

  function emailChangeHandler(e) {
    dispatchForm({
      type: "EMAIL_CHANGE",
      data: e.target.value,
    });
  }

  function passChangeHandler(e) {
    dispatchForm({
      type: "PASS_CHANGE",
      data: e.target.value,
    });
  }

  return (
    <div className="Register-wrapper">
      <div className="logoCont">
        <h2 className="logo">Dispel</h2>
        <span>
          Developed By <p>Systile</p>
        </span>
      </div>
      <motion.h2
      // animate={{
      //   translateY: [0, -80, 0],
      //   transition: {
      //     duration: 8,
      //     repeat: Infinity,
      //     type: "spring",
      //   },
      // }}
      >
        LOGIN
      </motion.h2>
      <form className="Register-form" onSubmit={formHandler}>
        <motion.input
          type="email"
          placeholder="Email"
          required
          maxLength="30"
          onChange={emailChangeHandler}
          value={formState.email}
          whileFocus={
            formState.emailIsValid
              ? {
                  boxShadow: "0 0 0 0.5rem var(--primary-green)",
                }
              : {
                  boxShadow: "0 0 0 0.5rem var(--secondary-red)",
                }
          }
        />
        <motion.input
          type="password"
          placeholder="Password"
          required
          maxLength="30"
          minLength="6"
          onChange={passChangeHandler}
          value={formState.pass}
          whileFocus={
            formState.passIsValid
              ? {
                  boxShadow: "0 0 0 0.5rem var(--primary-green)",
                }
              : {
                  boxShadow: "0 0 0 0.5rem var(--secondary-red)",
                }
          }
        />
        <motion.button
          type="submit"
          className={formState.formIsValid ? "buttonValid" : ""}
          initial={{
            transform: "scale(1)",
          }}
          disabled={!formState.formIsValid}
          whileHover={
            formState.formIsValid
              ? {
                  transform: "scale(1.3)",
                }
              : {
                  transform: "scale(1)",
                }
          }
          whileTap={
            formState.formIsValid
              ? {
                  transform: "scale(0.9)",
                }
              : {
                  transform: "scale(1)",
                }
          }
        >
          Login
        </motion.button>
      </form>
      <div className="RegisterContBtn">
        <span>Don't have an Account?</span>
        <motion.button
          whileHover={{
            backgroundColor: "var(--primary-green-accent)",
            color: "#333",
            scale: 1.1,
            border: "2px solid transparent",
            transition: {
              duration: 0.3,
              type: "spring",
            },
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => (window.location.href = "/register")}
        >
          Register Here
        </motion.button>
      </div>
    </div>
  );
}

export default Register;
