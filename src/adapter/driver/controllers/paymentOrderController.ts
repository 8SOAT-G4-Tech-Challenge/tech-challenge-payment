import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import {
	GetPaymentOrderByIdParams,
	GetPaymentOrderByOrderIdParams,
	MakePaymentOrderParams,
} from '@application/ports/input/paymentOrders';
import logger from '@common/logger';
import { handleError } from '@driver/errorHandler';
import { NotificationPaymentDto } from '@driver/schemas/paymentOrderSchema';
import { PaymentOrder } from '@models/paymentOrder';
import { PaymentOrderService } from '@services/paymentOrderService';

export class PaymentOrderController {
	private readonly paymentOrderService: PaymentOrderService;

	constructor(paymentOrderService: PaymentOrderService) {
		this.paymentOrderService = paymentOrderService;
	}

	async getPaymentOrders(
		req: FastifyRequest,
		reply: FastifyReply
	): Promise<void> {
		try {
			logger.info('Listing payment orders');
			const paymentOrders: PaymentOrder[] =
				await this.paymentOrderService.getPaymentOrders();

			reply.code(StatusCodes.OK).send(paymentOrders);
		} catch (error) {
			const errorMessage = 'Unexpected error when listing for payment orders';
			logger.error(
				`${errorMessage}: ${JSON.stringify(error?.response.message)}`
			);
			handleError(req, reply, error);
		}
	}

	async getPaymentOrderById(
		req: FastifyRequest<{ Body: GetPaymentOrderByIdParams }>,
		reply: FastifyReply
	): Promise<void> {
		const params: GetPaymentOrderByIdParams = req.params as {
			id: string;
		};

		try {
			logger.info('Listing payment order by ID');
			const paymentOrder: PaymentOrder | null =
				await this.paymentOrderService.getPaymentOrderById(params);

			reply.code(StatusCodes.OK).send(paymentOrder);
		} catch (error) {
			const errorMessage = 'Unexpected error when listing for payment order';
			logger.error(
				`${errorMessage}: ${JSON.stringify(error?.response.message)}`
			);
			handleError(req, reply, error);
		}
	}

	async getPaymentOrderByOrderId(
		req: FastifyRequest<{ Body: GetPaymentOrderByOrderIdParams }>,
		reply: FastifyReply
	): Promise<void> {
		const params: GetPaymentOrderByOrderIdParams = req.params as {
			orderId: string;
		};

		try {
			logger.info('Listing payment order by order ID');

			const paymentOrder: PaymentOrder | null =
				await this.paymentOrderService.getPaymentOrderByOrderId(params);

			reply.code(StatusCodes.OK).send(paymentOrder);
		} catch (error) {
			const errorMessage = 'Unexpected error when listing for payment order';
			logger.error(
				`${errorMessage}: ${JSON.stringify(error?.response.message)}`
			);
			handleError(req, reply, error);
		}
	}

	async makePayment(
		req: FastifyRequest<{ Body: MakePaymentOrderParams }>,
		reply: FastifyReply
	): Promise<void> {
		const params: MakePaymentOrderParams = req.params as {
			orderId: string;
		};

		try {
			logger.info('Making payment order');
			const paymentOrder: PaymentOrder =
				await this.paymentOrderService.makePayment(params);

			reply.code(StatusCodes.OK).send(paymentOrder);
		} catch (error) {
			const errorMessage = 'Unexpected error when making payment order';
			logger.error(
				`${errorMessage}: ${JSON.stringify(error?.response.message)}`
			);
			handleError(req, reply, error);
		}
	}

	async processPaymentNotification(
		req: FastifyRequest<{ Body: NotificationPaymentDto }>,
		reply: FastifyReply
	): Promise<void> {
		try {
			logger.info(
				`Process notification payment order ${JSON.stringify(req.body)}`
			);
			await this.paymentOrderService.processPaymentNotification(req.body);
			reply.code(StatusCodes.NO_CONTENT).send();
		} catch (error) {
			const errorMessage =
				'Unexpected error when process notification payment order';
			logger.error(
				`${errorMessage}: ${JSON.stringify(error?.response.message)}`
			);
			handleError(req, reply, error);
		}
	}
}
