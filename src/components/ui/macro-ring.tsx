import { cn } from '@/lib/utils';

interface MacroRingProps {
  label: string;
  value: number;
  totalMacros: number; // Sum of all three macros (protein + carbs + fat)
  color: 'protein' | 'carbs' | 'fat';
  className?: string;
}

const colorMap = {
  protein: {
    stroke: 'hsl(var(--macro-protein))',
    text: 'text-[hsl(var(--macro-protein))]',
    bg: 'bg-blue-100',
  },
  carbs: {
    stroke: 'hsl(var(--macro-carbs))',
    text: 'text-[hsl(var(--macro-carbs))]',
    bg: 'bg-orange-100',
  },
  fat: {
    stroke: 'hsl(var(--macro-fat))',
    text: 'text-[hsl(var(--macro-fat))]',
    bg: 'bg-purple-100',
  },
};

export function MacroRing({ label, value, totalMacros, color, className }: MacroRingProps) {
  // Calculate percentage of this macro relative to total macros consumed
  const percentage = totalMacros > 0 ? (value / totalMacros) * 100 : 0;
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const colors = colorMap[color];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('text-2xl font-bold', colors.text)}>
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(value)}g
          </div>
        </div>
      </div>
      {/* Label */}
      <div className="text-sm font-medium text-center">{label}</div>
    </div>
  );
}
