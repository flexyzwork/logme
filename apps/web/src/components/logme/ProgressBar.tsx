import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0 ~ 100
  label?: string
}

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 text-sm font-medium text-muted-foreground">{label}</div>
      )}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full bg-primary transition-all')}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}