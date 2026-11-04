import { Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  user?: Types.ObjectId;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  target: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

