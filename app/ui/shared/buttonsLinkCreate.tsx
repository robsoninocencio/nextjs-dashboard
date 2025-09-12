import Link, { LinkProps } from "next/link";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export function ButtonLinkCreate({
  href,
  children,
}: {
  href: LinkProps<string>["href"];
  children: React.ReactNode;
}) {
  return (
    <Button asChild>
      <Link href={href}>
        <span className="hidden md:block">{children}</span>{" "}
        <PlusIcon className="h-5 md:ml-4" />
      </Link>
    </Button>
  );
}
