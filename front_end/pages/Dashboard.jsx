import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [boardCount, setBoardCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Fetch both active and completed boards counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [activeRes, completedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/boards/count"),
          axios.get("http://localhost:5000/api/boards/completed/count"),
        ]);

        setBoardCount(activeRes.data.count);
        setCompletedCount(completedRes.data.count);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { title: "Active Boards", value: boardCount, color: "bg-blue-500" },
    { title: "Pending Tasks", value: boardCount, color: "bg-yellow-500" },
    { title: "Completed Tasks", value: completedCount, color: "bg-green-500" },
  ];

  const recentActivity = [
    { user: "Ananya", action: "completed a task", time: "2 hrs ago" },
    { user: "Puskar", action: "created a new board", time: "4 hrs ago" },
    { user: "Ravi", action: "completed a task", time: "6 hrs ago" },
  ];

  return (
    <div className="p-6 min-h-screen w-full bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-md text-white ${item.color}`}
          >
            <h2 className="text-lg font-medium">{item.title}</h2>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <li key={index} className="py-3 flex justify-between">
              <div>
                <p className="text-gray-800">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
