import { PaymentOrderStatusType } from '@src/core/domain/types/paymentOrderType';

export class PaymentOrderMockBuilder {
	id: string;

	orderId: string;

	status: PaymentOrderStatusType;

	paidAt: Date | null;

	value: number;

	createdAt: Date;

	updatedAt: Date;

	constructor() {
		this.id = '';
		this.orderId = '';
		this.status = 'pending' as PaymentOrderStatusType; // Ajuste com um valor padrão válido
		this.paidAt = null;
		this.value = 0;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	withId(value: string) {
		this.id = value;
		return this;
	}

	withOrderId(value: string) {
		this.orderId = value;
		return this;
	}

	withStatus(value: PaymentOrderStatusType) {
		this.status = value;
		return this;
	}

	withPaidAt(value: Date | null) {
		this.paidAt = value;
		return this;
	}

	withValue(value: number) {
		this.value = value;
		return this;
	}

	withCreatedAt(value: Date) {
		this.createdAt = value;
		return this;
	}

	withUpdatedAt(value: Date) {
		this.updatedAt = value;
		return this;
	}

	withDefaultValues() {
		this.id = 'payment12345-6789-4def-1234-56789abcdef0';
		this.orderId = 'order12345-6789-4def-1234-56789abcdef0';
		this.status = 'completed' as PaymentOrderStatusType;
		this.paidAt = new Date();
		this.value = 100.0;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		return this;
	}

	build() {
		return {
			id: this.id,
			orderId: this.orderId,
			status: this.status,
			paidAt: this.paidAt,
			value: this.value,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
