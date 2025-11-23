  import { useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { applicationService } from "../../services/application.service";
  import { api } from "../../services/api";

  export default function ApplyJob() {
    const { id: jobId } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [uploading, setUploading] = useState(false);

    // --------------------------------
    // FILE SELECT
    // --------------------------------
    const handleFileChange = (e: any) => {
      const f = e.target.files[0];
      if (!f) return;

      if (f.type !== "application/pdf") {
        alert("Only PDF files allowed");
        return;
      }

      setFile(f);
    };

    // --------------------------------
    // UPLOAD RESUME
    // --------------------------------
    const uploadResume = async () => {
      if (!file) return alert("Select a file first");

      try {
        setUploading(true);

        // 1. GET PRESIGNED URL
        const presignRes = await api.get("/uploads/presign", {
          params: {
            filename: file.name,
            contentType: file.type,
          },
        });

        const { uploadUrl, fileUrl } = presignRes.data;

        // 2. UPLOAD TO CLOUD STORAGE
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        setResumeUrl(fileUrl);
        alert("Resume uploaded!");
      } catch (err) {
        console.error(err);
        alert("Resume upload failed");
      }

      setUploading(false);
    };

    // --------------------------------
    // SUBMIT APPLICATION
    // --------------------------------
    const submitApplication = async () => {
      if (!resumeUrl) return alert("Upload resume first");

      try {
        await applicationService.apply({
          jobId,
          resumeUrl,
          originalFileName: file?.name,
          fileSize: file?.size,
          coverLetter,
        });

        alert("Application Submitted!");
        navigate("/candidate/dashboard");
      } catch (err) {
        console.error(err);
        alert("Failed to apply");
      }
    };

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Apply for Job</h1>

        {/* UPLOAD RESUME */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Upload Resume (PDF Only)</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button
          onClick={uploadResume}
          disabled={uploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>

        {resumeUrl && (
          <p className="text-green-600 mt-3">Resume uploaded successfully!</p>
        )}

        {/* COVER LETTER */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold">Cover Letter (Optional)</label>
          <textarea
            className="w-full border p-3 rounded h-40"
            placeholder="Write a short cover letter..."
            onChange={(e) => setCoverLetter(e.target.value)}
          ></textarea>
        </div>

        {/* SUBMIT */}
        <button
          onClick={submitApplication}
          disabled={!resumeUrl}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Submit Application
        </button>
      </div>
    );
  }
