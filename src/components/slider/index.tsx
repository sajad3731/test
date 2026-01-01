import type { FC } from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const PercentageSlider: FC<SliderProps> = ({ value, onChange }) => {
  const marks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col gap-2">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {marks.map((mark) => (
          <button
            key={mark}
            type="button"
            onClick={() => onChange(mark)}
            className={`px-2 py-1 rounded ${
              value === mark ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            {mark}%
          </button>
        ))}
      </div>
    </div>
  );
};
