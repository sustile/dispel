import React, { useReducer, useState } from "react";
import "./Register.css";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";

const intialFormState = {
  pass: "",
  passIsValid: false,
  confirmPass: "",
  confirmPassIsValid: false,
  email: "",
  emailIsValid: false,
  name: "",
  nameIsValid: false,
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
      formIsValid:
        state.passIsValid && state.confirmPassIsValid && state.nameIsValid && x,
    };
  } else if (action.type === "PASS_CHANGE") {
    let x = action.data.length >= 6 && action.data.length <= 30;
    return {
      ...state,
      pass: action.data,
      passIsValid: x,
      formIsValid:
        x &&
        state.confirmPassIsValid &&
        state.nameIsValid &&
        state.emailIsValid,
    };
  } else if (action.type === "NAME_CHANGE") {
    let x =
      action.data.length >= 2 &&
      action.data.length <= 30 &&
      !action.data.includes("@") &&
      !action.data.includes("#");
    return {
      ...state,
      name: action.data,
      nameIsValid: x,
      formIsValid:
        x &&
        state.confirmPassIsValid &&
        state.passIsValid &&
        state.emailIsValid,
    };
  } else if (action.type === "CONFIRM_PASS_CHANGE") {
    let x =
      action.data.length >= 6 &&
      action.data.length <= 30 &&
      state.pass === action.data;
    return {
      ...state,
      confirmPass: action.data,
      confirmPassIsValid: x,
      formIsValid:
        x && state.nameIsValid && state.passIsValid && state.emailIsValid,
    };
  }
  return intialFormState;
};

function Register() {
  const [formState, dispatchForm] = useReducer(formReducer, intialFormState);
  const CONSTANTS = useSelector((state) => state.CONSTANTS);

  async function formHandler(e) {
    e.preventDefault();
    let data = await axios.post(`${CONSTANTS.ip}/api/signup`, {
      name: formState.name,
      email: formState.email,
      password: formState.pass,
      confirmPassword: formState.confirmPass,
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

  function nameChangeHandler(e) {
    dispatchForm({
      type: "NAME_CHANGE",
      data: e.target.value,
    });
  }

  function confirmPassChangeHandler(e) {
    dispatchForm({
      type: "CONFIRM_PASS_CHANGE",
      data: e.target.value,
    });
  }

  return (
    <div className="Register-wrapper">
      <motion.h2
        animate={{
          translateY: [0, -80, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            type: "spring",
          },
        }}
      >
        DISPEL
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
          type="text"
          placeholder="Name"
          required
          maxLength="30"
          minLength="2"
          onChange={nameChangeHandler}
          value={formState.name}
          whileFocus={
            formState.nameIsValid
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
        <motion.input
          type="password"
          placeholder="Confirm Password"
          required
          maxLength="30"
          minLength="6"
          onChange={confirmPassChangeHandler}
          value={formState.confirmPass}
          whileFocus={
            formState.confirmPassIsValid
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
          Register
        </motion.button>
      </form>
    </div>
  );
}

export default Register;
