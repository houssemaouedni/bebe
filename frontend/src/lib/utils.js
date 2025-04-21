/**
 * Combines multiple class names into a single string
 * @param {string[]} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Format a date to a locale string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return new Date(date).toLocaleDateString("fr-FR", { ...defaultOptions, ...options })
}

/**
 * Format a time to a locale string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
