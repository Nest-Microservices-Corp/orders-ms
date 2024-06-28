import { IsString, IsUUID, IsUrl } from "class-validator";

export class PaymentOrderDto {

    @IsString()
    stripePaymentId: string;

    @IsString()
    @IsUUID()
    orderId: string;
    
    @IsString()
    @IsUrl()
    receiptUrl: string;
    
}
