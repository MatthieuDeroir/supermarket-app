// modules/payment/dto/payment.dto.ts

/**
 * Data transfer object for creating a payment
 */
export interface CreatePaymentDto {
  /** Total payment amount */
  amount: number;
  /** Currency code (e.g., EUR, USD) */
  currency: string;
  /** Payment description */
  description: string;
}

/**
 * Data transfer object for executing a payment
 */
export interface ExecutePaymentDto {
  /** PayPal payment ID */
  paymentId: string;
  /** PayPal payer ID */
  payerId: string;
}

/**
 * Payment link representation
 */
export interface PaymentLink {
  /** Link URL */
  href: string;
  /** Relationship type (e.g., "approval_url", "execute") */
  rel: string;
  /** HTTP method to use with this link */
  method?: string;
}

/**
 * Payment state enum representing different payment states
 */
export enum PaymentState {
  CREATED = "created",
  APPROVED = "approved",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  FAILED = "failed",
  EXPIRED = "expired"
}

/**
 * Data transfer object for payment responses from PayPal
 */
export interface PaymentResponseDto {
  /** PayPal payment ID */
  id: string;
  /** PayPal intent type */
  intent?: string;
  /** Payment state */
  state: PaymentState | string;
  /** Payment creation timestamp */
  create_time?: string;
  /** Payment update timestamp */
  update_time?: string;
  /** Array of payment links for different actions */
  links?: PaymentLink[];
  /** Optional invoice ID from our system after payment execution */
  invoiceId?: number;
  /** Payer information */
  payer?: {
    payment_method?: string;
    status?: string;
    payer_info?: {
      email?: string;
      first_name?: string;
      last_name?: string;
      payer_id?: string;
    };
  };
  /** Transaction information */
  transactions?: Array<{
    amount?: {
      total?: string;
      currency?: string;
    };
    description?: string;
    related_resources?: Array<any>;
  }>;
}