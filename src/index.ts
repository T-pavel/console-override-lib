/**
 * Переопределение глобального console с сохранением в localStorage
 */

interface LogEntry {
  timestamp: string
  level: 'log' | 'warn' | 'error' | 'info'
  message: string
  args: any[]
}

class ConsoleOverride {
  private originalConsole: Console
  private storageKey = 'console_logs'
  private maxEntries = 1000

  constructor() {
    this.originalConsole = { ...console }
  }

  /**
   * Применяет переопределение console
   */
  apply(): void {
    const self = this

    // Сохраняем оригинальные методы
    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    const originalInfo = console.info

    // Переопределяем console.log
    console.log = function (...args: any[]) {
      self.saveToLocalStorage('log', args)
      originalLog.apply(console, args)
    }

    // Переопределяем console.warn
    console.warn = function (...args: any[]) {
      self.saveToLocalStorage('warn', args)
      originalWarn.apply(console, args)
    }

    // Переопределяем console.error
    console.error = function (...args: any[]) {
      self.saveToLocalStorage('error', args)
      originalError.apply(console, args)
    }

    // Переопределяем console.info
    console.info = function (...args: any[]) {
      self.saveToLocalStorage('info', args)
      originalInfo.apply(console, args)
    }
  }

  /**
   * Восстанавливает оригинальный console
   */
  restore(): void {
    console.log = this.originalConsole.log
    console.warn = this.originalConsole.warn
    console.error = this.originalConsole.error
    console.info = this.originalConsole.info
  }

  /**
   * Сохраняет лог в localStorage
   */
  private saveToLocalStorage(level: LogEntry['level'], args: any[]): void {
    try {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message: args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
          )
          .join(' '),
        args: args.map((arg) =>
          typeof arg === 'object' ? JSON.parse(JSON.stringify(arg)) : arg,
        ),
      }

      const existingLogs = localStorage.getItem(this.storageKey)
      const logs: LogEntry[] = existingLogs ? JSON.parse(existingLogs) : []

      logs.push(logEntry)

      // Ограничиваем количество записей
      if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries)
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs))
    } catch (error) {
      // Если не удалось сохранить, используем оригинальный console
      this.originalConsole.error(
        'Ошибка при сохранении лога в localStorage:',
        error,
      )
    }
  }

  /**
   * Получить логи из localStorage
   */
  getLogs(): LogEntry[] {
    try {
      const existingLogs = localStorage.getItem(this.storageKey)

      return existingLogs ? JSON.parse(existingLogs) : []
    } catch (error) {
      this.originalConsole.error(
        'Ошибка при получении логов из localStorage:',
        error,
      )

      return []
    }
  }

  /**
   * Очистить логи из localStorage
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('[ConsoleOverride] Логи очищены')
    } catch (error) {
      this.originalConsole.error('Ошибка при очистке логов:', error)
    }
  }
}

// Создаем глобальный экземпляр
const consoleOverride = new ConsoleOverride()

// Экспортируем функции для удобства
export const applyConsoleOverride = () => consoleOverride.apply()
export const restoreConsoleOverride = () => consoleOverride.restore()
export const getConsoleLogs = () => consoleOverride.getLogs()
export const clearConsoleLogs = () => consoleOverride.clearLogs()

export { ConsoleOverride }
export type { LogEntry } 