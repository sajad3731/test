import { test, expect } from "@playwright/test";

test.describe("Limit Order Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Tab Switching", () => {
    test("should display buy tab as default", async ({ page }) => {
      // Use exact match to avoid matching submit button
      const buyTab = page.getByRole("button", { name: "خرید", exact: true });
      await expect(buyTab).toHaveClass(/bg-green-500/);
    });

    test("should switch to sell tab", async ({ page }) => {
      const sellTab = page.getByRole("button", { name: "فروش", exact: true });
      await sellTab.click();
      await expect(sellTab).toHaveClass(/bg-red-500/);
    });

    test("should show correct balance based on tab", async ({ page }) => {
      // Buy mode - show USDT balance
      await expect(page.getByText("100 USDT")).toBeVisible();

      // Switch to sell
      await page.getByRole("button", { name: "فروش", exact: true }).click();
      await expect(page.getByText("1 BTC")).toBeVisible();
    });
  });

  test.describe("Input Validation", () => {
    test("should only accept numeric input", async ({ page }) => {
      const priceInput = page.locator('input[name="price"]');
      // Type character by character to trigger onChange validation
      await priceInput.pressSequentially("abc123");
      await expect(priceInput).toHaveValue("123");
    });

    test("should reject negative numbers", async ({ page }) => {
      const priceInput = page.locator('input[name="price"]');
      await priceInput.pressSequentially("-100");
      await expect(priceInput).toHaveValue("100");
    });

    test("should respect decimal limits for price (2 decimals)", async ({
      page,
    }) => {
      const priceInput = page.locator('input[name="price"]');
      await priceInput.pressSequentially("87600.123");
      // Input should stop at 2 decimals
      await expect(priceInput).toHaveValue("87600.12");
    });

    test("should respect decimal limits for amount (6 decimals)", async ({
      page,
    }) => {
      const amountInput = page.locator('input[name="amount"]');
      await amountInput.pressSequentially("0.1234567");
      // Input should stop at 6 decimals
      await expect(amountInput).toHaveValue("0.123456");
    });

    test("should show price range error", async ({ page }) => {
      const priceInput = page.locator('input[name="price"]');
      await priceInput.fill("50000");
      await expect(page.getByText(/حداقل قیمت/)).toBeVisible();

      await priceInput.fill("100000");
      await expect(page.getByText(/حداکثر قیمت/)).toBeVisible();
    });

    test("should show amount range error", async ({ page }) => {
      const amountInput = page.locator('input[name="amount"]');
      await amountInput.fill("0.0000001");
      await expect(page.getByText(/حداقل مقدار/)).toBeVisible();

      await amountInput.fill("15");
      await expect(page.getByText(/حداکثر مقدار/)).toBeVisible();
    });
  });

  test.describe("Interdependent Calculations", () => {
    test("should calculate total from price and amount", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.001");

      const totalInput = page.locator('input[name="total"]');
      await expect(totalInput).toHaveValue("88.00");
    });

    test("should calculate amount from price and total", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="total"]').fill("88");

      const amountInput = page.locator('input[name="amount"]');
      await expect(amountInput).toHaveValue("0.001000");
    });

    test("should update total when price changes", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.001");

      // Change price
      await page.locator('input[name="price"]').fill("87600");

      const totalInput = page.locator('input[name="total"]');
      await expect(totalInput).toHaveValue("87.60");
    });
  });

  test.describe("Percentage Slider", () => {
    test("should update total on slider change in buy mode", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");

      // Click 50% button
      await page.getByRole("button", { name: "50%" }).click();

      const totalInput = page.locator('input[name="total"]');
      await expect(totalInput).toHaveValue("50.00");
    });

    test("should update amount on slider change in sell mode", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "فروش", exact: true }).click();
      await page.locator('input[name="price"]').fill("88000");

      // Click 50% button
      await page.getByRole("button", { name: "50%" }).click();

      const amountInput = page.locator('input[name="amount"]');
      await expect(amountInput).toHaveValue("0.500000");
    });

    test("should update slider when total changes manually in buy mode", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="total"]').fill("50");

      const slider = page.locator('input[type="range"]');
      await expect(slider).toHaveValue("50");
    });
  });

  test.describe("Fee Calculation", () => {
    test("should calculate 1.5% fee correctly in buy mode", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      // Fee = 0.1 * 0.015 = 0.0015 BTC
      await expect(page.getByText("0.001500 BTC")).toBeVisible();
    });

    test("should calculate 1.5% fee correctly in sell mode", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "فروش", exact: true }).click();
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      // Total = 8800, Fee = 8800 * 0.015 = 132 USDT
      await expect(page.getByText("132.00 USDT")).toBeVisible();
    });
  });

  test.describe("You Will Receive", () => {
    test("should show correct receive amount in buy mode", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      // Receive = 0.1 - 0.0015 = 0.0985 BTC
      await expect(page.getByText("0.098500 BTC")).toBeVisible();
    });

    test("should show correct receive amount in sell mode", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "فروش", exact: true }).click();
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      // Receive = 8800 - 132 = 8668 USDT
      await expect(page.getByText("8668.00 USDT")).toBeVisible();
    });
  });

  test.describe("Balance Validation", () => {
    test("should show insufficient balance error in buy mode", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="total"]').fill("150"); // More than 100 USDT

      await expect(page.getByText(/موجودی ناکافی.*USDT/)).toBeVisible();
    });

    test("should show insufficient balance error in sell mode", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "فروش", exact: true }).click();
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("1.5"); // More than 1 BTC

      await expect(page.getByText(/موجودی ناکافی.*BTC/)).toBeVisible();
    });

    test("should disable submit button when balance insufficient", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="total"]').fill("150");

      const submitBtn = page.getByRole("button", { name: "ثبت سفارش خرید" });
      await expect(submitBtn).toBeDisabled();
    });
  });

  test.describe("Form Submission", () => {
    test("should enable submit when form is valid", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.001");

      const submitBtn = page.getByRole("button", { name: "ثبت سفارش خرید" });
      await expect(submitBtn).toBeEnabled();
    });

    test("should submit order successfully", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.001");

      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toContain("خرید");
        await dialog.accept();
      });

      await page.getByRole("button", { name: "ثبت سفارش خرید" }).click();
    });

    test("should show sell button in sell mode", async ({ page }) => {
      await page.getByRole("button", { name: "فروش", exact: true }).click();

      const submitBtn = page.getByRole("button", { name: "ثبت سفارش فروش" });
      await expect(submitBtn).toBeVisible();
    });
  });

  test.describe("Order Type Switch", () => {
    test("should reset amount and total when switching tabs", async ({
      page,
    }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      await page.getByRole("button", { name: "فروش", exact: true }).click();

      await expect(page.locator('input[name="amount"]')).toHaveValue("");
      await expect(page.locator('input[name="total"]')).toHaveValue("");
    });

    test("should preserve price when switching tabs", async ({ page }) => {
      await page.locator('input[name="price"]').fill("88000");
      await page.locator('input[name="amount"]').fill("0.1");

      await page.getByRole("button", { name: "فروش", exact: true }).click();

      await expect(page.locator('input[name="price"]')).toHaveValue("88000");
    });

    test("should reset slider when switching tabs", async ({ page }) => {
      await page.getByRole("button", { name: "50%" }).click();
      await page.getByRole("button", { name: "فروش", exact: true }).click();

      const slider = page.locator('input[type="range"]');
      await expect(slider).toHaveValue("0");
    });
  });
});
