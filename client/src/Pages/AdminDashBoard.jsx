import { Link } from "react-router-dom"
import AttendanceTable from "../components/AttendanceTable"

const AdminDashBoard = () => {
  return (
    <>
<div className="grid grid-cols-[250px_1fr] min-h-screen">
<div className="flex flex-col w-64 h-screen bg-blue-100">
      {/* Sidebar Header */}
      <div className="p-4 text-lg font-bold text-center text-white bg-blue-500">
        Dashboard
      </div>

      {/* Sidebar Items */}
      <nav className="flex flex-col p-4 space-y-4">
        {/* Attendance Section */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-blue-500">Attendance</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/attendance"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Attendance
              </Link>
            </li>
            <li>
              <Link
                to="/schedule"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                to="/report"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Employee Section */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-blue-500">Employee</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/register-employee"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Register New Employee
              </Link>
            </li>
            <li>
              <Link
                to="/employee-list"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Employee List
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile Section */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-blue-500">Profile</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase text-blue-500">Settings</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/feedback"
                className="block px-4 py-2 text-blue-700 rounded hover:bg-blue-200"
              >
                Feedback
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  <AttendanceTable />
</div>

    </>
  )
}

export default AdminDashBoard