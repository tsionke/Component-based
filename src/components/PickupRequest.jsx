import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pickupRequest.css";

export default function PickupRequest() {
  const navigate = useNavigate();

  const [selectedTypes, setSelectedTypes] = useState({
    recyclable: false,
    nonRecyclable: false,
  });
  const [materialType, setMaterialType] = useState("");
  const [weight, setWeight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedTypes.recyclable && !selectedTypes.nonRecyclable) {
      setError("Please select at least one waste type");
      return;
    }
    if (!weight || parseFloat(weight) <= 0) {
      setError("Please enter valid weight");
      return;
    }

    setIsSubmitting(true);

    try {
      const types = [];
      if (selectedTypes.recyclable) types.push("Recyclable");
      if (selectedTypes.nonRecyclable) types.push("Non-Recyclable");

      const requestData = {
        type: types.join(" & "),
        material: materialType || null,
        kg: parseFloat(weight),
        userEmail: localStorage.getItem("userEmail") || "user@example.com",
        status: "pending",
      };

      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // SUCCESS → Go to Done/Success Page
        navigate("/request-success");
      } else {
        setError(result.error || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your server running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pickup-request-page min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="form-card">
        <div className="text-center mb-4">
          <h2 className="kuralewo-title">Kuralewo</h2>
          <p className="subtitle">Request waste pickup</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Your existing form fields remain the same */}
          <div className="mb-4">
            <label className="form-label">Type of Waste</label>
            <div className="radio-group">
              <label
                className={`radio-option ${selectedTypes.recyclable ? "selected" : ""}`}
                onClick={() => toggleType("recyclable")}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.recyclable}
                  readOnly
                />
                <span>Recyclable</span>
              </label>
              <label
                className={`radio-option ${selectedTypes.nonRecyclable ? "selected" : ""}`}
                onClick={() => toggleType("nonRecyclable")}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.nonRecyclable}
                  readOnly
                />
                <span>Non-Recyclable</span>
              </label>
            </div>
          </div>

          {selectedTypes.recyclable && (
            <div className="mb-4">
              <label className="form-label">Recyclable Type</label>
              <div className="radio-group">
                {["Plastic", "Metal", "Others"].map((type) => (
                  <label
                    key={type}
                    className={`radio-option ${materialType === type ? "selected" : ""}`}
                    onClick={() => setMaterialType(type)}
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={materialType === type}
                      readOnly
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">Total Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter total weight"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn w-100"
          >
            {isSubmitting ? "Submitting..." : "Submit Pickup Request"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="btn btn-link text-muted"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
