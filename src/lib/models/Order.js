import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    OfficeAndRestaurantMappingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficeAndRestaurantMapping',
        required: true
    },
    OrderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    NumberOfVeg: {
        type: Number,
        default: 0,
    },
    NumberOfNonVeg: {
        type: Number,
        default: 0,
    },
    AdditionalOrder: [
        {
            orderedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            items: [
                {
                    item: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'AdditionalMenu',
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        default: 1,
                    },
                    totalPrice: {
                        type: Number,
                        required: true,
                        default: 0,
                    }
                }
            ]
        }
    ],
    GuestOrder: [
        {
            orderedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            items: [
                {
                    item: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'AdditionalMenu',
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        default: 1,
                    },
                    totalPrice: {
                        type: Number,
                        required: true,
                        default: 0,
                    }
                }
            ]
        }
    ],
    TotalAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
