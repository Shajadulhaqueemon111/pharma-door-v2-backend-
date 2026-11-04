import AuditLog from './audit.model';

export const createAuditLog = async ({
  userId,
  userName = 'Anonymous User',
  userEmail = 'user@pharmadoor.com',
  userRole = 'user',
  action,
  target,
  targetId,
  details = '',
  ipAddress = '127.0.0.1',
  userAgent = 'Web Client',
}: {
  userId?: any;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  target: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  try {
    return await AuditLog.create({
      user: userId,
      userName,
      userEmail,
      userRole,
      action,
      target,
      targetId,
      details,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Audit log creation note:', err);
    return null;
  }
};

const getAuditLogs = async (limit = 100) => {
  return await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
};

export const AuditService = {
  createAuditLog,
  getAuditLogs,
};

