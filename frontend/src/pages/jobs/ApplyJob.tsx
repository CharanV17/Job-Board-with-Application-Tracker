import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import { uploadService } from "../../services/upload.service";
import { applicationService } from "../../services/application.service";

export default function ApplyJob() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [file, setFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Redirect if not candidate
  if (!token) navigate("/login");
  if (user?.role === "employer") navigate("/jobs/" + jobId);

  const handleFileChange = (e: any) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      alert("PDF only");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }

    setFile(f);
  };

  const handleApply = async () => {
    if (!file) {
      alert("Please upload your resume");
      return;
    }

    setLoading(true);

    try {
      // 1. PRESIGN request
      const presign = await uploadService.getPresignedUrl(
        file.name,
        file.type
      );

      // 2. Upload to S3
      await uploadService.uploadToS3(presign.uploadUrl, file);

      // 3. Create Application
      await applicationService.apply({
        jobId,
        resumeUrl: presign.publicUrl,
        originalFileName: file.name,
        fileSize: file.size,
        coverLetter,
      });

      setMsg("Application submitted!");
      setTimeout(() => navigate("/dashboard"), 1200);

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to apply");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-6">Apply for Job</h1>

      <div className="bg-white shadow p-6 rounded-lg space-y-6">

        {msg && (
          <div className="text-green-700 bg-green-100 p-3 rounded">
            {msg}
          </div>
        )}

        {/* Resume Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Resume (PDF, max 5MB)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block font-medium mb-2">Cover Letter (optional)</label>
          <textarea
            className="border p-2 rounded w-full h-32"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a brief cover letter here..."
          />
        </div>

        <div className="pt-4">
          <button
            disabled={loading}
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>

      </div>
    </div>
  );
}
