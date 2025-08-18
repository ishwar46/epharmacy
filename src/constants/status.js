// Order status options - Updated to match backend Order model
export const ORDER_STATUS = [
    "pending",
    "prescription_verified",
    "confirmed",
    "packed",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned"
];

// Payment method options
export const PAYMENT_METHODS = [
    "Cash on Delivery",
    "Credit Card",
    "Net Banking"
];

// Payment status options
export const PAYMENT_STATUS = [
    "pending",
    "paid",
    "failed",
    "refunded"
];
