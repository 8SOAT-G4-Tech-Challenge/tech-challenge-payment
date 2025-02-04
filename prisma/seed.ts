import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await Promise.all([
		prisma.paymentOrder.create({
			data: {
				orderId: 'ba13feb1-2b62-4860-ac3f-65546258bad5',
				status: 'approved',
				paidAt: new Date(),
				value: 30.0,
				qrData:
					'00020101021243650016COM.MERCADOLIBRE02013063638f1192a-5fd1-4180-a180-8bcae3556bc35204000053039865802BR5925IZABEL AAAA DE MELO6007BARUERI62070503***63040B6D',
			},
		}),
		prisma.paymentOrder.create({
			data: {
				orderId: '6cc639e1-a49d-4307-bd4f-b086a0ec5f62',
				status: 'pending',
				value: 20.0,
				qrData: null,
			},
		}),
		prisma.paymentOrder.create({
			data: {
				orderId: '3e98fc41-a0d3-4479-9e01-160ed393bfbd',
				status: 'pending',
				value: 20.0,
				qrData: null,
			},
		}),
	]);

	console.log('Seed data created successfully!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
