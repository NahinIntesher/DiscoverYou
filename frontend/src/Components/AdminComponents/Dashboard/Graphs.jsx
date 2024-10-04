import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartCard = ({ title, icon, chart }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "0.375rem",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      gap: "1rem",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    }}
  >
    <div
      style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid rgba(209, 213, 219, 1)",
        display: "flex",
        backgroundColor: "rgb(var(--light))",
      }}
    >
      <span
        style={{
          fontSize: "1.125rem",
          color: "rgb(var(--extradark))",
        }}
      >
        {icon}
      </span>
      <h3
        style={{
          marginLeft: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "rgb(var(--extradark))",
        }}
      >
        {title}
      </h3>
    </div>
    <div
      style={{
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "18rem",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {chart}
      </div>{" "}
      {/* Allow full height and width */}
    </div>
  </div>
);

const Graphs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/dashboard/"
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const contestResults = data.contestResults;
  const courseResults = data.courseResults;
  const webinarResults = data.webinarResults;
  const productResults = data.productResults;
  const hiringResults = data.hiringResults;

  // Bar chart for contest participation
  const contestData = {
    labels: contestResults.map((contest) => contest.contestName),
    datasets: [
      {
        label: "Participation Count",
        data: contestResults.map((contest) => contest.participant_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow chart to fill its container
    },
  };

  // Pie chart for course participation percentages
  const courseData = {
    labels: courseResults.map((course) => course.courseName),
    datasets: [
      {
        label: "Participation Percentage",
        data: courseResults.map((course) => course.participation_percentage),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Line chart for webinar participation trends
  const webinarData = {
    labels: webinarResults.map((webinar) => webinar.webinarName),
    datasets: [
      {
        label: "Webinar Participation",
        data: webinarResults.map((webinar) => webinar.participant_count),
        fill: false,
        backgroundColor: "#742774",
        borderColor: "#742774",
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Bar chart for product sales
  const productData = {
    labels: productResults.map((product) => product.productName),
    datasets: [
      {
        label: "Total Sold",
        data: productResults.map((product) => product.total_sold),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Bar chart for hiring job participation
  const hiringData = {
    labels: hiringResults.map((job) => job.jobName),
    datasets: [
      {
        label: "Participant Count",
        data: hiringResults.map((job) => job.participant_count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // Pie chart for job application distribution
  const hiringPieData = {
    labels: hiringResults.map((job) => job.jobName),
    datasets: [
      {
        label: "Job Application Distribution",
        data: hiringResults.map((job) => job.participant_count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        flexGrow: "1",
        overflowY: "auto",
        padding: "5px",
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <ChartCard
          title="Contest Participation"
          icon="🏆"
          chart={<Bar data={contestData} />}
        />
        <ChartCard
          title="Product Sales"
          icon="🛒"
          chart={<Bar data={productData} />}
        />
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <ChartCard
          title="Hiring Distribution"
          icon="💼"
          chart={<Pie data={hiringPieData} />}
        />
        <ChartCard
          title="Course Participation"
          icon="📚"
          chart={<Pie data={courseData} />}
        />
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <ChartCard
          title="Webinar Participation"
          icon="🎤"
          chart={<Line data={webinarData} />}
        />
        <ChartCard
          title="Job Hiring Participation"
          icon="🔍"
          chart={<Bar data={hiringData} />}
        />
      </div>
    </div>
  );
};

export default Graphs;
