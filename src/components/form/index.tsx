import { useState, useCallback, useMemo, type FC } from "react";
import { Tab } from "../tab";
import { MOCK_ASSETS, LIMITS, DECIMALS, FEE_PERCENTAGE } from "../../../data";
import { NumericInput } from "../input";
import { PercentageSlider } from "../slider";
import { formatNumber, parseNumber } from "./utils";

type OrderType = "buy" | "sell";

interface FormState {
  price: string;
  amount: string;
  total: string;
}

type FieldName = keyof FormState;

export const Form: FC = () => {
  const [orderType, setOrderType] = useState<OrderType>("buy");
  const [formState, setFormState] = useState<FormState>({
    price: "",
    amount: "",
    total: "",
  });
  const [sliderValue, setSliderValue] = useState(0);

  // ============ Computed Values ============
  const price = parseNumber(formState.price);
  const amount = parseNumber(formState.amount);
  const total = parseNumber(formState.total);

  const fee = useMemo(() => {
    if (orderType === "buy") {
      return amount * FEE_PERCENTAGE; // Fee in BTC
    }
    return total * FEE_PERCENTAGE; // Fee in USDT
  }, [orderType, amount, total]);

  const youWillReceive = useMemo(() => {
    if (orderType === "buy") {
      return Math.max(0, amount - fee);
    }
    return Math.max(0, total - fee);
  }, [orderType, amount, total, fee]);

  // ============ Validation ============
  const validation = useMemo(() => {
    const errors: Partial<Record<FieldName | "balance", string>> = {};

    if (price > 0) {
      if (price < LIMITS.price.min)
        errors.price = `حداقل قیمت: ${LIMITS.price.min.toLocaleString()}`;
      if (price > LIMITS.price.max)
        errors.price = `حداکثر قیمت: ${LIMITS.price.max.toLocaleString()}`;
    }

    if (amount > 0) {
      if (amount < LIMITS.amount.min)
        errors.amount = `حداقل مقدار: ${LIMITS.amount.min}`;
      if (amount > LIMITS.amount.max)
        errors.amount = `حداکثر مقدار: ${LIMITS.amount.max}`;
    }

    // Balance validation
    if (orderType === "buy" && total > MOCK_ASSETS.USDT) {
      errors.balance = `موجودی ناکافی (${MOCK_ASSETS.USDT} USDT)`;
    }
    if (orderType === "sell" && amount > MOCK_ASSETS.BTC) {
      errors.balance = `موجودی ناکافی (${MOCK_ASSETS.BTC} BTC)`;
    }

    return errors;
  }, [price, amount, total, orderType]);

  const isValid = useMemo(() => {
    return (
      Object.keys(validation).length === 0 &&
      price > 0 &&
      amount > 0 &&
      total > 0
    );
  }, [validation, price, amount, total]);

  // ============ Field Update Handlers ============
  const updateField = useCallback((field: FieldName, value: string) => {
    setFormState((prev) => {
      const newState = { ...prev, [field]: value };
      const p =
        field === "price" ? parseNumber(value) : parseNumber(prev.price);
      const a =
        field === "amount" ? parseNumber(value) : parseNumber(prev.amount);
      const t =
        field === "total" ? parseNumber(value) : parseNumber(prev.total);

      // Calculate dependent fields
      if (field === "price" || field === "amount") {
        if (p > 0 && a > 0) {
          newState.total = formatNumber(p * a, DECIMALS.USDT);
        }
      } else if (field === "total") {
        if (p > 0 && t > 0) {
          newState.amount = formatNumber(t / p, DECIMALS.BTC);
        }
      }

      return newState;
    });
    // setLastEdited(field);

    // Update slider based on new values
    setTimeout(() => updateSliderFromValues(), 0);
  }, []);

  const updateSliderFromValues = useCallback(() => {
    setFormState((prev) => {
      const t = parseNumber(prev.total);
      const a = parseNumber(prev.amount);

      if (orderType === "buy" && t > 0) {
        setSliderValue(Math.min(100, (t / MOCK_ASSETS.USDT) * 100));
      } else if (orderType === "sell" && a > 0) {
        setSliderValue(Math.min(100, (a / MOCK_ASSETS.BTC) * 100));
      }
      return prev;
    });
  }, [orderType]);

  const handleSliderChange = useCallback(
    (percentage: number) => {
      setSliderValue(percentage);
      const p = parseNumber(formState.price);

      if (orderType === "buy") {
        const newTotal = (percentage / 100) * MOCK_ASSETS.USDT;
        setFormState((prev) => ({
          ...prev,
          total: formatNumber(newTotal, DECIMALS.USDT),
          amount:
            p > 0 ? formatNumber(newTotal / p, DECIMALS.BTC) : prev.amount,
        }));
      } else {
        const newAmount = (percentage / 100) * MOCK_ASSETS.BTC;
        setFormState((prev) => ({
          ...prev,
          amount: formatNumber(newAmount, DECIMALS.BTC),
          total:
            p > 0 ? formatNumber(newAmount * p, DECIMALS.USDT) : prev.total,
        }));
      }
    },
    [orderType, formState.price]
  );

  const handleOrderTypeChange = useCallback(
    (type: string) => {
      setOrderType(type as OrderType);
      setSliderValue(0);
      setFormState({ price: formState.price, amount: "", total: "" });
    },
    [formState.price]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;

      console.log("Order Submitted:", {
        type: orderType,
        price,
        amount,
        total,
        fee,
        youWillReceive,
      });

      alert(`سفارش ${orderType === "buy" ? "خرید" : "فروش"} ثبت شد!`);
    },
    [isValid, orderType, price, amount, total, fee, youWillReceive]
  );

  // ============ Render ============
  return (
    <div
      className="w-96 m-auto my-10 border rounded-lg p-4 flex flex-col gap-4 bg-white shadow-sm"
      dir="rtl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Tab selectedTab={orderType} setSelectedTab={handleOrderTypeChange} />

        {/* Balance Display */}
        <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <span>موجودی:</span>
          <span>
            {orderType === "buy"
              ? `${MOCK_ASSETS.USDT} USDT`
              : `${MOCK_ASSETS.BTC} BTC`}
          </span>
        </div>

        {/* Input Fields */}
        <NumericInput
          label="قیمت (Price)"
          value={formState.price}
          unit="USDT"
          onChange={(v) => updateField("price", v)}
          error={validation.price}
          decimals={DECIMALS.price}
        />

        <NumericInput
          label="مقدار (Amount)"
          value={formState.amount}
          unit="BTC"
          onChange={(v) => updateField("amount", v)}
          error={validation.amount}
          decimals={DECIMALS.BTC}
        />

        <NumericInput
          label="قیمت کل (Total)"
          value={formState.total}
          unit="USDT"
          onChange={(v) => updateField("total", v)}
          error={validation.total}
          decimals={DECIMALS.USDT}
        />

        {/* Percentage Slider */}
        <PercentageSlider value={sliderValue} onChange={handleSliderChange} />

        {/* Fee & Receive Info */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">کارمزد (۱.۵٪):</span>
            <span>
              {fee.toFixed(orderType === "buy" ? DECIMALS.BTC : DECIMALS.USDT)}{" "}
              {orderType === "buy" ? "BTC" : "USDT"}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-gray-600">دریافت می‌کنید:</span>
            <span
              className={
                orderType === "buy" ? "text-green-600" : "text-red-600"
              }
            >
              {youWillReceive.toFixed(
                orderType === "buy" ? DECIMALS.BTC : DECIMALS.USDT
              )}{" "}
              {orderType === "buy" ? "BTC" : "USDT"}
            </span>
          </div>
        </div>

        {/* Balance Error */}
        {validation.balance && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {validation.balance}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
            orderType === "buy"
              ? isValid
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-300 cursor-not-allowed"
              : isValid
              ? "bg-red-500 hover:bg-red-600"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          {orderType === "buy" ? "ثبت سفارش خرید" : "ثبت سفارش فروش"}
        </button>
      </form>
    </div>
  );
};
