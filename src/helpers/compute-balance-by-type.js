export function computeBalanceByType(transactions) {
  const result = transactions.reduce((acc, current) => {
    if (!acc[current.type]) {
      acc[current.type] = 0;
    }

    acc[current.type] = acc[current.type] + Number(current.amount);
    return acc;
  }, {});

  return result;
}
