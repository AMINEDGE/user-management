"use client";

import { cfg } from "@/cfg";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Edit() {
  const params = useParams();

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);

  const [loadingEnabled, setLoadingEnabled] = useState(false);
  const [formLoadingEnabled, setFormLoadingEnabled] = useState(false);

  const validateForm = () => {
    var isFormValid = true;
    var errors = [];
    setErrorMessages([]);

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

  const init = async () => {
    setLoadingEnabled(true);

    const token = localStorage.getItem("token");

    if (!token) {
      document.location.href = "/login";
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
    setErrorMessages([]);
    setFormLoadingEnabled(true);

    if (!validateForm()) {
      setFormLoadingEnabled(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      document.location.href = "/login";
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
      setErrorMessages([body.error || "Something went wrong"]);
      setFormLoadingEnabled(false);
      return;
    }

    withReactContent(Swal).fire({
      title: <i>Operation successful</i>,
      icon: "success",
      preConfirm: () => {
        window.location.href = `/`;
      },
    });
    setFormLoadingEnabled(false);
  };

  return (
    <div className="flex flex-col items-center m-8 rounded-xl p-4">
      <div className="flex flex-col items-center m-8 w-100 rounded-xl bg-[#eee] p-4">
        <div className="flex flex-col items-start w-full">
          <Link href={"/"} className="self-start">
            <ChevronLeft />
          </Link>
        </div>
        <h1 className="text-2xl font-bold my-8">Edit User</h1>
        {loadingEnabled && <ClipLoader className="my-4" />}
        <form className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="border border-gray-300 p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="First Name"
            className="border border-gray-300 p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
            onClick={() => edit()}
            type="button"
            className="flex flex-row w-full mt-4 items-center justify-center gap-2 transition-all bg-cyan-600 text-white p-2 rounded hover:bg-cyan-800 cursor-pointer"
          >
            Edit {formLoadingEnabled && <ClipLoader color="white" size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
