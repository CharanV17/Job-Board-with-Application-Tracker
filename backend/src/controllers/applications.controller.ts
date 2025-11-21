import Application from "../models/application.model";
import Job from "../models/job.model";

// =============================
// GET SINGLE APPLICATION
// =============================
export const getApplicationById = async (req, res) => {
  try {
    const appId = req.params.id;

    // Fetch application with job & candidate populated
    const application = await Application.findById(appId)
      .populate("job")
      .populate("candidate");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = req.user;

    // Candidate can view ONLY their own application
    if (user.role === "candidate") {
      if (application.candidate._id.toString() !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // Employer can view ONLY applications for jobs they created
    if (user.role === "employer") {
      const job = await Job.findById(application.job._id);

      // IMPORTANT: Job model uses employer, not createdBy
      if (!job || job.employer.toString() !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.json(application);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE APPLICATION STATUS
// =============================
export const updateApplicationStatus = async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Log status change into history
    application.statusHistory.push({
      status,
      changedBy: req.user.id,
      at: new Date(),
    });

    // Update current status
    application.status = status;

    await application.save();

    return res.json({
      message: "Status updated",
      application,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
