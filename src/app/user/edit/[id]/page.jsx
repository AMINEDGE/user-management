"use client";

import { cfg } from "@/cfg";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Edit() {
  const router = useRouter();
  const params = useParams();

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

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

  const init = async () => {
    setLoadingEnabled(true);

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }

    const res = await fetch(`${cfg.apiEndpoint}users/${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": cfg.apiKey,
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await res.json();

    if (!res.ok) {
      setLoadingEnabled(false);
      return;
    }

    setUser(body.data);

    setEmail(body.data.email);
    setFirstName(body.data.first_name);
    setLastName(body.data.last_name);
    setLoadingEnabled(false);
  };

  useEffect(() => {
    init();
  }, []);

  const edit = async () => {
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setFormLoadingEnabled(true);

    if (!validateForm()) {
      setFormLoadingEnabled(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }

    const res = await fetch(`${cfg.apiEndpoint}users/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": cfg.apiKey,
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await res.json();

    if (!res.ok) {
      setErrorMessage(body.error || "Something went wrong");
      setFormLoadingEnabled(false);
      return;
    }

    withReactContent(Swal).fire({
      title: <i>Operation successful</i>,
      icon: "success",
      preConfirm: () => {
        router.replace("/");
      },
    });
    setFormLoadingEnabled(false);
  };

  return (
    <div className="flex flex-col items-center m-8 rounded-xl p-4">
      <div className="flex flex-col items-center m-8 w-80 rounded-xl bg-[#eee] dark:bg-[#222] p-4">
        <div className="flex flex-col items-start w-full">
          <button onClick={() => router.back()} className="self-start">
            <ChevronLeft />
          </button>
        </div>
        <h1 className="text-2xl font-bold my-8">Edit User</h1>
        {loadingEnabled && <ClipLoader className="my-4" color="#ccc" />}
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
              placeholder="First Name"
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
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            onClick={() => edit()}
            type="button"
            className="flex flex-row w-full mt-4 mb-8 items-center justify-center gap-2 transition-all bg-cyan-600 text-white p-2 rounded hover:bg-cyan-800 cursor-pointer"
          >
            <Pencil size={16} /> Edit{" "}
            {formLoadingEnabled && <ClipLoader color="white" size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
