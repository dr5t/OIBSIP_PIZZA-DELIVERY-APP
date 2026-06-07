const Inventory = require('../models/Inventory');
const { sendEmail, emailTemplates } = require('./sendEmail');

const checkStockLevels = async (itemIds) => {
  try {
    const items = await Inventory.find({ _id: { $in: itemIds } });
    const lowStockItems = items.filter(item => item.quantity <= item.threshold);

    if (lowStockItems.length > 0) {
      console.log(`⚠️ Low stock detected for ${lowStockItems.length} item(s)`);
      
      const { subject, html } = emailTemplates.lowStockAlert(lowStockItems);
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject,
        html
      });

      console.log(`📧 Low stock alert sent to ${process.env.ADMIN_EMAIL}`);
    }

    return lowStockItems;
  } catch (error) {
    console.error('❌ Stock check error:', error.message);
    return [];
  }
};

const deductStock = async (pizzaDetails) => {
  const itemIds = [];

  if (pizzaDetails.base?.item) {
    await Inventory.findByIdAndUpdate(pizzaDetails.base.item, { $inc: { quantity: -1 } });
    itemIds.push(pizzaDetails.base.item);
  }

  if (pizzaDetails.sauce?.item) {
    await Inventory.findByIdAndUpdate(pizzaDetails.sauce.item, { $inc: { quantity: -1 } });
    itemIds.push(pizzaDetails.sauce.item);
  }

  if (pizzaDetails.cheese?.item) {
    await Inventory.findByIdAndUpdate(pizzaDetails.cheese.item, { $inc: { quantity: -1 } });
    itemIds.push(pizzaDetails.cheese.item);
  }

  if (pizzaDetails.veggies?.length > 0) {
    for (const veggie of pizzaDetails.veggies) {
      if (veggie.item) {
        await Inventory.findByIdAndUpdate(veggie.item, { $inc: { quantity: -1 } });
        itemIds.push(veggie.item);
      }
    }
  }

  if (pizzaDetails.meat?.length > 0) {
    for (const m of pizzaDetails.meat) {
      if (m.item) {
        await Inventory.findByIdAndUpdate(m.item, { $inc: { quantity: -1 } });
        itemIds.push(m.item);
      }
    }
  }

  return itemIds;
};

module.exports = { checkStockLevels, deductStock };
