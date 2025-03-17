// Converts a date string to Nepal Date format (YYYY-MM-DD)
export const toNepalDateString = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-NP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Converts to Nepal DateTime format (YYYY-MM-DD HH:MM)
export const toNepalDatetimeString = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleString("en-NP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

// Formats a date for display in Nepal format (e.g., March 17, 2025)
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-NP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
