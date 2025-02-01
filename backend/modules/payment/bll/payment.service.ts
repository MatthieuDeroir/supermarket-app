import cartService from "../../carts/bll/cart.service.ts";
import { PaymentRepository } from "../dal/payment.repository.ts";
import { CreatePaymentDTO, ExecutePaymentDTO, PaymentResponseDTO } from "../dto/payment.dto.ts";

export class PaymentService {
  static async createPayment(idCart: number): Promise<PaymentResponseDTO> {
    const amount = await cartService.getTotalAmount(idCart);
    const currency = "EUR";
    const description = `Paiement de la commande ${idCart}`;

    const dto: CreatePaymentDTO = {
      amount,
      currency,
      description,
    };
    // Appel au DAL
    return await PaymentRepository.createPayment(dto);
  }

  static async executePayment(dto: ExecutePaymentDTO): Promise<PaymentResponseDTO> {
    if (!dto.paymentId || !dto.payerId) {
      throw new Error("Les paramètres paymentId et payerId sont obligatoires.");
    }

    // Appel au DAL
    return await PaymentRepository.executePayment(dto);
  }
}
