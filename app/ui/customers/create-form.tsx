"use client";

import Link from "next/link";
import {
  PhotoIcon,
  UserCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/app/ui/shared/button";

import {
  createCustomer,
  CreateCustomerState,
} from "@/app/lib/customers/actions";

function SubmitCustomerButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Cadastrando..." : "Cadastrar Cliente"}
    </Button>
  );
}

export default function CustomerCreateForm() {
  // Estado inicial - mesmo formato do retorno da action createCustomer
  const initialState: CreateCustomerState = {
    errors: { name: [], email: [], image: [] },
    message: "",
  };

  // useActionState associa o estado ao resultado da action createCustomer
  const [state, formAction] = useActionState(createCustomer, initialState);

  return (
    <form action={formAction} encType="multipart/form-data" noValidate>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Image */}
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Escolha sua imagem
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="image-error"
            />
            <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Cliente:
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nome do cliente"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              defaultValue={state.submittedData?.name}
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email:
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email do cliente"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
              defaultValue={state.submittedData?.email}
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Form message */}
        {state.message && (
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 text-sm text-red-700"
          >
            {state.message}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <SubmitCustomerButton />
      </div>
    </form>
  );
}
