/* eslint-disable indent */
import { OrderStatusEnum } from '@application/enumerations/orderStatusEnum';
import { PaymentNotificationStateEnum } from '@application/enumerations/paymentNotificationStateEnum';
import { PaymentOrderStatusEnum } from '@application/enumerations/paymentOrderEnum';
import logger from '@common/logger';
import { PaymentOrder } from '@domain/models/paymentOrder';
import { NotificationPaymentDto } from '@driver/schemas/paymentOrderSchema';
import { InvalidPaymentOrderException } from '@exceptions/invalidPaymentOrderException';
import { PaymentNotificationException } from '@exceptions/paymentNotificationException';
import { CreateQrResponse } from '@models/mercadoPagoQr';
import {
	GetPaymentOrderByIdParams,
	GetPaymentOrderByOrderIdParams,
	MakePaymentOrderParams,
	UpdatePaymentOrderParams,
} from '@ports/input/paymentOrders';
import { PaymentOrderRepository } from '@ports/repository/paymentOrderRepository';

import { UpdateOrderParams } from '../ports/input/orders';
import { MercadoPagoService } from './mercadoPagoService';
import { OrderService } from './orderService';

export class PaymentOrderService {
	private readonly paymentOrderRepository;

	private readonly mercadoPagoService: MercadoPagoService;

	private readonly orderService: OrderService;

	constructor(
		paymentOrderRepository: PaymentOrderRepository,
		mercadoPagoService: MercadoPagoService,
		orderService: OrderService
	) {
		this.paymentOrderRepository = paymentOrderRepository;
		this.mercadoPagoService = mercadoPagoService;
		this.orderService = orderService;
	}

	async getPaymentOrders(): Promise<PaymentOrder[]> {
		const paymentOrders: PaymentOrder[] =
			await this.paymentOrderRepository.getPaymentOrders();

		return paymentOrders;
	}

	async getPaymentOrderById(
		getPaymentOrderByIdParams: GetPaymentOrderByIdParams
	): Promise<PaymentOrder | null> {
		const paymentOrder: PaymentOrder | null =
			await this.paymentOrderRepository.getPaymentOrderById(
				getPaymentOrderByIdParams
			);

		return paymentOrder;
	}

	async getPaymentOrderByOrderId(
		getPaymentOrderByOrderIdParams: GetPaymentOrderByOrderIdParams
	): Promise<PaymentOrder | null> {
		const paymentOrder: PaymentOrder | null =
			await this.paymentOrderRepository.getPaymentOrderByOrderId(
				getPaymentOrderByOrderIdParams
			);

		return paymentOrder;
	}

	async makePayment(
		makePaymentOrderParams: MakePaymentOrderParams
	): Promise<PaymentOrder> {
		const { orderId } = makePaymentOrderParams;

		logger.info('[PAYMENT ORDER SERVICE] Getting order');

		const order = await this.orderService.getOrderCreatedById({
			id: orderId,
		});

		logger.info(`[PAYMENT ORDER SERVICE] Order found: ${orderId}`);

		if (!order) {
			throw new InvalidPaymentOrderException(
				`Order with id: ${orderId} not found`
			);
		}

		logger.info(
			`[PAYMENT ORDER SERVICE] Getting payment order by order ID: ${orderId}`
		);

		const existingPaymentOrder =
			await this.paymentOrderRepository.getPaymentOrderByOrderId({ orderId });

		logger.info(
			`[PAYMENT ORDER SERVICE] Payment order found: ${
				existingPaymentOrder?.id || 'not found'
			}`
		);

		if (existingPaymentOrder) {
			throw new InvalidPaymentOrderException(
				`Payment Order for the Order ID: ${orderId} already exists`
			);
		}

		logger.info(
			`[PAYMENT ORDER SERVICE] Getting order total value by ID: ${orderId}`
		);

		logger.info('[PAYMENT ORDER SERVICE] Creating Payment Order');

		const createQrResponse: CreateQrResponse =
			await this.mercadoPagoService.createQrPaymentRequest(orderId);

		logger.info(
			`[PAYMENT ORDER SERVICE] Payment QR code created: ${createQrResponse?.qrData}`
		);

		const createdPaymentOrder =
			await this.paymentOrderRepository.createPaymentOrder({
				orderId,
				value: createQrResponse.value,
				qrData: createQrResponse.qrData,
			});

		return createdPaymentOrder;
	}

	async processPaymentNotification(
		notificationData: NotificationPaymentDto
	): Promise<void> {
		switch (notificationData.state) {
			case PaymentNotificationStateEnum.FINISHED:
				await this.finalizePayment(notificationData);
				break;
			case PaymentNotificationStateEnum.CONFIRMATION_REQUIRED:
				logger.info('[PAYMENT ORDER SERVICE] Confirmation payment required');
				break;
			case PaymentNotificationStateEnum.CANCELED:
				await this.cancelPayment(notificationData);
				break;
			default:
				throw new PaymentNotificationException(
					`Invalid payment notification type ${notificationData.state}`
				);
		}
	}

