export class ProductMockBuilder {
	id: string;

	name: string;

	description: string;

	value: number;

	categoryId: string;

	createdAt: Date;

	updatedAt: Date;

	constructor() {
		this.id = '';
		this.name = '';
		this.description = '';
		this.value = 0;
		this.categoryId = '';
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	withId(value: string) {
		this.id = value;
		return this;
	}

	withName(value: string) {
		this.name = value;
		return this;
	}

	withDescription(value: string) {
		this.description = value;
		return this;
	}

	withValue(value: number) {
		this.value = value;
		return this;
	}

	withCategoryId(value: string) {
		this.categoryId = value;
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
		this.id = '451e2afc-75bd-4e68-a1a2-8ec2f038db9a';
		this.name = 'Default Product Name';
		this.description = 'Default product description.';
		this.value = 99.99;
		this.categoryId = '456e7890-e12b-34c5-d678-987654321000';
		this.createdAt = new Date();
		this.updatedAt = new Date();
		return this;
	}

	build() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			value: this.value,
			categoryId: this.categoryId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
