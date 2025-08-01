import { ConsoleOverride, applyConsoleOverride, getConsoleLogs, clearConsoleLogs } from '../index';

describe('ConsoleOverride', () => {
  let consoleOverride: ConsoleOverride;
  let originalConsole: Console;

  beforeEach(() => {
    // Сохраняем оригинальный console
    originalConsole = { ...console };
    consoleOverride = new ConsoleOverride();
  });

  afterEach(() => {
    // Восстанавливаем оригинальный console
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });

  describe('apply', () => {
    it('должен переопределить console методы', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const infoSpy = jest.spyOn(console, 'info').mockImplementation();

      consoleOverride.apply();

      console.log('test');
      console.warn('warning');
      console.error('error');
      console.info('info');

      expect(logSpy).toHaveBeenCalledWith('test');
      expect(warnSpy).toHaveBeenCalledWith('warning');
      expect(errorSpy).toHaveBeenCalledWith('error');
      expect(infoSpy).toHaveBeenCalledWith('info');
    });

    it('должен сохранять логи в localStorage', () => {
      consoleOverride.apply();

      console.log('test message');
      console.warn('warning message');

      // Проверяем что localStorage.setItem был вызван
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      
      // Проверяем что getItem был вызван при получении логов
      consoleOverride.getLogs();
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('restore', () => {
    it('должен восстанавливать оригинальный console', () => {
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalInfo = console.info;

      consoleOverride.apply();
      consoleOverride.restore();

      expect(console.log).toBe(originalLog);
      expect(console.warn).toBe(originalWarn);
      expect(console.error).toBe(originalError);
      expect(console.info).toBe(originalInfo);
    });
  });

  describe('getLogs', () => {
    it('должен возвращать пустой массив если нет логов', () => {
      const logs = consoleOverride.getLogs();
      expect(logs).toEqual([]);
    });

    it('должен возвращать сохраненные логи', () => {
      consoleOverride.apply();
      console.log('test');
      console.error('error');

      // Проверяем что localStorage.setItem был вызван
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      
      // Проверяем что getItem был вызван при получении логов
      consoleOverride.getLogs();
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('clearLogs', () => {
    it('должен очищать логи из localStorage', () => {
      consoleOverride.apply();
      console.log('test');
      
      // Проверяем что localStorage.setItem был вызван
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      
      consoleOverride.clearLogs();
      
      // Проверяем что localStorage.removeItem был вызван
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });
});

describe('Экспортированные функции', () => {
  let originalConsole: Console;

  beforeEach(() => {
    originalConsole = { ...console };
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });

  it('applyConsoleOverride должен применять переопределение', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    
    applyConsoleOverride();
    console.log('test');
    
    expect(logSpy).toHaveBeenCalledWith('test');
  });

  it('getConsoleLogs должен возвращать логи', () => {
    applyConsoleOverride();
    console.log('test');
    
    // Проверяем что localStorage.setItem был вызван
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    
    // Проверяем что getItem был вызван при получении логов
    getConsoleLogs();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('clearConsoleLogs должен очищать логи', () => {
    applyConsoleOverride();
    console.log('test');
    
    // Проверяем что localStorage.setItem был вызван
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    
    clearConsoleLogs();
    
    // Проверяем что localStorage.removeItem был вызван
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
}); 