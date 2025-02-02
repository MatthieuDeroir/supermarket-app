export interface CreatePaymentDTO {
    amount: number;
    currency: string;
    description: string;
  }
  
  export interface ExecutePaymentDTO {
    paymentId: string;
    payerId: string;
  }
  
  export interface PaymentResponseDTO {
    id: string;
    status: string;
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  }
  