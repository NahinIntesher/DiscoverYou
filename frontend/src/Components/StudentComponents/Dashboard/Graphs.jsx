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
import { FaChartBar, FaChartPie, FaChartLine, FaGraduationCap, FaTrophy } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const chartColors = {
  contests: ["rgba(59, 130, 246, 0.8)", "rgb(255, 125, 32)"],
  showcases: ["rgba(16, 185, 129, 0.8)", "rgba(107, 114, 128, 0.8)"],
  courses: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
  webinars: ["rgba(153, 102, 255, 0.8)", "rgba(255, 159, 64, 0.8)"],
  pie: ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)"],
};

const initialChartData = {
  contests: { labels: [], datasets: [] },
  showcases: { labels: [], datasets: [] },
  courses: { labels: [], datasets: [] },
  webinars: { labels: [], datasets: [] },
  pieData: { labels: [], datasets: [] },
};

export default function Dashboard() {
  const [data, setData] = useState({
    contests: {},
    showcases: {},
    courses: {},
    webinars: {},
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
        "http://localhost:3000/student/dashboard",
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
        ["User Participation", "Total Contest Participants"],
        [
          fetchedData.contestResults.user_participation_last_10_contests,
          fetchedData.contestResults.total_contest_participants,
        ],
        "Contests",
        chartColors.contests
      ),
      showcases: createChartData(
        ["User Posts", "Total Showcase Posts"],
        [
          fetchedData.showcaseResults.user_posts,
          fetchedData.showcaseResults.total_showcase_posts,
        ],
        "Showcases",
        chartColors.showcases
      ),
      courses: createChartData(
        ["Enrolled Courses", "Total Courses"],
        [
          fetchedData.courseResults.enrolled_courses,
          fetchedData.courseResults.total_courses,
        ],
        "Courses",
        chartColors.courses
      ),
      pieData: createChartData(
        ["Completed Courses", "Remaining Courses"],
        [
          fetchedData.courseResults.completed_courses,
          fetchedData.courseResults.total_courses -
            fetchedData.courseResults.completed_courses,
        ],
        "Course Completion",
        chartColors.pie
      ),
      webinars: createChartData(
        ["User Participation", "Total Webinars Last 10"],
        [
          fetchedData.webinarResults.user_participation_last_10_webinars,
          fetchedData.webinarResults.total_webinars_last_10,
        ],
        "Webinars",
        chartColors.webinars
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 p-2">
      <ChartCard title="Participation in last 10 Contests" icon={<FaTrophy />} chart={<Bar data={chartData.contests} options={barChartOptions} />} />
      <ChartCard title="Showcase Posts" icon={<FaChartBar />} chart={<Bar data={chartData.showcases} options={barChartOptions} />} />
      <ChartCard title="Webinar Participation" icon={<FaChartLine />} chart={<Bar data={chartData.webinars} options={barChartOptions} />} />
      <ChartCard title="Courses Overview" icon={<FaGraduationCap />} chart={<Bar data={chartData.courses} options={barChartOptions} />} />
      <ChartCard title="Course Completion" icon={<FaChartPie />} chart={<Pie data={chartData.pieData} options={pieChartOptions} />} />
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ChartCard = ({ title, icon, chart }) => (
  <div className="bg-white rounded-md shadow-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center">
      <span className="text-2xl text-gray-600">{icon}</span>
      <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-2 flex justify-center items-center" style={{ height: '200px' }}>
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
          size: 14 
        } 
      },
    },
  },
};