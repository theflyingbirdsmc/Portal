// import { Server } from 'http';
// import socketIo from 'socket.io';

// export function createSocketIo(router, port: number) {
//     // Pass the existing server instance from createServiceBuilder
//     const io = socketIo(router.server, { cors: { origin: '*' } });

//     // Add your Socket.IO routes or configuration here if needed
//     io.on('connection', (socket) => {
//         console.log('Client connected:', socket.id);

//         // Example: Emit a welcome message to the client
//         socket.emit('message', 'Welcome to the Socket.IO server!');
//     });

//     return io;
// }
