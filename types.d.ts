declare global {
  interface Window {
    applyConsoleOverride: () => void
    restoreConsoleOverride: () => void
    getConsoleLogs: () => any[]
    clearConsoleLogs: () => void
  }
}

export {} 