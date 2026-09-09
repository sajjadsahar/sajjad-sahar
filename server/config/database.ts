import path from 'path';
import { db } from '../db.js';

export const DATABASE_CONFIG = {
  dataDir: path.join(process.cwd(), 'server', 'data'),
  dbFile: path.join(process.cwd(), 'server', 'data', 'portfolio_db.json'),
};

export { db };
export default db;
