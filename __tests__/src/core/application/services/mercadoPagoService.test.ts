import { MercadoPagoService } from '@src/core/application/services/mercadoPagoService';
import logger from '@src/core/common/logger';
import { OrderItemMockBuilder } from '@tests/mocks/order-item.mock-builder';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';

jest.mock('axios');

describe('MercadoPagoService -> Test', () => {
	const mockedQRResponse = {
		qrData: '00020101021126510014BR.GOV.BCB.PIX',
		inStoreOrderId: '6ef4dc98-8096-4ace-87f0-ee863137ea8f',
		value: 49.99,
	};

	let service: MercadoPagoService;
	let orderService: any = jest.fn();
	let mercadoPagoApiAdapter: any = jest.fn();

	beforeEach(() => {
		orderService = {
			getAllCartItemsByOrderId: jest.fn(),
			getProductById: jest.fn(),
		};

		mercadoPagoApiAdapter = {
			createQrCodePayment: jest.fn(),
		};

		service = new MercadoPagoService(orderService, mercadoPagoApiAdapter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createQrPaymentRequest', () => {
		test('should create QRCode and return QRCode data', async () => {
			const order = new OrderMockBuilder().withDefaultValues().build();
			const orderItem = new OrderItemMockBuilder().withDefaultValues().build();

			const loggerSpy = jest.spyOn(logger, 'info');

			orderService.getAllCartItemsByOrderId.mockResolvedValue([orderItem]);
			mercadoPagoApiAdapter.createQrCodePayment.mockResolvedValue(
				mockedQRResponse
			);

			const response = await service.createQrPaymentRequest(order.id);

			expect(loggerSpy).toHaveBeenCalledWith(
				'[MERCADO PAGO SERVICE] Creating QR Payment Request...'
			);
			expect(orderService.getAllCartItemsByOrderId).toHaveBeenCalledWith(
				order.id
			);
			expect(loggerSpy).toHaveBeenCalledWith(
				'[MERCADO PAGO SERVICE] Making request to collect qrData'
			);
			expect(response).toEqual(mockedQRResponse);
		});
	});
});
