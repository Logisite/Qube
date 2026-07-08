import { useState } from "react"
import { loadActivity } from "./activity"

export function ActivitySection() {
  const [activity] = useState(() => loadActivity())

  if (activity.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No activity yet. Claim tokens to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {activity.slice(0, 10).map((entry, i) => (
        <div
          key={`${entry.timestamp}-${i}`}
          className="flex items-center justify-between px-2 py-3 hover:bg-white/[0.02] rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground w-16">
              {entry.type}
            </span>
            <span className="text-sm text-card-foreground font-medium">{entry.token}</span>
            {entry.amount && (
              <span className="text-xs text-muted-foreground">{entry.amount}</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}
