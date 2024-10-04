import React from "react";

export default function RecentActivityBox({ recentActivity }) {
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  return (
    <div className="participant">
      <div className="participantDetailsContainer">
        <table
          style={{
          }}
        >
          <caption
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              padding: "18px",
            }}
          >
            Recent Activity
          </caption>
          <thead>
            <tr>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #ddd",
                  padding: "12px",
                  backgroundColor: "rgb(var(--light))",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Event ID
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #ddd",
                  padding: "12px",
                  backgroundColor: "rgb(var(--light))",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Event Title
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #ddd",
                  padding: "12px",
                  backgroundColor: "rgb(var(--light))",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Event Type
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #ddd",
                  padding: "12px",
                  backgroundColor: "rgb(var(--light))",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Participants
              </th>
              <th
                style={{
                  width: "20%",
                  border: "1px solid #ddd",
                  padding: "12px",
                  backgroundColor: "rgb(var(--light))",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Event Date
              </th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {activity.Event_ID}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {activity.Title}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {activity.Event_Type}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {activity.participant_count}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {getDate(activity.Date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
