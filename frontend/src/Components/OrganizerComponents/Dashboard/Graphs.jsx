import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaGraduationCap,
  FaTrophy,
  FaBriefcase, // Add this import for the hiring icon
} from "react-icons/fa";
import BottomPart from "./RecentActivity";
import RecentActivity from "./RecentActivity";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartColors = {
  contests: ["rgba(59, 130, 246, 0.8)", "rgb(255, 125, 32)"],
  showcases: ["rgba(16, 185, 129, 0.8)", "rgba(107, 114, 128, 0.8)"],
  courses: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
  webinars: ["rgba(153, 102, 255, 0.8)", "rgba(255, 159, 64, 0.8)"],
  hirings: ["rgba(255, 206, 86, 0.8)", "rgba(54, 162, 235, 0.8)"], // Add color for hirings
  pie: ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)"],
};

const initialChartData = {
  contests: { labels: [], datasets: [] },
  showcases: { labels: [], datasets: [] },
  courses: { labels: [], datasets: [] },
  webinars: { labels: [], datasets: [] },
  hirings: { labels: [], datasets: [] }, // Add initial data for hirings
  pieData: { labels: [], datasets: [] },
};

export default function Graphs() {
  const [data, setData] = useState({
    contests: {},
    showcases: {},
    courses: {},
    webinars: {},
    hirings: {}, // Add hirings to the state
  });
  const [chartData, setChartData] = useState(initialChartData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/organizer/dashboard",
        { withCredentials: true }
      );
      const profileData = response.data;
      setData(profileData);
      prepareChartData(profileData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = (fetchedData) => {
    const newChartData = {
      contests: createChartData(
        ["User Organized", "Total Contests"],
        [
          fetchedData.contestResults.contests_organized, // Update as needed
          fetchedData.contestResults.total_contests,
        ],
        "Contests",
        chartColors.contests
      ),
      webinars: createChartData(
        ["User Hosted", "Total Webinars"],
        [
          fetchedData.webinarResults.webinars_hosted,
          fetchedData.webinarResults.total_webinars,
        ],
        "Webinars",
        chartColors.webinars
      ),
      hirings: createChartData(
        ["User Organized", "Total Hirings"],
        [
          fetchedData.hiringResults.hirings_organized,
          fetchedData.hiringResults.total_hirings,
        ],
        "Hirings",
        chartColors.hirings
      ),
    };

    setChartData(newChartData);
  };

  const createChartData = (labels, data, label, backgroundColor) => ({
    labels,
    datasets: [{ label, data, backgroundColor }],
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: "0.25rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "0.25rem",
        }}
      >
        <div className="semi-container">
          <div>
            <ChartCard
              title="Contests Overview"
              icon={<FaTrophy />}
              chart={
                <Bar data={chartData.contests} options={barChartOptions} />
              }
            />
          </div>
          <div>
            <ChartCard
              title="Webinars Overview"
              icon={<FaChartLine />}
              chart={
                <Bar data={chartData.webinars} options={barChartOptions} />
              }
            />
            <ChartCard
              title="Hirings Overview"
              icon={<FaBriefcase />} // Icon for hirings
              chart={<Bar data={chartData.hirings} options={barChartOptions} />}
            />
          </div>
        </div>
      </div>
      <RecentActivity />
    </div>
  );
}

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // height: "100vh"
    }}
  >
    <div
      style={{
        width: "4rem",
        height: "4rem",
        border: "4px solid rgba(59, 130, 246, 1)",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
  </div>
);

const ChartCard = ({ title, icon, chart }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "0.375rem",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid rgba(209, 213, 219, 1)",
        display: "flex",
        background:
          "linear-gradient(to right, rgb(var(--light)), rgb(var(--light)))",
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
        height: "12rem",
      }}
    >
      {chart}
    </div>
  </div>
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 14,
        },
      },
    },
    x: {
      ticks: {
        font: {
          size: 14,
        },
      },
    },
  },
};

const barChartOptions = {
  ...chartOptions,
  barPercentage: 0.6,
  categoryPercentage: 0.7,
};

const pieChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 15,
        font: {
          size: 14,
        },
      },
    },
  },
};
