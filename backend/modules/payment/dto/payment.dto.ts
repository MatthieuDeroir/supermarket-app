// Payment DTOs
export interface PaymentResponseDto {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

export interface CreatePaymentDto {
  amount: number;
  currency: string;
  description: string;
}

export interface ExecutePaymentDto {
  paymentId: string;
  payerId: string;
}