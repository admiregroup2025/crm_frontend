// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   ChartNoAxesCombined,
// // //   Clock4,
// // //   UserCheck,
// // //   Users,
// // //   LogIn,
// // //   LogOut,
// // //   Download,
// // //   Calendar as CalendarIcon,
// // // } from "lucide-react";

// // // import { toast, ToastContainer } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";

// // // import Attendance from "../attendance/Attendence.jsx";
// // // import EmployeeTable from "./EmployeeTable.jsx";
// // // import SearchEmployes from "./SearchEmployes.jsx";
// // // // import AllStatus from "./AllStatus.jsx";

// // // const MainAttendance = () => {
// // //   const employeeId = localStorage.getItem("userId");
// // //   const companyId = localStorage.getItem("companyId");

// // //   const [loadingClock, setLoadingClock] = useState(false);
// // //   const [todayRecord, setTodayRecord] = useState(null);

// // //   const stats = [
// // //     { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
// // //     { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
// // //     { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
// // //     { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
// // //   ];

// // //   const today = new Date();
// // //   const formattedDate = today.toLocaleDateString("en-US");

// // //   // ============================
// // //   // Fetch today's attendance record
// // //   // ============================
// // //   useEffect(() => {
// // //     const fetchTodayAttendance = async () => {
// // //       if (!employeeId) {
// // //         console.warn("Missing employeeId in localStorage");
// // //         return;
// // //       }
// // //       try {
// // //         const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
// // //         if (!res.ok) throw new Error("Failed to fetch attendance");
// // //         const data = await res.json();

// // //         // Filter records for this employee
// // //         const employeeRecords = data.filter(record => record.employee?._id === employeeId);

// // //         // Find today's record
// // //         const todayRec = employeeRecords.find(record => {
// // //           const recordDate = new Date(record.date);
// // //           return (
// // //             recordDate.getDate() === today.getDate() &&
// // //             recordDate.getMonth() === today.getMonth() &&
// // //             recordDate.getFullYear() === today.getFullYear()
// // //           );
// // //         });

// // //         setTodayRecord(todayRec || null);
// // //       } catch (err) {
// // //         console.error("Error fetching today's attendance:", err);
// // //       }
// // //     };

// // //     fetchTodayAttendance();
// // //   }, [employeeId]);

// // //   // ============================
// // //   // CLOCK IN
// // //   // ============================
// // //   const handleClockIn = async () => {
// // //     if (loadingClock) return;

// // //     if (!employeeId) {
// // //       toast.error("Missing employee ID");
// // //       return;
// // //     }

// // //     if (todayRecord && todayRecord.clockIn) {
// // //       toast.warning("You have already clocked in today.");
// // //       return;
// // //     }

// // //     try {
// // //       setLoadingClock(true);
// // //       const res = await fetch("http://localhost:4000/attendance/clockin", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ employeeId, companyId }),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         toast.warning(data.message || "Clock-in failed");
// // //       } else {
// // //         toast.success(data.message || "Clocked in successfully");
// // //         setTodayRecord({
// // //           ...data.attendance,
// // //           clockIn: data.attendance.clockIn || new Date().toISOString(),
// // //         });
// // //       }
// // //     } catch (err) {
// // //       toast.error("Server error during Clock In");
// // //       console.error(err);
// // //     } finally {
// // //       setLoadingClock(false);
// // //     }
// // //   };

// // //   // ============================
// // //   // CLOCK OUT
// // //   // ============================
// // //   const handleClockOut = async () => {
// // //     if (loadingClock) return;

// // //     if (!employeeId) {
// // //       toast.error("Missing employee ID");
// // //       return;
// // //     }

// // //     if (!todayRecord || !todayRecord.clockIn) {
// // //       toast.warning("You need to clock in first.");
// // //       return;
// // //     }

// // //     if (todayRecord.clockOut) {
// // //       toast.warning("You have already clocked out today.");
// // //       return;
// // //     }

// // //     try {
// // //       setLoadingClock(true);
// // //       const res = await fetch("http://localhost:4000/attendance/clockout", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ employeeId, companyId }),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         toast.warning(data.message || "Clock-out failed");
// // //       } else {
// // //         toast.success(data.message || "Clocked out successfully");
// // //         setTodayRecord(prev => ({
// // //           ...prev,
// // //           ...data.attendance,
// // //           clockOut: data.attendance.clockOut || new Date().toISOString(),
// // //         }));
// // //       }
// // //     } catch (err) {
// // //       toast.error("Server error during Clock Out");
// // //       console.error(err);
// // //     } finally {
// // //       setLoadingClock(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex max-h-[82vh] flex-col gap-6 overflow-y-auto px-4 py-6">
// // //       <ToastContainer position="top-right" autoClose={3000} />

