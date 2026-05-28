const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAlert(dishName, category, count) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to:   process.env.OWNER_EMAIL,
    subject: `🚨 Alert: ${count} ${category} complaints for "${dishName}"`,
    html: `
      <div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#e74c3c">⚠️ Repeated Complaint Alert</h2>
        <p>Your dish <strong>${dishName}</strong> has received 
           <strong>${count} ${category}</strong> complaints today.</p>
        <p>Please check and take action immediately.</p>
        <hr/>
        <p style="color:#888;font-size:12px">Smart Feedback System</p>
      </div>
    `
  });
}

module.exports = { sendAlert };