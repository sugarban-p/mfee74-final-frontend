整理結果如下。

**缺 RWD**

| 類型           | 檔案                                                                                                                | 問題                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Header layout  | [Header.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/components/common/Header.tsx:329)                     | header 固定桌機導覽：`navbar-center`、mega menu、右側 icon 區都沒有手機版收合/隱藏/漢堡選單設定。           |
| Header 元件    | [MegaMenuCard.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/components/header/MegaMenuCard.tsx:40)          | `card w-75` 固定寬度，mega menu 卡片未針對小螢幕改成單欄、滿版或可捲動。                                    |
| 商品列表頁     | [[petType]/page.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/app/product/[petType]/page.tsx:469)           | 主 layout 固定 `flex-row gap-24`，左側篩選 `w-[250px] shrink-0`，手機版沒有改成上下排列、抽屜或可收合篩選。 |
| 商品列表 grid  | [[petType]/page.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/app/product/[petType]/page.tsx:659)           | 商品列表固定 `grid-cols-4`，沒有 `grid-cols-1 sm:grid-cols-2 ...` 這類 RWD 欄數。                           |
| 商品列表工具列 | [[petType]/page.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/app/product/[petType]/page.tsx:626)           | 標題/總數與排序固定左右排列，手機版沒有換行或直向排列。                                                     |
| 商品卡         | [ProductCard.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/components/product/ProductCard.tsx:156)          | 卡片固定 `w-[250px]`、圖片固定 `h-[150px]`，應改成可吃父層寬度，例如 `w-full` 搭配 grid 控制。              |
| 商品詳情推薦列 | [[product]/page.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/app/product/[petType]/[product]/page.tsx:246) | 推薦商品固定 `flex gap-8`，沒有 wrap、橫向捲動或 RWD grid，手機會溢出。                                     |

**部分已有，但還不完整**

| 類型                    | 檔案                                                                                                                         | 狀態                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 快速購物/商品詳情主區塊 | [QuickShoppingSection.tsx](C:/Users/jimmy/Desktop/mfee74-final-frontend/src/components/product/QuickShoppingSection.tsx:432) | 有 `lg:grid-cols-[510px_505px]`，算是有基本 RWD；但 `gap-16.5`、收藏按鈕 `w-30`、加入購物車 `w-50`、底部 `justify-between` 在手機仍應補 breakpoint。 |

**不用列入**
`src/app/product/page.tsx` 目前只是 placeholder；`FilterButton.tsx`、`ProductQuantitySelector.tsx` 是小型 inline 控制，沒有明顯需要獨立 RWD layout。

---

# Header RWD 計畫

## Summary

- 保留桌機版現有 `navbar-center`：`所有商品 / 所有活動` 繼續用 mega menu，`AI 顧問 / 寵物百科` 繼續用一般連結。
- 在 `lg` 以下隱藏桌機導覽，新增手機/平板用的漢堡選單。
- 手機選單用同一種直向 list 呈現四個導覽項，避免把桌機 mega menu 硬縮到小螢幕。

## Key Changes

- 在 `Header.tsx` 新增 `LuMenu` import，漢堡按鈕需有 `aria-label`。
- 將桌機 `navbar-center` 加上 `hidden lg:flex`。
- 新增手機選單區塊：
  - `lg:hidden` 顯示漢堡按鈕。
  - 使用 daisyUI/Tailwind 既有 `dropdown` 或等效原生結構，不新增套件。
  - `所有商品` 顯示 `productMegaMenuCards` 的卡片標題與子分類連結，但改成文字 list，不使用 `MegaMenuCard`。
  - `所有活動` 顯示現有四個活動連結。
  - `AI 顧問`、`寵物百科` 保留目前 href，不順手改路由。
- 右側 icon 區保留；在小螢幕縮小 gap，例如 `gap-2 lg:gap-4`，避免和 logo、漢堡按鈕擠壓。
- 不修改 `MegaMenuCard.tsx`，因為手機版不使用它；這是最小改動。

## Test Plan

- 執行 `pnpm run check`，確認 lint 和 typecheck 通過。
- 手動檢查寬度：
  - `< lg`：只顯示漢堡選單，不顯示桌機 `navbar-center`；選單可點、可看子分類。
  - `lg` 以上：顯示原本桌機導覽與 mega menu。
  - 小螢幕右側購物車/會員 icon 不與 logo 或漢堡按鈕重疊。
- 確認購物車 popover、會員按鈕、登出按鈕原行為不受影響。

## Assumptions

- breakpoint 使用 `lg`，依你選的建議方案。
- 手機版只做導覽收合，不重設計購物車面板。
- 不新增抽象元件；若之後 Header 導覽項目變多，再考慮抽共用 nav data。
