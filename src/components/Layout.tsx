import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ChefHat, BookOpen, CalendarDays, MoreHorizontal, Tag, Settings, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

const primaryNavItems = [
  { path: '/', label: 'Inventory', icon: Package },
  { path: '/recipes', label: 'Recipes', icon: ChefHat },
  { path: '/meals', label: 'Log', icon: BookOpen },
  { path: '/planner', label: 'Planner', icon: CalendarDays },
];

const moreNavItems = [
  { path: '/tags', label: 'Manage Tags', icon: Tag, description: 'Create and organize recipe tags' },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp, description: 'View nutrition and cost insights' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Check if current path is in more items
  const isMoreActive = moreNavItems.some(item => item.path === location.pathname);

  const handleMoreItemClick = (path: string) => {
    navigate(path);
    setIsMoreOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-6 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="grid grid-cols-5">
          {primaryNavItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 text-xs transition-colors',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
          
          {/* More Tab */}
          <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex h-full flex-col items-center gap-1 px-2 py-2 text-xs transition-colors rounded-none',
                  isMoreActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="truncate">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader className="text-left">
                <SheetTitle>More Options</SheetTitle>
                <SheetDescription>
                  Additional tools and settings for your food tracking
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-4 py-6">
                {moreNavItems.map(({ path, label, icon: Icon, description }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Button
                      key={path}
                      variant={isActive ? "default" : "ghost"}
                      className="h-auto p-4 justify-start gap-4"
                      onClick={() => handleMoreItemClick(path)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          {description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}