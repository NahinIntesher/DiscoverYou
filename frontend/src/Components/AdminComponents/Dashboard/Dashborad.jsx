import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";
import Header from "../../CommonComponents/Header";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement);

const CATEGORIES = [
  "Hirings",
  "Contests",
  "Courses",
  "Communities",
  "Webinars",
];

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulating API call with dummy data
      const dummyData = {
        hirings: [
          { date: "2024-10-01", count: 4 },
          { date: "2024-10-01", count: 4 },
          // ... (other data points)
          { date: "2024-11-01", count: 5 },
          { date: "2024-01-01", count: 1 },
          // ... (other data points)
        ],
        contests: [
          { title: "Contest 1", count: 4 },
          { title: "Contest 2", count: 6 },
          // ... (other data points)
        ],
        courses: [
          { title: "Course 1", count: 7 },
          { title: "Course 2", count: 2 },
          // ... (other data points)
        ],
        communities: [
          { title: "Community 1", count: 1 },
          { title: "Community 2", count: 3 },
          // ... (other data points)
        ],
        webinars: [
          { title: "Webinar 1", count: 5 },
          { title: "Webinar 2", count: 4 },
          // ... (other data points)
        ],
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setData(dummyData);
      prepareChartData(dummyData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = (fetchedData) => {
    const newChartData = {
      hirings: prepareBarChartData(fetchedData.hirings, "Hirings"),
      contests: prepareBarChartData(fetchedData.contests, "Contests"),
      pieData: preparePieChartData(fetchedData.contests),
    };
    setChartData(newChartData);
  };

  const prepareBarChartData = (items, label) => ({
    labels: items.map((item) => item.date || item.title),
    datasets: [
      {
        label: `Total ${label}`,
        data: items.map((item) => item.count),
        backgroundColor:
          label === "Hirings"
            ? "rgba(75, 192, 192, 0.6)"
            : "rgba(255, 206, 86, 0.6)",
      },
    ],
  });

  const preparePieChartData = (items) => ({
    labels: items.map((item) => item.title),
    datasets: [
      {
        label: "Contest Participation",
        data: items.map((item) => item.count),
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  });

  const StatCard = ({ title, count }) => (
    <div style={styles.statCard}>
      <h2>
        Total {title}: {count}
      </h2>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {children}
    </div>
  );

  if (isLoading) {
    return <div style={styles.loading}>Loading dashboard data...</div>;
  }

  if (!data) {
    return (
      <div style={styles.error}>
        Error loading dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="mainContent">
      <div className="contentTitle">
        <div className="content">
          <div className="title">Dashboard</div>
        </div>
      </div>
      

      <div style={styles.statContainer}>
        {CATEGORIES.map((category) => (
          <StatCard
            key={category}
            title={category}
            count={data[category.toLowerCase()]?.length || 0}
          />
        ))}
      </div>

      <div style={styles.chartContainer}>
        <ChartCard title="Total Hirings">
          <div style={styles.scrollContainer}>
            <Bar data={chartData.hirings} options={styles.chartOptions} />
          </div>
        </ChartCard>

        <ChartCard title="Contest Participation">
          <Pie data={chartData.pieData} options={styles.chartOptions} />
        </ChartCard>

        <div style={styles.mapContainer}>
          <h3 style={styles.chartTitle}>Map</h3>
          <div style={styles.mapPlaceholder}>
            <span style={styles.placeholderText}>Map Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  statContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  statCard: {
    padding: "10px",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  chartContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-between",
  },
  chartCard: {
    flex: "1 1 calc(50% - 10px)",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    padding: "20px",
    maxHeight: "400px",
  },
  chartTitle: { textAlign: "center" },
  chartOptions: { responsive: true, maintainAspectRatio: false },
  scrollContainer: {
    overflowX: "auto", // Enable horizontal scrolling
    whiteSpace: "nowrap", // Prevent line breaks
  },
  mapContainer: {
    flex: "1 1 100%",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    padding: "20px",
    height: "300px",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e2e2e2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed #ccc",
    borderRadius: "8px",
  },
  placeholderText: { color: "#aaa" },
  loading: { textAlign: "center", fontSize: "1.2em", marginTop: "50px" },
  error: {
    textAlign: "center",
    fontSize: "1.2em",
    marginTop: "50px",
    color: "red",
  },
};
