import Form from "@/app/ui/bancos/create-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { fetchBancos } from "@/lib/bancos/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bancos",
};

export default async function Page() {
  const bancos = await fetchBancos();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bancos", href: "/dashboard/bancos" },
          {
            label: "Cadastro de Banco",
            href: "/dashboard/bancos/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
