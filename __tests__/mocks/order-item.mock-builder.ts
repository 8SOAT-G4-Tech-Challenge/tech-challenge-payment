export class OrderItemMockBuilder {
	id: string;

	orderId: string;

	productId: string;

	quantity: number;

	value: number;

	details: string | null;

	createdAt: Date;

	updatedAt: Date;

	constructor() {
		this.id = '';
		this.orderId = '';
		this.productId = '';
		this.quantity = 0;
		this.value = 0;
		this.details = null;
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

	withProductId(value: string) {
		this.productId = value;
		return this;
	}

	withQuantity(value: number) {
		this.quantity = value;
		return this;
	}

	withValue(value: number) {
		this.value = value;
		return this;
	}

	withDetails(value: string | null) {
		this.details = value;
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
		this.id = 'abc12345-6789-4def-1234-56789abcdef0';
		this.orderId = 'order12345-6789-4def-1234-56789abcdef0';
		this.productId = 'product12345-6789-4def-1234-56789abcdef0';
		this.quantity = 2;
		this.value = 49.99;
		this.details = 'Default order item details.';
		this.createdAt = new Date();
		this.updatedAt = new Date();
		return this;
	}

	build() {
		return {
			id: this.id,
			orderId: this.orderId,
			productId: this.productId,
			quantity: this.quantity,
			value: this.value,
			details: this.details,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