// // //       {/* Top Stats */}
// // //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
// // //         {stats.map(item => (
// // //           <div key={item.id} className="w-full rounded-md">
// // //             <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
// // //               <div className="mb-4 flex items-center justify-between">
// // //                 <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
// // //                 <div className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500">{item.icon}</div>
// // //               </div>
// // //               <div>
// // //                 <div
// // //                   className={`text-left font-semibold leading-tight ${
// // //                     item.value === "5" || item.value === "12"
// // //                       ? "text-red-500"
// // //                       : item.value === "84"
// // //                       ? "text-green-500"
// // //                       : "text-slate-700"
// // //                   }`}
// // //                 >
// // //                   {item.value}
// // //                 </div>
// // //                 <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Bottom Section */}
// // //       <div className="flex flex-col gap-6 md:flex-row">
// // //         {/* Quick Actions */}
// // //         <div className="flex h-96 w-80 flex-col gap-4 rounded-md border bg-white p-5 shadow-sm">
// // //           <p className="text-lg font-semibold">Quick Actions</p>
// // //           <div className="flex flex-col gap-3">
// // //             <button
// // //               onClick={handleClockIn}
// // //               disabled={loadingClock}
// // //               className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
// // //             >
// // //               <LogIn size={18} />
// // //               Clock In
// // //             </button>
// // //             <button
// // //               onClick={handleClockOut}
// // //               disabled={loadingClock}
// // //               className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
// // //             >
// // //               <LogOut size={18} />
// // //               Clock Out
// // //             </button>
// // //             <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50">
// // //               <Download size={18} />
// // //               Export Report
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Attendance Calendar */}
// // //         <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
// // //           <Attendance />
// // //         </div>
// // //       </div>

// // //       {/* Search and Filters */}
// // //       <div>
// // //         <div className="flex justify-between py-5">
// // //           <SearchEmployes />
// // //           {/* <AllStatus /> */}
// // //           <div className="flex items-center gap-2 text-gray-700">
// // //             <CalendarIcon size={20} className="text-gray-500" />
// // //             <span className="text-sm">{formattedDate}</span>
// // //           </div>
// // //         </div>

// // //         {/* Attendance Table */}
// // //         <div>
// // //           <EmployeeTable />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default MainAttendance;



// // import React, { useState, useEffect } from "react";
// // import {
// //   ChartNoAxesCombined,
// //   Clock4,
// //   UserCheck,
// //   Users,
// //   LogIn,
// //   LogOut,
// //   Download,
// //   Calendar as CalendarIcon,
// // } from "lucide-react";

// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // import Attendance from "../attendance/Attendence.jsx";
// // import EmployeeTable from "./EmployeeTable.jsx";
// // import SearchEmployes from "./SearchEmployes.jsx";

// // const MainAttendance = () => {
// //   // ====================
// //   // User Info & Role
// //   // ====================
// //   const [role, setRole] = useState("");
// //   const employeeId = localStorage.getItem("userId");
// //   const companyId = localStorage.getItem("companyId");

// //   useEffect(() => {
// //     const storedRole = localStorage.getItem("role");
// //     setRole(storedRole ? storedRole.toLowerCase() : "");
// //   }, []);

// //   // ====================
// //   // State
// //   // ====================
// //   const [loadingClock, setLoadingClock] = useState(false);
// //   const [todayRecord, setTodayRecord] = useState(null);

// //   const today = new Date();
// //   const formattedDate = today.toLocaleDateString("en-US");

// //   // ====================
// //   // Stats (visible to all roles)
// //   // ====================
// //   const stats = [
// //     { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
// //     { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
// //     { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
// //     { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
// //   ];

// //   // ====================
// //   // Fetch today's attendance record (Employee only)
// //   // ====================
// //   useEffect(() => {
// //     const fetchTodayAttendance = async () => {
// //       if (role !== "employee" || !employeeId) return;

// //       try {
// //         const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
// //         if (!res.ok) throw new Error("Failed to fetch attendance");
// //         const data = await res.json();

// //         const employeeRecords = data.filter(record => record.employee?._id === employeeId);

