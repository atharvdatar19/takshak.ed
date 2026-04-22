import { APP_CONFIG } from "./config"

export function trackEvent(eventName, payload = {}) {
  if (!APP_CONFIG.analytics.enabled) return

  if (window?.gtag) {
    window.gtag("event", eventName, payload)
  }

  if (APP_CONFIG.analytics.debug) {

    console.info(`[analytics] ${eventName}`, payload)
  }
}
