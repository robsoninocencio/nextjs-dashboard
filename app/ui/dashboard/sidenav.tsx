'use client';

import { PowerIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';

import AcmeLogo from '@/app/ui/shared/acme-logo';

import NavLinks from './nav-links';
import { useSidebar } from './sidebar-context';
import { handleSignOut } from './sign-out-action';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SideNav() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Card className='flex h-full flex-col px-3 py-4 md:px-2'>
      <div className='flex items-center justify-between mb-2'>
        <Link
          className={`flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40 ${
            isCollapsed ? 'md:w-12' : 'md:w-full'
          }`}
          href='/'
        >
          <div
            className={`text-white transition-all duration-300 ${
              isCollapsed ? 'w-8 md:w-12' : 'w-32 md:w-40'
            }`}
          >
            <AcmeLogo />
          </div>
        </Link>
        <Button
          variant='ghost'
          size='sm'
          onClick={toggleSidebar}
          className='hidden md:flex h-8 w-8 p-0 hover:bg-gray-100'
          title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {isCollapsed ? <Bars3Icon className='w-4 h-4' /> : <XMarkIcon className='w-4 h-4' />}
        </Button>
      </div>
      <CardContent className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 p-0'>
        <NavLinks />
        <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
        <form action={handleSignOut}>
          <Button
            type='submit'
            variant='ghost'
            className='flex h-[48px] w-full grow items-center justify-center gap-2 md:flex-none md:justify-start'
          >
            <PowerIcon className='w-6' />
            <div className='hidden md:block'>Sair</div>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
