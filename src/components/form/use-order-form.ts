import { useCallback, useMemo, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormData } from "./schema";
import { MOCK_ASSETS, DECIMALS, FEE_PERCENTAGE } from "../../../data";
import { formatNumber, parseNumber } from "./utils";

type OrderType = "buy" | "sell";

export const useOrderForm = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [lastEditedField, setLastEditedField] = useState<"price" | "amount" | "total" | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: "onChange",
    defaultValues: {
      orderType: "buy",
      price: "",
      amount: "",
      total: "",
    },
  });

  const { control, setValue, getValues, formState: { errors } } = form;

  const orderType = useWatch({ control, name: "orderType" });
  const priceStr = useWatch({ control, name: "price" });
  const amountStr = useWatch({ control, name: "amount" });
  const totalStr = useWatch({ control, name: "total" });

  const price = parseNumber(priceStr);
  const amount = parseNumber(amountStr);
  const total = parseNumber(totalStr);

  // Computed values
  const fee = useMemo(() => {
    return orderType === "buy"
      ? amount * FEE_PERCENTAGE
      : total * FEE_PERCENTAGE;
  }, [orderType, amount, total]);

  const youWillReceive = useMemo(() => {
    return orderType === "buy"
      ? Math.max(0, amount - fee)
      : Math.max(0, total - fee);
  }, [orderType, amount, total, fee]);

  const isValid = useMemo(() => {
    const hasNoErrors = Object.keys(errors).length === 0;
    return hasNoErrors && price > 0 && amount > 0 && total > 0;
  }, [errors, price, amount, total]);

  const balanceError = (errors as Record<string, { message?: string }>).balance?.message;

  // Update field with dependent calculations
  const updateField = useCallback(
    (field: "price" | "amount" | "total", value: string) => {
      setValue(field, value, { shouldValidate: true });
      setLastEditedField(field);

      const p = field === "price" ? parseNumber(value) : price;
      const a = field === "amount" ? parseNumber(value) : amount;
      const t = field === "total" ? parseNumber(value) : total;

      if (field === "price" || field === "amount") {
        if (p > 0 && a > 0) {
          setValue("total", formatNumber(p * a, DECIMALS.USDT), { shouldValidate: true });
        }
      } else if (field === "total") {
        if (p > 0 && t > 0) {
          setValue("amount", formatNumber(t / p, DECIMALS.BTC), { shouldValidate: true });
        }
      }
    },
    [setValue, price, amount, total]
  );

  // Update slider from values
  useEffect(() => {
    if (lastEditedField === null) return;

    if (orderType === "buy" && total > 0) {
      setSliderValue(Math.min(100, (total / MOCK_ASSETS.USDT) * 100));
    } else if (orderType === "sell" && amount > 0) {
      setSliderValue(Math.min(100, (amount / MOCK_ASSETS.BTC) * 100));
    }
  }, [orderType, total, amount, lastEditedField]);

  // Handle slider change
  const handleSliderChange = useCallback(
    (percentage: number) => {
      setSliderValue(percentage);
      const p = price;

      if (orderType === "buy") {
        const newTotal = (percentage / 100) * MOCK_ASSETS.USDT;
        setValue("total", formatNumber(newTotal, DECIMALS.USDT), { shouldValidate: true });
        if (p > 0) {
          setValue("amount", formatNumber(newTotal / p, DECIMALS.BTC), { shouldValidate: true });
        }
      } else {
        const newAmount = (percentage / 100) * MOCK_ASSETS.BTC;
        setValue("amount", formatNumber(newAmount, DECIMALS.BTC), { shouldValidate: true });
        if (p > 0) {
          setValue("total", formatNumber(newAmount * p, DECIMALS.USDT), { shouldValidate: true });
        }
      }
    },
    [orderType, price, setValue]
  );

  // Handle order type change
  const handleOrderTypeChange = useCallback(
    (type: string) => {
      const currentPrice = getValues("price");
      setValue("orderType", type as OrderType);
      setValue("amount", "");
      setValue("total", "");
      setValue("price", currentPrice);
      setSliderValue(0);
      setLastEditedField(null);
    },
    [setValue, getValues]
  );

  return {
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
  };
};
