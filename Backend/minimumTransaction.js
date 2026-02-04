export default function Transactions(transactions) {
    // Step 1: Calculate net balances for each person
    const netBalance = {};
    
    transactions.forEach(transaction => {
        const payer = transaction["Paid by"];
        const amount = parseFloat(transaction.amount);
        const splitBetween = transaction["Split between"];
        const numPeople = splitBetween.length;
        const sharePerPerson = amount / numPeople;
        
        // Initialize balances if not exists
        if (!netBalance[payer]) netBalance[payer] = 0;
        
        // Payer paid 'amount', so they are owed money
        netBalance[payer] += amount;
        
        // Each person in splitBetween owes their share
        splitBetween.forEach(person => {
            if (!netBalance[person]) netBalance[person] = 0;
            netBalance[person] -= sharePerPerson;
        });
    });
    
    // Step 2: Separate creditors and debtors
    const creditors = []; // people who should receive money (positive balance)
    const debtors = [];   // people who should pay money (negative balance)
    
    for (const person in netBalance) {
        const balance = netBalance[person];
        if (balance > 0.01) { // using small threshold for floating point
            creditors.push({ name: person, amount: balance });
        } else if (balance < -0.01) {
            debtors.push({ name: person, amount: -balance }); // store as positive
        }
    }
    
    // Step 3: Settle debts using greedy approach
    const settlements = {};
    
    // Initialize settlements object
    for (const person in netBalance) {
        settlements[person] = {};
    }
    
    let i = 0, j = 0;
    
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        
        // Settle the minimum of what debtor owes and creditor is owed
        const settleAmount = Math.min(debtor.amount, creditor.amount);
        
        // Record the transaction with FLIPPED SIGNS:
        // debtor owes creditor (NEGATIVE for debtor)
        settlements[debtor.name][creditor.name] = -settleAmount;
        // creditor is owed by debtor (POSITIVE for creditor)
        settlements[creditor.name][debtor.name] = settleAmount;
        
        // Update remaining amounts
        debtor.amount -= settleAmount;
        creditor.amount -= settleAmount;
        
        // Move to next debtor/creditor if current one is settled
        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }
    
    // Clean up: remove zero balances
    for (const person in settlements) {
        for (const otherPerson in settlements[person]) {
            if (Math.abs(settlements[person][otherPerson]) < 0.01) {
                delete settlements[person][otherPerson];
            }
        }
        // Remove empty objects
        if (Object.keys(settlements[person]).length === 0) {
            delete settlements[person];
        }
    }
    
    return settlements;
}