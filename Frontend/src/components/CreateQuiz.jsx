import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api.js";

function CreateQuiz() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/syllabus/getall`)
      .then(res => setTopics(res.data.syllabus))
      .catch(err => alert("Error fetching topics"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/quiz/generate-questions/${selectedTopic}`, { numQuestions });
      setMessage("Quiz created successfully!");
    } catch (err) {
      setMessage("Error creating quiz");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-700 flex items-center justify-center gap-2">
        <i className="ri-add-circle-line text-2xl"></i> Create Quiz
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
            <i className="ri-book-mark-line"></i> Topic:
          </label>
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select a topic</option>
            {topics.map(topic => (
              <option key={topic._id} value={topic._id}>{topic.topic}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-1">
            <i className="ri-question-line"></i> Number of Questions:
          </label>
          <input
            type="number"
            value={numQuestions}
            onChange={e => setNumQuestions(e.target.value)}
            min={1}
            max={20}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
        >
          <i className="ri-add-line"></i> {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
}

export default CreateQuiz;
