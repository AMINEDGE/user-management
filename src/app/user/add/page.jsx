"use client";

import { cfg } from "@/cfg";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Edit() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [loadingEnabled, setLoadingEnabled] = useState(false);
  const [formLoadingEnabled, setFormLoadingEnabled] = useState(false);

  const validateForm = () => {
    var isFormValid = true;

    setEmailErrorMessage("");
    setPasswordErrorMessage("");

    if (!email.trim()) {
      setEmailErrorMessage("Email is required");
      isFormValid = false;
    }
    if (!password.trim()) {
      setPasswordErrorMessage("Password is required");
      isFormValid = false;
    }

    return isFormValid;
  };

  const add = async () => {
    setEmailErrorMessage("");
    setPasswordErrorMessage("");

    setFormLoadingEnabled(true);

    if (!validateForm()) {
      setFormLoadingEnabled(false);
      return;
    }

    setTimeout(() => {
      withReactContent(Swal).fire({
        title: <i>Operation successful</i>,
        icon: "success",
        preConfirm: () => {
          window.location.href = `/`;
        },
      });
      setFormLoadingEnabled(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center m-8 rounded-xl p-4">
      <div className="flex flex-col items-center m-8 w-80 rounded-xl bg-[#eee] p-4">
        <div className="flex flex-col items-start w-full">
          <Link href={"/"} className="self-start">
            <ChevronLeft />
          </Link>
        </div>
        <h1 className="text-2xl font-bold my-8">Add User</h1>
        {loadingEnabled && <ClipLoader className="my-4" />}
        <form className="flex flex-col items-center gap-4">
          <div className="flex flex-col w-full">
            <label className="font-bold self-start">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 p-2 rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="font-bold self-start">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 p-2 rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="font-bold self-start">Email</label>
            <input
              type="text"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailErrorMessage && (
              <p className="text-red-500 text-sm">{emailErrorMessage}</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="font-bold self-start">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordErrorMessage && (
              <p className="text-red-500 text-sm">{passwordErrorMessage}</p>
            )}
          </div>

          <button
            onClick={() => add()}
            type="button"
            className="flex flex-row w-full mt-4 items-center justify-center gap-2 transition-all bg-cyan-600 text-white p-2 rounded hover:bg-cyan-800 cursor-pointer"
          >
            <Plus /> Add{" "}
            {formLoadingEnabled && <ClipLoader color="white" size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
