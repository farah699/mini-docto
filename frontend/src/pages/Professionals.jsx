import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Professionals() {
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get("/professionals");

        setProfessionals(response.data.professionals);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return <p>Loading professionals...</p>;
  }

  return (
    <div className="page">

      <h1>Available Professionals</h1>

      <div className="professionals-grid">

        {professionals.map((professional) => (
          <div
            className="professional-card"
            key={professional._id}
          >

            <h2>{professional.name}</h2>

            <p>
              ⭐ {professional.score}/100
            </p>

            <p>
              Available
            </p>

            <button
              onClick={() =>
                navigate(`/professionals/${professional._id}`)
              }
            >
              View slots
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Professionals;