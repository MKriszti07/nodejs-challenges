const fs = require('fs').promises;

// Simulated async function to fetch user data
const fetchUserDetails = async () => {
    console.log("[Task 1] Fetching user details...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("[Task 1 Completed]");
    return { id: 1, name: 'John Doe' };
};

// Simulated async function to fetch user transactions
const fetchUserTransactions = async (userId) => {
    console.log("[Task 2] Fetching transactions for User ID:", userId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("[Task 2 Completed]");
    return [ "Transaction1: Credit $100", "Transaction2: Debt $50" ];
};

// Async function to write user transactions to a file
const writeTransactionsToFile = async (transactions) => {
    console.log("[Task 3] Writing transactions to file...");
    await fs.writeFile("day22/transactions.txt", transactions.join("\n"));
    console.log("[Task 3 Completed]");
    return "Transactions written successfully";
};

// Main Async Function to Chain the Tasks
const main = async () => {
    try {
        const userDetails = await fetchUserDetails();
        const transactions = await fetchUserTransactions(userDetails.id);
        const result = await writeTransactionsToFile(transactions);
        console.log(result);
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
};

main();