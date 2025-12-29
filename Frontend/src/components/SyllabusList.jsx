import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
// ...existing imports...

function SyllabusList() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e.key === "Enter" && search.trim()) {
  setLoading(true);
  setResult(null);
      let timeoutReached = false;
      const timeout = setTimeout(() => {
        timeoutReached = true;
        setLoading(false);
        setResult({ error: "AI did not respond in 1.5 minutes. Please try again later." });
      }, 90000); // 1.5 minutes
      try {
        // Call both endpoints in parallel
        const [descRes, videoRes] = await Promise.all([
          axios.post(`${API_BASE_URL}/syllabus/generateText`, { topic: search }),
          axios.post(`${API_BASE_URL}/syllabus/generateVideo`, { topic: search })
        ]);
        clearTimeout(timeout);
        if (!timeoutReached) {
          if (descRes.data.success && videoRes.data.success) {
            const combined = {
              description: descRes.data.data?.description || "",
              videoLink: videoRes.data.data?.videoLink || ""
            };
            setResult(combined);
            setHistory(prev => [{ topic: search, ...combined }, ...prev]);
          } else {
            setResult({ error: descRes.data.message || videoRes.data.message || "Failed to generate topic." });
          }
        }
        setLoading(false);
      } catch {
        clearTimeout(timeout);
        if (!timeoutReached) {
          setResult({ error: "Error generating topic." });
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Syllabus AI Search</h2>
        <div className="relative">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setMenuOpen(m => !m)}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow rounded z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => { setMenuOpen(false); alert('Search History: ' + history.map(h => h.topic).join(', ')); }}
              >
                <i className="ri-history-line"></i> View Search History
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => { setMenuOpen(false); navigate('/quizzes'); }}
              >
                <i className="ri-question-answer-line"></i> Quiz
              </button>
            </div>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Type topic and press Enter..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {loading && (
        <div className="flex flex-col justify-center items-center h-40">
          <i className="ri-loader-4-line animate-spin text-5xl text-green-600 mb-2"></i>
          <span className="text-green-700 font-bold text-lg">AI is generating your topic. This may take up to 1.5 minutes. Please wait...</span>
        </div>
      )}
      {!loading && result && (
        <div className="bg-white rounded-xl shadow p-4 mt-4">
          {result.error ? (
            <div className="text-red-600 font-semibold">{result.error}</div>
          ) : result.description ? (
            <>
              <div className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
                <i className="ri-book-mark-line text-xl"></i> {search}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-medium">Description:</span> {result.description}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Video Lecture:</span>
                {result.videoLink ? (
                  <a href={result.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
                    {result.videoLink}
                  </a>
                ) : (
                  <span className="ml-2 text-gray-400">No video link</span>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default SyllabusList;
