type LogEntry = {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
};

const MAX_LOG_ENTRIES = 100;

class Logger {
  private logs: LogEntry[] = [];

  private addLog(
    level: LogEntry['level'],
    message: string,
    data?: unknown,
  ): void {
    const now = Date.now();

    // 新しいログエントリを追加
    this.logs.push({
      timestamp: now,
      level,
      message,
      data,
    });

    // 最大エントリ数を超えたら古いものを削除
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
    }

    // コンソールにも出力
    const consoleMethod =
      level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '');
  }

  info(message: string, data?: unknown): void {
    this.addLog('info', message, data);
  }

  error(message: string, data?: unknown): void {
    this.addLog('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.addLog('debug', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs].sort((a, b) => b.timestamp - a.timestamp);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsAsText(): string {
    const logs = this.getLogs();
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
