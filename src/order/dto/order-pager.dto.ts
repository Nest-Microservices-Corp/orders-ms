import { OrderStatus } from '@prisma/client';
import { PagerDto } from '../../common/dto/pager.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatuslist } from '../types/order.enum';

export class OrderPagerDto extends PagerDto {
    
    @IsEnum( OrderStatuslist )
    @IsOptional()
    status?: OrderStatus;

}