import { Role } from "../../../../generated/prisma/enums";

export interface IRegisterCustomerPayload {
	name: string;
	email: string;
	password: string;
	customer: {
		contactNumber?: string;
	};
};

export interface IVerifyEmailPayload {
	email: string;
	otp: string;
};

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IRequestUser {
	userId: string;
	email: string;
	name: string;
	role: Role;
}