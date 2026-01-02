import { useState, type FC, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { LikeSvg } from "../../assets/like";
import { DisLikeSvg } from "../../assets/dislike";

type SentimentType = "like" | "dislike" | null;

interface SentimentSelectorProps {
  likePercentage?: number;
  dislikePercentage?: number;
  onSelect?: (sentiment: SentimentType) => void;
}

const baseButtonStyles =
  "relative border duration-200 flex items-center justify-center gap-1 py-4 cursor-pointer";

export const Button: FC<SentimentSelectorProps> = ({
  likePercentage = 70,
  dislikePercentage = 30,
  onSelect,
}) => {
  const [selected, setSelected] = useState<SentimentType>(null);

  const handleSelect = useCallback(
    (type: "like" | "dislike") => {
      setSelected((prev) => {
        const newValue = prev === type ? null : type;
        onSelect?.(newValue);
        return newValue;
      });
    },
    [onSelect]
  );

  const likeWidth = useMemo(
    () => (selected ? `${likePercentage}%` : "50%"),
    [selected, likePercentage]
  );
  const dislikeWidth = useMemo(
    () => (selected ? `${dislikePercentage}%` : "50%"),
    [selected, dislikePercentage]
  );

  return (
    <div className="w-72 flex items-center justify-center">
      {/* Like Button */}
      <button
        type="button"
        aria-pressed={selected === "like"}
        aria-label="صعودی"
        style={{ width: likeWidth }}
        className={twMerge(
          baseButtonStyles,
          "-ml-4 rounded-r-full text-white",
          "[clip-path:polygon(0%_0%,100%_0,100%_100%,30px_100%)]",
          selected ? "bg-green-100" : "bg-green-500",
          selected === "like" && [
            "border-green-500",
            "after:absolute after:top-0 after:bottom-0 after:left-0",
            "after:h-[115%] after:w-px after:bg-green-500",
            "after:origin-top-right after:-rotate-[27deg]",
          ]
        )}
        onClick={() => handleSelect("like")}
      >
        {!selected ? (
          <>
            <LikeSvg />
            <span>صعودی</span>
          </>
        ) : (
          <span className="text-green-500">{likePercentage}%</span>
        )}
      </button>

      {/* Dislike Button */}
      <button
        type="button"
        aria-pressed={selected === "dislike"}
        aria-label="نزولی"
        style={{ width: dislikeWidth }}
        className={twMerge(
          baseButtonStyles,
          "rounded-l-full text-white",
          "[clip-path:polygon(0%_0%,calc(100%-30px)_0,100%_100%,0_100%)]",
          selected ? "bg-red-100" : "bg-red-500",
          selected === "dislike" && [
            "border-red-500",
            "before:absolute before:-top-2 before:right-0",
            "before:h-[115%] before:w-px before:bg-red-500",
            "before:origin-bottom-left before:-rotate-27",
          ]
        )}
        onClick={() => handleSelect("dislike")}
      >
        {!selected ? (
          <>
            <DisLikeSvg />
            <span>نزولی</span>
          </>
        ) : (
          <span className="text-red-500">{dislikePercentage}%</span>
        )}
      </button>
    </div>
  );
};
