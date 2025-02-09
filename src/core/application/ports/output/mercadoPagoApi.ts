import { CreateQrRequest, CreateQrResponse } from '@models/mercadoPagoQr';

export interface MercadoPagoApi {
	createQrCodePayment(request: CreateQrRequest): Promise<CreateQrResponse>;
}
