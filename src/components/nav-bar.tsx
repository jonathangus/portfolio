import { cn } from '@/lib/utils';

const navItems = [
  {
    href: 'https://github.com/jonathangus',
    label: 'Github',
    external: true,
  },
  {
    href: 'https://x.com/0xheavydev',
    label: 'X',
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/jonathan-Ljungek/',
    label: 'Linkedin',
    external: true,
  },

  {
    href: 'https://www.Ljungek.work/resume.pdf',
    label: 'Resume',
  },
  {
    href: 'mailto:jonathan@Ljungek.work',
    label: 'Mail',
  },
];

export function Navbar() {
  return (
    <nav className="md:sticky z-20 md:top-0 py-4 md:py-24 md:pt-[80px] flex flex-col h-full w-fit">
      <ul className="flex flex-row md:flex-col flex-wrap justify-start space-x-4 md:space-x-0 md:space-y-2 text-sm text-muted-foreground w-fit">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={cn(
                'click-action block transition-colors hover:text-foreground'
              )}
              target={item.external ? '_blank' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
