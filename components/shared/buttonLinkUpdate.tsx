import Link, { LinkProps } from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ButtonLinkUpdateProps {
  href: LinkProps<string>['href'];
  filters?: Record<string, string>;
}

export function ButtonLinkUpdate({ href, filters }: ButtonLinkUpdateProps) {
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
    <Link href={finalHref} className='rounded-md border p-1 hover:bg-gray-100'>
      <PencilIcon className='w-4' />
    </Link>
  );
}
