import io from 'socket.io-client';

const SOCKET_URL = 'https://crypto-tracker-api-production.up.railway.app'; // Railway production backend
const CONNECTION_TIMEOUT = 10000; // 10 seconds

class SocketService {
    socket = null;
    connectionTimeout = null;
    onConnectionError = null;

    connect(onError) {
        this.onConnectionError = onError;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
            timeout: 10000,
        });

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
            if (this.socket && !this.socket.connected) {
                console.error('Socket connection timeout');
                if (this.onConnectionError) {
                    this.onConnectionError('Connection timeout. Please check if the server is running.');
                }
            }
        }, CONNECTION_TIMEOUT);

        this.socket.on('connect', () => {
            console.log('✓ Socket connected successfully');
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
                this.connectionTimeout = null;
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            if (this.onConnectionError) {
                this.onConnectionError(`Connection failed: ${error.message}`);
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    disconnect() {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    isConnected() {
        return this.socket && this.socket.connected;
    }
}

export default new SocketService();
