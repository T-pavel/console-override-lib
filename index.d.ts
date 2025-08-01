/**
 * Переопределение глобального console с сохранением в localStorage
 */

export interface LogEntry {
  timestamp: string
  level: 'log' | 'warn' | 'error' | 'info'
  message: string
  args: any[]
}

export class ConsoleOverride {
  private originalConsole: Console
  private storageKey: string
  private maxEntries: number

  constructor()

  /**
   * Применяет переопределение console
   */
  apply(): void

  /**
   * Восстанавливает оригинальный console
   */
  restore(): void

  /**
   * Получить логи из localStorage
   */
  getLogs(): LogEntry[]

  /**
   * Очистить логи из localStorage
   */
  clearLogs(): void
}

/**
 * Применяет переопределение глобального console
 */
export declare function applyConsoleOverride(): void

/**
 * Восстанавливает оригинальный console
 */
export declare function restoreConsoleOverride(): void

/**
 * Получить логи из localStorage
 */
export declare function getConsoleLogs(): LogEntry[]

/**
 * Очистить логи из localStorage
 */
export declare function clearConsoleLogs(): void 