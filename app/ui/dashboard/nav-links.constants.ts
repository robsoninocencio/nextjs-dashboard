import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { ComponentType, SVGProps } from "react";

// 🔗 Enum para rotas
export enum Paths {
  Dashboard = "/dashboard",
  Invoices = "/dashboard/invoices",
  Clientes = "/dashboard/clientes",
  Bancos = "/dashboard/bancos",
  Tipos = "/dashboard/tipos",
}

// 🔤 Labels para suporte a internacionalização futura
export const labels = {
  [Paths.Dashboard]: "Dashboard",
  [Paths.Invoices]: "Faturas",
  [Paths.Clientes]: "Clientes",
  [Paths.Bancos]: "Bancos",
  [Paths.Tipos]: "Tipos",
} as const;

// 🔧 Tipagem dos ícones
export type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// 🧠 Tipo dos links de navegação
export type NavLink = {
  label: string;
  path: string;
  icon: Icon;
};

// 🚀 Array dos links de navegação
export const navLinksMenu: readonly NavLink[] = [
  {
    label: labels[Paths.Dashboard],
    path: Paths.Dashboard,
    icon: HomeIcon,
  },
  {
    label: labels[Paths.Invoices],
    path: Paths.Invoices,
    icon: DocumentDuplicateIcon,
  },
  {
    label: labels[Paths.Clientes],
    path: Paths.Clientes,
    icon: UserGroupIcon,
  },
  {
    label: labels[Paths.Bancos],
    path: Paths.Bancos,
    icon: BanknotesIcon,
  },
  {
    label: labels[Paths.Tipos],
    path: Paths.Tipos,
    icon: BanknotesIcon,
  },
] as const;

// ✅ Função utilitária para validar paths
export const isValidPath = (value: string): value is Paths => {
  return Object.values(Paths).includes(value as Paths);
};
