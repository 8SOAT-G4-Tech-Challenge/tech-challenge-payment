import { FastifyInstance } from 'fastify';

import { MercadoPagoService, PaymentOrderService } from '@application/services';
import { PaymentOrderRepositoryImpl } from '@src/adapter/driven/infra/paymentOrderRepositoryImpl';
import { EnvironmentService } from '@src/core/common/environmentService';

import { PaymentOrderController } from '../controllers/paymentOrderController';
import {
	SwaggerGetPaymentOrderById,
	SwaggerGetPaymentOrderByOrderId,
	SwaggerGetPaymentOrders,
	SwaggerPaymentOrderMakePayment,
	SwaggerPaymentOrderProcessPaymentNotifications,
} from './doc/paymentOrders';

const paymentOrderRepository = new PaymentOrderRepositoryImpl();

const environmentService = new EnvironmentService();

const mercadoPagoService = new MercadoPagoService(environmentService);

const paymentOrderService = new PaymentOrderService(
	paymentOrderRepository,
	mercadoPagoService
);

const paymentOrderController = new PaymentOrderController(paymentOrderService);

export const routes = async (fastify: FastifyInstance) => {
	fastify.get(
		'/admin/payment-orders',
		SwaggerGetPaymentOrders,
		paymentOrderController.getPaymentOrders.bind(paymentOrderController)
	);
	fastify.get(
		'/totem/payment-orders/:id',
		SwaggerGetPaymentOrderById,
		paymentOrderController.getPaymentOrderById.bind(paymentOrderController)
	);
	fastify.get(
		'/totem/orders/:orderId/payment-orders',
		SwaggerGetPaymentOrderByOrderId,
		paymentOrderController.getPaymentOrderByOrderId.bind(paymentOrderController)
	);
	fastify.post(
		'/totem/payment-orders/make-payment/:orderId',
		SwaggerPaymentOrderMakePayment,
		paymentOrderController.makePayment.bind(paymentOrderController)
	);
	fastify.post(
		'/totem/payment-orders/process-payment-notifications',
		SwaggerPaymentOrderProcessPaymentNotifications,
		paymentOrderController.processPaymentNotification.bind(
			paymentOrderController
		)
	);
};
