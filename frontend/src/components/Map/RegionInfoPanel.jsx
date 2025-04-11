import React from "react";

const RegionInfoPanel = ({ region, onClose }) => {
  if (!region) return null;

  return (
    <div style={{
      position: "absolute",
      top: 80,
      right: 20,
      width: 280,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      padding: "16px",
      zIndex: 1000,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0 }}>{region.NAME_1}</h4>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
          title="Закрыть"
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>Индекс активности:</strong> {Math.round(region.intensity * 100)}%</div>

      </div>
    </div>
  );
};

export default RegionInfoPanel;