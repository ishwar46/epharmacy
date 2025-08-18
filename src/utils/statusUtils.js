export const getStatusColor = (status) => {
    const colors = {
        pending: "bg-yellow-500",
        prescription_verified: "bg-blue-500",
        confirmed: "bg-indigo-500",
        packed: "bg-purple-500",
        out_for_delivery: "bg-orange-500",
        delivered: "bg-green-500",
        cancelled: "bg-red-500",
        returned: "bg-gray-500",
    };
    return colors[status] || "bg-gray-400";
};

export const getStatusLabel = (status) => {
    const labels = {
        pending: "Pending",
        prescription_verified: "Prescription Verified",
        confirmed: "Confirmed", 
        packed: "Packed",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
        returned: "Returned",
    };
    return labels[status] || status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
};
