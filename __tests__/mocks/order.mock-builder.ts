import { OrderStatusEnum } from '@src/core/application/enumerations/orderStatusEnum';
import { OrderStatusType } from '@src/core/domain/types/orderStatusType';

export class OrderMockBuilder {
	id: string;

	customerId: string | null;

	readableId: string | null;

	status: OrderStatusType;

	createdAt: Date;

	updatedAt: Date;

	constructor() {
		this.id = '';
		this.customerId = '';
		this.readableId = '';
		this.status = OrderStatusEnum.created;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	withId(value: string) {
		this.id = value;
		return this;
	}

	withCustomerId(value: string | null) {
		this.customerId = value;
		return this;
	}

	withReadableId(value: string | null) {
		this.readableId = value;
		return this;
	}

	withStatus(value: OrderStatusType) {
		this.status = value;
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
		this.id = 'e01e10d9-1729-4252-9022-654eaf08cc76';
		this.readableId = '58';
		this.customerId = 'aa676370-c3c0-4359-a364-ccb31b961b94';
		this.status = OrderStatusEnum.created;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		return this;
	}

	build() {
		return {
			id: this.id,
			customerId: this.customerId,
			readableId: this.readableId,
			status: this.status,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
