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
  FaShoppingCart,
} from "react-icons/fa";

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
  courses: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(255, 206, 86, 0.8)"],
  webinars: ["rgba(153, 102, 255, 0.8)", "rgba(255, 159, 64, 0.8)"],
  products: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"],
  pie: ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)"],
};

const initialChartData = {
  contests: null,
  showcases: null,
  courses: null,
  webinars: null,
  products: null,
  pieData: null,
};

export default function Graphs() {
  const [chartData, setChartData] = useState(initialChartData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3000/student/dashboard",
        { withCredentials: true }
      );
      const profileData = response.data;
      prepareChartData(profileData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = (fetchedData) => {
    const newChartData = {
      contests: createChartData(
        ["User Participation", "Total Contests"],
        [
          fetchedData.contestResults.participation_by_user,
          fetchedData.contestResults.total_contests,
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
        ["Enrolled Courses", "Completed Courses", "Total Courses"],
        [
          fetchedData.courseResults.enrolled_courses,
          fetchedData.courseResults.completed_courses,
          fetchedData.courseResults.total_courses,
        ],
        "Courses",
        chartColors.courses
      ),
      pieData: createChartData(
        ["Completed Courses", "Remaining Courses"],
        [
          fetchedData.courseResults.completed_courses,
          fetchedData.courseResults.enrolled_courses - fetchedData.courseResults.completed_courses,
        ],
        "Course Completion",
        chartColors.pie
      ),
      webinars: createChartData(
        ["User Participation", "Total Webinars"],
        [
          fetchedData.webinarResults.participation_by_user,
          fetchedData.webinarResults.total_webinars,
        ],
        "Webinars",
        chartColors.webinars
      ),
      products: createChartData(
        ["Posted by User", "Total Products"],
        [
          fetchedData.productResults.posted_by_user,
          fetchedData.productResults.total_products,
        ],
        "Products",
        chartColors.products
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

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
      {chartData.contests && (
        <ChartCard
          title="Contests Overview"
          icon={<FaTrophy />}
          chart={<Bar data={chartData.contests} options={barChartOptions} />}
        />
      )}
      {chartData.showcases && (
        <ChartCard
          title="Showcase Posts"
          icon={<FaChartBar />}
          chart={<Bar data={chartData.showcases} options={barChartOptions} />}
        />
      )}
      {chartData.webinars && (
        <ChartCard
          title="Webinar Participation"
          icon={<FaChartLine />}
          chart={<Bar data={chartData.webinars} options={barChartOptions} />}
        />
      )}
      {chartData.courses && (
        <ChartCard
          title="Courses Overview"
          icon={<FaGraduationCap />}
          chart={<Bar data={chartData.courses} options={barChartOptions} />}
        />
      )}
      {chartData.pieData && (
        <ChartCard
          title="Course Completion"
          icon={<FaChartPie />}
          chart={<Pie data={chartData.pieData} options={pieChartOptions} />}
        />
      )}
      {chartData.products && (
        <ChartCard
          title="Products Overview"
          icon={<FaShoppingCart />}
          chart={<Bar data={chartData.products} options={barChartOptions} />}
        />
      )}
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-red-500 text-xl">{message}</div>
  </div>
);

const ChartCard = ({ title, icon, chart }) => (
  <div className="bg-white rounded-md shadow-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex bg-gradient-to-r from-[rgb(var(--light))] to-[rgb(var(--light))]">
      <span className="text-lg text-[rgb(var(--extradark))]">{icon}</span>
      <h3 className="ml-2 text-sm font-semibold text-[rgb(var(--extradark))]">{title}</h3>
    </div>
    <div className="p-4 flex justify-center items-center h-64">{chart}</div>
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