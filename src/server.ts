import app from './app';

import mongoose from 'mongoose';
import config from './app/config';

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('DB URL:', config.database_url);
    console.log('PORT:', config.port);
    app.listen(config.port, () => {
      console.log(` app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
