"use client";

import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

interface CustomCurrencyInputProps extends CurrencyInputProps {
  id: string;
  hasError?: boolean;
}

export default function CustomCurrencyInput({
  id,
  name,
  placeholder,
  defaultValue,
  "aria-describedby": ariaDescribedby,
  hasError,
  ...props
}: CustomCurrencyInputProps) {
  return (
    <div className="relative">
      <CurrencyInput
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-describedby={ariaDescribedby}
        className={`peer block w-full rounded-md border ${
          hasError ? "border-red-500" : "border-gray-200"
        } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
        intlConfig={{ locale: "pt-BR", currency: "BRL" }}
        prefix="R$ "
        decimalSeparator=","
        groupSeparator="."
        step={1}
        allowDecimals
        decimalsLimit={2}
        {...props}
      />
      <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
