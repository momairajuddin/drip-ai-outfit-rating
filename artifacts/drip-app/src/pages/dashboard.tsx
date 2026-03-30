import { useAuth } from "@/hooks/use-auth";
import { useScanHistory } from "@/hooks/use-scan";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, Badge, Button } from "@/components/ui/core";
import { getScoreColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Camera } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: history } = useScanHistory({ limit: 3 });

  if (!user) return null;

  return (
    <AppLayout>
      <div className="px-6 py-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="font-display uppercase tracking-[0.2em] text-xs text-muted-foreground mb-1">Welcome back,</h2>
            <h1 className="font-display text-3xl font-bold">{user.username}</h1>
          </div>
          <div className="font-display italic text-2xl text-gold">DRIP.</div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <Card className="flex flex-col justify-center items-center py-8">
            <span className="font-display uppercase tracking-[0.1em] text-[10px] text-muted-foreground mb-2">Avg Score</span>
            <span className={`font-display text-4xl font-bold ${getScoreColor(user.avgScore)}`}>
              {user.avgScore > 0 ? user.avgScore.toFixed(1) : '-'}
            </span>
          </Card>
          <Card className="flex flex-col justify-center items-center py-8">
            <span className="font-display uppercase tracking-[0.1em] text-[10px] text-muted-foreground mb-2">High Score</span>
            <span className={`font-display text-4xl font-bold ${getScoreColor(user.highestScore)}`}>
              {user.highestScore > 0 ? user.highestScore.toFixed(1) : '-'}
            </span>
          </Card>
        </div>

        <Link href="/scan" className="block mb-12">
          <Button variant="gold" size="lg" className="w-full h-16 text-lg group">
            <Camera className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
            Analyze New Fit
          </Button>
        </Link>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display uppercase tracking-[0.2em] text-sm font-bold">Recent Archive</h3>
            <Link href="/history" className="text-xs uppercase font-display tracking-widest text-muted-foreground hover:text-foreground">View All</Link>
          </div>

          <div className="space-y-4">
            {history?.scans && history.scans.length > 0 ? (
              history.scans.map((scan, i) => (
                <motion.div 
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/result/${scan.id}`}>
                    <Card className="p-0 overflow-hidden hover:border-foreground transition-colors group flex h-28 cursor-pointer">
                      <div className="w-24 h-full bg-muted overflow-hidden">
                        <img 
                          src={scan.imagePath} 
                          alt="Outfit" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <Badge variant="outline" className="mb-2">{scan.styleArchetype || "Unclassified"}</Badge>
                          <div className="text-xs text-muted-foreground font-body">
                            {new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                          </div>
                        </div>
                        <div className={`font-display text-2xl font-bold text-right ${getScoreColor(scan.overallScore)}`}>
                          {scan.overallScore.toFixed(1)}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-border border-dashed">
                <p className="text-muted-foreground font-body text-sm">No outfits scanned yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
