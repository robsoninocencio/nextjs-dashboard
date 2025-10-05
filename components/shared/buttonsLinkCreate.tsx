import Link, { LinkProps } from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface ButtonLinkCreateProps {
  href: LinkProps<string>['href'];
  children: React.ReactNode;
  filters?: Record<string, string>;
}

export function ButtonLinkCreate({ href, children, filters }: ButtonLinkCreateProps) {
  let finalHref = href;

  if (filters && typeof href === 'string') {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    if (params.toString()) {
      finalHref = `${href}?${params.toString()}`;
    }
  }

  return (
    <Button asChild>
      <Link href={finalHref}>
        <span className='hidden md:block'>{children}</span> <PlusIcon className='h-5 md:ml-4' />
      </Link>
    </Button>
  );
}
