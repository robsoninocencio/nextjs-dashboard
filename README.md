https://vercel.com/robson-inocncios-projects/nextjs-dashboard-bk6o

## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

npm install -g pnpm
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
cd nextjs-dashboard
pnpm i
pnpm dev

https://nextjs.org/learn/dashboard-app/optimizing-fonts-images

https://www.prisma.io/docs/guides/nextjs
npm install prisma tsx --save-dev
pnpm add prisma tsx --save-dev

npm install @prisma/client @prisma/extension-accelerate
pnpm add @prisma/client @prisma/extension-accelerate

npx prisma init --db --output ../app/generated/prisma

npx prisma migrate dev --name init

npx prisma db seed

npx prisma studio

mkdir -p lib && touch lib/prisma.ts

pnpm seed

openssl rand -base64 32

E -mail: user@nextmail.com
Senha: 123456

https://nextjs-dashboard-bk6o.vercel.app/:3000/api/auth
