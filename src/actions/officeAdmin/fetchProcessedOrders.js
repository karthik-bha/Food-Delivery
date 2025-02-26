"use server";

export const fetchProcessedOrders = async (data) => {
    let todayOrders = {};
    let previousOrders = {};

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    data.forEach((order) => {
        let orderId = order._id;
        let orderDate = new Date(order.OrderDate);
        orderDate.setHours(0, 0, 0, 0);

        // Determine if the order is from today or previous
        let orderGroup = orderDate.getTime() === today.getTime() ? todayOrders : previousOrders;

        // Initialize order entry if it doesn't exist
        if (!orderGroup[orderId]) {
            orderGroup[orderId] = {
                orderId: orderId,
                NumberOfVeg: 0,
                NumberOfNonVeg: 0,
                TotalAmount:0,
                additionalOrders: [],
                guestOrders: [],
            };
        }

        // Process Additional Orders
        order.AdditionalOrder.forEach((addOrder) => {
            orderGroup[orderId].NumberOfVeg = order.NumberOfVeg
            orderGroup[orderId].NumberOfNonVeg = order.NumberOfNonVeg
            orderGroup[orderId].TotalAmount = order.TotalAmount
            addOrder.items.forEach((item) => {
                orderGroup[orderId].additionalOrders.push(
                    `${addOrder.orderedBy.name} ordered ${item.quantity}x ${item.item.name}`
                );
            });
        });

        // Process Guest Orders
        order.GuestOrder.forEach((guestOrder) => {
            guestOrder.items.forEach((item) => {
                orderGroup[orderId].guestOrders.push(
                    `Guest (${guestOrder.orderedBy.name}) ordered ${item.quantity}x ${item.item.name}`
                );
            });
        });
    });

    return {
        todayOrders, previousOrders
    };
};
