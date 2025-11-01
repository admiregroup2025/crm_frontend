import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ROLES = ["Admin", "Employee"];
const DEPARTMENTS = ["IT", "Sales", "Marketing", "Engineering", "HR", "Finance"];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const EditUser = ({ user, onClose, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        company: "",
        role: "",
        password: "",
        accountActive: true,
    });

    // ✅ Pre-fill data
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || "",
                company: user.company?._id || user.company || "",
                role: user.role || "Employee",
                password: "", // optional password change
                accountActive: user.accountActive ?? true,
            });
        }
    }, [user]);

    // ✅ Fetch Companies
    const getCompanies = async () => {
        try {
            const response = await axios.get(`${API_URL}/company/all`);
            setCompanies(response.data.companies || []);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        }
    };

    useEffect(() => {
        getCompanies();
    }, []);

    const handleInputChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    // ✅ Submit Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isAdmin = user.role?.toLowerCase() === "admin";
        const endpoint = isAdmin ? `${API_URL}/editAdmin/${user._id}` : `${API_URL}/employee/editEmployee/${user._id}`;
        try {
            const res = await axios.put(endpoint, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                company: formData.company,
                role: formData.role,
                password: formData.password || undefined, // only send if changed
                accountActive: formData.accountActive,
            });

            if (res.status === 200) {
                alert(`${formData.role} updated successfully!`);
                onSave(res.data.updatedUser || res.data.employee || res.data.admin);
            } else {
                alert("Update failed. Please try again.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error.response?.data?.msg || "Failed to update user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-2 md:p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit {formData.role || "User"}</h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Full Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Enter full name"
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter email"
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
                        <select
                            value={formData.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            required
                        >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map((dept) => (
                                <option
                                    key={dept}
                                    value={dept}
                                >
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Company */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                        <select
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            required
                        >
                            <option value="">Select company</option>
                            {companies.map((comp) => (
                                <option
                                    key={comp._id}
                                    value={comp._id}
                                >
                                    {comp.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                            required
                        >
                            <option value="">Select Role</option>
                            {ROLES.map((role) => (
                                <option
                                    key={role}
                                    value={role}
                                >
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password (optional) */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">New Password (optional)</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Leave blank to keep current password"
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Account Active */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.accountActive}
                        onChange={(e) => handleInputChange("accountActive", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600"
                    />
                    <label className="text-sm font-medium text-gray-700">Account Active</label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Updating...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;