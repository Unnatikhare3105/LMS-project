import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api.js";


function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/quiz/get-all`)
      .then(res => setQuizzes(res.data.quizzes))
      .catch(err => alert("Error fetching quizzes"));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">All Quizzes</h2>
      <ul className="space-y-4">
        {quizzes.map(quiz => (
          <li key={quiz._id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <div className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                <i className="ri-book-2-line text-xl"></i>
                Topic: {quiz.topic}
              </div>
              <div className="mt-1 text-gray-700">
                <span className="font-medium">Questions:</span> {quiz.numQuestions}
              </div>
              <div className="mt-1 text-gray-700">
                <span className="font-medium">Created By:</span> {quiz.userId?.email || "Unknown"}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded flex items-center gap-1">
                <i className="ri-eye-line"></i> View
              </button>
              <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded flex items-center gap-1">
                <i className="ri-edit-line"></i> Edit
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded flex items-center gap-1">
                <i className="ri-delete-bin-line"></i> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;
