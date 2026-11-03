import { Server, Socket } from 'socket.io';
import { ConsultationService } from '../modules/consultation/consultation.service';

export const setupSocketIO = (io: Server) => {
  const roomUsers = new Map<string, Set<string>>();

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join Room
    socket.on('join-room', async (data: { roomId: string; user: { id: string; name: string; role: 'patient' | 'doctor' | 'admin' } }) => {
      const { roomId, user } = data;
      if (!roomId) return;

      socket.join(roomId);

      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
      }
      roomUsers.get(roomId)?.add(socket.id);

      console.log(`👤 User ${user?.name || socket.id} (${user?.role}) joined room: ${roomId}`);

      // Notify others in the room
      socket.to(roomId).emit('user-connected', {
        socketId: socket.id,
        user,
      });

      // Send confirmation to the joining user
      socket.emit('room-joined', {
        roomId,
        peerCount: roomUsers.get(roomId)?.size || 1,
      });
    });

    // WebRTC Signaling: Offer
    socket.on('signal-offer', (data: { roomId: string; sdp: any; user?: any }) => {
      const { roomId, sdp, user } = data;
      socket.to(roomId).emit('signal-offer', {
        sdp,
        callerSocketId: socket.id,
        user,
      });
    });

    // WebRTC Signaling: Answer
    socket.on('signal-answer', (data: { roomId: string; sdp: any }) => {
      const { roomId, sdp } = data;
      socket.to(roomId).emit('signal-answer', {
        sdp,
        responderSocketId: socket.id,
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('signal-ice-candidate', (data: { roomId: string; candidate: any }) => {
      const { roomId, candidate } = data;
      socket.to(roomId).emit('signal-ice-candidate', {
        candidate,
        fromSocketId: socket.id,
      });
    });

    // Media toggle notifications
    socket.on('toggle-audio', (data: { roomId: string; enabled: boolean; user?: any }) => {
      socket.to(data.roomId).emit('peer-audio-toggled', {
        socketId: socket.id,
        enabled: data.enabled,
        user: data.user,
      });
    });

    socket.on('toggle-video', (data: { roomId: string; enabled: boolean; user?: any }) => {
      socket.to(data.roomId).emit('peer-video-toggled', {
        socketId: socket.id,
        enabled: data.enabled,
        user: data.user,
      });
    });

    // Real-time Chat
    socket.on('send-chat-message', async (data: { roomId: string; message: string; senderName: string; senderRole: 'patient' | 'doctor' | 'admin'; senderId: string }) => {
      const { roomId, message, senderName, senderRole, senderId } = data;
      const messagePayload = {
        senderId: senderId || socket.id,
        senderName: senderName || 'User',
        senderRole: senderRole || 'patient',
        message,
        timestamp: new Date(),
      };

      try {
        await ConsultationService.addMessage(roomId, messagePayload);
      } catch (err) {
        console.error('Error saving chat message to DB:', err);
      }

      // Broadcast to room including sender
      io.to(roomId).emit('receive-chat-message', messagePayload);
    });

    // Real-time E-Prescription Issued by Doctor
    socket.on('doctor-issue-prescription', async (data: { roomId: string; prescription: any }) => {
      const { roomId, prescription } = data;
      try {
        await ConsultationService.savePrescription(roomId, prescription);
      } catch (err) {
        console.error('Error saving prescription from socket:', err);
      }

      // Broadcast to all participants in the consultation room
      io.to(roomId).emit('prescription-issued', prescription);
    });

    // End Consultation Call
    socket.on('end-call', async (data: { roomId: string; endedBy?: string }) => {
      const { roomId, endedBy } = data;
      try {
        const consultation = await ConsultationService.getConsultationByRoomId(roomId);
        if (consultation && consultation.status !== 'completed') {
          await ConsultationService.updateStatus(consultation._id.toString(), 'completed');
        }
      } catch (err) {
        console.error('Error updating status on end-call:', err);
      }

      io.to(roomId).emit('call-ended', {
        endedBy: endedBy || 'Participant',
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          roomUsers.get(room)?.delete(socket.id);
          if (roomUsers.get(room)?.size === 0) {
            roomUsers.delete(room);
          }
          socket.to(room).emit('user-disconnected', {
            socketId: socket.id,
          });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