	async finalizePayment(
		notificationData: NotificationPaymentDto
	): Promise<void> {
		logger.info(
			`[PAYMENT ORDER SERVICE] Finished payment: ${JSON.stringify(
				notificationData
			)}`
		);
		logger.info(
			`[PAYMENT ORDER SERVICE] Searching for payment order by id: ${notificationData.additional_info.external_reference}`
		);
		let paymentOrder =
			await this.paymentOrderRepository.getPaymentOrderByOrderId({
				orderId: notificationData.additional_info.external_reference,
			});

		if (!paymentOrder) {
			throw new PaymentNotificationException(
				`Error processing payment finish notification. Payment order ${notificationData.additional_info.external_reference} not found.`
			);
		}

		if (PaymentOrderStatusEnum.pending === paymentOrder.status) {
			logger.info(
				`[PAYMENT ORDER SERVICE] Found payment order: ${JSON.stringify(
					paymentOrder
				)}`
			);

			const updatePaymentOrderParams: UpdatePaymentOrderParams = {
				id: paymentOrder.id,
				status: PaymentOrderStatusEnum.approved,
				paidAt: new Date(notificationData.created_at),
				value: notificationData.amount,
			};

			logger.info(
				`[PAYMENT ORDER SERVICE] Updating payment order: ${JSON.stringify(
					updatePaymentOrderParams
				)}`
			);

			paymentOrder = await this.paymentOrderRepository.updatePaymentOrder(
				updatePaymentOrderParams
			);

			logger.info(
				`[PAYMENT ORDER SERVICE] Payment order updated successfully: ${JSON.stringify(
					paymentOrder
				)}`
			);

			const numberOfOrdersToday =
				(await this.orderService.getNumberOfValidOrdersToday()) ?? 0;

			const updateOrder: UpdateOrderParams = {
				id: paymentOrder.orderId,
				status: OrderStatusEnum.received,
				readableId: `${numberOfOrdersToday + 1}`,
			};

			logger.info(`Updating order: ${JSON.stringify(updateOrder)}`);
			const order = await this.orderService.updateOrder(updateOrder);
			logger.info(`Order updated successfully: ${JSON.stringify(order)}`);
		} else {
			throw new PaymentNotificationException(
				`Error processing payment finish notification. Payment order ${notificationData.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
			);
		}
	}

	async cancelPayment(notificationData: NotificationPaymentDto): Promise<void> {
		logger.info(
			`[PAYMENT ORDER SERVICE] Cancelated payment: ${JSON.stringify(
				notificationData
			)}`
		);

		logger.info(
			`[PAYMENT ORDER SERVICE] Searching for payment order by id: ${notificationData.additional_info.external_reference}`
		);

		let paymentOrder =
			await this.paymentOrderRepository.getPaymentOrderByOrderId({
				orderId: notificationData.additional_info.external_reference,
			});

		if (!paymentOrder) {
			throw new PaymentNotificationException(
				`Error processing payment cancelation notification. Payment order ${notificationData.additional_info.external_reference} not found.`
			);
		}

		if (PaymentOrderStatusEnum.pending === paymentOrder.status) {
			logger.info(
				`[PAYMENT ORDER SERVICE] Found payment order: ${JSON.stringify(
					paymentOrder
				)}`
			);
			const updatePaymentOrderParams: UpdatePaymentOrderParams = {
				id: paymentOrder.id,
				status: PaymentOrderStatusEnum.cancelled,
			};

			logger.info(
				`[PAYMENT ORDER SERVICE] Updating payment order: ${JSON.stringify(
					updatePaymentOrderParams
				)}`
			);

			paymentOrder = await this.paymentOrderRepository.updatePaymentOrder(
				updatePaymentOrderParams
			);

			logger.info(
				`[PAYMENT ORDER SERVICE] Payment order updated successfully: ${JSON.stringify(
					paymentOrder
				)}`
			);

			const updateOrder: UpdateOrderParams = {
				id: paymentOrder.orderId,
				status: OrderStatusEnum.canceled,
			};

			logger.info(
				`[PAYMENT ORDER SERVICE] Updating order: ${JSON.stringify(updateOrder)}`
			);

			const order = await this.orderService.updateOrder(updateOrder);

			logger.info(
				`[PAYMENT ORDER SERVICE] Order updated successfully: ${JSON.stringify(
					order
				)}`
			);
		} else {
			throw new PaymentNotificationException(
				`Error processing payment cancelation notification. Payment order ${notificationData.additional_info.external_reference} with status other than pending. Current status: ${paymentOrder.status}`
			);
		}
	}
}
