import { useEffect, useState } from "react";
import { profileService } from "../../services/profile.service";
import { api } from "../../services/api";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    bio: "",
    skills: "",
    resumeUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    const data = await profileService.getProfile();

    setForm({
      name: data.name || "",
      location: data.location || "",
      bio: data.bio || "",
      skills: (data.skills || []).join(", "),
      resumeUrl: data.resumeUrl || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const uploadResume = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);

    const presign = await api.get("/uploads/presign", {
      params: {
        filename: file.name,
        contentType: file.type,
      },
    });

    const { uploadUrl, fileUrl } = presign.data;

    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    setForm({ ...form, resumeUrl: fileUrl });
    setUploading(false);
  };

  const saveProfile = async () => {
    setSaving(true);

    await profileService.updateProfile({
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()),
    });

    alert("Profile updated");
    setSaving(false);
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

      <div className="bg-white shadow p-6 rounded space-y-6">

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="border p-2 rounded w-full h-28"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-1">Skills (comma-separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* RESUME UPLOAD */}
        <div>
          <label className="block mb-2">Resume (PDF)</label>

          {form.resumeUrl && (
            <a
              href={form.resumeUrl}
              target="_blank"
              className="text-blue-600 underline block mb-2"
            >
              View Current Resume
            </a>
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={(e: any) => setFile(e.target.files[0])}
          />

          <button
            disabled={!file || uploading}
            onClick={uploadResume}
            className="px-4 py-2 bg-blue-600 text-white rounded mt-2"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>

        {/* SAVE */}
        <button
          disabled={saving}
          onClick={saveProfile}
          className="px-6 py-3 bg-green-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

