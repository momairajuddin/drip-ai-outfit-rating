import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ScoreCounterProps {
  score: number;
  duration?: number;
  className?: string;
}

export function ScoreCounter({ score, duration = 1500, className }: ScoreCounterProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const endScore = score;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayScore(endScore * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, duration]);

  const colorClass = getScoreColor(score);

  return (
    <span className={cn(colorClass, className)}>
      {displayScore.toFixed(1)}
    </span>
  );
}
