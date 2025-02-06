import axios, { AxiosInstance } from 'axios';

import {
	convertKeysToCamelCase,
	convertKeysToSnakeCase,
} from '@src/core/application/utils/caseConverterUtil';
import {
	CreateQrRequest,
	CreateQrResponse,
} from '@src/core/domain/models/mercadoPagoQr';

import { MercadoPagoApiPort } from '../../../core/application/ports/output/mercadoPagoApiPort';

export class MercadoPagoApiAdapter implements MercadoPagoApiPort {
	private readonly axiosInstance: AxiosInstance;

	constructor(
		private readonly baseUrl: string,
		private readonly token: string,
		private readonly userId: number,
		private readonly posId: string
	) {
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
			},
		});
	}

	async createQrCodePayment(
		request: CreateQrRequest
	): Promise<CreateQrResponse> {
		try {
			const formattedRequest = convertKeysToSnakeCase(request);

			const response = await this.axiosInstance.post(
				`/instore/orders/qr/seller/collectors/${this.userId}/pos/${this.posId}/qrs`,
				formattedRequest
			);

			const formattedResponse: CreateQrResponse = await convertKeysToCamelCase(
				response.data
			);

			return formattedResponse;
		} catch (error) {
			return this.handleError(error);
		}
	}

	private handleError(error: any): never {
		if (axios.isAxiosError(error) && error.response) {
			const { data, status } = error.response;
			const errorMessage = data.message || 'Unknown error occurred';
			const errorDetails = data.error || 'Error details not provided';

			throw new Error(
				`MercadoPago Error: ${errorDetails}, Message: ${errorMessage}, Status: ${status}`
			);
		}

		throw new Error(
			'Unexpected error occurred while communicating with MercadoPago'
		);
	}
}
