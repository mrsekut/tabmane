type LogEntry = {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
};

const LOG_STORAGE_KEY = 'tabmane_logs';
const MAX_LOG_ENTRIES = 100;

class Logger {
  private async getStoredLogs(): Promise<LogEntry[]> {
    try {
      const result = await chrome.storage.local.get(LOG_STORAGE_KEY);
      return result[LOG_STORAGE_KEY] || [];
    } catch (error) {
      console.error('Failed to get stored logs:', error);
      return [];
    }
  }

  private async saveLogs(logs: LogEntry[]): Promise<void> {
    try {
      await chrome.storage.local.set({ [LOG_STORAGE_KEY]: logs });
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  private async addLog(
    level: LogEntry['level'],
    message: string,
    data?: unknown,
  ): Promise<void> {
    const logs = await this.getStoredLogs();
    const now = Date.now();

    // 新しいログエントリを追加
    logs.push({
      timestamp: now,
      level,
      message,
      data,
    });

    // 最大エントリ数を超えたら古いものを削除
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.splice(0, logs.length - MAX_LOG_ENTRIES);
    }

    await this.saveLogs(logs);

    // コンソールにも出力
    const consoleMethod =
      level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '');
  }

  async info(message: string, data?: unknown): Promise<void> {
    await this.addLog('info', message, data);
  }

  async warn(message: string, data?: unknown): Promise<void> {
    await this.addLog('warn', message, data);
  }

  async error(message: string, data?: unknown): Promise<void> {
    await this.addLog('error', message, data);
  }

  async debug(message: string, data?: unknown): Promise<void> {
    await this.addLog('debug', message, data);
  }

  async getLogs(): Promise<LogEntry[]> {
    const logs = await this.getStoredLogs();
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  async clearLogs(): Promise<void> {
    try {
      await chrome.storage.local.remove(LOG_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  async getLogsAsText(): Promise<string> {
    const logs = await this.getLogs();
    return logs
      .map(log => {
        const timestamp = new Date(log.timestamp).toISOString();
        const dataStr = log.data
          ? `\n${JSON.stringify(log.data, null, 2)}`
          : '';
        return `[${timestamp}] [${log.level.toUpperCase()}] ${log.message}${dataStr}`;
      })
      .join('\n\n');
  }
}

export const logger = new Logger();
