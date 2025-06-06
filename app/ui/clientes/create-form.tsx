"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  PhotoIcon,
  UserCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/app/ui/shared/button";

import { createCliente, CreateClienteFormState } from "@/lib/clientes/actions";

function SubmitClienteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Cadastrando..." : "Cadastrar Cliente"}
    </Button>
  );
}

function InputError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <>
      {errors.map((error) => (
        <p key={error} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ))}
    </>
  );
}

export default function ClienteCreateForm() {
  // Estado inicial - mesmo formato do retorno da action createCliente
  const initialState: CreateClienteFormState = {
    errors: { name: [], email: [] },
    message: "",
  };

  // useActionState associa o estado ao resultado da action createCliente
  const [state, formAction] = useActionState(createCliente, initialState);

  return (
    <form action={formAction} noValidate>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Cliente Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Cliente
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nome do cliente"
                defaultValue={state.submittedData?.name}
                aria-describedby="name-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.name?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="name-errorr" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.name} />
          </div>
        </div>

        {/* Cliente Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email do cliente"
                defaultValue={state.submittedData?.email}
                aria-describedby="email-error"
                className={`peer block w-full rounded-md border ${
                  state.errors?.email?.length
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="email-error" aria-live="polite" aria-atomic="true">
            <InputError errors={state.errors?.email} />
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
          href={{ pathname: "/dashboard/clientes" }}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <SubmitClienteButton />
      </div>
    </form>
  );
}
