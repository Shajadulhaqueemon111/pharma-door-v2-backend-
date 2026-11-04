import { Schema, model } from 'mongoose';
import { IAuditLog } from './audit.interface';

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userEmail: {
      type: String,
      default: 'system@pharmadoor.com',
    },
    userRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: 'Web Browser',
    },
  },
  {
    timestamps: true,
  },
);

const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;

