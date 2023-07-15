import { expect, test } from "@playwright/test";

import { urlList } from "../../config";

const domain = process.env.DOMAIN ?? `https://voicecamp.love`;
console.log(`domain`, domain);

test("登録フォームの確認", async ({ page }) => {
  await page.goto(`${domain}`);
  await page.getByRole("link", { name: "ポッドキャストの登録" }).click();
  await page.goto(`${domain}`);
});

test("詳細ページの確認", async ({ page }) => {
  for (let i = urlList.length - 1; i >= 0; i--) {
    let name = urlList[i].name;
    await page.goto(`${domain}`);
    await page.getByRole("link", { name }).click();
    await page.getByRole("heading", { name }).click();
    await page.locator("span").getByRole("img").click();
    await page.getByRole("link", { name: "トップへ戻る" }).click();
  }
});
