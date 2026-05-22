import cron from 'node-cron';
import { MedicineService } from './medicine.service';

export const checkExpiredMedicines = () => {
  cron.schedule('0 0 * * *', async () => {
    const expired = await MedicineService.markExpiredMedicines();
    console.log('Expired medicines marked:', expired.length);
  });
};
