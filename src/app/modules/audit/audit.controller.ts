import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { AuditService } from './audit.service';

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 100;
  const result = await AuditService.getAuditLogs(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audit logs retrieved successfully',
    data: result,
  });
});

const createAuditLog = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const ipAddress =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Web Client';

  const result = await AuditService.createAuditLog({
    userId: user?._id || user?.userId,
    userName: req.body.userName || user?.name || user?.email || 'Authenticated User',
    userEmail: user?.email || req.body.userEmail || 'user@pharmadoor.com',
    userRole: user?.role || req.body.userRole || 'user',
    action: req.body.action || 'MODIFY',
    target: req.body.target || 'General',
    targetId: req.body.targetId,
    details: req.body.details || '',
    ipAddress,
    userAgent,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Audit log recorded successfully',
    data: result,
  });
});

export const AuditController = {
  getAuditLogs,
  createAuditLog,
};
