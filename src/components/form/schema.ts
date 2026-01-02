import { z } from "zod";
import { LIMITS, MOCK_ASSETS } from "../../../data";

export const orderFormSchema = z
  .object({
    orderType: z.enum(["buy", "sell"]),
    price: z.string(),
    amount: z.string(),
    total: z.string(),
  })
  .superRefine((data, ctx) => {
    const { orderType } = data;
    const price = parseFloat(data.price) || 0;
    const amount = parseFloat(data.amount) || 0;
    const total = parseFloat(data.total) || 0;

    // Price validation
    if (price > 0) {
      if (price < LIMITS.price.min) {
        ctx.addIssue({
          code: "custom",
          message: `حداقل قیمت: ${LIMITS.price.min.toLocaleString()}`,
          path: ["price"],
        });
      }
      if (price > LIMITS.price.max) {
        ctx.addIssue({
          code: "custom",
          message: `حداکثر قیمت: ${LIMITS.price.max.toLocaleString()}`,
          path: ["price"],
        });
      }
    }

    // Amount validation
    if (amount > 0) {
      if (amount < LIMITS.amount.min) {
        ctx.addIssue({
          code: "custom",
          message: `حداقل مقدار: ${LIMITS.amount.min}`,
          path: ["amount"],
        });
      }
      if (amount > LIMITS.amount.max) {
        ctx.addIssue({
          code: "custom",
          message: `حداکثر مقدار: ${LIMITS.amount.max}`,
          path: ["amount"],
        });
      }
    }

    // Balance validation - add to the relevant field path
    if (orderType === "buy" && total > MOCK_ASSETS.USDT) {
      ctx.addIssue({
        code: "custom",
        message: `موجودی ناکافی (${MOCK_ASSETS.USDT} USDT)`,
        path: ["total"],
      });
    }
    if (orderType === "sell" && amount > MOCK_ASSETS.BTC) {
      ctx.addIssue({
        code: "custom",
        message: `موجودی ناکافی (${MOCK_ASSETS.BTC} BTC)`,
        path: ["amount"],
      });
    }
  });

export type OrderFormData = z.infer<typeof orderFormSchema>;
