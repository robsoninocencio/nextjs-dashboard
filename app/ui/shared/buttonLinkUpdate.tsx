import Link, { type LinkProps } from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";

export function ButtonLinkUpdate({
  href,
}: {
  href: LinkProps<string>["href"];
}) {
  return (
    <Link href={href} className="rounded-md border p-2 hover:bg-gray-100">
      <PencilIcon className="w-5" />
    </Link>
  );
}