// //         const todayRec = employeeRecords.find(record => {
// //           const recordDate = new Date(record.date);
// //           return (
// //             recordDate.getDate() === today.getDate() &&
// //             recordDate.getMonth() === today.getMonth() &&
// //             recordDate.getFullYear() === today.getFullYear()
// //           );
// //         });

// //         setTodayRecord(todayRec || null);
// //       } catch (err) {
// //         console.error("Error fetching today's attendance:", err);
// //       }
// //     };

// //     fetchTodayAttendance();
// //   }, [employeeId, role, today]);

// //   // ====================
// //   // Clock In / Clock Out (Employee only)
// //   // ====================
// //   const handleClockIn = async () => {
// //     if (loadingClock) return;
// //     if (!employeeId) return toast.error("Missing employee ID");
// //     if (todayRecord?.clockIn) return toast.warning("You have already clocked in today.");

// //     try {
// //       setLoadingClock(true);
// //       const res = await fetch("http://localhost:4000/attendance/clockin", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ employeeId, companyId }),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) return toast.warning(data.message || "Clock-in failed");

// //       toast.success(data.message || "Clocked in successfully");
// //       setTodayRecord({ ...data.attendance, clockIn: data.attendance.clockIn || new Date().toISOString() });
// //     } catch (err) {
// //       toast.error("Server error during Clock In");
// //       console.error(err);
// //     } finally {
// //       setLoadingClock(false);
// //     }
// //   };

// //   const handleClockOut = async () => {
// //     if (loadingClock) return;
// //     if (!employeeId) return toast.error("Missing employee ID");
// //     if (!todayRecord?.clockIn) return toast.warning("You need to clock in first.");
// //     if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");

// //     try {
// //       setLoadingClock(true);
// //       const res = await fetch("http://localhost:4000/attendance/clockout", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ employeeId, companyId }),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) return toast.warning(data.message || "Clock-out failed");

// //       toast.success(data.message || "Clocked out successfully");
// //       setTodayRecord(prev => ({ ...prev, ...data.attendance, clockOut: data.attendance.clockOut || new Date().toISOString() }));
// //     } catch (err) {
// //       toast.error("Server error during Clock Out");
// //       console.error(err);
// //     } finally {
// //       setLoadingClock(false);
// //     }
// //   };

// //   // ====================
// //   // Render
// //   // ====================
// //   return (
// //     <div className="flex max-h-[82vh] flex-col gap-6 overflow-y-auto px-4 py-6">
// //       <ToastContainer position="top-right" autoClose={3000} />

// //       {/* Top Stats (all roles) */}
// //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
// //         {stats.map(item => (
// //           <div key={item.id} className="w-full rounded-md">
// //             <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
// //               <div className="mb-4 flex items-center justify-between">
// //                 <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
// //                 <div className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500">{item.icon}</div>
// //               </div>
// //               <div>
// //                 <div
// //                   className={`text-left font-semibold leading-tight ${
// //                     item.value === "5" || item.value === "12"
// //                       ? "text-red-500"
// //                       : item.value === "84"
// //                       ? "text-green-500"
// //                       : "text-slate-700"
// //                   }`}
// //                 >
// //                   {item.value}
// //                 </div>
// //                 <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Bottom Section: Quick Actions + Attendance Calendar (Employee Only) */}
// //       {role === "employee" && (
// //         <div className="flex flex-col gap-6 md:flex-row">
// //           {/* Quick Actions */}
// //           <div className="flex h-96 w-80 flex-col gap-4 rounded-md border bg-white p-5 shadow-sm">
// //             <p className="text-lg font-semibold">Quick Actions</p>
// //             <div className="flex flex-col gap-3">
// //               <button
// //                 onClick={handleClockIn}
// //                 disabled={loadingClock}
// //                 className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <LogIn size={18} />
// //                 Clock In
// //               </button>
// //               <button
// //                 onClick={handleClockOut}
// //                 disabled={loadingClock}
// //                 className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 <LogOut size={18} />
// //                 Clock Out
// //               </button>
// //               <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50">
// //                 <Download size={18} />
// //                 Export Report
// //               </button>
// //             </div>
// //           </div>

// //           {/* Attendance Calendar */}
// //           <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
// //             <Attendance />
// //           </div>
// //         </div>
// //       )}

// //       {/* Search and Filters + Attendance Table (all roles) */}
// //       <div>
// //         <div className="flex justify-between py-5">
// //           <SearchEmployes />
// //           <div className="flex items-center gap-2 text-gray-700">
// //             <CalendarIcon size={20} className="text-gray-500" />
// //             <span className="text-sm">{formattedDate}</span>
// //           </div>
// //         </div>

