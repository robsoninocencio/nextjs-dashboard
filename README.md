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

npx prisma init --db --output ../generated/prisma

npx prisma migrate dev --name init

npx prisma db seed

npx prisma studio

mkdir -p lib && touch lib/prisma.ts

pnpm seed

openssl rand -base64 32

E -mail: user@nextmail.com
Senha: 123456

https://nextjs-dashboard-l263mjqo9-robson-inocncios-projects.vercel.app/

https://nextjs-dashboard-l263mjqo9-robson-inocncios-projects.vercel.app/login

DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZGVjYmM4YTAtMzljYS00ZGQ4LTliNTMtMjQwMmNlYzBhYzhhIiwidGVuYW50X2lkIjoiZGRkOWM2ZGJiNDNmZDdkNmNlOWI4NTg3ZWQ5YmExNWM5ZjVlOTFhZDA4YmM0NjJjMThlYjMyNTYyZmU5MWJiMSIsImludGVybmFsX3NlY3JldCI6ImUyNTAyZmZiLTcwYWYtNDkzNi1iYjIyLWU1YTdmMjMyOGNhMiJ9.nCtM3XE0fXL6rSl9JVKWuwFX6zp6E0Q6tswikYJGSUU"
vercel env add DATABASE_URL development
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL production

AUTH_SECRET=GeWiFqAe+VQIooe6pIEVVoYhaOtvP6juMz3JHw9N6qE=
vercel env add AUTH_SECRET development
vercel env add AUTH_SECRET preview
vercel env add AUTH_SECRET production

development
AUTH_URL=http://localhost:3000

preview
AUTH_URL=https://nextjs-dashboard-bk6o-git-main-robson-inocncios-projects.vercel.app

production
AUTH_URL=https://nextjs-dashboard-bk6o.vercel.app

Não deve adicinar "/api/auth" ao final das rotas a vercel completa.

vercel env add AUTH_URL development
http://localhost:3000

vercel env add AUTH_URL preview
https://nextjs-dashboard-bk6o-git-main-robson-inocncios-projects.vercel.app

vercel env add AUTH_URL production
https://nextjs-dashboard-bk6o.vercel.app

vercel --prod

# `openssl rand -base64 32`

vercel dev
