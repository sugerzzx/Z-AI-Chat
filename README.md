# Z-Ai-Chat

此项目是一个 AI 聊天应用的实战项目，项目使用`next.js` 和 `prisma`，UI 仿照 ChatGpt，使用 `GoogleGenerativeAI` 生成对话。

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

添加 `.env` 文件

```bash
cp .env.example .env
```

修改 `.env` 文件

```bash
# .env
DATABASE_URL="file:./dev.db" # 数据库连接地址

GOOGLE_GEN_API_KEY="Your Google API Key" # 确保使用可用的 Google API Key

LOCAL_PROXY_URL="http://127.0.0.1:8080" # 如果需要使用代理访问 Google API，设置代理地址

MOCK_MESSAGE="Hello, World!" # 模拟消息，有值时，不会调用 Google API
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
