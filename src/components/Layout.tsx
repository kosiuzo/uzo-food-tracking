import { ReactNode, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, ChefHat, BookOpen, Menu, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DebugPanel } from '@/components/DebugPanel';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const baseNavigationSections: NavSection[] = [
  {
    title: 'Daily Tracking',
    items: [
      {
        path: '/',
        label: 'Inventory',
        icon: Package,
        description: 'Monitor what ingredients you have on hand.',
      },
      {
        path: '/meals',
        label: 'Log',
        icon: BookOpen,
        description: 'Capture meals, leftovers, and quick notes.',
      },
    ],
  },
  {
    title: 'Planning & Inspiration',
    items: [
      {
        path: '/recipes',
        label: 'Recipes',
        icon: ChefHat,
        description: 'Build new dishes and reuse favorites.',
      },
      {
        path: '/planner',
        label: 'Planner',
        icon: CalendarDays,
        description: 'Organize your upcoming meals and prep.',
      },
    ],
  },
];

const additionalNavItems: NavItem[] = [
  // Tags are now managed via a button on the Recipe page.
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationSections = useMemo(() => {
    const sections = [...baseNavigationSections];

    if (additionalNavItems.length > 0) {
      sections.push({
        title: 'More Tools',
        items: additionalNavItems,
      });
    }

    return sections;
  }, []);

  const allNavItems = useMemo(
    () => navigationSections.flatMap(section => section.items),
    [navigationSections]
  );

  const activeNavItem = allNavItems.find(item => {
    if (item.path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(item.path);
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-3 px-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px]"
              aria-label="Primary navigation"
            >
              <SheetHeader className="text-left">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Quickly jump between the tools you use most.
                </SheetDescription>
              </SheetHeader>

              <nav className="mt-6 space-y-6" role="navigation">
                {navigationSections.map(section => (
                  <div key={section.title} className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {section.title}
                    </p>
                    <div className="space-y-1">
                      {section.items.map(({ path, label, icon: Icon, description }) => {
                        const isActive = path === '/'
                          ? location.pathname === '/'
                          : location.pathname.startsWith(path);

                        return (
                          <Button
                            key={path}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                              isActive && 'shadow-sm'
                            )}
                            onClick={() => handleNavigate(path)}
                          >
                            <div
                              className={cn(
                                'flex h-9 w-9 items-center justify-center rounded-lg border',
                                isActive
                                  ? 'border-primary/40 bg-primary/10'
                                  : 'border-border'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium leading-tight">{label}</div>
                              {description && (
                                <p className="text-xs text-muted-foreground">
                                  {description}
                                </p>
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">
              {activeNavItem?.label ?? 'Uzo Food Tracking'}
            </span>
            {activeNavItem?.description && (
              <span className="text-xs text-muted-foreground">
                {activeNavItem.description}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {children}
      </main>

      {/* Debug Panel - only shows in development */}
      <DebugPanel />
    </div>
  );
}
