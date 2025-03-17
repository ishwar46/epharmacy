export const getStatusColor = (status) => {
    const colors = {
        pending: "bg-yellow-500",
        processing: "bg-blue-500",
        confirmed: "bg-indigo-500",
        shipped: "bg-purple-500",
        "out for delivery": "bg-orange-500",
        delivered: "bg-green-500",
        cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
};
