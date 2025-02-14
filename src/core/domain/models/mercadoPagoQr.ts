export interface CreateQrRequestItem {
	title: string;
	unitPrice: number;
	quantity: number;
	unitMeasure: 'unit' | 'pack';
	totalAmount: number;
}

export interface CreateQrRequest {
	externalReference: string;
	title: string;
	description: string;
	totalAmount: number;
	expirationDate: string;
	items: CreateQrRequestItem[];
}

export interface CreateQrResponse {
	qrData: string;
	inStoreOrderId: string;
	value: number;
}
