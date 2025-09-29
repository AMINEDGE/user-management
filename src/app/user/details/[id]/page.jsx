"use client";

import { cfg } from "@/cfg";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Details() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loadingEnabled, setLoadingEnabled] = useState(false);

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
    setLoadingEnabled(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col items-center m-8 rounded-xl p-4">
      <div className="flex flex-col items-center m-8 w-100 rounded-xl bg-[#eee] p-4">
        <div className="flex flex-col items-start w-full">
          <Link href={"/"} className="self-start">
            <ChevronLeft />
          </Link>
        </div>
        {loadingEnabled ? (
          <ClipLoader className="my-4" />
        ) : user ? (
          <div className="flex flex-col my-8 gap-4">
            <div className="flex flex-row items-center gap-4">
              <img
                src={user.avatar}
                className="mx-auto rounded-4xl w-20 h-20 object-cover"
              />
              <div className="flex flex-col">
                <label>{`Name: ${user.first_name} ${user.last_name}`}</label>
                <label>{`Email: ${user.email}`}</label>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
