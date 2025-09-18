import logger from '../utils/logger';

// Only show this button in development mode
const isDev = process.env.NODE_ENV !== 'production';

const DownloadLogsButton = () => {
    if (!isDev) return null;
    return (
        <button
            style={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 9999,
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '10px 18px',
                fontSize: 14,
                cursor: 'pointer',
                opacity: 0.7,
            }}
            onClick={() => logger.downloadLogs()}
            title="Download app logs (developer only)"
        >
            ⬇️ Download Logs
        </button>
    );
};

export default DownloadLogsButton;
