import { useEffect, useState } from 'react';
import { logger } from '../../../shared/services/logger';

type LogEntry = {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
};

export const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const loadLogs = async () => {
    const storedLogs = await logger.getLogs();
    setLogs(storedLogs);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClearLogs = async () => {
    await logger.clearLogs();
    await loadLogs();
  };

  const handleCopyLogs = async () => {
    const logsText = await logger.getLogsAsText();
    try {
      await navigator.clipboard.writeText(logsText);
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(null), 2000);
    } catch (error) {
      console.error('Failed to copy logs:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP');
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return '#f44336';
      case 'warn':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'debug':
        return '#9e9e9e';
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true);
          loadLogs();
        }}
        style={{
          marginTop: 8,
          padding: '4px 8px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 4,
          fontSize: 10,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'center',
          color: '#999',
          textDecoration: 'underline',
        }}
      >
        debug logs ({logs.length})
      </button>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        fontSize: 11,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600 }}>Debug Logs</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {copyMessage && (
            <span
              style={{
                marginRight: 8,
                color: '#4CAF50',
                fontSize: 10,
              }}
            >
              {copyMessage}
            </span>
          )}
          <button
            onClick={handleCopyLogs}
            style={{
              padding: '4px 8px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 10,
              cursor: 'pointer',
              marginRight: 4,
            }}
          >
            Copy All
          </button>
          <button
            onClick={handleClearLogs}
            style={{
              padding: '4px 8px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 10,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: 4,
          padding: 8,
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#999', textAlign: 'center', padding: 16 }}>
            No logs available
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: 8,
                padding: 8,
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
                borderLeft: `3px solid ${getLevelColor(log.level)}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ color: getLevelColor(log.level), fontWeight: 600 }}
                >
                  [{log.level.toUpperCase()}]
                </span>
                <span style={{ color: '#666' }}>
                  {formatTimestamp(log.timestamp)}
                </span>
              </div>
              <div>{log.message}</div>
              {log.data && (
                <pre
                  style={{
                    marginTop: 4,
                    padding: 4,
                    backgroundColor: '#e9e9e9',
                    borderRadius: 2,
                    fontSize: 10,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
