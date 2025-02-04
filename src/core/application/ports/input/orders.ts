import { OrderStatusType } from '@domain/types/orderStatusType';

export type GetOrderByIdParams = {
	id?: string;
};

export type UpdateOrderParams = {
	id?: string;
	readableId?: string;
	status?: OrderStatusType;
};
