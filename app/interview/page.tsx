"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const roles = [
  "Software Engineer", 
  "Data Analyst", 
  "HR", 
  "Marketing",
  "Product Manager",
  "Finance Analyst",
  "Teacher / Educator", 
  "Business Development Executive",
  "Web Developer",
  "Graphic Designer"
];
const languages = ["English", "Hindi", "Marathi"];

export default function InterviewPage() {
  const router = useRouter();
  const [role, setRole] = useState(roles[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleStart = () => {
    const setup = { role, language };
    localStorage.setItem("careersetu.setup", JSON.stringify(setup));
    localStorage.removeItem("careersetu.chat");
    localStorage.removeItem("careersetu.results");
    if (resumeText) {
      localStorage.setItem("careersetu.resume", resumeText);
    } else {
      localStorage.removeItem("careersetu.resume");
    }
    router.push("/chat");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setUploadMessage('Please upload a PDF or TXT file only.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
      setResumeFile(file.name);
      setUploadMessage('Resume uploaded ✓');
      
      // Clear message after 3 seconds
      setTimeout(() => setUploadMessage(null), 3000);
    };

    reader.onerror = () => {
      setUploadMessage('Failed to read file. Please try again.');
      setTimeout(() => setUploadMessage(null), 3000);
    };

    if (file.type === 'application/pdf') {
      // For PDF files, we'll need to extract text
      // For now, we'll read as text (this won't work for most PDFs)
      // In a real implementation, you'd use a PDF parsing library
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeText(null);
    setUploadMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 animate-fade-in">
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/50 sm:p-8">
        <h1 className="text-3xl font-bold text-blue-950">Start Interview</h1>
        <p className="mt-2 text-slate-600">
          Choose your target role and interview language.
        </p>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-blue-800">
              Job Role
            </span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 text-slate-800 outline-none ring-blue-200 transition focus:ring-2"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-blue-800">
              Interview Language
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 text-slate-800 outline-none ring-blue-200 transition focus:ring-2"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Resume Upload Section */}
          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-blue-800">
                Optional — Upload your resume for personalized questions
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="w-full rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 text-slate-800 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 outline-none ring-blue-200 transition focus:ring-2"
              />
            </label>
            
            {uploadMessage && (
              <p className={`text-sm font-medium ${
                uploadMessage.includes('✓') ? 'text-green-600' : 'text-red-600'
              }`}>
                {uploadMessage}
              </p>
            )}
            
            {resumeFile && (
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-800">
                    📄 {resumeFile}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="mt-8 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-blue-700"
        >
          Start
        </button>
      </div>
    </section>
  );
}
