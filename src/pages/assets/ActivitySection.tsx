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
    <div className="space-y-2">
      {activity.slice(0, 10).map((entry, i) => (
        <div
          key={`${entry.timestamp}-${i}`}
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {entry.type}
            </span>
            <span className="text-sm text-card-foreground">{entry.token}</span>
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
