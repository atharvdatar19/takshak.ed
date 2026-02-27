export function formatDate(value) {
  if (!value) return "NA"
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function getDaysLeft(value) {
  if (!value) return null
  return Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
}

export function isWithinRange(value, days) {
  const dayDelta = getDaysLeft(value)
  return dayDelta !== null && dayDelta >= 0 && dayDelta <= days
}
