import { useEffect, useState, useRef } from "react";
import { CalendarIcon, LogIn, LogOut, Edit, Edit2, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

const roles = ["All Status", "Present", "Absent", "Late", "Grace Present", "Half Day"];

// ✅ Filter Dropdown
const AllStatus = ({ onSelect }) => {
  const [selected, setSelected] = useState("All Status");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    onSelect(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-52" ref={dropdownRef}>
      <div
        className="flex items-center justify-between bg-[#f3f3f5] rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-black">
          {/* Funnel icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-funnel text-gray-500"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <span>{selected}</span>
        </div>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
          {roles.map((r) => (
            <div
              key={r}
              onClick={() => handleSelect(r)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Edit Modal (unchanged)
const EditModal = ({ attendance, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clockIn: attendance.clockIn || "",
    clockOut: attendance.clockOut || "",
    status: attendance.status || "Present",
  });

  const formatForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const toFullISOString = (localValue) => {
    if (!localValue) return "";
    return new Date(localValue).toISOString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "clockIn" || name === "clockOut"
          ? toFullISOString(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-center">Edit Attendance</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Clock In</label>
            <input
              type="datetime-local"
              name="clockIn"
              value={formatForInput(formData.clockIn)}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Clock Out</label>
            <input
              type="datetime-local"
              name="clockOut"
              value={formatForInput(formData.clockOut)}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
              <option value="Grace Present">Grace Present</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Main EmployeeTable
const EmployeeTable = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [viewAttendance, setViewAttendance] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ✅ Fetch attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        let url =
          role?.toLowerCase() === "employee"
            ? `http://localhost:4000/attendance/${userId}`
            : "http://localhost:4000/attendance/getAllAttendance";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        let allData = Array.isArray(data) ? data : data.data || [];

        if (role?.toLowerCase() === "employee") {
          allData = allData.filter((item) => item.employee?._id === userId);
        }

        allData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEmployeeData(allData);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userId, role, token]);

  // ✅ Fetch company name when view modal opens
  useEffect(() => {
    const fetchCompanyName = async () => {
      if (viewAttendance?.company?._id) {
        try {
          const res = await fetch(
            `http://localhost:4000/company/${viewAttendance.company._id}`
          );
          const data = await res.json();
          setCompanyName(data.company?.companyName || "N/A");
        } catch (err) {
          console.error("Error fetching company name:", err);
          setCompanyName("N/A");
        }
      }
    };
    fetchCompanyName();
  }, [viewAttendance]);

  const formatTime = (time) =>
    time ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString([], {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const calculateWorkingHours = (clockIn, clockOut, status) => {
    if (clockIn && clockOut)
      return ((new Date(clockOut) - new Date(clockIn)) / 36e5).toFixed(2);
    if (status === "Absent") return "0.00";
    return "-";
  };

  const handleSave = async (updatedData) => {
    try {
      const res = await fetch(
        `http://localhost:4000/attendance/${editingAttendance._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      const updatedAttendance = await res.json();

      setEmployeeData((prev) =>
        prev.map((att) =>
          att._id === updatedAttendance._id ? updatedAttendance : att
        )
      );

      setEditingAttendance(null);
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  // ✅ Filtered Data
  const filteredData =
    selectedStatus === "All Status"
      ? employeeData
      : employeeData.filter((u) => u.status === selectedStatus);

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-x-auto">
      {["admin", "superadmin"].includes(role?.toLowerCase()) && (
        <div className="flex justify-end p-3">
          <AllStatus onSelect={(status) => setSelectedStatus(status)} />
        </div>
      )}

      <table className="w-full rounded-md overflow-hidden shadow-md border-gray-200 whitespace-nowrap">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-left">
            <th className="p-3 text-sm font-semibold text-gray-700">Employee</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Department</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Check In</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Check Out</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Working Hours</th>
            {role?.toLowerCase() === "admin" && (
              <th className="p-3 text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500">
                No attendance records found.
              </td>
            </tr>
          ) : (
            filteredData.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-800">
                      {u.employee?.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        {u.employee?.fullName || "Unknown"}
                      </div>
                      {u.employee?.email && (
                        <div className="text-xs text-gray-400">
                          {u.employee.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {u.employee?.department || "N/A"}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(u.date)}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-green-600" />
                    <span>{formatTime(u.clockIn)}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>{formatTime(u.clockOut)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={u.status} />
                </td>
                <td className="p-3 text-sm font-medium text-gray-800">
                  {calculateWorkingHours(u.clockIn, u.clockOut, u.status) !== "-"
                    ? `${calculateWorkingHours(
                        u.clockIn,
                        u.clockOut,
                        u.status
                      )} hrs`
                    : "-"}
                </td>
                {role?.toLowerCase() === "admin" && (
                  <td className="p-3 text-sm text-gray-700 flex gap-2">
                    <button
                      onClick={() => setEditingAttendance(u)}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      {/* <Edit className="w-4 h-4" /> */}
                                            <Edit2 size={16} />

                    </button>
                    <button
                      onClick={() => setViewAttendance(u)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                                            <Eye size={16} />

                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Edit Modal */}
      {editingAttendance && (
        <EditModal
          attendance={editingAttendance}
          onClose={() => setEditingAttendance(null)}
          onSave={handleSave}
        />
      )}

      {/* ✅ View Modal */}
      {viewAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-center">
              Attendance Details
            </h2>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-800">
                  {viewAttendance.employee?.fullName?.charAt(0)?.toUpperCase() ||
                    "?"}
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {viewAttendance.employee?.fullName || "Unknown"}
                  </div>
                  {viewAttendance.employee?.email && (
                    <div className="text-gray-400">
                      {viewAttendance.employee.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="font-medium">Department:</span>{" "}
                {viewAttendance.employee?.department || "N/A"}
              </div>

              <div>
                <span className="font-medium">Role:</span>{" "}
                {viewAttendance.employee?.role || "N/A"}
              </div>

              <div>
                <span className="font-medium">Company:</span>{" "}
                {companyName || "N/A"}
              </div>

              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(viewAttendance.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-green-600" />
                <span>{formatTime(viewAttendance.clockIn)}</span>
              </div>

              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-600" />
                <span>{formatTime(viewAttendance.clockOut)}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium">Status:</span>
                <StatusBadge status={viewAttendance.status} />
              </div>

              <div>
                <span className="font-medium">Working Hours:</span>{" "}
                {calculateWorkingHours(
                  viewAttendance.clockIn,
                  viewAttendance.clockOut,
                  viewAttendance.status
                ) !== "-"
                  ? `${calculateWorkingHours(
                      viewAttendance.clockIn,
                      viewAttendance.clockOut,
                      viewAttendance.status
                    )} hrs`
                  : "-"}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewAttendance(null)}
                className="rounded bg-gray-200 px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
