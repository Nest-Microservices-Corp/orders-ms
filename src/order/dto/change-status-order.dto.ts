import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { OrderStatuslist } from "../types/order.enum";

export class ChangeStatusOrderDto {

    @IsUUID()
    id: string;

    @IsEnum( OrderStatuslist )
    @IsOptional()
    status?: OrderStatus;

}