import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocket } from './src/lib/socket.js';
import mongoose from 'mongoose';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Connect to MongoDB first
await mongoose.connect(process.env.MONGODB_URI!);
console.log('Connected to MongoDB');

const server = createServer((req, res) => {
  try {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  } catch (err) {
    console.error('Error occurred handling request:', err);
    res.statusCode = 500;
    res.end('Internal server error');
  }
});

// Initialize Socket.IO before Next.js
const io = initSocket(server);
console.log('Socket.IO initialized');

// Then prepare Next.js
app.prepare().then(() => {
  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 