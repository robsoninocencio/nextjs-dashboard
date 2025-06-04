"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinksMenu } from "./nav-links.constants";

// 🔧 Verifica se o link está ativo (ignora barra no final)
const isActive = (currentPath: string, linkPath: string) => {
  const normalize = (path: string) => path.replace(/\/$/, "");

  const current = normalize(currentPath);
  const link = normalize(linkPath);

  return current === link || (link !== "" && current.startsWith(link + "/"));
};

type NavLinkProps = {
  link: (typeof navLinksMenu)[number];
  ativo: boolean;
};

const NavLink = React.memo(function NavLink({ link, ativo }: NavLinkProps) {
  const Icon = link.icon;

  const baseClassNames =
    "relative flex h-12 grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-colors duration-200 hover:bg-sky-100 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:flex-none md:justify-start md:p-2 md:px-3";
  const activeClassNames = "bg-sky-100 text-blue-600";

  return (
    <Link
      href={{ pathname: link.path }}
      aria-current={ativo ? "page" : undefined}
      aria-label={link.label}
      className={clsx(baseClassNames, ativo && activeClassNames)}
    >
      {ativo && (
        <span
          className="absolute left-0 h-full w-1 rounded-r bg-blue-600 transition-all duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}
      <Icon
        className={clsx("w-6 transition-colors duration-200", {
          "text-blue-600": ativo,
        })}
      />
      <p
        className={clsx("hidden md:block transition-colors duration-200", {
          "text-blue-600 font-semibold": ativo,
        })}
      >
        {link.label}
      </p>
    </Link>
  );
});

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navLinksMenu.map((link) => (
        <NavLink
          key={link.path}
          link={link}
          ativo={isActive(pathname, link.path)}
        />
      ))}
    </>
  );
}
