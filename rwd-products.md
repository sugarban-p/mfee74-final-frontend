# 商品相關 RWD 調整

## Header layout

預期效果：手機版隱藏桌機導覽與 mega menu，改用漢堡選單展開商品、活動與主要連結；右側 icon 間距縮小，購物車面板在手機以接近滿版寬度顯示，不會超出 viewport。

具體樣式：

- `navbar-center hidden gap-1 lg:flex`
- 手機選單：`dropdown lg:hidden`、`w-72 max-w-[calc(100vw-40px)]`
- 右側 icon：`gap-2 md:gap-4`
- 購物車面板：`fixed inset-x-5 top-20 w-auto sm:absolute sm:top-12 sm:-right-13 sm:w-[470px] sm:max-w-[calc(100vw-40px)]`

## MegaMenuCard

預期效果：小螢幕卡片可吃父層寬度；桌機維持原本 300px 卡片寬度。

具體樣式：

- 卡片：`w-full sm:w-75`
- 圖片：`w-full`

## 商品列表頁

預期效果：手機版篩選區改在商品內容上方；桌機維持左側篩選、右側商品列表。標題/總數與排序在手機上下排列，避免擠壓。

具體樣式：

- 主 layout：`flex flex-col ... lg:flex-row lg:gap-24`
- 篩選側欄：`w-full lg:w-[250px] lg:shrink-0`
- 篩選表單：`gap-6 lg:gap-12`
- 工具列：`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between`

## 商品列表 grid

預期效果：手機 1 欄、平板 2 欄、大桌機逐步增加到 4 欄。

具體樣式：

- `grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`

## ProductCard

預期效果：商品卡跟隨父層 grid 寬度伸縮；圖片維持固定比例，不再用固定高度造成手機版比例不自然。

具體樣式：

- 卡片：`w-full`
- 圖片：`aspect-[5/3] w-full`

## QuickShoppingSection

預期效果：手機版商品圖片與購買資訊上下排列，縮小縮圖間距與尺寸；收藏、加入購物車按鈕在手機滿寬，桌機維持原尺寸。

具體樣式：

- 主 layout：`grid gap-8 lg:grid-cols-[510px_505px] lg:justify-center lg:gap-16.5`
- 主圖 `sizes`：`(min-width: 1024px) 510px, 100vw`
- 縮圖列：`gap-4 sm:gap-8`
- 縮圖：`size-24 sm:size-32`
- 商品標題區：`flex flex-col ... sm:flex-row sm:items-start sm:justify-between`
- 收藏按鈕：`w-full sm:w-30`
- 底部結帳列：`flex flex-col gap-4 ... sm:flex-row sm:items-center sm:justify-between`
- 加入購物車：`w-full sm:w-50`

## 商品詳情推薦列

預期效果：手機版推薦商品 1 欄顯示，平板 2 欄，大桌機 4 欄，不再因固定 flex row 溢出。

具體樣式：

- `grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4`
