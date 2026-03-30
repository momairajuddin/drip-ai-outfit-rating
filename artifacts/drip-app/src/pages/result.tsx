import { useRef } from "react";
import { useParams, Link } from "wouter";
import { useScanById } from "@/hooks/use-scan";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, Badge, Button } from "@/components/ui/core";
import { ScoreCounter } from "@/components/score-counter";
import { getScoreColor } from "@/lib/utils";
import { ChevronLeft, Share, Sparkles, TrendingUp, AlertCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";

export default function Result() {
  const { id } = useParams();
  const { data: scan, isLoading } = useScanById(id ? parseInt(id) : null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center py-32">
          <div className="animate-spin text-gold font-display text-4xl">●</div>
        </div>
      </AppLayout>
    );
  }

  if (!scan) return null;

  const radarData = [
    { subject: 'Fit', score: scan.scores.fit.score },
    { subject: 'Color', score: scan.scores.color.score },
    { subject: 'Coherence', score: scan.scores.styleCoherence.score },
    { subject: 'Trend', score: scan.scores.trendAlignment.score },
    { subject: 'Signature', score: scan.scores.signatureFactor.score },
  ];

  const handleShare = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, { 
          backgroundColor: '#000000',
          useCORS: true,
          scale: 2,
          onclone: (doc) => {
            const el = doc.querySelector('[data-share-card]') as HTMLElement;
            if (el) {
              el.style.backgroundColor = '#000000';
              el.style.color = '#F5F5F0';
            }
          }
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `drip-score-${scan.id}.png`;
        link.click();
      } catch (err) {
        console.error("Failed to generate image", err);
      }
    }
  };

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <Link href="/history" className="inline-flex items-center text-xs uppercase font-display tracking-widest text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div ref={cardRef} data-share-card className="bg-background" style={{ backgroundColor: '#000000' }}>
          {/* Hero Image & Score */}
          <div className="relative aspect-[4/5] border-2 border-border mb-8 overflow-hidden">
            <img src={scan.imagePath} alt="Scanned Fit" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <Badge variant="gold" className="mb-3">{scan.styleArchetype}</Badge>
                <div className="flex flex-wrap gap-2">
                  {scan.vibeTags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-background/80 backdrop-blur">#{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="block font-display uppercase tracking-[0.2em] text-[10px] text-muted-foreground mb-1">Final Score</span>
                <ScoreCounter 
                  score={scan.overallScore} 
                  className="font-display text-7xl font-bold leading-none"
                />
              </div>
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 px-2">
            
            {/* Radar Chart */}
            <motion.div variants={item}>
              <h3 className="font-display uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-border pb-2">Analysis Breakdown</h3>
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'Outfit' }} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mt-4">
                {Object.entries(scan.scores).map(([key, data]) => (
                  <div key={key} className="flex items-start justify-between border-b border-border/50 pb-2">
                    <div className="flex-1 pr-4">
                      <span className="font-display uppercase tracking-wider font-bold text-xs block mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">{data.detail}</p>
                    </div>
                    <span className={`font-display text-xl font-bold ${getScoreColor(data.score)}`}>{data.score}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Elements */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-gold/30 bg-gold/5">
                <div className="flex items-center gap-2 mb-2 text-gold">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-display uppercase tracking-widest font-bold text-xs">Best Element</span>
                </div>
                <p className="text-sm text-foreground font-body">{scan.bestElement}</p>
              </Card>
              <Card className="border-destructive/30 bg-destructive/5">
                <div className="flex items-center gap-2 mb-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-display uppercase tracking-widest font-bold text-xs">Needs Work</span>
                </div>
                <p className="text-sm text-foreground font-body">{scan.weakestElement}</p>
              </Card>
            </motion.div>

            {/* Upgrades */}
            <motion.div variants={item}>
              <h3 className="font-display uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-border pb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Upgrade Path
              </h3>
              <div className="space-y-4">
                {scan.upgrades.map((upgrade, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">Swap out</span>
                        <p className="text-sm line-through text-muted-foreground">{upgrade.swap}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">Score Impact</span>
                        <span className="text-gold font-bold font-display text-lg">+{upgrade.predictedScoreIncrease}</span>
                      </div>
                    </div>
                    <div className="bg-muted p-3 border-l-2 border-gold">
                      <span className="text-[10px] uppercase font-display tracking-widest text-gold block mb-1">Replace with</span>
                      <p className="text-sm font-bold">{upgrade.with}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center"><ShoppingBag className="w-3 h-3 mr-1"/> {upgrade.priceRange}</span>
                        {/* Fake search button for aesthetics */}
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(upgrade.searchQuery)}`} target="_blank" rel="noreferrer" className="text-xs uppercase font-display tracking-widest text-foreground hover:text-gold transition-colors border-b border-foreground hover:border-gold">Shop Similar</a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Celebrity Match */}
            <motion.div variants={item} className="mb-8">
              <Card className="bg-gradient-to-br from-card to-muted p-6 border-l-4 border-l-gold">
                <span className="font-display uppercase tracking-widest text-[10px] text-muted-foreground mb-1 block">Style Double</span>
                <h4 className="font-display text-2xl font-bold mb-2">{scan.celebrityMatch.name} <span className="text-gold text-lg ml-2">{scan.celebrityMatch.matchPercentage}% Match</span></h4>
                <p className="text-sm text-muted-foreground font-body">{scan.celebrityMatch.description}</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-8 flex gap-4 px-2">
          <Button onClick={handleShare} variant="outline" className="flex-1 border-dashed">
            <Share className="w-4 h-4 mr-2" /> Share Card
          </Button>
          <Link href="/scan" className="flex-1">
            <Button variant="primary" className="w-full">Next Scan</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
