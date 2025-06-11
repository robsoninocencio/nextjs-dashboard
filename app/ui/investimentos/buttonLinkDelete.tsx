import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteInvestimento } from "@/lib/investimentos/actions";

export function ButtonLinkDelete({ id }: { id: string }) {
  const deleteInvestimentoWithId = deleteInvestimento.bind(null, id);

  return (
    <form action={deleteInvestimentoWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
