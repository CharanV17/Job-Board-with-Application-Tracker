import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applicationService } from "../../services/application.service";
import { api } from "../../services/api";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleFileChange = (e: any) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    setFile(f);
  };

  const uploadResume = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);

    const presign = await api.get("/uploads/presign", {
      params: {
        filename: file.name,
        contentType: file.type
      }
    });

    const { uploadUrl, fileUrl } = presign.data;

    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type
      }
    });

    setResumeUrl(fileUrl);
    setUploading(false);
  };

  const submitApplication = async () => {
    if (!resumeUrl) return alert("Upload resume first");

    await applicationService.apply({
      jobId: id,
      resumeUrl,
      originalFileName: file?.name,
      fileSize: file?.size,
      coverLetter
    });

    alert("Application submitted!");
    navigate("/candidate/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Apply for Job</h1>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block mb-2">Upload Resume (PDF)</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      <button
        onClick={uploadResume}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {resumeUrl && (
        <p className="text-green-600 mb-6">Resume uploaded successfully!</p>
      )}

      {/* Cover Letter */}
      <div>
        <label className="block mb-2">Cover Letter (optional)</label>
        <textarea
          className="border p-3 rounded w-full h-40"
          onChange={(e) => setCoverLetter(e.target.value)}
        ></textarea>
      </div>

      {/* Submit */}
      <button
        onClick={submitApplication}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        disabled={!resumeUrl}
      >
        Submit Application
      </button>
    </div>
  );
}
