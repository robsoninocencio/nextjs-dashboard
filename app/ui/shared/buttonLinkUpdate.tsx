import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";

export function ButtonLinkUpdate({ href }: { href: string }) {
  return (
    <Link
      href={{ pathname: href }}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
