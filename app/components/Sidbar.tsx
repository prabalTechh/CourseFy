import {  useEffect, useState } from "react";
import Home from "../icons/Home";
import Menu from "../icons/Menu";
import Watch from "../icons/Watch";
import Chat from "../icons/Chat";
import Bookmark from "../icons/Bookmark";
import Dot from "../icons/Dot";
import { Inner } from "./Inner";

const Dashboard = () => {
  // Manage screen size state
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and set isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    handleResize();

    // Event listener for window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
};

const Sidebar = () => {
  return (
    <div className="sm:w-24 lg:w-96 h-[96vh] my-2 mx-2  rounded border border-gray-500/25 shadow-lg shadow-gray-300">
      {window.innerWidth < 640 ? (
        <div className="flex flex-col  justify-center gap-4 ">
          <div className="flex gap-3 items-center lg:m-2 border py-2 font-semibold font-jersey border-gray-400 text-sm px-4">
            <Menu />
          </div>
          <Inner startIcon={<Home />} />
          <Inner startIcon={<Bookmark />} />
          <Inner startIcon={<Chat />} />
          <Inner startIcon={<Watch />} />
        </div>
      ) : (
        <div>
          {" "}
          <div className="flex gap-3 items-center m-2 border py-2 rounded  font-semibold font-jersey border-gray-500/25 text-sm px-4">
            <Menu /> Menu
          </div>
          <Inner title={"Home"} startIcon={<Home />} />
          <Inner title={"Bookmark"} startIcon={<Bookmark />} />
          <Inner title={"Question"} startIcon={<Chat />} />
          <Inner title={"Watch History"} startIcon={<Watch />} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
