import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'socket.io-client';

let io: SocketIOServer | null = null;

export const initSocket = (server: NetServer) => {
  if (io) {
    console.log('Socket.IO already initialized');
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/api/socketio',
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinInvoiceRoom', (invoiceId: string) => {
      socket.join(`invoice-${invoiceId}`);
      console.log(`Client joined invoice room: invoice-${invoiceId}`);
    });

    socket.on('paymentConfirmed', (data: { invoiceId: string }) => {
      console.log('Payment confirmed for invoice:', data.invoiceId);
      io?.to(`invoice-${data.invoiceId}`).emit('paymentConfirmed', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}; 