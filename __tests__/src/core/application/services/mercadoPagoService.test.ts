import { MercadoPagoService } from '@src/core/application/services/mercadoPagoService';
import logger from '@src/core/common/logger';
import { OrderItemMockBuilder } from '@tests/mocks/order-item.mock-builder';
import { OrderMockBuilder } from '@tests/mocks/order.mock-builder';

jest.mock('axios');

describe('MercadoPagoService -> Test', () => {
	const mockedQRResponse = {
		qrData: '00020101021126510014BR.GOV.BCB.PIX',
		inStoreOrderId: '6ef4dc98-8096-4ace-87f0-ee863137ea8f',
	};

	let service: MercadoPagoService;
	let orderService: any = jest.fn();
	let mercadoPagoHttpClient: any = jest.fn();

	beforeEach(() => {
		orderService = {
			getAllCartItemsByOrderId: jest.fn(),
			getProductById: jest.fn(),
		};

		mercadoPagoHttpClient = {
			createQrCodePayment: jest.fn(),
		};

		service = new MercadoPagoService(orderService, mercadoPagoHttpClient);
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
			orderService.getProductById.mockResolvedValue(orderItem);
			mercadoPagoHttpClient.createQrCodePayment.mockResolvedValue(
				mockedQRResponse
			);

			const response = await service.createQrPaymentRequest(order.id, 200);

			expect(loggerSpy).toHaveBeenCalledWith('Creating QR Payment Request...');
			expect(orderService.getAllCartItemsByOrderId).toHaveBeenCalledWith(
				order.id
			);
			expect(orderService.getProductById).toHaveBeenCalledWith(
				orderItem.productId
			);
			expect(loggerSpy).toHaveBeenCalledWith(
				'Making request to collect qrData'
			);
			expect(response).toEqual(mockedQRResponse);
		});

		// test('should throw InvalidMercadoPagoException', async () => {
		// 	jest.spyOn(axios, 'post').mockRejectedValue({});

		// 	const order = new OrderMockBuilder().withDefaultValues().build();
		// 	const orderItem = new OrderItemMockBuilder().withDefaultValues().build();

		// 	cartService.getAllCartItemsByOrderId.mockResolvedValue([orderItem]);
		// 	productService.getProductById.mockResolvedValue(orderItem);

		// 	const rejectedFunction = async () => {
		// 		await service.createQrPaymentRequest(order.id, 200);
		// 	};

		// 	expect(rejectedFunction()).rejects.toThrow(InvalidMercadoPagoException);
		// 	expect(rejectedFunction()).rejects.toThrow('Unexpected error occurred');
		// });

		// test('should throw InvalidMercadoPagoException with default details', async () => {
		// 	jest.spyOn(axios, 'post').mockRejectedValue({ response: { data: {} } });
		// 	jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

		// 	const order = new OrderMockBuilder().withDefaultValues().build();
		// 	const orderItem = new OrderItemMockBuilder().withDefaultValues().build();

		// 	cartService.getAllCartItemsByOrderId.mockResolvedValue([orderItem]);
		// 	productService.getProductById.mockResolvedValue(orderItem);

		// 	const rejectedFunction = async () => {
		// 		await service.createQrPaymentRequest(order.id, 200);
		// 	};

		// 	expect(rejectedFunction()).rejects.toThrow(InvalidMercadoPagoException);
		// 	expect(rejectedFunction()).rejects.toThrow(
		// 		'Error: Error details not provided, Message: Unknown error occurred'
		// 	);
		// });

		// test('should throw InvalidMercadoPagoException with details', async () => {
		// 	jest.spyOn(axios, 'post').mockRejectedValue({
		// 		response: {
		// 			data: {
		// 				message: 'message',
		// 				error: 'error',
		// 			},
		// 		},
		// 	});
		// 	jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

		// 	const order = new OrderMockBuilder().withDefaultValues().build();
		// 	const orderItem = new OrderItemMockBuilder().withDefaultValues().build();

		// 	cartService.getAllCartItemsByOrderId.mockResolvedValue([orderItem]);
		// 	productService.getProductById.mockResolvedValue(orderItem);

		// 	const rejectedFunction = async () => {
		// 		await service.createQrPaymentRequest(order.id, 200);
		// 	};

		// 	expect(rejectedFunction()).rejects.toThrow(InvalidMercadoPagoException);
		// 	expect(rejectedFunction()).rejects.toThrow(
		// 		'Error: error, Message: message'
		// 	);
		// });
	});
});
