import  { useState } from "react";

const AttendanceTable = () => {
  // Sample data
  const [data, setData] = useState([
    {
      profile: "profile1.png",
      id: 101,
      name: "Ramesh",
      shift: "Night",
      task: "Watchman",
      checkIn: "8:00 PM",
      checkOut: "8:00 AM",
      hours: "12 hr",
    },
    {
      profile: "profile2.png",
      id: 102,
      name: "Sita",
      shift: "Day",
      task: "Kitchen",
      checkIn: "8:00 AM",
      checkOut: "2:00 PM",
      hours: "6 hr",
    },
    {
      profile: "profile3.png",
      id: 103,
      name: "Joseb",
      shift: "Afternoon",
      task: "Security Guard",
      checkIn: "2:00 PM",
      checkOut: "8:00 PM",
      hours: "6 hr",
    },
  ]);

  const [filter, setFilter] = useState("");

  // Filtered data based on selected filter
  const filteredData =
    filter === "byTask"
      ? data.filter((item) => item.task)
      : filter === "byAbsent"
      ? [] // Add logic for absent employees
      : filter === "byPresent"
      ? data
      : data;

  return (
    <div className="p-8 bg-gray-100 min-h-screen ">
      {/* Header Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-white rounded ${
              filter === "byTask" ? "bg-blue-600" : "bg-blue-400"
            } hover:bg-blue-500`}
            onClick={() => setFilter("byTask")}
          >
            By Task
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              filter === "byAbsent" ? "bg-red-600" : "bg-red-400"
            } hover:bg-red-500`}
            onClick={() => setFilter("byAbsent")}
          >
            By Absent
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              filter === "byPresent" ? "bg-green-600" : "bg-green-400"
            } hover:bg-green-500`}
            onClick={() => setFilter("byPresent")}
          >
            By Present
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Profile</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Shift</th>
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Check In</th>
              <th className="px-4 py-2">Check Out</th>
              <th className="px-4 py-2">Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2">
                    <img
                      src={item.profile}
                      alt="profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.shift}</td>
                  <td className="px-4 py-2">{item.task}</td>
                  <td className="px-4 py-2">{item.checkIn}</td>
                  <td className="px-4 py-2">{item.checkOut}</td>
                  <td className="px-4 py-2">{item.hours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
