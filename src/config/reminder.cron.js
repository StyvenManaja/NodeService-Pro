const cron = require("node-cron");
const { sendReminders } = require("../services/reminder.service");

// Tous les jours à 09:00 (heure Antananarivo)
cron.schedule("0 9 * * *", async () => {
  console.log("Job relances — start");
  await sendReminders();
  console.log("Job relances — finished");
}, {
  timezone: process.env.TZ || "Indian/Antananarivo"
});

module.exports = {};
