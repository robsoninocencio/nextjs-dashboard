import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import Form from "@/app/ui/ativos/create-form";

import { fetchTipos } from "@/lib/tipos/data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ativos",
};

export default async function Page() {
  const tipos = await fetchTipos();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Ativos", href: "/dashboard/ativos" },
          {
            label: "Cadastro de Ativo",
            href: "/dashboard/ativos/create",
            active: true,
          },
        ]}
      />
      <Form tipos={tipos} />
    </main>
  );
}
