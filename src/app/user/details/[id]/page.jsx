"use client";

import { cfg } from "@/cfg";
import { ChevronLeft, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Details() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loadingEnabled, setLoadingEnabled] = useState(false);

  const router = useRouter();

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
    setLoadingEnabled(false);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }

    const res = await fetch(`${cfg.apiEndpoint}users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "x-api-key": cfg.apiKey,
        Authorization: `Bearer ${token}`,
      },
    });
    // const body = await res.json();

    if (!res.ok) {
      return;
    }
    withReactContent(Swal).fire({
      title: <i>Operation successful</i>,
      icon: "success",
      preConfirm: () => {
        router.replace("/");
      },
    });
    init();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col items-center m-8 rounded-xl p-4">
      <div className="flex flex-col items-center m-8 w-100 rounded-xl bg-[#eee] dark:bg-[#222] p-4">
        <div className="flex flex-col items-start w-full">
          <Link href={"/"} className="self-start">
            <ChevronLeft />
          </Link>
        </div>
        {loadingEnabled ? (
          <ClipLoader className="my-4" color="#ccc" />
        ) : user ? (
          <div className="flex flex-col my-8 gap-4">
            <div className="flex flex-row items-center gap-4">
              <img
                src={user.avatar}
                className="mx-auto rounded-4xl w-20 h-20 object-cover"
              />
              <div className="flex flex-col">
                <label>
                  <strong>Name: </strong>
                  {`${user.first_name} ${user.last_name}`}
                </label>
                <label>
                  <strong>Email: </strong>
                  {`${user.email}`}
                </label>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center justify-center">
              <Link href={`/user/edit/${user.id}`}>
                <Pencil color="#fc0" />
              </Link>
              <button
                className="cursor-pointer"
                onClick={() => {
                  withReactContent(Swal).fire({
                    title: <i>You sure you want to delete this user?</i>,
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel!",
                    preConfirm: () => {
                      deleteUser(user.id);
                    },
                  });
                }}
              >
                <Trash2 color="#f06" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
