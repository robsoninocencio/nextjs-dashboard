"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Lista de links exibidos na navegação lateral.
// Dependendo do tamanho da aplicação, isso poderia estar em um banco de dados.
const links = [
  { nome: "Dashboard", href: "/dashboard", icone: HomeIcon },
  {
    nome: "Faturas",
    href: "/dashboard/invoices",
    icone: DocumentDuplicateIcon,
  },
  { nome: "Clientes", href: "/dashboard/clientes", icone: UserGroupIcon },
  { nome: "Bancos", href: "/dashboard/bancos", icone: BanknotesIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const IconeLink = link.icone;
        const ativo = pathname === link.href;

        return (
          <Link
            key={link.nome}
            href={{ pathname: link.href }}
            aria-current={ativo ? "page" : undefined}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": ativo,
              }
            )}
          >
            <IconeLink className="w-6" />
            <p className="hidden md:block">{link.nome}</p>
          </Link>
        );
      })}
    </>
  );
}
