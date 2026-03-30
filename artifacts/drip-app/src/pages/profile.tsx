import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/app-layout";
import { Button, Card } from "@/components/ui/core";
import { LogOut, Crown, Mail, Calendar } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <header className="mb-10 text-center py-8 border-b-2 border-border">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center border-2 border-foreground mb-4">
            <span className="font-display text-3xl font-bold uppercase">{user.username.charAt(0)}</span>
          </div>
          <h1 className="font-display text-3xl font-bold">{user.username}</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground text-sm font-body">
            <Mail className="w-4 h-4" /> {user.email}
          </div>
        </header>

        <div className="space-y-4 mb-10">
          <Card className="flex items-center justify-between p-4 bg-muted/50 border-dashed">
            <div className="flex items-center gap-3">
              <Crown className={`w-5 h-5 ${user.isPremium ? 'text-gold' : 'text-muted-foreground'}`} />
              <span className="font-display uppercase tracking-widest text-xs font-bold">Status</span>
            </div>
            <span className={`font-bold font-body text-sm ${user.isPremium ? 'text-gold' : 'text-muted-foreground'}`}>
              {user.isPremium ? 'DRIP. PRO' : 'Standard'}
            </span>
          </Card>
          
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="font-display uppercase tracking-widest text-xs font-bold">Member Since</span>
            </div>
            <span className="text-sm font-body text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric'})}
            </span>
          </Card>
        </div>

        <Button onClick={logout} variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive hover:border-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>

        <div className="mt-12 text-center text-[10px] text-muted-foreground font-display uppercase tracking-[0.2em]">
          DRIP. OS Version 1.0<br/>
          Editorial Noir Edition
        </div>
      </div>
    </AppLayout>
  );
}
