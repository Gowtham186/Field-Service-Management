import { io } from 'socket.io-client';


const socket = io('http://localhost:4500');

socket.on('connect', () => {
    console.log(`Connected to WebSocket server with ID: ${socket.id}`);
});

socket.on('new-service-request', (data) => {
    console.log('New service request received:', data);
});


socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});
