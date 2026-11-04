import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { setupSocketIO } from './app/socket/socket.handler';
import { DoctorService } from './app/modules/doctor/doctor.service';

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('MongoDB connected successfully');
    console.log('PORT:', config.port);

    // Seed default verified doctors if none exist
    try {
      await DoctorService.seedInitialDoctors();
      console.log('Default verified doctors check complete.');
    } catch (seedErr) {
      console.warn('Doctor seeding notice:', seedErr);
    }

    const httpServer = http.createServer(app);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'https://pharma-door-frontend.vercel.app',
          '*',
        ],
        methods: ['GET', 'POST', 'PATCH'],
        credentials: true,
      },
    });

    setupSocketIO(io);

    httpServer.listen(config.port, () => {
      console.log(`🚀 Server with Socket.IO listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Server startup error:', err);
  }
}

export default app;
