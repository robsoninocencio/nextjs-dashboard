import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchTipos } from "@/lib/tipos/data";

import Form from "@/app/ui/ativos/edit-form";

import { fetchAtivoById } from "@/lib/ativos/data";
import type { Ativo } from "@/lib/ativos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faturas",
};

export default async function Page(props: any) {
  const id = props.params.id;
  if (!id) {
    notFound();
  }
  const [ativo, tipos] = await Promise.all([fetchAtivoById(id), fetchTipos()]);

  if (!ativo) {
    notFound();
  }

  // Garantir que ativo.status tenha o tipo correto
  const typedAtivo: Ativo = {
    id: ativo.id,
    tipoId: ativo.tipoId,
    nome: ativo.nome,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Ativos", href: "/dashboard/ativos" },
          {
            label: "Atualizar Ativos",
            href: `/dashboard/ativos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form ativo={typedAtivo} tipos={tipos} />
    </main>
  );
}
