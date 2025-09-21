import { SidebarProvider } from '@/app/ui/dashboard/sidebar-context';
import LayoutWrapper from './layout-wrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </SidebarProvider>
  );
}
