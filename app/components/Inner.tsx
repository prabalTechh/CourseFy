import { ReactElement } from "react";

interface Innerprops {
  startIcon: ReactElement;
  title?: String;
}

export  function Inner({ startIcon, title }: Innerprops) {
  return (
    <div className="flex lg:gap-4 items-center justify-center lg:justify-normal  hover:bg-gray-200 hover:text-black  text-sm w-full hover:mx-2 hover:transition hover:delay-150  md:pl-6 py-2  ">
      {startIcon}
      <span className="font-semibold text-pretty text-zinc-600  hover:text-black ">
        {title}
      </span>
    </div>
  );
}
