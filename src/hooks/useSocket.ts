import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (invoiceId?: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
        path: '/api/socketio',
        withCredentials: true,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    const socket = socketRef.current;

    if (invoiceId) {
      console.log('Joining invoice room:', invoiceId);
      socket.emit('joinInvoiceRoom', invoiceId);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [invoiceId]);

  return socketRef.current;
}; 