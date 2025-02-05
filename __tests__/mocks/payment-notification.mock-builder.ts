import { PaymentNotificationStateEnum } from '@src/core/application/enumerations/paymentNotificationStateEnum';

export class PaymentNotificationMockBuilder {
	amount: number;

	caller_id: number;

	client_id: number;

	created_at: string;

	id: string;

	state: keyof typeof PaymentNotificationStateEnum;

	payment?: {
		id?: number;
		state?: string;
		type?: string;
	};

	additional_info: {
		external_reference: string;
	};

	constructor() {
		this.amount = 0;
		this.caller_id = 0;
		this.client_id = 0;
		this.created_at = new Date().toISOString();
		this.id = '';
		this.state = PaymentNotificationStateEnum.CONFIRMATION_REQUIRED;
		this.payment = undefined;
		this.additional_info = { external_reference: '' };
	}

	withAmount(value: number) {
		this.amount = value;
		return this;
	}

	withCallerId(value: number) {
		this.caller_id = value;
		return this;
	}

	withClientId(value: number) {
		this.client_id = value;
		return this;
	}

	withCreatedAt(value: string) {
		this.created_at = value;
		return this;
	}

	withId(value: string) {
		this.id = value;
		return this;
	}

	withState(value: keyof typeof PaymentNotificationStateEnum) {
		this.state = value;
		return this;
	}

	withPayment(value: { id?: number; state?: string; type?: string }) {
		this.payment = value;
		return this;
	}

	withAdditionalInfo(value: { external_reference: string }) {
		this.additional_info = value;
		return this;
	}

	withDefaultValues() {
		this.amount = 100;
		this.caller_id = 12345;
		this.client_id = 67890;
		this.created_at = new Date().toISOString();
		this.id = 'payment-uuid-1234';
		this.state = PaymentNotificationStateEnum.FINISHED;
		this.payment = {
			id: 1,
			state: 'completed',
			type: 'credit_card',
		};
		this.additional_info = { external_reference: 'external-1234' };
		return this;
	}

	build() {
		return {
			amount: this.amount,
			caller_id: this.caller_id,
			client_id: this.client_id,
			created_at: this.created_at,
			id: this.id,
			state: this.state,
			payment: this.payment,
			additional_info: this.additional_info,
		};
	}
}
