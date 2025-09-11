import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteBanco } from "@/lib/bancos/actions";

export function ButtonLinkDelete({ id }: { id: string }) {
  const deleteBancoWithId = deleteBanco.bind(null, id);

  return (
    <form action={deleteBancoWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
