# Z-Ai-Chat

此项目为个人在基于 `next.js` 和 `prisma` 的全栈项目的练习项目，UI 仿照 ChatGpt，使用 `GoogleGenerativeAI` 生成对话。

## 开始

1. 安装依赖

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. 添加环境变量

```bash
cp .env.example .env
```

```bash
# .env
DATABASE_URL="file:./dev.db" # 数据库连接地址

GOOGLE_GEN_API_KEY="Your Google API Key" # 确保使用可用的 Google API Key

LOCAL_PROXY_URL="http://127.0.0.1:8080" # 如果需要使用代理访问 Google API，设置代理地址
```

3. 设置数据库

```bash
npx prisma db push
```

4. 运行项目

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
