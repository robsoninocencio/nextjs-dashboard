"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchMes({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("queryMes", term);
    } else {
      params.delete("queryMes");
    }
    const queryString = params.toString();
    const href = `${pathname}${queryString ? `?${queryString}` : ""}`;
    replace(href as Parameters<typeof replace>[0]);
  }, 300);

  return (
    <div className="flex flex-1 flex-col">
      <label
        htmlFor="searchMes"
        className="mb-1 text-sm font-medium text-gray-700"
      >
        Buscar Mes
      </label>
      <input
        id="searchMes"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("queryMes")?.toString()}
      />

      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
