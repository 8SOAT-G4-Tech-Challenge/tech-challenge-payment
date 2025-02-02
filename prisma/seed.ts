import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await Promise.all([
		prisma.paymentOrder.create({
			data: {
				orderId: '1234',
				status: 'approved',
				paidAt: new Date(),
				value: 30,
				qrData: null,
			},
		}),
		prisma.paymentOrder.create({
			data: {
				orderId: '12345',
				status: 'pending',
				value: 20,
				qrData: null,
			},
		}),
		prisma.paymentOrder.create({
			data: {
				orderId: '123456',
				status: 'pending',
				value: 20,
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
