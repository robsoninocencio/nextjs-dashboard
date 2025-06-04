import Form from "@/app/ui/bancos/create-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bancos",
};

export default async function Page() {
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
