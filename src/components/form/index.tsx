import type { FC } from "react";
import { FormProvider } from "react-hook-form";
import { Tab } from "../tab";
import { NumericInput } from "../input";
import { PercentageSlider } from "../slider";
import { MOCK_ASSETS, DECIMALS } from "../../../data";
import { useOrderForm } from "./use-order-form";

export const Form: FC = () => {
  const {
    form,
    orderType,
    sliderValue,
    fee,
    youWillReceive,
    isValid,
    balanceError,
    updateField,
    handleSliderChange,
    handleOrderTypeChange,
    price,
    amount,
    total,
  } = useOrderForm();

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = () => {
    console.log("Order Submitted:", {
      type: orderType,
      price,
      amount,
      total,
      fee,
      youWillReceive,
    });
    alert(`سفارش ${orderType === "buy" ? "خرید" : "فروش"} ثبت شد!`);
  };

  // Filter out balance errors from field errors (they're shown separately)
  const priceError = errors.price?.message;
  const amountError = errors.amount?.message?.includes("موجودی ناکافی")
    ? undefined
    : errors.amount?.message;
  const totalError = errors.total?.message?.includes("موجودی ناکافی")
    ? undefined
    : errors.total?.message;

  return (
    <FormProvider {...form}>
      <div
        className="w-96 m-auto my-10 border rounded-lg p-4 flex flex-col gap-4 bg-white shadow-sm"
        dir="rtl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Tab
            selectedTab={orderType || "buy"}
            setSelectedTab={handleOrderTypeChange}
          />

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
            name="price"
            label="قیمت (Price)"
            value={watch("price")}
            unit="USDT"
            onChange={(v) => updateField("price", v)}
            error={priceError}
            decimals={DECIMALS.price}
          />

          <NumericInput
            name="amount"
            label="مقدار (Amount)"
            value={watch("amount")}
            unit="BTC"
            onChange={(v) => updateField("amount", v)}
            error={amountError}
            decimals={DECIMALS.BTC}
          />

          <NumericInput
            name="total"
            label="قیمت کل (Total)"
            value={watch("total")}
            unit="USDT"
            onChange={(v) => updateField("total", v)}
            error={totalError}
            decimals={DECIMALS.USDT}
          />

          {/* Percentage Slider */}
          <PercentageSlider value={sliderValue} onChange={handleSliderChange} />

          {/* Fee & Receive Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">کارمزد (۱.۵٪):</span>
              <span>
                {fee.toFixed(
                  orderType === "buy" ? DECIMALS.BTC : DECIMALS.USDT
                )}{" "}
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
          {balanceError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {balanceError}
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
    </FormProvider>
  );
};
