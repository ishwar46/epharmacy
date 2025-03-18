import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { getUsers, deleteUser } from "../services/userService";
import { FaUser, FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Pagination from "../components/Paginations";
import UserModal from "../components/UserModal";
import EditUserModal from "../components/EditUserModal";
import CreateUserModal from "../components/CreateUserModal";
import Lottie from "react-lottie";
import noDataAnimation from "../assets/animations/nodata.json";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Loading from "../components/Loading";

const UsersDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // For search or filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // For pagination
  const [startIndex, setStartIndex] = useState(0);

  // For modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch admin info & users
  const fetchData = async () => {
    try {
      const meResp = await getMe();
      setAdminInfo(meResp.data);

      const usersResp = await getUsers();
      setUsers(usersResp.data); // e.g. { success: true, data: [...] }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new user
  const handleUserCreated = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
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

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Filter & search
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + 10);

  // Quick stats
  const totalUsers = users.length;

  // For "no data" animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noDataAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return <Loading />;
  }

  if (!adminInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">
          Failed to load admin information.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            Users Dashboard
          </h1>
        </div>

        {/* Admin Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {adminInfo.name}
            </p>
            <p className="text-xs text-gray-500">{adminInfo.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
            <span className="text-gray-600 font-semibold">
              {adminInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Users */}
        <div className="flex flex-col items-center bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-200 transform hover:scale-105">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full shadow-sm mb-2">
            <FaUser size={22} />
          </div>
          <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
          <span className="text-xl font-semibold text-indigo-600">
            {totalUsers}
          </span>
        </div>
      </div>

      {/* Table of Users */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <caption className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Users List
                </h2>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white transition duration-200"
                >
                  <FaPlus size={14} /> Add User
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <select
                  onChange={(e) => setRoleFilter(e.target.value)}
                  value={roleFilter}
                  className="border border-gray-200 text-sm rounded-md py-2 px-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>
          </caption>

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 font-medium">SN</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium hidden md:table-cell">Email</th>
              <th className="p-3 font-medium hidden lg:table-cell">Phone</th>
              <th className="p-3 font-medium hidden lg:table-cell">Address</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-3">{startIndex + index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 hidden md:table-cell">{user.email}</td>
                  <td className="p-3 hidden lg:table-cell">{user.phone}</td>
                  <td className="p-3 hidden lg:table-cell truncate max-w-[120px]">
                    {user.address}
                  </td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="inline-flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="inline-flex items-center gap-1 border border-green-500 text-green-500 px-3 py-1 rounded text-sm hover:bg-green-50"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="inline-flex items-center gap-1 border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-600 flex flex-col items-center justify-center"
                >
                  <div className="w-48 h-48">
                    <Lottie options={defaultOptions} height={150} width={150} />
                  </div>
                  <p className="text-gray-500 font-medium mt-2">
                    No Users Found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          data={filteredUsers}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
      </div>

      {/* User View Modal */}
      {modalOpen && selectedUser && (
        <UserModal
          open={modalOpen}
          user={selectedUser}
          handleClose={() => setModalOpen(false)}
        />
      )}

      {/* Edit User Modal */}
      {editModalOpen && userToEdit && (
        <EditUserModal
          open={editModalOpen}
          user={userToEdit}
          handleClose={() => setEditModalOpen(false)}
          onUpdated={() => fetchData()}
        />
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <CreateUserModal
          open={createModalOpen}
          handleClose={() => setCreateModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          handleConfirm={confirmDelete}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default UsersDashboard;
