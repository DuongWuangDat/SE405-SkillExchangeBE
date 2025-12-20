const express = require('express');
const router = express.Router();
const reportController = require('../controller/report_controller.js');

// POST: Add new report (requires auth)
router.post('/add',  reportController.addReport);

// GET: Get all reports (requires auth)
router.get('/all',  reportController.getAllReports);

// GET: Get all resolved reports (requires auth)
router.get('/resolved',  reportController.getAllResolvedReports);

// PUT: Resolve a report (requires auth)
router.put('/resolve/:id',  reportController.resolveReport);

// DELETE: Delete a report (requires auth)
router.delete('/:id',  reportController.deleteReport);

module.exports = router;
