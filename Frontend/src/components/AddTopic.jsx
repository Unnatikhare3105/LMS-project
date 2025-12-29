import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

function AddTopic({ onTopicAdded }) {
  const [form, setForm] = useState({ topic: "", description: "", videoLink: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/syllabus/add`, form);
      if (res.data.success) {
        setMessage("Topic added successfully!");
        setForm({ topic: "", description: "", videoLink: "" });
        if (onTopicAdded) onTopicAdded();
      } else {
        setMessage(res.data.message || "Failed to add topic");
      }
    } catch (err) {
      setMessage("Error adding topic");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
        <i className="ri-add-circle-line"></i> Add New Topic
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Video Lecture Link</label>
          <input
            type="url"
            name="videoLink"
            value={form.videoLink}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
        >
          <i className="ri-add-line"></i> {loading ? "Adding..." : "Add Topic"}
        </button>
      </form>
      {message && <p className={`mt-4 text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}

export default AddTopic;
