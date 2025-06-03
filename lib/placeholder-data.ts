import { v4 as uuidv4 } from "uuid";

const usersData = [
  {
    id: "3147cf60-76e1-4f8e-a3b6-f8025ddf895f",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
  {
    id: "904f8536-6a34-4161-ac7b-5c17a62a3a45",
    name: "Robson Inocencio",
    email: "robson.inocencio@gmail.com",
    password: "123456",
  },
];

const bancosData = [
  {
    id: "14d431b5-d8bb-4093-a067-5c67e67e2e40",
    nome: "Caixa Economica Federal",
  },
  {
    id: "b567da52-a347-40a0-831e-b0ae0a3b4d3a",
    nome: "Santander",
  },
  {
    id: "e95a1482-ae01-4338-b228-00050be58cf0",
    nome: "Safra",
  },
  {
    id: "8fb18392-13a8-444b-b825-05a1b5ad9e06",
    nome: "Rico",
  },
];

const clientesData = [
  {
    id: uuidv4(),
    name: "Yasmin",
    email: "yasmin@gmail.com",
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Lee Robinson",
    email: "lee@robinson.com",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Novotny",
    email: "michael@novotny.com",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Amy Burns",
    email: "amy@burns.com",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Balazs Orban",
    email: "balazs@orban.com",
  },
];

const invoicesData = [
  {
    id: "05decddc-fa47-4877-95ca-d73eeb4897fb",
    cliente_id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    amount: 15795,
    status: "pendente",
    date: "2022-12-06",
  }, // Evil Rabbit 1
  {
    id: "2d2417c1-a638-46cd-a51b-abc821616897",
    cliente_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    amount: 20348,
    status: "pendente",
    date: "2022-11-14",
  }, // Delba de Oliveira 2
  {
    id: "317d0a43-c844-4c09-8edf-cf96a75594f9",
    cliente_id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    amount: 3040,
    status: "pago",
    date: "2022-10-29",
  }, // Amy Burns 3
  {
    id: "360d3f92-df24-4b26-87f5-2f7daca43a3f",
    cliente_id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    amount: 44800,
    status: "pago",
    date: "2023-09-10",
  }, // Michael Novotny 4
  {
    id: "51455604-025a-4be2-919b-65c87c3ee95d",
    cliente_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 34577,
    status: "pendente",
    date: "2023-08-05",
  }, // Balazs Orban 5
  {
    id: "5c271905-4c6a-432b-8719-7609c7e50a3a",
    cliente_id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    amount: 54246,
    status: "pendente",
    date: "2023-07-16",
  }, // Lee Robinson 6
  {
    id: "6901a607-2760-45fb-903b-d3e86e95fb1d",
    cliente_id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    amount: 666,
    status: "pendente",
    date: "2023-06-27",
  }, // Evil Rabbit 7
  {
    id: "7ec7bb11-605b-4631-8f8a-2c1bee2d29a2",
    cliente_id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    amount: 32545,
    status: "pago",
    date: "2023-06-09",
  }, // Michael Novotny 8
  {
    id: "91f7cc3e-a0c3-40e5-96e9-6e50318ac43f",
    cliente_id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    amount: 1250,
    status: "pago",
    date: "2023-06-17",
  }, // Amy Burns 9
  {
    id: "ccaed837-2101-42e6-aba1-2720a8abc3fc",
    cliente_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 8546,
    status: "pago",
    date: "2023-06-07",
  }, // Balazs Orban 10
  {
    id: "dd3660a2-3a63-4519-a500-113f1e3cf189",
    cliente_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    amount: 500,
    status: "pago",
    date: "2023-08-19",
  }, // Delba de Oliveira 11
  {
    id: "e4b6a632-cc0a-44fb-be21-e1ff65c8d372",
    cliente_id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    amount: 8945,
    status: "pago",
    date: "2023-06-03",
  }, // Balazs Orban 12
  {
    id: "ef902a9f-efe1-4739-98fb-65931e1bc785",
    cliente_id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    amount: 1000,
    status: "pago",
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

export { usersData, clientesData, invoicesData, revenueData, bancosData };
