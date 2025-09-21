'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/app/ui/dashboard/sidebar-context';
import SideNav from '@/app/ui/dashboard/sidenav';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div
        className={`w-full flex-none transition-all duration-300 ${
          isCollapsed ? 'md:w-16' : 'md:w-64'
        }`}
      >
        <SideNav />
      </div>
      <div className='flex-grow p-2 md:overflow-y-auto md:p-4'>{children}</div>
    </div>
  );
}
