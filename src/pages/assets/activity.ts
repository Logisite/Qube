const ACTIVITY_KEY = "assets-activity"

export interface ActivityEntry {
  type: "claim" | "wrap" | "unwrap" | "decrypt"
  token: string
  amount?: string
  timestamp: number
}

export function loadActivity(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ActivityEntry[]
  } catch {
    return []
  }
}

export function saveActivity(entry: ActivityEntry): void {
  const activity = loadActivity()
  activity.unshift(entry)
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(0, 50)))
}
