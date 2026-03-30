/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '../../../shared/api';
import React, { useState } from 'react';

// Issuance types
const items = [
  '--SELECT--',
  'Administrative Order',
  'Memorandum Circular',
  'Office Circular',
  'Office Memorandum',
  'Office Order',
  'Resolution',
  'CSC Issuance',
  'OLA Opinion',
  'MOA / MOU',
  'Project Contract',
  'Memorandum Order'
];

const AddDocumentNo = () => {
  const [issuanceType, setIssuanceType] = useState("");
  const [error, setError] = useState("");
  const [documentNo, setDocumentNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issuanceType || issuanceType === "--SELECT--") {
      setDocumentNo("");
      setError("Please select an issuance type.");
      return;
    }

    setError("");

    const confirmGenerate = window.confirm(
      "Generate document number for this issuance type?"
    );
    if (!confirmGenerate) return;

    try {
      setLoading(true);

      const response = await api.get(
        "/aims/documents/generateDocumentNo",
        { params: { issuanceType } }
      );

      setDocumentNo(response.data.nextDocNo);
    } catch (err) {
      setError("Failed to generate document number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-0 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "500px" }}>
        
        {/* Header */}
        <h4 className="text-center mb-4">
          Generate Document Number
        </h4>

        <form onSubmit={handleGenerate}>
          
          {/* Issuance Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Issuance Type
            </label>

            <select
              className="form-select"
              value={issuanceType}
              onChange={(e) => setIssuanceType(e.target.value)}
            >
              {items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {error && (
              <div className="text-danger mt-1">
                <small>{error}</small>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Result Display */}
          {documentNo && (
            <div className="alert alert-success text-center">
              <div className="fw-semibold">Generated Document No:</div>
              <h3 className="mt-2 mb-0">{documentNo}</h3>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default AddDocumentNo;