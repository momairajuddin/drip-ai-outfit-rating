import { Link, useLocation } from "wouter";
import { Camera, Home, User, BarChart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: Camera, label: "Scan", href: "/scan", isPrimary: true },
    { icon: BarChart, label: "DNA", href: "/dna" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col max-w-md mx-auto relative overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-background/80 backdrop-blur-xl border-t-2 border-border px-6 py-4 flex justify-between items-center relative">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              if (item.isPrimary) {
                return (
                  <Link href={item.href} key={item.label} className="relative -top-8 flex flex-col items-center group outline-none">
                    <div className="w-16 h-16 rounded-full bg-background border-2 border-gold flex items-center justify-center text-gold shadow-[0_0_20px_rgba(201,168,76,0.15)] group-hover:bg-gold group-hover:text-background transition-colors duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-display uppercase text-[10px] tracking-[0.2em] font-bold mt-2 text-gold">Scan</span>
                  </Link>
                );
              }

              return (
                <Link 
                  href={item.href} 
                  key={item.label} 
                  className={cn(
                    "flex flex-col items-center gap-1 transition-colors duration-300 outline-none",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="font-display uppercase text-[9px] tracking-[0.15em] font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
