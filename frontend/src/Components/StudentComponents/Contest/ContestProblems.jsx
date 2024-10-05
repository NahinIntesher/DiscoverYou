import React from 'react';
import './SingleContest.css'; // Adjust the path as necessary
import NotFound from '../../CommonComponents/NotFound';

export default function ContestProblems({ problems }) {
  return (
    <div className="content center">
      {problems.length > 0 ? (
        <div className="participantList">
          {problems.map((problem, index) => (
            <div className="problemBox" key={problem.problem_id}>
                <div className="number">
                 Problem {index+1}
                </div>
                <div className="name">
                 {problem.problem_name}
                </div>
                <div className="description">
                  {problem.problem_description}
                </div>
                <div className="sampleContainer">
                  <div className="sampleBox">
                    <div className="title">Sample Input</div>
                    <pre className="code">{problem.sample_input}</pre>
                  </div>
                  <div className="sampleBox">
                    <div className="title">Sample Output</div>
                    <pre className="code">{problem.sample_output}</pre>
                  </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <NotFound message="No problem found for this contest!"/>
      )}
    </div>
  );
}
