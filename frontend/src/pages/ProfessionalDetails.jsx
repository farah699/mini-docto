import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProfessionalDetails() {

  const { id } = useParams();

  const [professional, setProfessional] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const professionalsResponse =
          await api.get("/professionals");

        const foundProfessional =
          professionalsResponse.data.professionals.find(
            (pro) => pro._id === id
          );

        setProfessional(foundProfessional);

        const availabilityResponse =
          await api.get(
            `/availability/professional/${id}`
          );

        setAvailabilities(
          availabilityResponse.data.availabilities
        );

      } catch (error) {

        console.error(error);

      }

    };

    fetchData();

  }, [id]);

  const handleBook = async (availabilityId) => {

    try {

      const response = await api.post(
        "/appointments",
        {
          availabilityId
        }
      );

      setMessage(response.data.message);

      setAvailabilities(
        availabilities.filter(
          (slot) => slot._id !== availabilityId
        )
      );

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Booking failed"
      );

    }

  };

  if (!professional) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">

      <h1>{professional.name}</h1>

      <h3>
        ⭐ {professional.score}/100
      </h3>

      <h2>Available slots</h2>

      {message && (
        <p>{message}</p>
      )}

      {availabilities.map((slot) => (

        <div
          className="professional-card"
          key={slot._id}
        >

          <h3>{slot.date}</h3>

          <p>
            {slot.startTime} - {slot.endTime}
          </p>

          <p>Available</p>

          <button
            className="login-button"
            onClick={() => handleBook(slot._id)}
          >
            Book
          </button>

        </div>

      ))}

    </div>
  );
}

export default ProfessionalDetails;