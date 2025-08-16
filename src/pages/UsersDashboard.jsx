import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getUsers, deleteUser } from "../services/userService";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaUser,
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Pagination from "../components/Paginations";
import UserModal from "../components/UserModal";
import EditUserModal from "../components/EditUserModal";
import CreateUserModal from "../components/CreateUserModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Lottie from "react-lottie";
import noDataAnimation from "../assets/animations/nodata.json";
import Loading from "../components/Loading";
import { useDynamicTitle } from "../hooks/useDynamicTitle";

const UsersDashboard = () => {
  // Set dynamic title for users dashboard
  useDynamicTitle("Users Management | Admin Dashboard | FixPharmacy");

  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Filter/search states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [startIndex, setStartIndex] = useState(0);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch admin info and users
  const fetchData = async () => {
    try {
      // 1) Get admin info
      const meResponse = await getMe();
      setAdminInfo(meResponse.data);

      // 2) Get users
      const usersResponse = await getUsers();
      setUsers(usersResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new user
  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  // Edit user
  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  // Delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // View details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + 10);

  // Quick stats
  const totalUsers = users.length;
  const adminCount = users.filter((user) => user.role === "admin").length;

  // Loading + error handling
  if (loading) {
    return <Loading />;
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-gray-600">Failed to load admin information</p>
        </div>
      </div>
    );
  }

  // For "no data" animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noDataAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="min-h-screen">
      <div className="max px-4 sm:px-6 lg:px-4 py-0 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your system users
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {adminInfo.name}
                </p>
                <p className="text-xs text-gray-500">{adminInfo.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Users */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          {/* Total Admins */}
          <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {adminCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaUser className="text-green-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">Users List</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {filteredUsers.length}
                </span>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <FaPlus size={14} />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <div className="flex items-center justify-between sm:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-600 font-medium"
                >
                  <FaFilter size={14} />
                  Filters
                </button>
                {roleFilter !== "All" && (
                  <button
                    onClick={() => setRoleFilter("All")}
                    className="text-xs text-blue-500"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filters */}
              <div
                className={`flex flex-col sm:flex-row gap-3 ${
                  showFilters ? "block" : "hidden sm:flex"
                }`}
              >
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="p-6">
            {paginatedUsers.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          #
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          User
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Email
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Phone
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Role
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                          Address
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-25">
                          <td className="py-4 px-2 text-sm text-gray-500">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-600">
                            {user.email || "N/A"}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-600">
                            {user.phone || "N/A"}
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                                user.role === "admin"
                                  ? "bg-red-50 text-red-700"
                                  : user.role === "delivery"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-600">
                            <span className="truncate max-w-xs block">
                              {user.address || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {paginatedUsers.map((user, index) => (
                    <div key={user._id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {user.email || "No email"}
                          </p>
                        </div>
                        <span
                          className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700"
                              : user.role === "delivery"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">Phone:</span>
                          <span className="font-medium text-gray-900">
                            {user.phone || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 truncate max-w-xs">
                          {user.address || "No address"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto">
                  <Lottie options={defaultOptions} height={128} width={128} />
                </div>
                <p className="text-gray-500 font-medium mt-4">No users found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 10 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Pagination
                  data={filteredUsers}
                  startIndex={startIndex}
                  setStartIndex={setStartIndex}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && selectedUser && (
        <UserModal
          open={modalOpen}
          user={selectedUser}
          handleClose={() => setModalOpen(false)}
        />
      )}

      {editModalOpen && userToEdit && (
        <EditUserModal
          open={editModalOpen}
          user={userToEdit}
          handleClose={() => setEditModalOpen(false)}
          onUpdate={fetchData}
        />
      )}

      {createModalOpen && (
        <CreateUserModal
          open={createModalOpen}
          handleClose={() => setCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleConfirm={confirmDelete}
      />
    </div>
  );
};

export default UsersDashboard;
