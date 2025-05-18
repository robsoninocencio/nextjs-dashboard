import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import type { Invoice } from "@/app/lib/definitions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    // Lidar com o caso de erro:
    return <div className="error-page">Fatura não encontrada</div>; // Ou redirecionar para /dashboard/invoices
  }

  // Garantir que invoice.status tenha o tipo correto
  const typedInvoice: Invoice = {
    id: invoice.id,
    customer_id: invoice.customer_id,
    amount: invoice.amount,
    date: invoice.date.toISOString(), // Converte a data para string ISO
    status:
      invoice.status === "pending" || invoice.status === "paid"
        ? invoice.status
        : "pending",
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={typedInvoice} customers={customers} />
    </main>
  );
}
