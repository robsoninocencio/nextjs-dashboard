"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SearchCliente({
  placeholder,
}: {
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("queryCliente", term);
    } else {
      params.delete("queryCliente");
    }

    const queryString = params.toString();
    const href = `${pathname}${queryString ? `?${queryString}` : ""}`;
    replace(href as Parameters<typeof replace>[0]);
  }, 300);

  return (
    <div className="flex flex-1 flex-col">
      <Label
        htmlFor="searchCliente"
        className="mb-1 text-sm font-medium text-gray-700"
      >
        Buscar Cliente
      </Label>
      <div className="relative flex flex-1 flex-shrink-0">
        <Input
          id="searchCliente"
          className="peer pl-10"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("queryCliente")?.toString()}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
  );
}
