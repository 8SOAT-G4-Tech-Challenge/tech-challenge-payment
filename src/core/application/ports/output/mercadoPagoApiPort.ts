import { CreateQrRequest, CreateQrResponse } from '@models/mercadoPagoQr';

export interface MercadoPagoApiPort {
	createQrCodePayment(request: CreateQrRequest): Promise<CreateQrResponse>;
}
