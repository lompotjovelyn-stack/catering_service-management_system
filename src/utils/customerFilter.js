function customerWhere(user, tableAlias = "c") {
  if (user.role !== "customer") return { sql: "", params: [] };
  return { sql: ` WHERE ${tableAlias}.id = ?`, params: [user.customer_id || 0] };
}

function bookingCustomerFilter(user, tableAlias = "b") {
  if (user.role !== "customer") return { sql: "", params: [] };
  return { sql: `WHERE ${tableAlias}.customer_id = ?`, params: [user.customer_id || 0] };
}

module.exports = {
  bookingCustomerFilter,
  customerWhere,
};
