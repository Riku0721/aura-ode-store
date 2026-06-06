# Aura & Ode — 電商網站

飾品 × 香氛 × 療癒小物 | Next.js + Supabase + Vercel 電商系統

---

## 技術架構

| 層次 | 技術 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 資料庫 / Auth / Storage | Supabase (PostgreSQL) |
| 狀態管理 | Zustand (購物車) |
| 樣式 | Tailwind CSS |
| 部署 | Vercel |

---

## 快速開始

### ⚠️ 第一步：刪除衝突檔案

```bash
rm src/app/page.tsx
```

> 這個檔案是 `create-next-app` 自動生成的預設頁面，和 `src/app/(store)/page.tsx` 都對應到 `/` 路由，會造成衝突。刪除後才能正常啟動。

### 3. 複製環境變數

```bash
cp .env.example .env.local
```

填入你的 Supabase 設定（從 Supabase Dashboard > Project Settings > API 取得）：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 建立資料庫 Schema

在 Supabase Dashboard > SQL Editor 執行：

```
supabase/migrations/001_initial_schema.sql
```

### 3. 安裝依賴並啟動

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

---

## 部署到 Vercel

1. 將此資料夾推送到 GitHub
2. 前往 [vercel.com](https://vercel.com) 新增專案，選擇你的 repo
3. 在 Vercel 設定 Environment Variables（和 `.env.local` 相同的變數）
4. 部署完成 ✓

**獨立網域設定：** Vercel Dashboard > 你的專案 > Settings > Domains > 新增網域

---

## 功能總覽

### 前台（顧客）
- 首頁：Hero Banner、精選商品、商品分類
- 商品列表：分類篩選、關鍵字搜尋、排序
- 商品詳情：圖片輪播、款式選擇、加入購物車
- 購物車：數量調整、免運費提示
- 結帳：訪客結帳 + 會員結帳、優惠碼
- 會員中心：訂單查詢、個人資料

### 後台（管理員）`/admin`
- **總覽**：今日數據、訂單預警、低庫存警告
- **訂單管理**：訂單狀態更新（待處理→處理中→已出貨→已送達）
- **商品管理**：新增/編輯商品、圖片、款式
- **庫存管理**：即時調整庫存、低庫存警告
- **顧客管理**：會員列表、消費紀錄
- **數據報表**：營業額趨勢、熱銷商品
- **網站設定**：首頁 Banner、商店資訊、SEO（無需改程式碼）

---

## 設定管理員帳號

在 Supabase SQL Editor 執行：

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

之後以該 email 登入，即可進入 `/admin`

---

## 金流整合（未來）

系統已預留彈性。新增金流只需：

1. 安裝 SDK（如 `npm install stripe`）
2. 建立 `/api/payment/checkout` API route
3. 在結帳頁面加入付款按鈕
4. 在 `.env.local` 加入金鑰

目前支援的串接選項：
- **Stripe**（國際卡）
- **綠界 ECPay**（台灣本地）
- **藍新 NewebPay**（台灣本地）

---

## 資料夾結構

```
aura-ode-store/
├── src/
│   ├── app/
│   │   ├── (store)/          # 前台顧客頁面
│   │   │   ├── page.tsx      # 首頁
│   │   │   ├── products/     # 商品頁面
│   │   │   ├── cart/         # 購物車
│   │   │   ├── checkout/     # 結帳
│   │   │   ├── account/      # 會員中心
│   │   │   └── auth/         # 登入/註冊
│   │   ├── (admin)/          # 後台管理
│   │   │   └── admin/
│   │   │       ├── page.tsx  # 總覽
│   │   │       ├── orders/   # 訂單管理
│   │   │       ├── products/ # 商品管理
│   │   │       ├── inventory/# 庫存管理
│   │   │       ├── customers/# 顧客管理
│   │   │       ├── analytics/# 數據報表
│   │   │       └── settings/ # 網站設定
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── store/            # 前台元件
│   │   └── admin/            # 後台元件
│   ├── lib/
│   │   ├── supabase/         # DB clients
│   │   └── utils/            # 工具函式
│   ├── store/                # Zustand stores
│   └── types/                # TypeScript 型別
├── supabase/
│   └── migrations/           # 資料庫 Schema
├── public/
│   └── images/               # 靜態圖片
├── .env.example
└── next.config.ts
```
