import React from 'react';
import './SingleContest.css'; // Adjust the path as necessary

export default function ContestParticipants({ participants }) {
  return (
    <div className="contest-section">
      <h4 className="section-title">Participants</h4>
      <div className="section-content">
        {participants.length > 0 ? (
          <ul className="list">
            {participants.map((participant) => (
              <li key={participant.participant_id} className="list-item">
                <div className="item-header">
                  <span className="item-position">
                    <strong>Position:</strong> {participant.result_position}
                    <p className="item-name"><strong>Name:</strong> {participant.participant_name}</p>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No participants available.</p>
        )}
      </div>
    </div>
  );
}
