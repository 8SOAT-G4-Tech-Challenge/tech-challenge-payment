import { FastifyInstance } from 'fastify';

import {
	MercadoPagoService,
	OrderService,
	PaymentOrderService,
} from '@application/services';
import { MercadoPagoApiAdapter } from '@src/adapter/driven/external/mercadoPagoApiAdapter';
import { OrderApiAdapter } from '@src/adapter/driven/external/orderApiAdapter';
import { PaymentOrderRepositoryImpl } from '@src/adapter/driven/infra/paymentOrderRepositoryImpl';

import { PaymentOrderController } from '../controllers/paymentOrderController';
import {
	SwaggerGetPaymentOrderById,
	SwaggerGetPaymentOrderByOrderId,
	SwaggerGetPaymentOrders,
	SwaggerPaymentOrderMakePayment,
	SwaggerPaymentOrderProcessPaymentNotifications,
} from './doc/paymentOrders';

const mercadoPagoApiAdapter = new MercadoPagoApiAdapter(
	process.env.MERCADO_PAGO_BASE_URL ?? '',
	process.env.MERCADO_PAGO_TOKEN ?? '',
	Number(process.env.MERCADO_PAGO_USER_ID),
	process.env.MERCADO_PAGO_EXTERNAL_POS_ID ?? ''
);

const orderApiAdapter = new OrderApiAdapter(process.env.ORDER_BASE_URL ?? '');

const paymentOrderRepository = new PaymentOrderRepositoryImpl();

const orderService = new OrderService(orderApiAdapter);

const mercadoPagoService = new MercadoPagoService(
	orderService,
	mercadoPagoApiAdapter
);

const paymentOrderService = new PaymentOrderService(
	paymentOrderRepository,
	mercadoPagoService,
	orderService
);

const paymentOrderController = new PaymentOrderController(paymentOrderService);

export const routes = async (fastify: FastifyInstance) => {
	fastify.get(
		'/payment-orders',
		SwaggerGetPaymentOrders,
		paymentOrderController.getPaymentOrders.bind(paymentOrderController)
	);

	fastify.get(
		'/payment-orders/:id',
		SwaggerGetPaymentOrderById,
		paymentOrderController.getPaymentOrderById.bind(paymentOrderController)
	);

	fastify.get(
		'/payment-orders/orders/:orderId',
		SwaggerGetPaymentOrderByOrderId,
		paymentOrderController.getPaymentOrderByOrderId.bind(paymentOrderController)
	);

	fastify.post(
		'/payment-orders/make-payment/:orderId',
		SwaggerPaymentOrderMakePayment,
		paymentOrderController.makePayment.bind(paymentOrderController)
	);

	fastify.post(
		'/payment-orders/process-payment-notifications',
		SwaggerPaymentOrderProcessPaymentNotifications,
		paymentOrderController.processPaymentNotification.bind(
			paymentOrderController
		)
	);
};
