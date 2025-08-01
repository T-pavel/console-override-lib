# Console Override Lib

Библиотека для переопределения глобального `console` с автоматическим сохранением всех логов в `localStorage`.

## Установка

```bash
npm install console-override-lib
```

## Использование

### Базовое использование

```typescript
import { applyConsoleOverride, getConsoleLogs, clearConsoleLogs } from 'console-override-lib'

// Применяем переопределение console
applyConsoleOverride()

// Теперь все вызовы console.log, console.warn, console.error, console.info
// будут автоматически сохраняться в localStorage
console.log('Тестовое сообщение')
console.warn('Предупреждение')
console.error('Ошибка')

// Получаем все сохраненные логи
const logs = getConsoleLogs()
console.log(logs)

// Очищаем логи
clearConsoleLogs()
```

### Использование класса

```typescript
import { ConsoleOverride } from 'console-override-lib'

const consoleOverride = new ConsoleOverride()

// Применяем переопределение
consoleOverride.apply()

// Ваш код с логированием
console.log('Сообщение 1')
console.error('Ошибка 1')

// Получаем логи
const logs = consoleOverride.getLogs()

// Восстанавливаем оригинальный console
consoleOverride.restore()

// Очищаем логи
consoleOverride.clearLogs()
```

## API

### Функции

#### `applyConsoleOverride()`
Применяет переопределение глобального `console`. Все вызовы `console.log`, `console.warn`, `console.error`, `console.info` будут сохраняться в `localStorage`.

#### `restoreConsoleOverride()`
Восстанавливает оригинальный `console`.

#### `getConsoleLogs(): LogEntry[]`
Возвращает массив всех сохраненных логов из `localStorage`.

#### `clearConsoleLogs()`
Очищает все сохраненные логи из `localStorage`.

### Класс ConsoleOverride

#### `apply(): void`
Применяет переопределение console.

#### `restore(): void`
Восстанавливает оригинальный console.

#### `getLogs(): LogEntry[]`
Возвращает массив всех сохраненных логов.

#### `clearLogs(): void`
Очищает все сохраненные логи.

### Типы

#### `LogEntry`
```typescript
interface LogEntry {
  timestamp: string    // ISO строка времени
  level: 'log' | 'warn' | 'error' | 'info'
  message: string      // Строковое представление аргументов
  args: any[]          // Оригинальные аргументы
}
```

## Особенности

- **Автоматическое ограничение**: Максимум 1000 записей в localStorage
- **Безопасность**: Обработка ошибок при работе с localStorage
- **Совместимость**: Работает в браузерах с поддержкой localStorage
- **TypeScript**: Полная поддержка типов

## Примеры

### Отладка в продакшене

```typescript
// В development режиме
if (process.env.NODE_ENV === 'development') {
  applyConsoleOverride()
  
  // В конце сессии или при ошибке
  const logs = getConsoleLogs()
  // Отправляем логи на сервер для анализа
  sendLogsToServer(logs)
}
```

### Мониторинг ошибок

```typescript
applyConsoleOverride()

// Перехватываем ошибки
window.addEventListener('error', (event) => {
  const logs = getConsoleLogs()
  // Анализируем логи перед ошибкой
  analyzeLogsBeforeError(logs, event)
})
```

## Лицензия

MIT 