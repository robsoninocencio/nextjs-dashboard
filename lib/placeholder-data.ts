import { v4 as uuidv4 } from "uuid";
// id: uuidv4(),

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

const tiposData = [
  {
    id: "0348832b-8e22-4413-a503-dd518883b401",
    nome: "Renda Fixa",
  },
  {
    id: "057909d7-7901-4a0a-99b1-732c97aa4086",
    nome: "Renda Variável",
  },
  {
    id: "0b66393b-c796-48f9-b841-c1145afa9f4b",
    nome: "Curto Prazo",
  },
  {
    id: "17564b20-b032-487e-a5e7-6badfc9d591e",
    nome: "Conta Corrente",
  },
];

const clientesData = [
  {
    id: "6d5771be-fa50-4ed0-8997-68b4c8a42499",
    name: "Yasmin Inocencio",
    email: "ya.inocencio@gmail.com",
  },
  {
    id: "d4af0403-3fb5-4393-bbd5-2d2f85877021",
    name: "Janaina Inocencio",
    email: "janaina.cs.inocencio@gmail.com",
  },
  {
    id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    name: "Robson Inocencio",
    email: "robson.inocencio@gmail.com",
  },
  {
    id: "0d3831d2-1156-4867-bdbd-57d3675685d9",
    name: "Elsa Inocencio",
    email: "elsacrente@gmailcom",
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

const ativosData = [
  {
    id: "6229b420-f771-4393-ab9f-af895af38fa8",
    nome: "CRA Emissão Terceiros CDI",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "8eb06c98-3d67-406b-9677-755bced18e54",
    nome: "LETRA CRED.AGNG",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "ca43b39a-58a7-45d1-b5a2-fd4df2745851",
    nome: "LTN PRE-Tesouro Jan/2026",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "148a953e-4dea-4b0c-8009-9bba6730efa5",
    nome: "NTN-F-Tesouro Jan/2031",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "f36e1c9a-86e8-40be-8815-c94df3780d35",
    nome: "SAF AGILITE FI RF CP",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "32be0c4a-76b5-4aa4-a659-acf531d4e811",
    nome: "SAF SOB SPECIAL FICFI RF SIMPL",
    tipoId: "0348832b-8e22-4413-a503-dd518883b401",
  }, // Renda Fixa
  {
    id: "ef902a9f-efe1-4739-98fb-65931e1bc785",
    nome: "CDB Automático",
    tipoId: "0b66393b-c796-48f9-b841-c1145afa9f4b",
  }, // Curto Prazo
  {
    id: "210819a3-8858-440f-a11b-d41ec4aaaf00",
    nome: "CONTA CORRENTE",
    tipoId: "17564b20-b032-487e-a5e7-6badfc9d591e",
  }, // Conta Corrente",
];

const investimentosData = [
  {
    id: "9a4151fa-1022-4b46-88c4-fa7332430686",
    saldoBruto: 2470794,
    saldoLiquido: 2470794,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 0,
    rendimentoDoMes: 21745,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "6229b420-f771-4393-ab9f-af895af38fa8",
  }, // Robson Inocencio - Safra - CRA Emissão Terceiros CDI
  {
    id: "ca3c3c85-48d5-4d4e-8af4-fa72fd21b434",
    saldoBruto: 2668740,
    saldoLiquido: 2668740,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 0,
    rendimentoDoMes: 23295,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "8eb06c98-3d67-406b-9677-755bced18e54",
  }, // Robson Inocencio - Safra - LETRA CRED.AGNG
  {
    id: "f926df16-024e-469c-b2e8-a75578a7576e",
    saldoBruto: 6431424,
    saldoLiquido: 6217418,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 214006,
    rendimentoDoMes: 85673,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "ca43b39a-58a7-45d1-b5a2-fd4df2745851",
  }, // Robson Inocencio - Safra - LTN PRE-Tesouro Jan/2026
  {
    id: "634b7a65-0288-4ce9-b52b-98a28d1525e6",
    saldoBruto: 2330697,
    saldoLiquido: 2330697,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 0,
    rendimentoDoMes: 106814,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "148a953e-4dea-4b0c-8009-9bba6730efa5",
  }, // Robson Inocencio - Safra - NTN-F-Tesouro Jan/2031
  {
    id: "904b5d2a-3644-4f8f-9774-ec942647fe52",
    saldoBruto: 12536646,
    saldoLiquido: 12392941,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 143705,
    rendimentoDoMes: 130463,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "f36e1c9a-86e8-40be-8815-c94df3780d35",
  }, // Robson Inocencio - Safra - SAF AGILITE FI RF CP
  {
    id: "6ad1afc8-6a5d-4a84-835b-714a6c21090b",
    saldoBruto: 7901293,
    saldoLiquido: 7824001,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 77292,
    rendimentoDoMes: 76981,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "32be0c4a-76b5-4aa4-a659-acf531d4e811",
  }, // Robson Inocencio - Safra - SAF SOB SPECIAL FICFI RF SIMPL
  {
    id: "d5e79b9e-7b57-48f9-8ae2-0c1a720dae35",
    saldoBruto: 50035,
    saldoLiquido: 50028,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 7,
    rendimentoDoMes: 0,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "ef902a9f-efe1-4739-98fb-65931e1bc785",
  }, // Robson Inocencio - Safra - CDB Automático
  {
    // id: uuidv4(),
    id: "7a6ca144-3e06-4e99-bf48-aec55b5c2867",
    saldoBruto: 9,
    saldoLiquido: 9,
    valorResgatado: 0,
    valorAplicado: 0,
    impostoIncorrido: 0,
    impostoPrevisto: 0,
    rendimentoDoMes: 33,
    dividendosDoMes: 0,
    data: "2025-04-30",
    ano: "2025",
    mes: "04",
    cliente_id: "f6928b6d-2de6-4cfd-91f5-f017af8da2af",
    bancoId: "e95a1482-ae01-4338-b228-00050be58cf0",
    ativoId: "210819a3-8858-440f-a11b-d41ec4aaaf00",
  }, // Robson Inocencio - Safra - CONTA CORRENTE
];

export {
  usersData,
  clientesData,
  invoicesData,
  revenueData,
  bancosData,
  tiposData,
  ativosData,
  investimentosData,
};
