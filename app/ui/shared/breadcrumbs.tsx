import { clsx } from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/shared/fonts";

interface Breadcrumb {
  label: string;
  href: string | { pathname: string }; // Ajustado para aceitar string ou UrlObject
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, "flex text-xl md:text-2xl")}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={
              typeof breadcrumb.href === "string"
                ? breadcrumb.href
                : breadcrumb.href.pathname
            } // Certifique-se de que `href` seja único
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? "text-gray-900" : "text-gray-500"
            )}
          >
            <Link
              href={
                typeof breadcrumb.href === "string"
                  ? { pathname: breadcrumb.href } // Converte string para UrlObject
                  : breadcrumb.href
              }
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
