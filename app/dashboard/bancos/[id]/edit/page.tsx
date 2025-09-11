import { notFound } from "next/navigation";

import Breadcrumbs from "@/app/ui/shared/breadcrumbs";

import { fetchBancos } from "@/lib/bancos/data";

import Form from "@/app/ui/bancos/edit-form";

import { fetchBancoById } from "@/lib/bancos/data";
import type { Banco } from "@/lib/bancos/definitions";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bancos",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const [banco, bancos] = await Promise.all([
    fetchBancoById(id),
    fetchBancos(),
  ]);

  if (!banco) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bancos", href: "/dashboard/bancos" },
          {
            label: "Atualizar banco",
            href: { pathname: `/dashboard/bancos/${id}/edit` },
            active: true,
          },
        ]}
      />
      <Form banco={banco} bancos={bancos} />
    </main>
  );
}
