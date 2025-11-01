import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiClock,
  FiBriefcase,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole.toLowerCase());
  }, []);

  const allItems = [
    { id: 1, label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard", roles: ["admin", "employee", "superadmin"] },
    { id: 2, label: "Lead Management", icon: <FiUsers size={20} />, url: "/lead-management", roles: ["admin", "employee", "superadmin"] },
    { id: 3, label: "User Management", icon: <FiUserPlus size={20} />, url: "/user-management", roles: ["admin", "superadmin"] },
    { id: 4, label: "Attendance", icon: <FiClock size={20} />, url: "/attendance", roles: ["admin", "employee", "superadmin"] },
    {
      id: 5,
      label: "Leave Management",
      icon: <FiClock size={20} />,
      url: role === "admin" || role === "superadmin" ? "/leaves" : "/leave-apply",
      roles: ["admin", "employee", "superadmin"],
    },
    { id: 6, label: "Companies", icon: <FiBriefcase size={20} />, url: "/companies", roles: ["admin", "superadmin"] },
    { id: 7, label: "Settings", icon: <FiSettings size={20} />, url: "/settings", roles: ["admin", "employee", "superadmin"] },
  ];

  const sidebarItems = allItems.filter((item) => item.roles.includes(role));

  if (!role) return null;

  return (
    <>
      {/* 📱 Mobile Header */}
      <div className="fixed top-0 left-0 z-30 flex w-full items-center justify-between bg-white px-4 py-3 shadow-md md:hidden">
        <div className="flex items-center gap-3 whitespace-nowrap select-none pointer-events-none">
          <div className="flex size-10 items-center justify-center rounded-lg bg-black text-[20px] font-semibold text-white">
            C
          </div>
          <div className="text-lg font-semibold text-black">CRM Pro</div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <FiX size={25} /> : <FiMenu size={25} />}
        </button>
      </div>

      {/* 💻 Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-[250px] bg-white border-r shadow-lg z-40">
        <div className="flex flex-col w-full">
          <div className="flex h-[12vh] items-center gap-3 border-b-2 px-4 select-none">
            <div className="flex size-12 items-center justify-center rounded-lg bg-black text-[25px] font-semibold text-white">
              C
            </div>
            <div className="text-[20px] font-semibold text-black whitespace-nowrap">
              CRM Pro
            </div>
          </div>

          <nav className="mt-8 flex-1 overflow-y-auto">
            <ul>
              {sidebarItems.map((item) => (
                <li key={item.id} className="mb-2 px-3">
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-3 rounded-lg bg-black px-4 py-3 text-white"
                        : "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {item.icon}
                    <span className="text-md">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* 📱 Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[70vw] max-w-[260px] bg-white shadow-xl transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header inside drawer */}
        <div className="flex h-[12vh] items-center justify-between border-b-2 px-4">
          <div className="flex items-center gap-3 whitespace-nowrap select-none">
            <div className="flex size-12 items-center justify-center rounded-lg bg-black text-[25px] font-semibold text-white">
              C
            </div>
            <div className="text-[22px] font-semibold text-black">CRM Pro</div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black">
            <FiX size={25} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 overflow-y-auto">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id} className="mb-2 px-3">
                <NavLink
                  to={item.url}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-3 rounded-lg bg-black px-4 py-3 text-white"
                      : "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                  }
                >
                  {item.icon}
                  <span className="text-md">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 📱 No dark overlay (click anywhere to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;