// //         <EmployeeTable />
// //       </div>
// //     </div>
// //   );
// // };

// // export default MainAttendance;

// import React, { useState, useEffect } from "react";
// import {
//   ChartNoAxesCombined,
//   Clock4,
//   UserCheck,
//   Users,
//   LogIn,
//   LogOut,
//   Download,
//   Calendar as CalendarIcon,
// } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Attendance from "../attendance/Attendence.jsx";
// import EmployeeTable from "./EmployeeTable.jsx";
// import SearchEmployes from "./SearchEmployes.jsx";

// const MainAttendance = () => {
//   const employeeId = localStorage.getItem("userId");
//   const companyId = localStorage.getItem("companyId");
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole?.toLowerCase() || "");
//   }, []);

//   const [loadingClock, setLoadingClock] = useState(false);
//   const [todayRecord, setTodayRecord] = useState(null);
//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-US");

//   const stats = [
//     { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
//     { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
//     { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
//     { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
//   ];

//   const isToday = (dateString) => {
//     const recordDate = new Date(dateString);
//     return (
//       recordDate.getDate() === today.getDate() &&
//       recordDate.getMonth() === today.getMonth() &&
//       recordDate.getFullYear() === today.getFullYear()
//     );
//   };

//   useEffect(() => {
//     if (role !== "employee" || !employeeId) return;

//     const fetchTodayAttendance = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
//         if (!res.ok) throw new Error("Failed to fetch attendance");
//         const data = await res.json();
//         const employeeRecords = data.filter((record) => record.employee?._id === employeeId);
//         const todayRec = employeeRecords.find((record) => isToday(record.date));
//         setTodayRecord(todayRec || null);
//       } catch (err) {
//         console.error("Error fetching today's attendance:", err);
//       }
//     };

//     fetchTodayAttendance();
//   }, [employeeId, role, today]);

//   const handleClockAction = async (type) => {
//     if (loadingClock) return;
//     if (!employeeId) return toast.error("Missing employee ID");

//     const endpoint = type === "in" ? "clockin" : "clockout";

//     if (type === "in" && todayRecord?.clockIn) return toast.warning("You have already clocked in today.");
//     if (type === "out") {
//       if (!todayRecord?.clockIn) return toast.warning("You need to clock in first.");
//       if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");
//     }

//     try {
//       setLoadingClock(true);
//       const res = await fetch(`http://localhost:4000/attendance/${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ employeeId, companyId }),
//       });

//       const data = await res.json();
//       if (!res.ok) return toast.warning(data.message || `${type === "in" ? "Clock-in" : "Clock-out"} failed`);

//       toast.success(data.message || `${type === "in" ? "Clocked in" : "Clocked out"} successfully`);
//       setTodayRecord((prev) => ({
//         ...prev,
//         ...data.attendance,
//         [type === "in" ? "clockIn" : "clockOut"]: data.attendance[type === "in" ? "clockIn" : "clockOut"] || new Date().toISOString(),
//       }));
//     } catch (err) {
//       toast.error(`Server error during Clock ${type === "in" ? "In" : "Out"}`);
//       console.error(err);
//     } finally {
//       setLoadingClock(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6 px-4 py-6">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Stats */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((item) => (
//           <div key={item.id} className="w-full rounded-md">
//             <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
//               <div className="mb-4 flex items-center justify-between">
//                 <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
//                 <div className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500">{item.icon}</div>
//               </div>
//               <div>
//                 <div
//                   className={`text-left font-semibold leading-tight ${
//                     item.value === "5" || item.value === "12"
//                       ? "text-red-500"
//                       : item.value === "84"
//                       ? "text-green-500"
//                       : "text-slate-700"
//                   }`}
//                 >
//                   {item.value}
//                 </div>
//                 <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Employee Only Section */}
//       {role === "employee" && (
//         <div className="flex flex-col gap-6 md:flex-row md:items-start">
//           {/* Quick Actions */}
//           <div className="flex-shrink-0 flex flex-col gap-4 rounded-md border bg-white p-5 shadow-sm w-full md:w-80 h-96">
//             <p className="text-lg font-semibold">Quick Actions</p>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => handleClockAction("in")}
//                 disabled={loadingClock}
//                 className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <LogIn size={18} /> Clock In
//               </button>
//               <button
//                 onClick={() => handleClockAction("out")}
//                 disabled={loadingClock}
//                 className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <LogOut size={18} /> Clock Out
//               </button>
//               <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50">
//                 <Download size={18} /> Export Report
//               </button>
//             </div>
//           </div>

