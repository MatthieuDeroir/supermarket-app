import cartService from "../../carts/bll/cart.service.ts";
import { PaymentRepository } from "../dal/payment.repository.ts";
import { PaymentResponseDto, ExecutePaymentDto, CreatePaymentDto } from "../dto/payment.dto.ts";
export class PaymentService {
  static async createPayment(idCart: number): Promise<PaymentResponseDto> {
    const amount = await cartService.getTotalAmount(idCart);
    const currency = "EUR";
    const description = `Paiement de la commande ${idCart}`;

    const dto: CreatePaymentDto = {
      amount,
      currency,
      description,
    };
    // Appel au DAL
    return await PaymentRepository.createPayment(dto);
  }

  static async executePayment(dto: ExecutePaymentDto): Promise<PaymentResponseDto> {
    if (!dto.paymentId || !dto.payerId) {
      throw new Error("Les paramètres paymentId et payerId sont obligatoires.");
    }

    // Appel au DAL
    return await PaymentRepository.executePayment(dto);
  }
}
