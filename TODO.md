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
