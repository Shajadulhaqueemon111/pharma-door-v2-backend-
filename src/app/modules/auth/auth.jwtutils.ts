import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: Record<string, unknown>,
  secret: string,
  expiresIn: number,
): string => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
