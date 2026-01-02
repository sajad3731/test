import { memo, type FC } from "react";
import { twMerge } from "tailwind-merge";

interface TabProps {
  selectedTab: "buy" | "sell";
  setSelectedTab: (tab: string) => void;
}

export const Tab: FC<TabProps> = memo(({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full flex items-center justify-center">
      <button
        type="button"
        className={twMerge([
          "-ml-6 w-[50%] relative border duration-200 flex items-center justify-center gap-1 py-2 text-white cursor-pointer",
          "rounded-r-lg [clip-path:polygon(0%_0%,100%_0,100%_100%,30px_100%)]",
          selectedTab === "buy" ? "bg-green-500" : "bg-slate-300",
        ])}
        onClick={() => setSelectedTab("buy")}
      >
        <p className={selectedTab === "buy" ? "text-white" : "text-slate-500"}>
          خرید
        </p>
      </button>
      <button
        type="button"
        className={twMerge([
          "w-[50%] relative border duration-200 flex items-center justify-center gap-1 py-2 text-white cursor-pointer",
          "rounded-l-lg [clip-path:polygon(0%_0%,calc(100%-30px)_0,100%_100%,0_100%)]",
          selectedTab === "sell" ? "bg-red-500" : "bg-slate-300",
        ])}
        onClick={() => setSelectedTab("sell")}
      >
        <p className={selectedTab === "sell" ? "text-white" : "text-slate-500"}>
          فروش
        </p>
      </button>
    </div>
  );
});

Tab.displayName = "Tab";
