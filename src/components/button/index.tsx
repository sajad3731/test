import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LikeSvg } from "../../assets/like";
import { DisLikeSvg } from "../../assets/dislike";

const likePercentage = 70;
const dislikePercentage = 30;

export const Button = () => {
  const [isSelected, setIsSelected] = useState(null);

  return (
    <div className="flex items-center justify-center w-screen h-75">
      <div className="w-75 flex items-center justify-center ">
        <button
          className={twMerge([
            "-ml-4 relative border duration-200 flex items-center justify-center gap-1 py-4 text-white cursor-pointer",
            "bg-green-500 rounded-r-full [clip-path:polygon(0%_0%,100%_0,100%_100%,30px_100%)]",
            isSelected
              ? `w-[${likePercentage}%] bg-green-100 ${
                  isSelected === "like" ? "border-green-500" : ""
                }`
              : "w-[50%] bg-green-500",
            isSelected === "like" &&
              "after:absolute after:top-0 after:bottom-0 after:left-0 after:h-[115%] after:w-[.5px] after:bg-green-500 after:origin-top-right after:-rotate-27",
          ])}
          onClick={() =>
            setIsSelected((prevState) => (prevState === "like" ? null : "like"))
          }
        >
          {!isSelected ? (
            <>
              <LikeSvg />
              <p>صعودی</p>
            </>
          ) : (
            <p className="text-green-500">{likePercentage}%</p>
          )}
        </button>
        <button
          className={twMerge([
            "relative border duration-200 flex items-center justify-center gap-1 py-4 text-white cursor-pointer",
            "bg-red-500 rounded-l-full [clip-path:polygon(0%_0%,calc(100%-30px)_0,100%_100%,0_100%)]",
            isSelected
              ? `w-[${dislikePercentage}%] bg-red-100 ${
                  isSelected === "dislike" ? "border-red-500" : ""
                }`
              : "w-[50%] bg-red-500",
            isSelected === "dislike" &&
              "before:absolute before:top-0 before:-right-1 before:h-[115%] before:w-[.5px] before:bg-red-500 before:origin-bottom-left before:-rotate-27",
          ])}
          onClick={() =>
            setIsSelected((prevState) =>
              prevState === "dislike" ? null : "dislike"
            )
          }
        >
          {!isSelected ? (
            <>
              <DisLikeSvg />
              <p>نزولی</p>
            </>
          ) : (
            <p className="text-red-500">{dislikePercentage}%</p>
          )}
        </button>
      </div>
    </div>
  );
};
