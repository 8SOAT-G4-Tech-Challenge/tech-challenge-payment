import { FastifyInstance } from 'fastify';

import {
	MercadoPagoService,
	OrderService,
	PaymentOrderService,
} from '@application/services';
import { MercadoPagoApiImpl } from '@src/adapter/driven/external/MercadoPagoApiImpl';
import { OrderApiImpl } from '@src/adapter/driven/external/OrderApiImpl';
import { PaymentOrderRepositoryImpl } from '@src/adapter/driven/infra/paymentOrderRepositoryImpl';

import { PaymentOrderController } from '../controllers/paymentOrderController';

const mercadoPagoApiImpl = new MercadoPagoApiImpl(
	process.env.MERCADO_PAGO_BASE_URL ?? '',
	process.env.MERCADO_PAGO_TOKEN ?? '',
	Number(process.env.MERCADO_PAGO_USER_ID),
	process.env.MERCADO_PAGO_EXTERNAL_POS_ID ?? ''
);

const orderApiImpl = new OrderApiImpl(process.env.ORDER_BASE_URL ?? '');

const paymentOrderRepository = new PaymentOrderRepositoryImpl();

const orderService = new OrderService(orderApiImpl);

const mercadoPagoService = new MercadoPagoService(
	orderService,
	mercadoPagoApiImpl
);
const paymentOrderService = new PaymentOrderService(
	paymentOrderRepository,
	mercadoPagoService,
	orderService
);

const paymentOrderController = new PaymentOrderController(paymentOrderService);

export const routes = async (fastify: FastifyInstance) => {
	fastify.get('/health', async (_request, reply) => {
		reply.status(200).send({ message: 'Health Check Payment - Ok' });
	});
	fastify.get(
		'/admin/payment-orders',
		paymentOrderController.getPaymentOrders.bind(paymentOrderController)
	);
	fastify.get(
		'/totem/payment-orders/:id',
		paymentOrderController.getPaymentOrderById.bind(paymentOrderController)
	);
	fastify.get(
		'/totem/payment-orders/orders/:orderId',
		paymentOrderController.getPaymentOrderByOrderId.bind(paymentOrderController)
	);
	fastify.post(
		'/totem/payment-orders/make-payment/:orderId',
		paymentOrderController.makePayment.bind(paymentOrderController)
	);
	fastify.post(
		'/totem/payment-orders/process-payment-notifications',
		paymentOrderController.processPaymentNotification.bind(
			paymentOrderController
		)
	);
};
