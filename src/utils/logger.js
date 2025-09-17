
// Usage: import logger from './utils/logger'; logger.log('message')
import pino from 'pino';

// OpenObserve config (replace with your actual endpoint and API key)
const OPENOBSERVE_URL = 'https://<your-openobserve-endpoint>/api/default/_json';
const OPENOBSERVE_API_KEY = '<your-api-key>';

const pinoLogger = pino({
    browser: {
        asObject: true
    },
    level: 'info',
});

const isProduction = process.env.NODE_ENV === 'production';

function storeLogLocally(level, ...args) {
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push({
        level,
        args,
        ts: new Date().toISOString(),
    });
    localStorage.setItem('appLogs', JSON.stringify(logs));
}

async function sendToOpenObserve(level, msg, extra) {
    try {
        await fetch(OPENOBSERVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENOBSERVE_API_KEY}`,
            },
            body: JSON.stringify({
                level,
                msg,
                ...extra,
                ts: new Date().toISOString(),
            }),
        });
    } catch (err) {
        // Fallback to console if OpenObserve fails
        console.error('[OpenObserveError]', err);
    }
}

function downloadLogs() {
    const logs = localStorage.getItem('appLogs') || '[]';
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const logger = {
    log: (...args) => {
        pinoLogger.info(...args);
        if (isProduction) {
            sendToOpenObserve('info', args[0], { args: args.slice(1) });
        } else {
            storeLogLocally('info', ...args);
        }
    },
    error: (...args) => {
        pinoLogger.error(...args);
        if (isProduction) {
            sendToOpenObserve('error', args[0], { args: args.slice(1) });
        } else {
            storeLogLocally('error', ...args);
        }
    },
    warn: (...args) => {
        pinoLogger.warn(...args);
        if (isProduction) {
            sendToOpenObserve('warn', args[0], { args: args.slice(1) });
        } else {
            storeLogLocally('warn', ...args);
        }
    },
    downloadLogs,
};

export default logger;
