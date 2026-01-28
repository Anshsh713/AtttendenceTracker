import React, { useState } from "react";
import { useSchedule } from "../../Context/ScheduleContext.jsx";
import SubjectHistoryCard from "../../Cards/SubjectHistoryCard.jsx";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import "./History.css";

export default function HistoryPage() {
  const { allSubjects } = useSchedule();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="history-page">
      <h1>Subject History</h1>

      <div className="subject-scroll">
        {allSubjects.length === 0 && (
          <div className="notfound">
            <p className="empty-text">Subject Not Found</p>
          </div>
        )}

        {allSubjects.map((subj) => {
          const isActive = selectedId === subj.$id;

          return (
            <div
              key={subj.$id}
              onClick={() => setSelectedId(subj.$id)}
              className={`subject-chip ${isActive ? "active" : ""}`}
            >
              <h3>{subj.SubjectName}</h3>

              {!isActive && <Button title="View History" />}

              {isActive && <p className="subject-selected">Selected</p>}
            </div>
          );
        })}
      </div>

      {selectedId ? (
        <SubjectHistoryCard
          subjectId={selectedId}
          close={() => setSelectedId(null)}
        />
      ) : (
        <p className="select-text">Select a subject to view history</p>
      )}
    </div>
  );
}
