import logger from '@common/logger';
import {
	CreateQrRequest,
	CreateQrRequestItem,
	CreateQrResponse,
} from '@models/mercadoPagoQr';
import { OrderItem } from '@models/orderItem';
import { ProductWithDetails } from '@models/product';
import { MercadoPagoHttpClient } from '@src/adapter/driven/http/mercadoPagoHttpClient';

import { OrderService } from './orderService';

export class MercadoPagoService {
	private readonly orderService: OrderService;

	private readonly mercadoPagoHttpClient: MercadoPagoHttpClient;

	constructor(
		orderService: OrderService,
		mercadoPagoHttpClient: MercadoPagoHttpClient
	) {
		this.mercadoPagoHttpClient = mercadoPagoHttpClient;
		this.orderService = orderService;
	}

	async createQrPaymentRequest(
		orderId: string,
		value: number
	): Promise<CreateQrResponse> {
		logger.info('Creating QR Payment Request...');

		const orderItems: OrderItem[] =
			await this.orderService.getAllCartItemsByOrderId(orderId);

		const createQrRequestItems: CreateQrRequestItem[] = await Promise.all(
			orderItems.map(async (orderItem: OrderItem) => {
				const product: ProductWithDetails =
					await this.orderService.getProductById(orderItem.productId);

				return {
					title: orderItem.productId,
					quantity: orderItem.quantity,
					unitMeasure: 'unit',
					totalAmount: orderItem.value,
					unitPrice: product.value,
				};
			})
		);

		const createQrRequest: CreateQrRequest = {
			externalReference: orderId,
			title: `Purchase ${orderId}`,
			description: '',
			totalAmount: value,
			expirationDate: new Date(Date.now() + 3600000).toISOString(),
			items: createQrRequestItems,
		};

		logger.info(
			`CreateQrRequest object to send to Mercado Pago: ${JSON.stringify(
				createQrRequest,
				null,
				2
			)}`
		);

		return this.createQrCodePayment(createQrRequest);
	}

	async createQrCodePayment(
		request: CreateQrRequest
	): Promise<CreateQrResponse> {
		logger.info('Making request to collect qrData');

		const response: CreateQrResponse =
			await this.mercadoPagoHttpClient.createQrCodePayment(request);

		logger.info(
			`Object successfully returned by Mercado Pago was: ${JSON.stringify(
				response,
				null,
				2
			)}`
		);

		return response;
	}
}
