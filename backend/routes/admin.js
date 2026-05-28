const router = require('express').Router();
const Feedback = require('../models/Feedback');

// Analytics summary
router.get('/analytics', async (req, res) => {
  const [sentimentStats, categoryStats, dishStats] = await Promise.all([
    Feedback.aggregate([{ $group: { _id: '$sentiment', count: { $sum: 1 } } }]),
    Feedback.aggregate([{ $group: { _id: '$category',  count: { $sum: 1 } } }]),
    Feedback.aggregate([
      { $group: { _id: '$dishName', count: { $sum: 1 }, 
        negativeCount: { $sum: { $cond: [{ $eq: ['$sentiment','Negative'] }, 1, 0] } }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);
  res.json({ sentimentStats, categoryStats, dishStats });
});

module.exports = router;