import React, { useState } from "react";
import { useSchedule } from "../../Context/ScheduleContext.jsx";
import SubjectHistoryCard from "../../Cards/SubjectHistoryCard.jsx";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";

export default function HistoryPage() {
  const { allSubjects } = useSchedule();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Subject History</h1>

      {/* 🔹 Horizontal Subject Bar (ALWAYS VISIBLE) */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px",
          padding: "10px 0",
          marginBottom: "25px",
        }}
      >
        {allSubjects.length === 0 && <p>No subjects added.</p>}

        {allSubjects.map((subj) => {
          const isActive = selectedId === subj.$id;

          return (
            <div
              key={subj.$id}
              onClick={() => setSelectedId(subj.$id)}
              style={{
                minWidth: "200px",
                padding: "15px",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "center",
                flexShrink: 0,
                border: isActive ? "2px solid #4f46e5" : "1px solid #ccc",
                background: isActive ? "#eef2ff" : "#f5f5f5",
                transition: "0.2s",
              }}
            >
              <h3>{subj.SubjectName}</h3>

              {!isActive && <Button title="View History" />}

              {isActive && (
                <p style={{ color: "#4f46e5", fontWeight: "600" }}>Selected</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔹 History Card (Changes on click) */}
      {selectedId ? (
        <SubjectHistoryCard
          subjectId={selectedId}
          close={() => setSelectedId(null)}
        />
      ) : (
        <p style={{ textAlign: "center" }}>Select a subject to view history</p>
      )}
    </div>
  );
}
