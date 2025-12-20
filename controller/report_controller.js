const Report = require('../model/report.js');
const User = require('../model/user.js');
const helper = require('../pkg/helper/helper.js');

// Add new report
const addReport = async (req, res) => {
    try {
        const { senderID, targetID, content, evidence } = req.body;

        // Validate IDs
        const isValidSenderID = await helper.isValidObjectID(senderID);
        const isValidTargetID = await helper.isValidObjectID(targetID);
        
        if (!isValidSenderID || !isValidTargetID) {
            return res.status(400).json({
                message: "Invalid id"
            });
        }

        // Check if sender exists and not deleted
        const sender = await User.findById(senderID);
        if (!sender) {
            return res.status(404).json({
                message: "Sender not found"
            });
        }
        if (sender.isDelete) {
            return res.status(403).json({
                message: "Sender account has been deleted"
            });
        }

        // Check if target exists and not deleted
        const target = await User.findById(targetID);
        if (!target) {
            return res.status(404).json({
                message: "Target user not found"
            });
        }
        if (target.isDelete) {
            return res.status(403).json({
                message: "Target user account has been deleted"
            });
        }

        // Create new report
        const newReport = new Report({
            senderID,
            targetID,
            content,
            evidence: evidence || ''
        });

        await newReport.save();

        const populatedReport = await Report.findById(newReport._id)
            .populate('senderID', 'username avatar email')
            .populate('targetID', 'username avatar email');

        return res.status(201).json({
            message: "Report created successfully",
            data: populatedReport
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Get all reports (not deleted)
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({ isDeleted: false })
            .populate('senderID', 'username avatar email')
            .populate('targetID', 'username avatar email')
            .sort({ createdAt: -1 });

        return res.json({
            message: "Get all reports successfully",
            data: reports
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Get all resolved reports
const getAllResolvedReports = async (req, res) => {
    try {
        const reports = await Report.find({ 
            isDeleted: false,
            isResolved: true 
        })
            .populate('senderID', 'username avatar email')
            .populate('targetID', 'username avatar email')
            .sort({ createdAt: -1 });

        return res.json({
            message: "Get all resolved reports successfully",
            data: reports
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Resolve report (mark as resolved)
const resolveReport = async (req, res) => {
    try {
        const reportID = req.params.id;
        
        const isValidID = await helper.isValidObjectID(reportID);
        if (!isValidID) {
            return res.status(400).json({
                message: "Invalid id"
            });
        }

        const report = await Report.findById(reportID);
        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        if (report.isDeleted) {
            return res.status(400).json({
                message: "Report has been deleted"
            });
        }

        if (report.isResolved) {
            return res.status(400).json({
                message: "Report already resolved"
            });
        }

        report.isResolved = true;
        await report.save();

        const updatedReport = await Report.findById(reportID)
            .populate('senderID', 'username avatar email')
            .populate('targetID', 'username avatar email');

        return res.json({
            message: "Report resolved successfully",
            data: updatedReport
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Delete report (soft delete)
const deleteReport = async (req, res) => {
    try {
        const reportID = req.params.id;
        
        const isValidID = await helper.isValidObjectID(reportID);
        if (!isValidID) {
            return res.status(400).json({
                message: "Invalid id"
            });
        }

        const report = await Report.findById(reportID);
        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        if (report.isDeleted) {
            return res.status(400).json({
                message: "Report already deleted"
            });
        }

        report.isDeleted = true;
        await report.save();

        return res.json({
            message: "Report deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    addReport,
    getAllReports,
    getAllResolvedReports,
    resolveReport,
    deleteReport
};
