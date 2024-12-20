"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import Card from "../components/Card";
import Sidebar from "../components/Sidbar";
import Dot from "../icons/Dot";
import Home from "../icons/Home";
import Add from "../icons/Add";
import Cross from "../icons/Cross";

const Dashboard = () => {
  const [admin, setAdmin] = useState(true);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize the router

  const handleClick = () => {
    setModal(!modal);
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization"); // Remove token
    router.push("/login"); // Redirect to login
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const courseData = { title, description, price, imageLink, published };
    const token = localStorage.getItem("Authorization");

    if (!token) {
      setMessage("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Course Added successfully!");
        setModal(false);
        setTitle("");
        setDescription("");
        setPrice(0);
        setImageLink("");
        setPublished(false);
      } else {
        setMessage(result.error || "Failed to add course");
      }
    } catch (error: any) {
      setMessage("Error: " + error.message);
    }
  }

  return (
    <div className="w-screen h-full flex">
      <Sidebar />
      <div className="w-full rounded items-center">
        <div className="flex mx-2 my-2 justify-end items-center pr-6 py-2 gap-2 rounded-lg border-gray-500/25 border-2 shadow shadow-gray-200">
          <span className="relative left-8">
            <Home />
          </span>
          <input type="text" className="border-2 rounded-md pl-7 text-sm py-2" />
          <button>
            <Dot />
          </button>
          <button
            onClick={handleLogout}
            className="ml-2 text-red-500 font-semibold"
          >
            Logout
          </button>
          {admin && (
            <button onClick={handleClick}>
              <Add />
            </button>
          )}
        </div>
        <div className="w-full rounded items-center bg-white justify-center md:justify-normal flex flex-wrap">
          <Card />
        </div>
      </div>

      {modal && (
        <div className="h-screen w-screen fixed bg-black/65 flex items-center justify-center">
          <div className="container bg-gray-100 w-80 p-6 rounded">
            <div className="flex justify-end">
              <button onClick={() => setModal(!modal)}>
                <Cross />
              </button>
            </div>
            <h2 className="text-xl mb-4 flex items-center gap-2 tracking-tighter">
              <span className="text-xl">
                <Add />
              </span>
              Add New Course
            </h2>
            <form onSubmit={handleSubmit} className="text-sm px-4">
              <Input
                type="text"
                value={title}
                placeholder="Enter Course Title"
                handleChange={(e) => setTitle(e.target.value)}
                classname="w-full border-2 p-2 rounded"
              />
              <Input
                type="text"
                value={description}
                placeholder="Enter Course Description"
                handleChange={(e) => setDescription(e.target.value)}
                classname="w-full border-2 p-2 rounded"
              />
              <Input
                type="number"
                value={price}
                placeholder="Enter Course Price"
                handleChange={(e) => setPrice(Number(e.target.value))}
                classname="w-full border-2 p-2 rounded"
              />
              <Input
                type="text"
                value={imageLink}
                placeholder="Enter Image URL"
                handleChange={(e) => setImageLink(e.target.value)}
                classname="w-full border-2 p-2 rounded"
              />
              <div className="flex gap-2 items-center">
                <label>Published</label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={() => setPublished(!published)}
                  className="relative bottom-[3px]"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-gray-300 border-2 shadow-sm text-xs font-semibold text-black py-1.5 px-4 rounded-lg"
              >
                Add Course
              </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

function Input({
  type,
  value,
  placeholder,
  handleChange,
  classname,
}: {
  type: string;
  value: any;
  placeholder: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classname?: string;
}) {
  return (
    <div className="mb-4">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={classname}
      />
    </div>
  );
}

export default Dashboard;
