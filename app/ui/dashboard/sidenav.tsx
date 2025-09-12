import { PowerIcon } from "@heroicons/react/24/outline";

import { signOut } from "@/auth";

import Link from "next/link";

import AcmeLogo from "@/app/ui/shared/acme-logo";

import NavLinks from "./nav-links";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SideNav() {
  return (
    <Card className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <CardContent className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 p-0">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 md:flex-none md:justify-start"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sair</div>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
