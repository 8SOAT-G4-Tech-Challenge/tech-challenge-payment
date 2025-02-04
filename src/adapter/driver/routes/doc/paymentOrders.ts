export const SwaggerGetPaymentOrders = {
	schema: {
		summary: 'Get payment orders',
		description: 'Returns payment orders data',
		tags: ['Payment Order'],
		response: {
			200: {
				description: 'Success get payment orders data',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
						},
						orderId: {
							type: 'string',
							format: 'uuid',
						},
						status: {
							type: 'string',
						},
						qrData: {
							type: 'string',
						},
						paidAt: {
							type: 'string',
							format: 'datetime',
						},
						createdAt: {
							type: 'string',
							format: 'datetime',
						},
						updatedAt: {
							type: 'string',
							format: 'datetime',
						},
					},
				},
			},
			500: {
				description: 'Unexpected error when listing for payment orders',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'string',
					},
					message: {
						type: 'string',
					},
					details: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};

export const SwaggerGetPaymentOrderById = {
	schema: {
		summary: 'Get payment order by ID',
		description: 'Returns payment order data for a specific ID',
		tags: ['Payment Order'],
		params: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: 'The MongoDB ObjectId of the payment order to retrieve',
				},
			},
			required: ['id'],
		},
		response: {
			200: {
				description: 'Success get payment order data',
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'MongoDB ObjectId',
					},
					orderId: {
						type: 'string',
						description: 'Reference order ID',
					},
					status: {
						type: 'string',
					},
					qrData: {
						type: 'string',
					},
					paidAt: {
						type: 'string',
						format: 'date-time',
					},
					value: {
						type: 'number',
					},
					createdAt: {
						type: 'string',
						format: 'date-time',
					},
					updatedAt: {
						type: 'string',
						format: 'date-time',
					},
				},
			},
			404: {
				description: 'Payment order not found',
				type: 'object',
				properties: {
					message: {
						type: 'string',
					},
				},
			},
			500: {
				description: 'Unexpected error when retrieving payment order',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'string',
					},
					message: {
						type: 'string',
					},
					details: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};

export const SwaggerGetPaymentOrderByOrderId = {
	schema: {
		summary: 'Get payment order by Order ID',
		description: 'Returns payment order data for a specific Order ID',
		tags: ['Payment Order'],
		params: {
			type: 'object',
			properties: {
				orderId: {
					type: 'string',
					format: 'uuid',
					description: 'Order ID that has a payment order',
				},
			},
			required: ['orderId'],
		},
		response: {
			200: {
				description: 'Success get payment order data',
				type: 'object',
				properties: {
					id: {
						type: 'string',
					},
					orderId: {
						type: 'string',
						format: 'uuid',
					},
					status: {
						type: 'string',
					},
					qrData: {
						type: 'string',
					},
					paidAt: {
						type: 'string',
						format: 'datetime',
					},
					value: {
						type: 'string',
					},
					createdAt: {
						type: 'string',
						format: 'datetime',
					},
					updatedAt: {
						type: 'string',
						format: 'datetime',
					},
				},
			},
			404: {
				description: 'Payment order not found',
				type: 'object',
				properties: {
					message: {
						type: 'string',
					},
				},
			},
			500: {
				description: 'Unexpected error when retrieving payment order',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'string',
					},
					message: {
						type: 'string',
					},
					details: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};

export const SwaggerPaymentOrderMakePayment = {
	schema: {
		summary: 'Make a payment for an order',
		description:
			'Creates the payment order and integrates with Mercado Pago to obtain the Payment QR Code',
		tags: ['Payment Order'],
		params: {
			type: 'object',
			properties: {
				orderId: {
					type: 'string',
					format: 'uuid',
					description: 'Order ID of an Order that needs to be paid',
				},
			},
			required: ['orderId'],
		},
		response: {
			200: {
				description: 'Order payment successfully completed',
				type: 'object',
				properties: {
					id: {
						type: 'string',
					},
					orderId: {
						type: 'string',
						format: 'uuid',
					},
					status: {
						type: 'string',
					},
					qrData: {
						type: 'string',
					},
					paidAt: {
						type: 'string',
						format: 'datetime',
					},
					createdAt: {
						type: 'string',
						format: 'datetime',
					},
					updatedAt: {
						type: 'string',
						format: 'datetime',
					},
					value: {
						type: 'string',
					},
				},
			},
			400: {
				description: 'Bad Request',
				type: 'object',
				properties: {
					message: {
						type: 'string',
					},
				},
			},
			500: {
				description: 'Unexpected error when making payment',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'string',
					},
					message: {
						type: 'string',
					},
					details: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};

export const SwaggerPaymentOrderProcessPaymentNotifications = {
	schema: {
		summary: 'Process payment notifications for an order',
		description:
			'Receives and processes payment notifications from the payment gateway',
		tags: ['Payment Order'],
		body: {
			type: 'object',
			required: [
				'amount',
				'caller_id',
				'client_id',
				'created_at',
				'id',
				'state',
			],
			properties: {
				amount: {
					type: 'number',
					description: 'Payment amount',
				},
				caller_id: {
					type: 'number',
					description: 'Payment caller identifier',
				},
				client_id: {
					type: 'number',
					description: 'Payment client identifier',
				},
				created_at: {
					type: 'string',
					description: 'Creation date',
				},
				id: {
					type: 'string',
					description: 'Notification identifier',
				},
				payment: {
					type: 'object',
					properties: {
						id: {
							type: 'number',
							description: 'Payment identifier',
						},
						state: {
							type: 'string',
							description: 'Payment state',
						},
						type: {
							type: 'string',
							description: 'Payment method',
						},
					},
				},
				state: {
					type: 'string',
					description: 'Notification state',
				},
				additional_info: {
					type: 'object',
					properties: {
						external_reference: {
							type: 'string',
							description: 'External reference information',
						},
					},
				},
			},
		},
		response: {
			204: {
				description: 'Processed payment notification',
				type: 'null',
			},
			400: {
				description: 'Bad Request',
				type: 'object',
				properties: {
					message: {
						type: 'string',
					},
				},
			},
			500: {
				description: 'Unexpected error when process payment',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'string',
					},
					message: {
						type: 'string',
					},
					details: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};
