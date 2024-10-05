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
  };

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
  };

  return (
    <div
      className="graphs-container "
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        flexGrow: "1",
        overflowY: "auto",
        padding: "6px",
      }}
    >
      <div className="bg-white p-5 m-5 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
        <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
          Contest Participations
        </h2>
        <Bar data={contestData} />
      </div>

      <div className="bg-white p-5 m-5 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
        <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
          Product Sales
        </h2>
        <Bar data={productData} />
      </div>

      <div className="bg-white p-5 m-5 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
        <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
          Webinar Participation Trends
        </h2>
        <Line data={webinarData} />
      </div>
      <div className="bg-white p-5 m-5 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
        <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
          Job Hiring Participation
        </h2>
        <Bar data={hiringData} />
      </div>

      <div className="flex gap-1 justify-center">
        <div className="bg-white px-2 py-5 m-2 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
          <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
            Hiring Distributions
          </h2>
          <Pie data={hiringPieData} />
        </div>

        <div className="bg-white px-2 py-5 m-2 text-sm rounded-xl shadow-xl w-auto flex flex-col text-center">
          <h2 className="text-lg font-bold mb-5 text-[rgb(var(--medium))]">
            Course Participations
          </h2>
          <Pie data={courseData} />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
