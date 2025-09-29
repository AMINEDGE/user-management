"use client";

import { cfg } from "@/cfg";
import Link from "next/link";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Login() {
  //   const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);

  const [loadingEnabled, setLoadingEnabled] = useState(false);

  const validateForm = () => {
    var isFormValid = true;
    var errors = [];
    setErrorMessages([]);

    // if (!username.trim()) {
    //   errors.push("Username is required");
    //   isFormValid = false;
    // }
    if (!email.trim()) {
      errors.push("Email is required");
      isFormValid = false;
    }
    if (!password.trim()) {
      errors.push("Password is required");
      isFormValid = false;
    }

    if (!isFormValid) {
      setErrorMessages(errors);
    }

    return isFormValid;
  };

  const login = async () => {
    setErrorMessages([]);
    setLoadingEnabled(true);

    if (!validateForm()) {
      setLoadingEnabled(false);
      return;
    }

    const res = await fetch(`${cfg.apiEndpoint}login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": cfg.apiKey,
      },
    });
    const body = await res.json();

    if (!res.ok) {
      setErrorMessages([body.error || "Something went wrong"]);
      setLoadingEnabled(false);
      return;
    }

    saveToken(body);
  };

  const saveToken = (body) => {
    setLoadingEnabled(false);
    localStorage.setItem("token", body.token);
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 flex flex-col items-center border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold my-8">Login Page</h1>
        <form className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {setErrorMessages.length &&
            errorMessages.map((e) => (
              <p className="text-red-500 text-sm">{e}</p>
            ))}
          <button
            onClick={() => login()}
            type="button"
            className="flex flex-row w-full mt-4 items-center justify-center gap-2 transition-all bg-cyan-600 text-white p-2 rounded hover:bg-cyan-800 cursor-pointer"
          >
            Login {loadingEnabled && <ClipLoader color="white" size={16} />}
          </button>
          <Link className="mt-4 text-gray-600 cursor-pointer" href="/">
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
}
