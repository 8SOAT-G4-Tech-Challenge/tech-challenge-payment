import { Order } from '@models/order';
import { OrderItem } from '@models/orderItem';
import { ProductWithDetails } from '@models/product';
import {
	UpdateOrderParams,
	GetOrderByIdParams,
} from '@src/core/application/ports/input/orders';
import { UpdateOrderResponse } from '@src/core/application/ports/output/orders';

export interface OrderApiPort {
	getAllCartItemsByOrderId(orderId: string): Promise<OrderItem[]>;
	getProductById(productId: string): Promise<ProductWithDetails>;
	updateOrder(order: UpdateOrderParams): Promise<UpdateOrderResponse>;
	getOrderCreatedById(params: GetOrderByIdParams): Promise<Order>;
	getNumberOfValidOrdersToday(): Promise<number>;
}
