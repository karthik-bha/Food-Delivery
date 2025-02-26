"use server";

export const getProcessedOrders = async (orders) => {
  if (!orders || orders.length === 0) return { todayOrders: [], previousOrders: [] };

  const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Helper function to format items
  const formatItems = (orderList) => {
    return orderList
      .flatMap((entry) =>
        entry.items.map(
          (item) => `${item.quantity} ${item.item?.name} by ${entry.orderedBy?.name || "Unknown"}`
        )
      )
      .join(", ") || "None";
  };

  // Process orders
  const formattedOrders = orders.map((order) => {
    const orderDate = new Date(order.OrderDate).toISOString().split("T")[0]; 
    const officeName = order.OfficeAndRestaurantMappingId?.office_id?.name || "Unknown Office";
    const restaurantName = order.OfficeAndRestaurantMappingId?.restaurant_id?.name || "Unknown Restaurant";

    return {
      id: order._id,
      officeName,
      restaurantName,
      numberOfVeg: order.NumberOfVeg,
      numberOfNonVeg: order.NumberOfNonVeg,
      totalAmount: order.TotalAmount,
      orderDate: orderDate,
      additionalBookedItems: formatItems(order.AdditionalOrder),
      guestBookedItems: formatItems(order.GuestOrder),
    };
  });

  // Separate today's orders and previous orders
  const todayOrders = formattedOrders.filter((order) => order.orderDate === todayDate);
  const previousOrders = formattedOrders.filter((order) => order.orderDate !== todayDate);

  return { todayOrders, previousOrders };
};
