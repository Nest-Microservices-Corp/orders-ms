import { OrderStatus } from "@prisma/client";

export const OrderStatuslist = [
    OrderStatus.PENDING,
    OrderStatus.CANCELLED,
    OrderStatus.DELIVERED
];