import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import Form from "@/app/ui/ativos/edit-form";

import { fetchTipos } from "@/lib/tipos/data";
import { fetchAtivoById } from "@/lib/ativos/data";
import { fetchCategorias } from "@/lib/categorias/data";

import type { Ativo } from "@/lib/ativos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ativos",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  if (!id) {
    notFound();
  }
  const [ativo, tipos, categorias] = await Promise.all([
    fetchAtivoById(id),
    fetchTipos(),
    fetchCategorias(),
  ]);

  if (!ativo) {
    notFound();
  }

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
      <Form ativo={ativo} tipos={tipos} categorias={categorias} />
    </main>
  );
}
