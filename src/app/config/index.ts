import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refress_secreet: process.env.JWT_REFRESH_SECRET,
  jwt_refress_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  opnai_api_key: process.env.OPENAI_API_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_SECRET,
};
