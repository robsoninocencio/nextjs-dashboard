'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar-context';

export function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={toggleSidebar}
      className='flex items-center gap-2'
      title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
    >
      <Bars3Icon className='w-4 h-4' />
      <span className='hidden sm:inline'>{isCollapsed ? 'Mostrar Menu' : 'Ocultar Menu'}</span>
    </Button>
  );
}
