const FEATURE_NAMES = [
    "Amount",
    "TimeOfDay_Hour", // 0-23
    "LocationMismatch", // 0: No, 1: Yes (e.g., transaction far from usual)
    "NumTransactionsLastHour",
    "CardNotPresent", // 0: In-store, 1: Online/Phone
    "SuspiciousMerchant", // 0: No, 1: Yes
    "IsForeignTransaction", // 0: No, 1: Yes (e.g., country different from card registration)
    "AmountToDailyAverageRatio", // How much this transaction deviates from typical daily spending
    "Label" // 0: Legitimate, 1: Fraudulent
];

// const TRANSACTION_DATA = [
const ENTITIES = [
    // --- Legitimate Transactions (Label: 0) ---

    // Regular daily spending
    { name: "Coffee Shop A", features: [25.50, 9, 0, 1, 0, 0, 0, 0.5, 0] },
    { name: "Groceries B",   features: [120.75, 17, 0, 1, 0, 0, 0, 1.2, 0] },
    { name: "Gas Station C", features: [60.00, 14, 0, 1, 0, 0, 0, 0.8, 0] },
    { name: "Online Book",   features: [35.20, 20, 0, 1, 1, 0, 0, 0.7, 0] },
    { name: "Restaurant D",  features: [85.90, 19, 0, 1, 0, 0, 0, 1.0, 0] },
    { name: "Subscription E",features: [15.00, 10, 0, 0, 1, 0, 0, 0.3, 0] },
    { name: "Lunch F",       features: [40.00, 13, 0, 1, 0, 0, 0, 0.6, 0] },
    { name: "Online Utility",features: [75.00, 11, 0, 1, 1, 0, 0, 0.9, 0] },
    { name: "Pharmacy G",    features: [55.30, 16, 0, 1, 0, 0, 0, 0.7, 0] },
    { name: "Clothing H",    features: [90.50, 18, 0, 1, 0, 0, 0, 1.1, 0] },
    { name: "Small Online Purchase", features: [12.00, 21, 0, 1, 1, 0, 0, 0.2, 0] },
    { name: "Weekend Market",features: [70.00, 10, 0, 1, 0, 0, 0, 0.9, 0] },

    // --- Fraudulent Transactions (Label: 1) ---

    // High amount, late night, location mismatch, foreign
    { name: "Expensive Electronics", features: [1500.00, 2, 1, 3, 1, 0, 1, 15.0, 1] },
    // Multiple small transactions in short period, suspicious merchant, foreign
    { name: "Series of Small Charges", features: [10.50, 23, 0, 8, 1, 1, 1, 0.1, 1] },
    // Very high amount, unusual hour, CNP
    { name: "Luxury Goods Online",   features: [2500.00, 3, 0, 1, 1, 0, 0, 25.0, 1] },
    // Sudden high volume, foreign, location mismatch
    { name: "Travel Agency Booking", features: [800.00, 5, 1, 5, 1, 0, 1, 8.0, 1] },
    // Unusual time, slightly high amount, suspicious merchant
    { name: "Shady Online Service", features: [150.00, 4, 0, 2, 1, 1, 0, 2.0, 1] },
    // Another series of small charges, late night
    { name: "Micro-transactions", features: [5.00, 1, 0, 10, 1, 0, 0, 0.05, 1] },
    // ATM withdrawal in a foreign country at unusual hour (assuming location mismatch implies this)
    { name: "ATM Withdrawal Abroad", features: [400.00, 2, 1, 1, 0, 0, 1, 4.0, 1] },
    // Very large single transaction, CNP, no prior activity
    { name: "High Value Software Key", features: [1000.00, 22, 0, 1, 1, 0, 0, 10.0, 1] },
    // High frequency of medium-sized transactions, potentially in a short time
    { name: "Multiple Online Purchases", features: [70.00, 0, 0, 6, 1, 0, 0, 0.8, 1] },
    // High amount, location mismatch
    { name: "Jewelry Store Purchase", features: [1800.00, 15, 1, 1, 0, 0, 0, 18.0, 1] }
];

// Normalized training data (features only, excluding the 'name' and 'label' for model input)
const TRAINING_DATA = ENTITIES.map(transaction => {
    // Normalization logic for each feature
    const maxAmount = 2500.00; // Max observed amount in this dataset
    const maxTimeOfDayHour = 23;
    const maxNumTransactionsLastHour = 10;
    const maxAmountToDailyAverageRatio = 25.0; // Max observed ratio

    return [
        transaction.features[0] / maxAmount,                    // Amount (0-1)
        transaction.features[1] / maxTimeOfDayHour,             // TimeOfDay_Hour (0-1)
        transaction.features[2],                                // LocationMismatch (0 or 1)
        transaction.features[3] / maxNumTransactionsLastHour,   // NumTransactionsLastHour (0-1)
        transaction.features[4],                                // CardNotPresent (0 or 1)
        transaction.features[5],                                // SuspiciousMerchant (0 or 1)
        transaction.features[6],                                // IsForeignTransaction (0 or 1)
        transaction.features[7] / maxAmountToDailyAverageRatio, // AmountToDailyAverageRatio (0-1)
        transaction.features[8]                                 // Label (0 or 1)
    ];
});

// To extract just the features for model input (X) and labels (y)
const X_TRAIN = TRAINING_DATA.map(row => row.slice(0, -1)); // All features except the last one (label)
const Y_TRAIN = TRAINING_DATA.map(row => row[row.length - 1]); // Only the last feature (label)


console.log("FEATURE_NAMES:", FEATURE_NAMES);
console.log("\nTRANSACTION_DATA (Raw):", ENTITIES);
console.log("\nTRAINING_DATA (Normalized, with Label):", TRAINING_DATA);
console.log("\nX_TRAIN (Features for Model):", X_TRAIN);
console.log("\nY_TRAIN (Labels for Model):", Y_TRAIN);