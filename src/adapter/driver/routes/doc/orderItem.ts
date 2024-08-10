export const SwaggerUpdateCartItem = {
	schema: {
		summary: 'Update order item',
		description: 'Update order item',
		tags: ['Order Item'],
		params: { id: { type: 'string', format: 'uuid' } },
		body: {
			quantity: {
				type: 'number',
			},
			details: {
				type: 'string',
			},
		},
		response: {
			200: {
				description: 'Order item updated successfully',
				type: 'object',
				properties: {
					id: {
						type: 'string',
					},
					orderId: {
						type: 'string',
					},
					productId: {
						type: 'string',
					},
					quantity: {
						type: 'number',
					},
					value: {
						type: 'number',
					},
					details: {
						type: 'string',
						format: 'nullable',
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
			400: {
				description: 'Bad request',
				type: 'object',
				properties: {
					path: {
						type: 'string',
					},
					status: {
						type: 'number',
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
			500: {
				description: 'Server error',
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

export const SwaggerDeleteOrderItem = {
	schema: {
		summary: 'Delete order item',
		description: 'Delete order item',
		tags: ['Order Item'],
		params: { id: { type: 'string', format: 'uuid' } },
		response: {
			200: {},
			404: {
				description: 'Product not found',
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
			500: {
				description: 'Unexpected error when deleting product',
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
