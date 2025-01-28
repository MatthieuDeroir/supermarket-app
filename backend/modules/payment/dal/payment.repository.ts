import paypal from "paypal-rest-sdk";
import { CreatePaymentDTO, ExecutePaymentDTO, PaymentResponseDTO } from "../dto/payment.dto.ts";

// Configuration du SDK PayPal
paypal.configure({
  mode: "sandbox", // ou "live"
  client_id: Deno.env.get("PAYPAL_CLIENT_ID") || "",
  client_secret: Deno.env.get("PAYPAL_CLIENT_SECRET") || ""
});

export class PaymentRepository {
  static createPayment(dto: CreatePaymentDTO): Promise<PaymentResponseDTO> {
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
          return_url: "https://yourapp.com/return",
          cancel_url: "https://yourapp.com/cancel"
        }
      };

      paypal.payment.create(payment, (err: paypal.Error, payment: PaymentResponseDTO) => {
        if (err) return reject(err);
        resolve(payment as PaymentResponseDTO);
      });
    });
  }

  static executePayment(dto: ExecutePaymentDTO): Promise<PaymentResponseDTO> {
    return new Promise((resolve, reject) => {
      paypal.payment.execute(dto.paymentId, { payer_id: dto.payerId }, (err: paypal.Error, payment: PaymentResponseDTO) => {
        if (err) return reject(err);
        resolve(payment as PaymentResponseDTO);
      });
    });
  }
}
