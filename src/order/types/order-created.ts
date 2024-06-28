import { OrderStatus } from "@prisma/client";

export interface IOrderCreated {
    OrderItem: {
        name: any;
        quantity: number;
        productId: number;
        price: number;
    }[];
    id: string;
    totalAmount: number;
    totalItems: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}