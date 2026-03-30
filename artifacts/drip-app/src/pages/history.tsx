import { useScanHistory } from "@/hooks/use-scan";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, Badge } from "@/components/ui/core";
import { getScoreColor } from "@/lib/utils";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function History() {
  const { data, isLoading } = useScanHistory({ limit: 50 });

  return (
    <AppLayout>
      <div className="px-4 py-8">
        <header className="mb-8 px-2 flex justify-between items-end border-b-2 border-border pb-4">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest">Archive</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">{data?.stats?.totalScans || 0} Outfits Logged</p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20"><span className="animate-spin text-gold font-display text-2xl">●</span></div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-2">
            {data?.scans.map((scan, i) => (
              <motion.div 
                key={scan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/result/${scan.id}`}>
                  <Card className="p-0 border border-border/50 hover:border-foreground transition-colors group cursor-pointer relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={scan.imagePath} 
                      alt="Outfit" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                      <div className="flex-1 pr-2">
                        <Badge variant="outline" className="bg-black/50 backdrop-blur text-[9px] mb-1 px-1.5 py-0 border-white/20 truncate max-w-full inline-block">
                          {scan.styleArchetype}
                        </Badge>
                      </div>
                      <span className={`font-display text-2xl font-bold ${getScoreColor(scan.overallScore)}`}>
                        {scan.overallScore.toFixed(1)}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
            
            {data?.scans.length === 0 && (
              <div className="col-span-2 text-center py-20 border-2 border-dashed border-border">
                <p className="font-display uppercase tracking-widest text-muted-foreground">Archive Empty</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
