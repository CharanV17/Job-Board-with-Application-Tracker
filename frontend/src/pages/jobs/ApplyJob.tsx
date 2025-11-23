import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadService } from "../../services/upload.service";
import { applicationService } from "../../services/application.service";

export default function ApplyJob() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [uploading, setUploading] = useState(false);

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
    if (!file) return alert("Choose a file");

    try {
      setUploading(true);

      const presign = await uploadService.getPresignedUrl(file.name, file.type);

      await uploadService.uploadToS3(presign.uploadUrl, file);

      setResumeUrl(presign.fileUrl);

      alert("Resume Uploaded!");
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    }

    setUploading(false);
  };

  const submit = async () => {
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
      navigate("/candidate/dashboard"); // Candidate Dashboard
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Apply Job</h1>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2"
        onClick={uploadResume}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {resumeUrl && <p className="text-green-600 mt-2">Resume uploaded!</p>}

      <textarea
        className="mt-4 w-full border p-3"
        placeholder="Cover Letter..."
        onChange={(e) => setCoverLetter(e.target.value)}
      />

      <button
        className="mt-6 bg-green-600 text-white px-6 py-2"
        onClick={submit}
        disabled={!resumeUrl}
      >
        Submit Application
      </button>
    </div>
  );
}
