import {
	CreatePaymentOrderParams,
	GetPaymentOrderByIdParams,
	GetPaymentOrderByOrderIdParams,
	UpdatePaymentOrderParams,
} from '@application/ports/input/paymentOrders';
import { PaymentOrderRepository } from '@application/ports/repository/paymentOrderRepository';
import { prisma } from '@driven/infra/lib/prisma';
import { PaymentOrder } from '@models/paymentOrder';

export class PaymentOrderRepositoryImpl implements PaymentOrderRepository {
	async getPaymentOrders(): Promise<PaymentOrder[]> {
		const paymentOrders = await prisma.paymentOrder.findMany();

		return paymentOrders.map((paymentOrder) => ({
			...paymentOrder,
			value: parseFloat(paymentOrder.value.toString()),
		}));
	}

	async getPaymentOrderById(
		getPaymentOrderByIdParams: GetPaymentOrderByIdParams
	): Promise<PaymentOrder | null> {
		const paymentOrder = await prisma.paymentOrder.findUnique({
			where: { id: getPaymentOrderByIdParams.id },
		});

		return paymentOrder
			? { ...paymentOrder, value: parseFloat(paymentOrder.value.toString()) }
			: null;
	}

	async getPaymentOrderByOrderId(
		getPaymentOrderByOrderIdParams: GetPaymentOrderByOrderIdParams
	): Promise<PaymentOrder | null> {
		const { orderId } = getPaymentOrderByOrderIdParams;

		const paymentOrder = await prisma.paymentOrder.findUnique({
			where: { orderId },
		});

		return paymentOrder
			? { ...paymentOrder, value: parseFloat(paymentOrder.value.toString()) }
			: null;
	}

	async createPaymentOrder(
		createPaymentOrderParams: CreatePaymentOrderParams
	): Promise<PaymentOrder> {
		const createdPaymentOrder = await prisma.paymentOrder.create({
			data: {
				orderId: createPaymentOrderParams.orderId,
				qrData: createPaymentOrderParams.qrData,
				status: 'pending',
				value: createPaymentOrderParams.value,
			},
		});

		return {
			...createdPaymentOrder,
			value: parseFloat(createdPaymentOrder.value.toString()),
		};
	}

	async updatePaymentOrder({
		id,
		status,
		paidAt,
		value,
	}: UpdatePaymentOrderParams): Promise<PaymentOrder> {
		const updatedPaymentOrder = await prisma.paymentOrder.update({
			where: { id },
			data: { status, paidAt, value },
		});

		return {
			...updatedPaymentOrder,
			value: parseFloat(updatedPaymentOrder.value.toString()),
		};
	}
}
