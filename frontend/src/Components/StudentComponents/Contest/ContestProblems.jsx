import React from 'react';
import './SingleContest.css'; // Adjust the path as necessary

export default function ContestProblems({ problems }) {
  return (
    <div className="contest-section">
      
      <div className="section-content">
        {problems.length > 0 ? (
          <ul className="list">
            {problems.map((problem, index) => (
              <li key={problem.problem_id} className="list-item ">
                <div className="item-header mb-2">
                  <span className="item-name text-lg mb-2">
                    <strong>{index+1}. Problem Name:</strong> {problem.problem_name}
                  </span>
                  <p className="item-description mb-2">
                    <strong>Description:</strong> {problem.problem_description || 'No description available'}
                  </p>
                </div>
                <div className="item-sample mb-2">
                  <p><strong>Sample Input:</strong></p>
                  <pre className="sample-input">{problem.sample_input}</pre>
                </div>
                <div className="item-sample mb-2">
                  <p><strong>Sample Output:</strong></p>
                  <pre className="sample-output">{problem.sample_output}</pre>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No problems available.</p>
        )}
      </div>
    </div>
  );
}
