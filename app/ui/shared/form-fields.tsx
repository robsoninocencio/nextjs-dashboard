"use client";

import { ChangeEvent } from "react";
import CustomCurrencyInput from "@/app/ui/shared/currency-input";

// Componente para exibir erros de validação de um campo
export function InputError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="mt-2 text-sm text-red-500">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

// Componente genérico para campos de seleção (select)
export function SelectField({
  id,
  label,
  options,
  defaultValue,
  errors,
  onChange,
  icon: Icon,
}: {
  id: string;
  label: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  errors?: string[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ElementType;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          defaultValue={defaultValue ?? ""}
          aria-describedby={`${id}-error`}
          onChange={onChange}
          className={`peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${
            errors?.length ? "border-red-500" : "border-gray-200"
          }`}
        >
          <option value="" disabled>
            Selecione o {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {id === "mes" ? `${option.id} - ${option.name}` : option.name}
            </option>
          ))}
        </select>
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        <InputError errors={errors} />
      </div>
    </div>
  );
}

// Componente genérico para campos de moeda
export function CurrencyField({
  id,
  label,
  placeholder,
  defaultValue,
  errors,
}: {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string | number;
  errors?: string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <CustomCurrencyInput
          id={id}
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-describedby={`${id}-error`}
          hasError={!!errors?.length}
        />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        <InputError errors={errors} />
      </div>
    </div>
  );
}
