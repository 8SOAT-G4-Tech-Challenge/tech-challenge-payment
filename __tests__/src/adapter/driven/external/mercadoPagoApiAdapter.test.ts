import { MercadoPagoApiImpl } from '@src/adapter/driven/external/MercadoPagoApiImpl';

// eslint-disable-next-line object-curly-newline
const { baseUrl, token, userId, posId } = {
	baseUrl: 'http://localhost:3030',
	token: 'token',
	userId: 2312313,
	posId: 'posId',
};

const mockedAxios = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
};

const mockedIsAxiosError = jest.fn();

jest.mock('axios', () => ({
	...jest.requireActual('axios'),
	create: () => mockedAxios,
	isAxiosError: () => mockedIsAxiosError,
}));

describe('MercadoPagoApiImpl -> Test', () => {
	let client: MercadoPagoApiImpl;

	const request = {
		externalReference: 'externalReference',
		title: 'title',
		description: 'description',
		totalAmount: 23,
		expirationDate: 'expirationDate',
		items: [],
	};

	beforeEach(() => {
		client = new MercadoPagoApiImpl(baseUrl, token, userId, posId);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createQrCodePayment', () => {
		test('should create qr code payment', async () => {
			const result = {
				qrData: 'qrData',
				inStoreOrderId: 'inStoreOrderId',
			};

			mockedAxios.post.mockResolvedValue({ data: result });

			const response = await client.createQrCodePayment(request);

			expect(response).toEqual(result);
		});

		test('should throw Error', async () => {
			mockedAxios.post.mockRejectedValue('');

			const rejectedFunction = async () => {
				await client.createQrCodePayment(request);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'Unexpected error occurred while communicating with MercadoPago'
			);
		});

		test('should throw axios Error', async () => {
			mockedAxios.post.mockRejectedValue({
				response: { data: { message: '' }, status: 500 },
			});
			mockedIsAxiosError.mockReturnValue(true);

			const rejectedFunction = async () => {
				await client.createQrCodePayment(request);
			};

			expect(rejectedFunction()).rejects.toThrow(Error);
			expect(rejectedFunction()).rejects.toThrow(
				'MercadoPago Error: Error details not provided, Message: Unknown error occurred, Status: 500'
			);
		});
	});
});
