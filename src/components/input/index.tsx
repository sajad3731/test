import { useCallback, type ChangeEvent, type FC } from "react";

const validateDecimalInput = (value: string, maxDecimals: number): boolean => {
  if (value === "") return true;

  // Check for negative
  if (value.includes("-")) return false;

  // Allow only numbers and single decimal point
  if (!/^\d*\.?\d*$/.test(value)) return false;

  // Check decimal places
  const parts = value.split(".");
  if (parts.length === 2 && parts[1].length > maxDecimals) return false;

  return true;
};

interface NumericInputProps {
  label: string;
  value: string;
  unit: string;
  onChange: (value: string) => void;
  error?: string;
  decimals: number;
}

export const NumericInput: FC<NumericInputProps> = ({
  label,
  value,
  unit,
  onChange,
  error,
  decimals,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (validateDecimalInput(newValue, decimals)) {
        onChange(newValue);
      }
    },
    [onChange, decimals]
  );

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          className={`w-full border rounded-lg p-3 pl-16 text-right ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={value}
          onChange={handleChange}
          dir="rtl"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};