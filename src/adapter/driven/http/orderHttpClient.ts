import axios, { AxiosInstance } from 'axios';

import { Order } from '@models/order';
import { OrderItem } from '@models/orderItem';
import { ProductWithDetails } from '@models/product';
import {
	GetOrderByIdParams,
	UpdateOrderParams,
} from '@src/core/application/ports/input/orders';
import { UpdateOrderResponse } from '@src/core/application/ports/output/orders';

export class OrderHttpClient {
	private readonly axiosInstance: AxiosInstance;

	constructor(private readonly baseUrl: string) {
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	async getAllCartItemsByOrderId(orderId: string): Promise<OrderItem[]> {
		try {
			const response = await this.axiosInstance.get(
				`${this.baseUrl}/order-items/${orderId}`
			);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Error fetching cart items: ${error.response.statusText}`
				);
			}
			throw new Error('Unexpected error fetching cart items');
		}
	}

	async getProductById(productId: string): Promise<ProductWithDetails> {
		try {
			const response = await this.axiosInstance.get(
				`${this.baseUrl}/products/${productId}`
			);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Error fetching product: ${error.response.statusText}`);
			}
			throw new Error('Unexpected error fetching product');
		}
	}

	async updateOrder(order: UpdateOrderParams): Promise<UpdateOrderResponse> {
		try {
			const response = await this.axiosInstance.put<UpdateOrderResponse>(
				`/orders/${order.id}`,
				order
			);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Error updating order: ${error.response.statusText}`);
			}
			throw new Error('Unexpected error updating order');
		}
	}

	async getOrderCreatedById({ id }: GetOrderByIdParams): Promise<Order> {
		try {
			const response = await this.axiosInstance.get<Order>(
				`/orders/${id}?status=created`
			);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(`Error fetching order: ${error.response.statusText}`);
			}
			throw new Error('Unexpected error fetching order');
		}
	}

	async getNumberOfValidOrdersToday(): Promise<number> {
		try {
			const response = await this.axiosInstance.get<{ count: number }>(
				'/orders/valid-orders-today'
			);
			return response.data.count;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				throw new Error(
					`Error fetching order count: ${error.response.statusText}`
				);
			}
			throw new Error('Unexpected error fetching order count');
		}
	}
}
