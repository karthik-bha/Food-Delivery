"use server";

export const processOrder = async (formData) => {
    const { vegMeals, nonVegMeals, orderData } = formData;

    if (!orderData) {
        throw new Error("Invalid order data");
    }

    // Group additional orders by userId
    const groupedAdditionalOrders = orderData?.additionalItems?.reduce((acc, item) => {
        if (!acc[item.userId]) {
            acc[item.userId] = {
                orderedBy: item.userId, // Obj id
                items: []
            };
        }
        acc[item.userId].items.push({
            item: item.item, // Obj id
            quantity: item.quantity || 1,
            totalPrice: item.quantity * item.price || 0
        });
        return acc;
    }, {});

    // Convert to array format
    const AdditionalOrder = Object.values(groupedAdditionalOrders);

    // Group guest orders by `addedBy`
    const groupedGuestOrders = orderData?.guest_items?.reduce((acc, item) => {
        if (!acc[item.addedBy]) {
            acc[item.addedBy] = {
                orderedBy: item.addedBy, // Obj id
                items: []
            };
        }
        acc[item.addedBy].items.push({
            item: item.item, // Obj id
            quantity: item.quantity || 1,
            totalPrice: item.quantity * item.price || 0
        });
        return acc;
    }, {});

    // Convert guest orders to array format
    const GuestOrder = Object.values(groupedGuestOrders);

    // Format final data
    const formattedData = {
        NumberOfVeg: Number(vegMeals) || 0,
        NumberOfNonVeg: Number(nonVegMeals) || 0,
        AdditionalOrder,
        GuestOrder,
        TotalAmount: orderData.TotalAmount || 0
    };

    return formattedData;
};
