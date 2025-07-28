import type { Revenue } from "./dashboard/definitions";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatNumberWithDot = (amount: string): string | undefined => {
  // Remove caracteres não numéricos, exceto vírgula e ponto
  const cleanedAmount = amount.replace(/[^\d,.]/g, "").replace(",", ".");

  // Converte para número e verifica se é válido
  const parsedAmount = parseFloat(cleanedAmount);
  if (isNaN(parsedAmount)) {
    return undefined;
  }

  // Multiplica por 100 para centavos, arredonda e converte para string
  return Math.round(parsedAmount * 100).toString();
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "pt-BR"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToYear = (dateStr: string, locale: string = "pt-BR") => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToMonth = (
  dateStr: string,
  locale: string = "pt-BR"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// Converte número para um número específico de casas decimais com vírgula e ponto como separador de milhar
export const formatToDecimals = (value: number, decimals: number): string => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0," + "0".repeat(decimals);
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
