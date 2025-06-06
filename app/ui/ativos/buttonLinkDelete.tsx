import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteAtivo } from "@/lib/ativos/actions";

export function ButtonLinkDelete({ id }: { id: string }) {
  const deleteAtivoWithId = deleteAtivo.bind(null, id);

  return (
    <form action={deleteAtivoWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
