import { PaymentRepository } from "../dal/payment.repository.ts";
import { CreatePaymentDTO, ExecutePaymentDTO, PaymentResponseDTO } from "../dto/payment.dto.ts";

export class PaymentService {
  static async createPayment(dto: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    // Validation simple
    if (dto.amount <= 0) {
      throw new Error("Le montant doit être supérieur à 0.");
    }

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
