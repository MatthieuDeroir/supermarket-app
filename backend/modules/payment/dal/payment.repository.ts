import paypal from "paypal-rest-sdk";
import { PaymentResponseDto, ExecutePaymentDto, CreatePaymentDto } from "../dto/payment.dto.ts";

// Configuration du SDK PayPal
paypal.configure({
  mode: "sandbox", // ou "live"
  client_id: Deno.env.get("PAYPAL_CLIENT_ID") || "",
  client_secret: Deno.env.get("PAYPAL_CLIENT_SECRET") || ""
});

export class PaymentRepository {
  static createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return new Promise((resolve, reject) => {
      const payment = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        transactions: [
          {
            amount: {
              total: dto.amount.toFixed(2),
              currency: dto.currency
            },
            description: dto.description
          }
        ],
        redirect_urls: {
          return_url: `${Deno.env.get("APP_BASE_URL")}/payment/success`,
          cancel_url: `${Deno.env.get("APP_BASE_URL")}/payment/cancel`
        }
      };

      paypal.payment.create(payment, (err: paypal.Error, payment: PaymentResponseDto) => {
        if (err) return reject(err);
        resolve(payment as PaymentResponseDto);
      });
    });
  }

  static executePayment(dto: ExecutePaymentDto): Promise<PaymentResponseDto> {
    return new Promise((resolve, reject) => {
      paypal.payment.execute(dto.paymentId, { payer_id: dto.payerId }, (err: paypal.Error, payment: PaymentResponseDto) => {
        if (err) return reject(err);
        resolve(payment as PaymentResponseDto);
      });
    });
  }
}
