"use client";

import { cfg } from "@/cfg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ChevronLeft,
  ChevronRight,
  DoorClosed,
  Eye,
  Pencil,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Home() {
  const [loadingEnabled, setLoadingEnabled] = useState(false);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [users, setUsers] = useState([]);

  const [isPhone, setIsPhone] = useState(false);

  const router = useRouter();

  const isMobile = () => window.innerWidth <= 768;
  useEffect(() => {
    requestAnimationFrame(() => setIsPhone(isMobile()));
  }, []);
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => setIsPhone(isMobile()));
    };

    // Initial check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const init = async () => {
    setLoadingEnabled(true);
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoadingEnabled(false);
      return;
    }

    setToken(savedToken);

    const res = await fetch(`${cfg.apiEndpoint}users?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": cfg.apiKey,
        Authorization: `Bearer ${savedToken}`,
      },
    });

    if (res.status == 401 || res.status == 429) {
      router.replace("/login");
      return;
    }

    const body = await res.json();
    setTotalPages(body.total_pages);
    setUsers(body.data);

    setLoadingEnabled(false);
    console.log(`USERS: ${JSON.stringify(body)}`);
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

    init();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    init();
  }, [page]);

  const UserList = (props) =>
    isPhone ? (
      <div>
        {users.map((u, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-[#f8f8f8] dark:bg-[#222] rounded-xl overflow-hidden p-4 my-8"
          >
            <div className="flex flex-row w-full items-center gap-2">
              <img
                className="mx-auto rounded-4xl w-20 h-20 object-cover"
                src={u.avatar}
              />
              <div className="flex flex-col w-60">
                <label>
                  <strong>Name: </strong>
                  {`${u.first_name} ${u.last_name}`}
                </label>
                <label>
                  <strong>Email: </strong>
                  {`${u.email}`}
                </label>
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center justify-end">
              <Link href={`/user/details/${u.id}`}>
                <Eye color="#0ac" />
              </Link>
              <Link href={`/user/edit/${u.id}`}>
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
                      deleteUser(u.id);
                    },
                  });
                }}
              >
                <Trash2 color="#f06" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-row items-center justify-center my-4 gap-4">
          <button
            disabled={page == 1}
            className={`rounded-full p-2 ${
              page == 1
                ? "bg-[#ccc] cursor-not-allowed"
                : "bg-purple-600 cursor-pointer"
            }`}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="text-white" />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page == totalPages}
            onClick={() => setPage(page + 1)}
            className={`rounded-full p-2 ${
              page == totalPages
                ? "bg-[#ccc] cursor-not-allowed"
                : "bg-purple-600 cursor-pointer"
            }`}
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center bg-[#f8f8f8] dark:bg-[#222] rounded-xl overflow-hidden p-4 my-8">
        <table>
          <thead>
            <tr className="h-30">
              <th className="w-20">Index</th>
              <th className="w-60">Email</th>
              <th className="w-60">Name</th>
              <th className="w-40">Avatar</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u, i) => (
              <tr key={i} className="h-30">
                <td className="text-center">{i + 1}</td>
                <td className="text-center">{u.email}</td>
                <td className="text-center">{`${u.first_name} ${u.last_name}`}</td>
                <td className="text-center">
                  <img
                    className="mx-auto rounded-4xl w-20 h-20 object-cover"
                    src={u.avatar}
                  />
                </td>
                <td className="text-center">
                  <div className="flex flex-row gap-4 self-center">
                    <Link href={`/user/details/${u.id}`}>
                      <Eye color="#0ac" />
                    </Link>
                    <Link href={`/user/edit/${u.id}`}>
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
                            deleteUser(u.id);
                          },
                        });
                      }}
                    >
                      <Trash2 color="#f06" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-row items-center gap-4">
          <button
            disabled={page == 1}
            className={`rounded-full p-2 ${
              page == 1
                ? "bg-[#ccc] cursor-not-allowed"
                : "bg-purple-600 cursor-pointer"
            }`}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="text-white" />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page == totalPages}
            onClick={() => setPage(page + 1)}
            className={`rounded-full p-2 ${
              page == totalPages
                ? "bg-[#ccc] cursor-not-allowed"
                : "bg-purple-600 cursor-pointer"
            }`}
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to User Management App
      </h1>
      {loadingEnabled ? (
        <ClipLoader size={16} color="#ccc" />
      ) : token ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center gap-4">
            <Link
              href={"/user/add"}
              className="flex w-40 flex-row items-center justify-center bg-green-400 p-2 font-bold gap-2 text-white rounded-md"
            >
              <Plus color="white" /> Add New User
            </Link>
            <button
              onClick={() => {
                withReactContent(Swal).fire({
                  title: <i>You sure you want to logout?</i>,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes!",
                  cancelButtonText: "No, cancel!",
                  preConfirm: () => {
                    logout();
                  },
                });
              }}
              className="flex w-40 cursor-pointer flex-row items-center justify-center bg-[#f06] p-2 font-bold gap-2 text-white rounded-md"
            >
              <DoorClosed color="white" /> Logout
            </button>
          </div>
          <UserList data={users} />
        </div>
      ) : (
        <Link href={"/login"}>Login</Link>
      )}
    </div>
  );
}
