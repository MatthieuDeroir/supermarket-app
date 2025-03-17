// modules/payment/bll/payment.service.ts
import paypal from "paypal-rest-sdk";
import { CreatePaymentDto, ExecutePaymentDto, PaymentResponseDto } from "../dto/payment.dto.ts";
import cartService from "../../carts/bll/cart.service.ts";
import addressService from "../../addresses/bll/address.service.ts";
import userRepository from "../../users/dal/user.repository.ts";

// Custom logging function to improve visibility
const log = {
  info: (message: string, data?: any) => {
    console.log(`[PAYMENT INFO] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  },
  error: (message: string, error?: any) => {
    console.error(`[PAYMENT ERROR] ${message}`);
    if (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
      } else {
        console.error(JSON.stringify(error, null, 2));
      }
    }
  },
  success: (message: string, data?: any) => {
    console.log(`[PAYMENT SUCCESS] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  },
  warning: (message: string, data?: any) => {
    console.warn(`[PAYMENT WARNING] ${message}`);
    if (data) console.warn(JSON.stringify(data, null, 2));
  },
  step: (message: string) => {
    console.log(`[PAYMENT STEP] ${message}`);
  }
};

// Configure PayPal SDK
const configuredPaypal = () => {
  log.step("Configuring PayPal SDK");
  const mode = Deno.env.get("PAYPAL_MODE") || "sandbox";
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID") || "";
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET") || "";

  if (!clientId || !clientSecret) {
    log.warning("PayPal credentials missing or incomplete");
  }

  log.info(`PayPal mode: ${mode}`);

  paypal.configure({
    mode,
    client_id: clientId,
    client_secret: clientSecret
  });

  return paypal;
};

// Initialize PayPal with logging
const paypalClient = configuredPaypal();

export class PaymentService {
  /**
   * Check if a payment ID is valid and in a state that can be executed
   * @param paymentId PayPal payment ID to check
   * @returns true if the payment is valid for execution
   */
  static async isPaymentValid(paymentId: string): Promise<boolean> {
    log.step(`Validating payment ${paymentId}`);

    try {
      const payment = await PaymentService.getPaymentDetails(paymentId);
      const isValid = payment && payment.state === "created";

      if (isValid) {
        log.info(`Payment ${paymentId} is valid and ready for execution`);
      } else {
        log.warning(`Payment ${paymentId} is not in a valid state for execution`, {
          state: payment?.state || "unknown"
        });
      }

      return isValid;
    } catch (error) {
      log.error(`Payment validation failed for ${paymentId}`, error);
      return false;
    }
  }

  /**
   * Complete payment flow - creates a payment and returns the approval URL
   * @param userId User ID to process payment for
   * @returns Object with payment info and approval URL
   */
  static async initiatePaymentFlow(userId: number): Promise<{
    payment: PaymentResponseDto;
    approvalUrl: string;
  }> {
    log.step(`Initiating complete payment flow for user #${userId}`);

    try {
      // Create the payment
      const payment = await PaymentService.createPaymentForActiveCart(userId);

      // Extract the approval URL
      const approvalUrl = payment.links?.find(link => link.rel === "approval_url")?.href;

      if (!approvalUrl) {
        throw new Error("No approval URL found in payment response");
      }

      log.success(`Payment flow initiated successfully for user #${userId}`, {
        paymentId: payment.id,
        approvalUrl
      });

      return {
        payment,
        approvalUrl
      };
    } catch (error) {
      log.error(`Failed to initiate payment flow for user #${userId}`, error);
      throw error;
    }
  }

  /**
   * Complete payment process - executes payment and processes the cart
   * @param paymentId PayPal payment ID
   * @param payerId PayPal payer ID
   * @param userId User ID in our system
   * @returns Complete payment result including invoice ID
   */
  static async completePaymentProcess(
      paymentId: string,
      payerId: string,
      userId: number
  ): Promise<PaymentResponseDto & { invoiceId: number }> {
    log.step(`Starting complete payment process for payment ${paymentId}, user #${userId}`);

    // First validate the payment is in a valid state
    const isValid = await PaymentService.isPaymentValid(paymentId);
    if (!isValid) {
      const errorMsg = `Payment ${paymentId} is not valid or cannot be executed`;
      log.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Execute the payment with PayPal
      const payment = await PaymentService.executePayment({
        paymentId,
        payerId
      });

      log.success(`PayPal payment executed successfully`, {
        id: payment.id,
        state: payment.state
      });

      // Process our internal cart
      log.step(`Processing cart payment for user #${userId}`);
      const invoiceId = await cartService.payActiveCart(userId);

      log.success(`Complete payment process finished successfully`, {
        paymentId,
        invoiceId
      });

      // Return enhanced payment response with invoice ID
      return {
        ...payment,
        invoiceId
      };
    } catch (error) {
      log.error(`Payment process failed`, error);
      throw error;
    }
  }

  /**
   * Create a PayPal payment for a specific cart
   * @param cartId Cart ID to create payment for (legacy method)
   * @returns PayPal payment response
   */
  static async createPayment(cartId: number): Promise<PaymentResponseDto> {
    log.step(`Starting payment creation for cart #${cartId}`);

    try {
      // Get the cart
      log.step(`Fetching cart #${cartId}`);
      const cart = await cartService.getCartById(cartId);
      if (!cart) {
        const errorMsg = `Cart with ID ${cartId} not found`;
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info(`Cart found`, { id: cart.id, userId: cart.userId, lines: cart.lines?.length });

      if (cart.payed) {
        const errorMsg = `Cart ${cartId} is already paid`;
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info("Cart payment status check passed");

      if (!cart.lines || cart.lines.length === 0) {
        const errorMsg = "Cannot pay an empty cart";
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info(`Cart has ${cart.lines.length} items`);

      // Get the total amount
      log.step("Calculating cart total amount");
      const amount = cart.total || await cartService.getTotalAmount(cartId);
      const currency = "EUR";
      const description = `Payment for order #${cartId}`;
      log.info(`Cart total: ${amount.toFixed(2)} ${currency}`);

      // Create payment DTO
      const dto: CreatePaymentDto = {
        amount,
        currency,
        description,
      };
      log.info("Created payment DTO", dto);

      // Create basic payment object
      log.step("Building PayPal payment object");
      const frontUrl = Deno.env.get("FRONT_URL") || Deno.env.get("APP_BASE_URL") || "http://localhost:3000";
      log.info(`Using front URL: ${frontUrl}`);

      const payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal"
        },
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
          return_url: `${frontUrl}/payment/success`,
          cancel_url: `${frontUrl}/payment/cancel`
        }
      };
      log.info("PayPal payment object built", payment);

      // Create the payment
      log.step("Sending payment creation request to PayPal");
      return new Promise((resolve, reject) => {
        paypalClient.payment.create(payment, (err, paypalPayment) => {
          if (err) {
            log.error("PayPal payment creation failed", err);
            return reject(err);
          }

          log.success("PayPal payment created successfully", {
            id: paypalPayment.id,
            state: paypalPayment.state,
            links: paypalPayment.links?.map(l => ({ rel: l.rel, href: l.href }))
          });

          const approvalUrl = paypalPayment.links?.find(link => link.rel === "approval_url")?.href;
          log.info(`Approval URL: ${approvalUrl}`);

          resolve(paypalPayment);
        });
      });
    } catch (error) {
      log.error("Unexpected error during payment creation", error);
      throw error;
    }
  }

  /**
   * Create a PayPal payment for the active cart of a user
   * @param userId The user ID for which to create payment
   * @returns PayPal payment response
   */
  static async createPaymentForActiveCart(userId: number): Promise<PaymentResponseDto> {
    log.step(`Starting payment creation for active cart of user #${userId}`);

    try {
      // Get the active cart
      log.step(`Fetching active cart for user #${userId}`);
      const activeCart = await cartService.getOrCreateActiveCart(userId);
      log.info("Active cart found", {
        id: activeCart.id,
        items: activeCart.lines?.length,
        total: activeCart.total
      });

      if (!activeCart || activeCart.lines.length === 0) {
        const errorMsg = "No active cart with items found";
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info(`Active cart has ${activeCart.lines.length} items`);

      // Get the active address
      log.step(`Fetching active address for user #${userId}`);
      const activeAddress = await addressService.getActiveAddressForUser(userId);

      if (!activeAddress) {
        const errorMsg = "No active address found for user";
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info("Active address found", {
        id: activeAddress.address_id,
        city: activeAddress.city,
        country: activeAddress.country
      });

      // Get the total amount
      log.step("Calculating cart total amount");
      const amount = activeCart.total || await cartService.getTotalAmount(activeCart.id);
      log.info(`Cart total: ${amount.toFixed(2)} EUR`);

      // Get the user info
      log.step(`Fetching user #${userId} details`);
      const user = await userRepository.findById(userId);
      if (!user) {
        const errorMsg = "User not found";
        log.error(errorMsg);
        throw new Error(errorMsg);
      }
      log.info("User found", {
        id: user.user_id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      });

      // Create payment object
      log.step("Building detailed PayPal payment object");
      const frontUrl = Deno.env.get("FRONT_URL") || Deno.env.get("APP_BASE_URL") || "http://localhost:3000";

      // Log each item in the cart
      log.info("Cart items:", activeCart.lines.map(line => ({
        id: line.productId,
        name: line.product?.name,
        qty: line.quantity,
        price: line.product?.finalPrice
      })));

      const payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
          payer_info: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
          }
        },
        transactions: [
          {
            amount: {
              total: amount.toFixed(2),
              currency: "EUR"
            },
            description: `Payment for order #${activeCart.id}`,
            invoice_number: `CART-${activeCart.id}-${Date.now()}`,
            item_list: {
              items: activeCart.lines.map(line => ({
                name: line.product?.name || `Product #${line.productId}`,
                price: ((line.product?.finalPrice || 0) / line.quantity).toFixed(2),
                currency: "EUR",
                quantity: line.quantity
              })),
              shipping_address: {
                recipient_name: `${user.first_name} ${user.last_name}`,
                line1: activeAddress.address_line1,
                line2: activeAddress.address_line2 || "",
                city: activeAddress.city,
                country_code: "FR", // Hardcoded for now, should be derived from country name
                postal_code: activeAddress.zip_code,
                state: ""
              }
            }
          }
        ],
        redirect_urls: {
          return_url: `${frontUrl}/payment/success?userId=${userId}`,
          cancel_url: `${frontUrl}/payment/cancel`
        },
        note_to_payer: "Contact us for any questions on your order."
      };
      log.info("PayPal payment object built with all details");

      // Create the payment
      log.step("Sending payment creation request to PayPal");
      return new Promise((resolve, reject) => {
        paypalClient.payment.create(payment, (err, paypalPayment) => {
          if (err) {
            log.error("PayPal payment creation failed", err);
            return reject(err);
          }

          log.success("PayPal payment created successfully", {
            id: paypalPayment.id,
            state: paypalPayment.state,
            links: paypalPayment.links?.map(l => ({ rel: l.rel, href: l.href }))
          });

          const approvalUrl = paypalPayment.links?.find(link => link.rel === "approval_url")?.href;
          log.info(`Approval URL: ${approvalUrl}`);

          resolve(paypalPayment);
        });
      });
    } catch (error) {
      log.error("Unexpected error during payment creation", error);
      throw error;
    }
  }

  /**
   * Execute a PayPal payment (legacy version)
   * @param dto Payment execution details
   * @returns PayPal payment execution response
   */
  static async executePayment(dto: ExecutePaymentDto): Promise<PaymentResponseDto> {
    log.step(`Executing payment ${dto.paymentId}`);

    if (!dto.paymentId || !dto.payerId) {
      const errorMsg = "PaymentId and PayerId are required";
      log.error(errorMsg);
      throw new Error(errorMsg);
    }

    log.info("Payment execution details", {
      paymentId: dto.paymentId,
      payerId: dto.payerId
    });

    // Execute the payment
    log.step("Sending payment execution request to PayPal");
    return new Promise((resolve, reject) => {
      paypalClient.payment.execute(dto.paymentId, { payer_id: dto.payerId }, (err, payment) => {
        if (err) {
          log.error("PayPal payment execution failed", err);
          return reject(err);
        }

        log.success("PayPal payment executed successfully", {
          id: payment.id,
          state: payment.state,
          transactions: payment.transactions?.length
        });

        resolve(payment);
      });
    });
  }

  /**
   * Execute a PayPal payment and process the active cart
   * @param dto Payment execution details
   * @param userId The authenticated user ID
   * @returns PayPal payment execution response
   */
  static async executePaymentForActiveCart(dto: ExecutePaymentDto, userId: number): Promise<PaymentResponseDto> {
    log.step(`Executing payment ${dto.paymentId} for user #${userId}'s active cart`);

    if (!dto.paymentId || !dto.payerId) {
      const errorMsg = "PaymentId and PayerId are required";
      log.error(errorMsg);
      throw new Error(errorMsg);
    }

    log.info("Payment execution details", {
      paymentId: dto.paymentId,
      payerId: dto.payerId,
      userId: userId
    });

    // Execute the payment
    log.step("Sending payment execution request to PayPal");
    return new Promise((resolve, reject) => {
      paypalClient.payment.execute(dto.paymentId, { payer_id: dto.payerId }, async (err, payment) => {
        if (err) {
          log.error("PayPal payment execution failed", err);
          return reject(err);
        }

        log.success("PayPal payment executed successfully", {
          id: payment.id,
          state: payment.state
        });

        try {
          // Process the cart payment in our system
          log.step(`Processing active cart payment for user #${userId}`);

          // First verify we have an active cart
          const activeCart = await cartService.getOrCreateActiveCart(userId);
          log.info("Active cart verified", {
            id: activeCart.id,
            items: activeCart.lines?.length,
            total: activeCart.total
          });

          const invoiceId = await cartService.payActiveCart(userId);
          log.success(`Cart payment processed, invoice #${invoiceId} created`);

          // Enhance the payment response with our invoice ID
          const enhancedPayment = {
            ...payment,
            invoiceId
          };

          log.info("Enhanced payment response with invoice ID", { invoiceId });
          resolve(enhancedPayment);
        } catch (error) {
          log.error("Error processing cart after PayPal payment", error);
          reject(error);
        }
      });
    });
  }

  /**
   * Get payment details
   * @param paymentId The PayPal payment ID
   * @returns Payment details
   */
  static async getPaymentDetails(paymentId: string): Promise<PaymentResponseDto> {
    log.step(`Getting details for payment ${paymentId}`);

    return new Promise((resolve, reject) => {
      paypalClient.payment.get(paymentId, (err, payment) => {
        if (err) {
          log.error("PayPal payment details retrieval failed", err);
          return reject(err);
        }

        log.success("PayPal payment details retrieved successfully", {
          id: payment.id,
          state: payment.state,
          create_time: payment.create_time,
          update_time: payment.update_time
        });

        resolve(payment);
      });
    });
  }
}

export default PaymentService;