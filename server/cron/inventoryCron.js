const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

const startInventoryCron = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running scheduled inventory check...');
    try {
      // Find items where quantity is less than or equal to threshold
      const items = await Inventory.find();
      const lowStockItems = items.filter(item => item.quantity <= item.threshold);

      if (lowStockItems.length > 0) {
        console.log(`⚠️ Scheduled Check: Low stock detected for ${lowStockItems.length} item(s)`);
        
        if (process.env.ADMIN_EMAIL) {
          const { subject, html } = emailTemplates.lowStockAlert(lowStockItems);
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject,
            html
          });
          console.log(`📧 Scheduled Check: Low stock alert sent to ${process.env.ADMIN_EMAIL}`);
        } else {
          console.log('⚠️ Scheduled Check: ADMIN_EMAIL not set, skipping email notification.');
        }
      } else {
        console.log('✅ Scheduled Check: All inventory levels are sufficient.');
      }
    } catch (error) {
      console.error('❌ Scheduled Check error:', error.message);
    }
  });

  console.log('🕒 Inventory checking cron job scheduled.');
};

module.exports = startInventoryCron;
