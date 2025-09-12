"use client";
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Feedback {
  id: number;
  comment: string;
}

const FeedbackViewer: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [moduleId, setModuleId] = useState<string>('');

  const fetchFeedback = async () => {
    if (!moduleId) return;
    try {
      // Dummy API call
      const response = await axios.get<Feedback[]>(`/api/feedback/module/${moduleId}`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Failed to fetch feedback');
    }
  };

  const handleModuleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModuleId(e.target.value);
  };

  return (
    <div>
      <h3>View Module Feedback</h3>
      <input
        type="text"
        value={moduleId}
        onChange={handleModuleIdChange}
        placeholder="Enter Module ID"
      />
      <button onClick={fetchFeedback} disabled={!moduleId}>
        Get Feedback
      </button>
      <ul>
        {feedback.map(fb => (
          <li key={fb.id}>{fb.comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackViewer;
