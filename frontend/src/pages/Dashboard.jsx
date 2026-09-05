import { useState } from "react";
import api from "../services/api";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/availability",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        date: "",
        startTime: "",
        endTime: ""
      });

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Failed to add availability"
      );

    }

  };

  return (
    <div className="page">

      <h1>
        Welcome {user?.name}
      </h1>

      <h2>My Availability</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>Start time</label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>End time</label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />

        </div>

        <button
          type="submit"
          className="login-button"
        >
          Add availability
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default Dashboard;