//           {/* Attendance Calendar */}
//           <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
//             <Attendance />
//           </div>
//         </div>
//       )}

//       {/* Search + Employee Table */}
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between items-center py-2">
//           <SearchEmployes />
//           <div className="flex items-center gap-2 text-gray-700">
//             <CalendarIcon size={20} className="text-gray-500" />
//             <span className="text-sm">{formattedDate}</span>
//           </div>
//         </div>

//         {/* Table with horizontal scroll */}
//         <div className="overflow-x-auto rounded-md shadow-sm bg-white">
//           <EmployeeTable />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainAttendance;



import React, { useState, useEffect } from "react";
import {
  ChartNoAxesCombined,
  Clock4,
  UserCheck,
  Users,
  LogIn,
  LogOut,
  Download,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Attendance from "../attendance/Attendence.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import SearchEmployes from "./SearchEmployes.jsx";

const MainAttendance = () => {
  const employeeId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toLowerCase() || "");
  }, []);

  const [loadingClock, setLoadingClock] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US");

  const stats = [
    { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
    { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
    { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
    { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
  ];

  const isToday = (dateString) => {
    const recordDate = new Date(dateString);
    return (
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    if (role !== "employee" || !employeeId) return;

    const fetchTodayAttendance = async () => {
      try {
        const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
        if (!res.ok) throw new Error("Failed to fetch attendance");
        const data = await res.json();
        const employeeRecords = data.filter((record) => record.employee?._id === employeeId);
        const todayRec = employeeRecords.find((record) => isToday(record.date));
        setTodayRecord(todayRec || null);
      } catch (err) {
        console.error("Error fetching today's attendance:", err);
      }
    };

    fetchTodayAttendance();
  }, [employeeId, role, today]);

  const handleClockAction = async (type) => {
    if (loadingClock) return;
    if (!employeeId) return toast.error("Missing employee ID");

    const endpoint = type === "in" ? "clockin" : "clockout";

    if (type === "in" && todayRecord?.clockIn) return toast.warning("You have already clocked in today.");
    if (type === "out") {
      if (!todayRecord?.clockIn) return toast.warning("You need to clock in first.");
      if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");
    }

    try {
      setLoadingClock(true);
      const res = await fetch(`http://localhost:4000/attendance/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, companyId }),
      });

      const data = await res.json();
      if (!res.ok) return toast.warning(data.message || `${type === "in" ? "Clock-in" : "Clock-out"} failed`);

      toast.success(data.message || `${type === "in" ? "Clocked in" : "Clocked out"} successfully`);
      setTodayRecord((prev) => ({
        ...prev,
        ...data.attendance,
        [type === "in" ? "clockIn" : "clockOut"]: data.attendance[type === "in" ? "clockIn" : "clockOut"] || new Date().toISOString(),
      }));
    } catch (err) {
      toast.error(`Server error during Clock ${type === "in" ? "In" : "Out"}`);
      console.error(err);
    } finally {
      setLoadingClock(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.id} className="w-full rounded-md">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <div className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500">{item.icon}</div>
              </div>
              <div>
                <div
                  className={`text-left font-semibold leading-tight ${
                    item.value === "5" || item.value === "12"
                      ? "text-red-500"
                      : item.value === "84"
                      ? "text-green-500"
                      : "text-slate-700"
                  }`}
                >
                  {item.value}
                </div>
                <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Only Section */}
      {role === "employee" && (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Quick Actions */}
          <div className="flex-shrink-0 flex flex-col gap-4 rounded-md border bg-white p-5 shadow-sm w-full lg:w-80">
            <p className="text-lg font-semibold">Quick Actions</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleClockAction("in")}
                disabled={loadingClock}
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
              >
                <LogIn size={18} /> Clock In
              </button>
              <button
                onClick={() => handleClockAction("out")}
                disabled={loadingClock}
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50 disabled:opacity-50"
              >
                <LogOut size={18} /> Clock Out
              </button>
              <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-gray-50">
                <Download size={18} /> Export Report
              </button>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
            <Attendance />
          </div>
        </div>
      )}

      {/* Search + Employee Table */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <SearchEmployes />
          <div className="flex items-center gap-2 text-gray-700">
            <CalendarIcon size={20} className="text-gray-500" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
};

export default MainAttendance;