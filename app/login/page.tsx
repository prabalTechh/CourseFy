"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Poligon } from "../icons/Poligon";
import Dot from "../icons/Dot";
import { useRouter } from "next/navigation";

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({
  label,
  name,
  placeholder,
  type,
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.username || !formData.password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // Store token in localStorage
        const { token } = data;
        if (token) {
          localStorage.setItem("Authorization", token); // Store token in localStorage
        }

        // Redirect to home page after successful login
        router.push("/"); // Redirect to the home page
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full grid md:grid-cols-3">
        {/* Left Section */}
        <div className="bg-[#7D7489] col-span-2 flex flex-col items-center justify-center">
          <h1 className="text-5xl w-96 pt-5 font-extrabold text-center font-jersey text-white">
            Press Play On Your Potential
          </h1>

          <div className="flex flex-col items-center h-full relative mt-10">
            <Poligon />
            <div className="absolute top-32">
              <Image
                src="/eye.png"
                width={300}
                height={350}
                alt="Eye illustration"
              />
              <div className="absolute top-[124px] left-[124px]">
                <Dot />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#3F3F3F] md:col-span-1 flex flex-col items-center justify-center">
          <div className="h-auto w-[90%] max-w-md bg-white rounded-md py-6 px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Username"
                name="username"
                placeholder="@joe"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />

              <Input
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="border-2 w-full rounded-lg bg-black text-white py-2 text-center text-sm hover:bg-gray-800"
              >
                Login
              </button>
            </form>

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
