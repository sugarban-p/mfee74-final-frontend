## 首頁

1. 常見問題

"如何聯繫 MOFU 客服？" 目前預設為展開狀態

## 頁面標籤設定

在 Next.js App Router 裡，業界比較常見的是「各自 route 設定 metadata」。
目前這個專案的做法是 centralized title resolver（集中式 title 判定）：AppShell 根據 pathname 統一決定 document.title。優點是簡單、全站規則集中；缺點是 dynamic route（動態路由）像商品詳情、訂單詳情、寵物詳情這種需要 API 資料的頁面，只能先顯示通用名稱，例如 商品詳情 | MOFU。
比較標準的做法：

- Static page（靜態頁）：在各自 route 用 `metadata` 設定。
- Dynamic page（動態頁）：用 `generateMetadata()` 依照 params/API 資料回傳 title。
- Client-side fetch page（目前商品詳情這種）：若暫時不重構成 server fetch，就用 `document.title` 或小型 Context override 處理。

以下用 browser tab title（瀏覽器頁籤標題）來說明，三種常見寫法差異很明確。

---

### 1.集中式 AppShell 判定

你們目前接近這種：

```tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TITLE_PREFIX = ' | MOFU';

const ROUTE_TITLE_RULES = [
{ pattern: /^\/$/, title: '陪毛孩過好每一天' },
  { pattern: /^\/product\/cat\/?$/, title: '貓咪專區' },
{ pattern: /^\/product\/dog\/?$/, title: '狗勾專區' },
  { pattern: /^\/product\/[^/]+\/[^/]+\/?$/, title: '商品詳情' },
];

function resolvePageTitle(pathname: string) {
const matchedRule = ROUTE_TITLE_RULES.find((rule) =>
rule.pattern.test(pathname)
);

return matchedRule ? `${matchedRule.title}${TITLE_PREFIX}` : 'MOFU';
}

export default function AppShell({ children }: { children: React.ReactNode }) {
const pathname = usePathname();

useEffect(() => {
document.title = resolvePageTitle(pathname || '/');
}, [pathname]);

return <>{children}</>;
}
```

適合：靜態 title、規則少、想集中管理。
缺點：像商品名稱這種 API 回來才知道的資料，不好直接放進來。

---

### 2.各 route 靜態 `metadata`

Next.js App Router 常見寫法：

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
title: '購物車 | MOFU',
};

export default function CartPage() {
return <div>購物車</div>;
}
```

或在 `layout.tsx` 設定 template：

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
title: {
default: 'MOFU｜陪毛孩過好每一天',
template: '%s | MOFU',
},
};
```

然後各頁只寫：

```tsx
export const metadata = {
title: '購物車',
};
```

適合：`/cart`、`/auth/login`、`/product/cat` 這種 title 固定的頁面。
限制：`metadata` 只能用在 Server Component，不能跟 `'use client'` 放同一個檔案。

---

3. Dynamic route 用 `generateMetadata()`

例如商品頁如果能在 server side（伺服器端）先 fetch 商品名稱：

```tsx
import type { Metadata } from 'next';

interface ProductPageProps {
params: Promise<{
petType: string;
product: string;
}>;
}

export async function generateMetadata({
params,
}: ProductPageProps): Promise<Metadata> {
const { petType, product } = await params;

const response = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/products/${petType}/${product}/detail`
);

if (!response.ok) {
return { title: '商品詳情' };
}

const data = await response.json();
const productName = data.product?.prod_name ?? data.product?.name;

return {
title: productName || '商品詳情',
};
}

export default function ProductPage() {
return <ProductPageClient />;
}
```

然後實際互動 UI 拆到 client component：

```tsx
'use client';

export default function ProductPageClient() {
// 原本 useParams、useEffect、fetch 商品資料的內容放這裡
}
```

適合：商品詳情、文章詳情、訂單詳情等 dynamic title。
缺點：如果目前整頁都靠 client-side fetch，改成這種會多一點重構。

---

---

最小改法補充

如果現在不想重構商品頁，最省事是保留 AppShell 集中式做法，再加一個 title override：

```tsx
useEffect(() => {
  if (!productDetail?.product.name) return;

  document.title = `${productDetail.product.name} | MOFU`;
}, [productDetail?.product.name]);
```

但這種直接在商品頁改 `document.title`，切頁清理要小心。比較乾淨的是用 Context 讓商品頁通知 `AppShell`。
