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