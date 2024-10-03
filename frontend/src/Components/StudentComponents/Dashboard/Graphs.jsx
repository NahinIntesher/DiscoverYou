import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "../../../assets/styles/dashboard.css";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define color palettes for different charts
const chartColors = {
  contests: [
    "rgba(59, 130, 246, 0.8)", // blue-500
    "rgb(255, 125, 32)", // orange-500
  ],
  showcases: [
    "rgba(16, 185, 129, 0.8)", // emerald-500
    "rgba(107, 114, 128, 0.8)", // gray-500
  ],
  courses: [
    "rgba(75, 192, 192, 0.8)", // teal
    "rgba(255, 99, 132, 0.8)", // red
  ],
  webinars: [
    "rgba(153, 102, 255, 0.8)", // purple
    "rgba(255, 159, 64, 0.8)", // orange
  ],
  pie: [
    "rgba(54, 162, 235, 0.8)", // blue
    "rgba(255, 206, 86, 0.8)", // yellow
  ],
};

const Card = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div
    style={{
      padding: "15px",
      borderBottom: "1px solid #e5e7eb",
    }}
  >
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3
    style={{
      fontSize: "18px",
      fontWeight: 600,
      color: "#1f2937",
    }}
  >
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div style={{ padding: "24px" }}>{children}</div>
);

export default function Graphs({ user }) {
  const [data, setData] = useState({
    contests: {},
    showcases: {},
    courses: {},
    webinars: {},
  });
  const [chartData, setChartData] = useState({
    contests: { labels: [], datasets: [] },
    showcases: { labels: [], datasets: [] },
    courses: { labels: [], datasets: [] },
    webinars: { labels: [], datasets: [] },
    pieData: { labels: [], datasets: [] },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        "http://localhost:3000/student/dashboard"
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
      contests: {
        labels: ["User Participation", "Total Contest Participants"],
        datasets: [
          {
            label: "Contests",
            data: [
              fetchedData.contestResults.user_participation_last_10_contests,
              fetchedData.contestResults.total_contest_participants,
            ],
            backgroundColor: chartColors.contests,
          },
        ],
      },
      showcases: {
        labels: ["User Posts", "Total Showcase Posts"],
        datasets: [
          {
            label: "Showcases",
            data: [
              fetchedData.showcaseResults.user_posts,
              fetchedData.showcaseResults.total_showcase_posts,
            ],
            backgroundColor: chartColors.showcases,
          },
        ],
      },
      courses: {
        labels: ["Enrolled Courses", "Total Courses"],
        datasets: [
          {
            label: "Courses",
            data: [
              fetchedData.courseResults.enrolled_courses,
              fetchedData.courseResults.total_courses,
            ],
            backgroundColor: chartColors.courses,
          },
        ],
      },
      pieData: {
        labels: ["Completed Courses", "Remaining Courses"],
        datasets: [
          {
            label: "Course Completion",
            data: [
              fetchedData.courseResults.completed_courses,
              fetchedData.courseResults.total_courses -
                fetchedData.courseResults.completed_courses,
            ],
            backgroundColor: chartColors.pie,
          },
        ],
      },
      webinars: {
        labels: ["User Participation", "Total Webinars Last 10"],
        datasets: [
          {
            label: "Webinars",
            data: [
              fetchedData.webinarResults.user_participation_last_10_webinars,
              fetchedData.webinarResults.total_webinars_last_10,
            ],
            backgroundColor: chartColors.webinars,
          },
        ],
      },
    };

    setChartData(newChartData);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      <Card style={{ height: "350px" }}>
        <CardHeader>
          <CardTitle>Participation in last 10 Contests</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={chartData.contests}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card style={{ height: "350px" }}>
        <CardHeader>
          <CardTitle>Showcase Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={chartData.showcases}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card style={{ height: "350px" }}>
        <CardHeader>
          <CardTitle>Webinar Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={chartData.webinars}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card style={{ height: "350px" }}>
        <CardHeader>
          <CardTitle>Courses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={chartData.courses}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
            }}
          />
        </CardContent>
      </Card>
      <Card style={{ height: "350px" }}>
        <CardHeader>
          <CardTitle>Course Completion</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <div className="w-40 h-40">
            <Pie
              data={chartData.pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { boxWidth: 10, font: { size: 10 } },
                  },
                  title: { display: false },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
