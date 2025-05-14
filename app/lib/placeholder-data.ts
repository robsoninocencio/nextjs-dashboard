// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import { v4 as uuidv4 } from "uuid";

const usersData = [
  {
    id: uuidv4(),
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

const customersData = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    image_url: "/customers/evil-rabbit.png",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
    image_url: "/customers/delba-de-oliveira.png",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Lee Robinson",
    email: "lee@robinson.com",
    image_url: "/customers/lee-robinson.png",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Novotny",
    email: "michael@novotny.com",
    image_url: "/customers/michael-novotny.png",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Amy Burns",
    email: "amy@burns.com",
    image_url: "/customers/amy-burns.png",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Balazs Orban",
    email: "balazs@orban.com",
    image_url: "/customers/balazs-orban.png",
  },
];

const invoicesData = [
  {
    id: uuidv4(),
    customer_id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  }, // Evil Rabbit 1
  {
    id: uuidv4(),
    customer_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  }, // Delba de Oliveira 2
  {
    id: uuidv4(),
    customer_id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    amount: 3040,
    status: "paid",
    date: "2022-10-29",
  }, // Amy Burns 3
  {
    id: uuidv4(),
    customer_id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    amount: 44800,
    status: "paid",
    date: "2023-09-10",
  }, // Michael Novotny 4
  {
    id: uuidv4(),
    customer_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 34577,
    status: "pending",
    date: "2023-08-05",
  }, // Balazs Orban 5
  {
    id: uuidv4(),
    customer_id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    amount: 54246,
    status: "pending",
    date: "2023-07-16",
  }, // Lee Robinson 6
  {
    id: uuidv4(),
    customer_id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    amount: 666,
    status: "pending",
    date: "2023-06-27",
  }, // Evil Rabbit 7
  {
    id: uuidv4(),
    customer_id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    amount: 32545,
    status: "paid",
    date: "2023-06-09",
  }, // Michael Novotny 8
  {
    id: uuidv4(),
    customer_id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    amount: 1250,
    status: "paid",
    date: "2023-06-17",
  }, // Amy Burns 9
  {
    id: uuidv4(),
    customer_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 8546,
    status: "paid",
    date: "2023-06-07",
  }, // Balazs Orban 10
  {
    id: uuidv4(),
    customer_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    amount: 500,
    status: "paid",
    date: "2023-08-19",
  }, // Delba de Oliveira 11
  {
    id: uuidv4(),
    customer_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 8945,
    status: "paid",
    date: "2023-06-03",
  }, // Balazs Orban 12
  {
    id: uuidv4(),
    customer_id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    amount: 1000,
    status: "paid",
    date: "2022-06-05",
  }, // Lee Robinson 13
];

const revenueData = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
];

const UserData = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          content: "https://pris.ly/youtube",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
  {
    name: "Robson",
    email: "robson.inocencio@gmail.com",
    posts: {
      create: [
        {
          title: "Follow Robson on GitHub",
          content: "https://github.com/robsoninocencio",
          published: true,
        },
      ],
    },
  },
];

export { usersData, customersData, invoicesData, revenueData, UserData };
