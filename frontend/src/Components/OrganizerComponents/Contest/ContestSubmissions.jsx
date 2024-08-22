import React from 'react';
import './SingleContest.css'; // Adjust the path as necessary

export default function ContestSubmissions({ submissions }) {
  return (
    <div className="h-full">
      <h4 className="text-lg font-semibold mb-4 text-black ">Submissions</h4>
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
        {submissions.length > 0 ? (
          <ul className="space-y-4 item-body">
            {submissions.map((submission) => (
              <li key={`${submission.participant_id}-${submission.problem_id}`} className="border-b border-gray-200 pb-4 mb-5 participants-name">
                <div className="flex justify-between item-center ">
                  <span className="font-medium text-black ">
                    Participant name: <strong>{submission.participant_name}</strong>
                  </span>
                  <span className="text-black ">{new Date(submission.submission_time).toLocaleString()}</span>
                </div>
                <div className="mt-2 ">
                  <p className="text-black  item-problem"><strong>Problem:</strong> {submission.problem_name}</p>
                  <p className="text-black item-solution"><strong>Solution:</strong></p>
                  <div className="item-code">
                    <pre><code>{submission.solution}</code></pre>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No submissions available.</p>
        )}
      </div>
    </div>
  );
}
