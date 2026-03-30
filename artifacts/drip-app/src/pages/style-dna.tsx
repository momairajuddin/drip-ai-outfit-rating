import { useStyleDna } from "@/hooks/use-style";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, Badge, Button } from "@/components/ui/core";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Lock, Fingerprint } from "lucide-react";
import { Link } from "wouter";

export default function StyleDNA() {
  const { data: dna, isLoading } = useStyleDna();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center py-32">
          <div className="animate-spin text-gold font-display text-4xl">●</div>
        </div>
      </AppLayout>
    );
  }

  if (!dna) return null;

  if (dna.locked) {
    const progress = (dna.totalOutfitsScanned / 5) * 100;
    return (
      <AppLayout>
        <div className="px-6 py-12 flex flex-col items-center text-center max-w-sm mx-auto min-h-[70vh] justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center mb-8 relative">
            <Lock className="w-8 h-8 text-muted-foreground absolute" />
            <svg className="w-full h-full -rotate-90">
              <circle cx="46" cy="46" r="44" className="stroke-muted fill-none stroke-[2]" />
              <circle cx="46" cy="46" r="44" className="stroke-gold fill-none stroke-[4] transition-all duration-1000" strokeDasharray="276" strokeDashoffset={276 - (276 * progress) / 100} />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-widest mb-4">DNA Locked</h1>
          <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
            Your Style DNA profile requires at least 5 scans to generate accurate insights. You need {dna.scansNeeded} more.
          </p>
          <Link href="/scan" className="w-full">
            <Button className="w-full" variant="gold">Scan Now</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const radarData = dna.avgScores ? [
    { subject: 'Fit', score: dna.avgScores.fit as number },
    { subject: 'Color', score: dna.avgScores.color as number },
    { subject: 'Coherence', score: dna.avgScores.coherence as number },
    { subject: 'Trend', score: dna.avgScores.trend as number },
    { subject: 'Signature', score: dna.avgScores.signature as number },
  ] : [];

  const trendData = dna.scoreTrend?.map((t, i) => ({
    scan: i + 1,
    score: t.score
  })) || [];

  return (
    <AppLayout>
      <div className="px-4 py-8">
        <header className="mb-10 px-2 border-b-2 border-border pb-4 flex items-center gap-3">
          <Fingerprint className="w-8 h-8 text-gold" />
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-widest">Style DNA</h1>
            <p className="text-muted-foreground font-body text-xs mt-1">Generated from {dna.totalOutfitsScanned} outfits</p>
          </div>
        </header>

        <div className="space-y-6 px-2">
          {/* Archetype */}
          <Card className="text-center py-10 border-gold/30 bg-gradient-to-b from-card to-gold/5">
            <span className="text-[10px] uppercase font-display tracking-[0.2em] text-gold mb-2 block">Dominant Archetype</span>
            <h2 className="font-display text-4xl font-bold">{dna.dominantArchetype}</h2>
            {dna.archetypePercentage && (
              <Badge variant="outline" className="mt-4 bg-background">{dna.archetypePercentage}% Match</Badge>
            )}
          </Card>

          {/* Radar Chart */}
          <Card className="p-4">
            <h3 className="font-display uppercase tracking-widest font-bold text-xs mb-4 text-center">Average Attributes</h3>
            <div className="h-64 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontFamily: 'Outfit' }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Color Palette */}
          {dna.topColors && dna.topColors.length > 0 && (
            <Card className="p-5">
              <h3 className="font-display uppercase tracking-widest font-bold text-xs mb-4">Signature Palette</h3>
              <div className="flex h-12 w-full border border-border">
                {dna.topColors.map((color, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </Card>
          )}

          {/* Trend Chart */}
          <Card className="p-4 pt-6">
            <h3 className="font-display uppercase tracking-widest font-bold text-xs mb-6 text-center">Score Evolution</h3>
            <div className="h-48 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="scan" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 0 }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: 'Outfit' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ fill: 'hsl(var(--gold))', strokeWidth: 0, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
