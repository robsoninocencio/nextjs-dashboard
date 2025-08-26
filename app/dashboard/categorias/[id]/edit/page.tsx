import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchCategorias } from "@/lib/categorias/data";

import Form from "@/app/ui/categorias/edit-form";

import { fetchCategoriaById } from "@/lib/categorias/data";
import type { Categoria } from "@/lib/categorias/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [categoria, categorias] = await Promise.all([
    fetchCategoriaById(id),
    fetchCategorias(),
  ]);

  if (!categoria) {
    notFound();
  }

  // Garantir que categoria tenha o tipo correto
  const typedCategoria: Categoria = {
    id: categoria.id,
    nome: categoria.nome,
    parentId: categoria.parentId,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Categorias", href: "/dashboard/categorias" },
          {
            label: "Atualizar Categoria",
            href: `/dashboard/categorias/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form categoria={typedCategoria} categorias={categorias} />
    </main>
  );
}
