// modules/payment/payment.controller.ts
import { Hono } from "hono";
import { PaymentService } from "./bll/payment.service.ts";

// Declaration for TypeScript to recognize userId in context
declare module "hono" {
    interface ContextVariableMap {
        userId: number;
    }
}

const paymentController = new Hono();

/**
 * POST /payment/process
 * - Combined endpoint that initiates the payment flow
 * - Creates payment and returns the approval URL
 */
paymentController.post("/process", async (c) => {
    console.log("[PAYMENT] Starting payment process");

    try {
        const userId = c.get("userId");
        if (!userId) {
            console.error("[PAYMENT ERROR] Authentication required for payment process");
            return c.json({ error: "Authentication required" }, 401);
        }

        console.log(`[PAYMENT] Processing payment for user #${userId}`);

        // Use the new combined flow
        const result = await PaymentService.initiatePaymentFlow(userId);

        console.log(`[PAYMENT SUCCESS] Payment initiated, approval URL: ${result.approvalUrl}`);

        return c.json({
            success: true,
            paymentId: result.payment.id,
            approvalUrl: result.approvalUrl
        });
    } catch (error) {
        console.error("[PAYMENT ERROR] Failed to process payment:", error);
        return c.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to process payment"
        }, 500);
    }
});

/**
 * GET /payment/success
 * - Handles the return from PayPal approval page
 * - Completes the payment process by executing the payment and processing the cart
 */
paymentController.get("/success", async (c) => {
    console.log("[PAYMENT] Payment success callback received");

    try {
        // Get the query parameters from PayPal redirect
        const paymentId = c.req.query("paymentId");
        const payerId = c.req.query("PayerID");
        const userIdParam = c.req.query("userId");

        // Get user ID from context or query parameter
        let userId = c.get("userId");
        if (!userId && userIdParam) {
            userId = parseInt(userIdParam);
        }

        console.log(`[PAYMENT] Success params: paymentId=${paymentId}, payerId=${payerId}, userId=${userId}`);

        if (!paymentId || !payerId) {
            console.error("[PAYMENT ERROR] Missing payment parameters");
            return c.json({
                success: false,
                error: "Missing required payment parameters"
            }, 400);
        }

        if (!userId) {
            console.error("[PAYMENT ERROR] User identification required");
            return c.json({
                success: false,
                error: "Authentication required"
            }, 401);
        }

        // Complete the payment process
        console.log(`[PAYMENT] Completing payment process for payment ${paymentId}`);
        const result = await PaymentService.completePaymentProcess(paymentId, payerId, userId);

        console.log(`[PAYMENT SUCCESS] Payment completed successfully, invoice #${result.invoiceId} created`);

        // Here you could either:
        // 1. Return JSON response (for API calls)
        // 2. Redirect to a success page (for web flows)

        // Option 1: JSON response
        return c.json({
            success: true,
            message: "Payment processed successfully",
            invoiceId: result.invoiceId,
            paymentId: result.id,
            paymentState: result.state
        });

        // Option 2: Redirect (uncomment to use)
        // const frontUrl = Deno.env.get("FRONT_URL") || "http://localhost:3000";
        // return c.redirect(`${frontUrl}/payment/thank-you?invoiceId=${result.invoiceId}`);
    } catch (error) {
        console.error("[PAYMENT ERROR] Failed to complete payment:", error);

        // Return error JSON
        return c.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete payment"
        }, 500);

        // Or redirect to error page (uncomment to use)
        // const frontUrl = Deno.env.get("FRONT_URL") || "http://localhost:3000";
        // return c.redirect(`${frontUrl}/payment/error?message=${encodeURIComponent(error.message)}`);
    }
});

/**
 * POST /payment/create
 * - Create a PayPal payment for the active cart of the authenticated user
 */
paymentController.post("/create", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        console.log(`[PAYMENT] Creating payment for user #${userId}`);
        const payment = await PaymentService.createPaymentForActiveCart(userId);

        // Extract the approval URL from the payment response
        const approvalUrl = payment.links?.find(link => link.rel === "approval_url")?.href;
        console.log(`[PAYMENT] Payment created, approval URL: ${approvalUrl}`);

        return c.json({
            payment,
            approvalUrl
        });
    } catch (error) {
        console.error("[PAYMENT ERROR] Error creating payment:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to create payment"
        }, 500);
    }
});

/**
 * GET /payment/create-payment/:idCart
 * - Legacy endpoint for creating a payment for a specific cart
 */
paymentController.get("/create-payment/:idCart", async (c) => {
    try {
        const cartId = Number(c.req.param("idCart"));
        console.log(`[PAYMENT] Creating payment for cart #${cartId}`);

        const result = await PaymentService.createPayment(cartId);
        console.log(`[PAYMENT] Payment created for cart #${cartId}`);

        return c.json(result);
    } catch (error) {
        console.error("[PAYMENT ERROR] Error creating payment:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to create payment"
        }, 400);
    }
});

/**
 * POST /payment/execute
 * - Execute a PayPal payment and process the active cart
 * Body: { paymentId: string, payerId: string }
 */
paymentController.post("/execute", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        const { paymentId, payerId } = await c.req.json();
        console.log(`[PAYMENT] Executing payment ${paymentId} for user #${userId}`);

        if (!paymentId || !payerId) {
            return c.json({ error: "PaymentId and PayerId are required" }, 400);
        }

        // Check if payment is valid before executing
        const isValid = await PaymentService.isPaymentValid(paymentId);
        if (!isValid) {
            return c.json({
                error: "Payment is not valid or has expired. Please create a new payment."
            }, 400);
        }

        const executedPayment = await PaymentService.executePaymentForActiveCart(
            { paymentId, payerId },
            userId
        );

        console.log(`[PAYMENT SUCCESS] Payment executed successfully, invoice #${executedPayment.invoiceId} created`);
        return c.json({
            message: "Payment successful",
            payment: executedPayment
        });
    } catch (error) {
        console.error("[PAYMENT ERROR] Error executing payment:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to execute payment"
        }, 500);
    }
});

/**
 * POST /payment/execute-payment
 * - Legacy endpoint for executing a payment
 */
paymentController.post("/execute-payment", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        const body = await c.req.json();
        console.log(`[PAYMENT] Executing payment ${body.paymentId} via legacy endpoint`);

        if (!body.paymentId || !body.payerId) {
            return c.json({ error: "PaymentId and PayerId are required" }, 400);
        }

        // Check if payment is valid before executing
        const isValid = await PaymentService.isPaymentValid(body.paymentId);
        if (!isValid) {
            return c.json({
                error: "Payment is not valid or has expired. Please create a new payment."
            }, 400);
        }

        // Use the new method that also processes the active cart
        const result = await PaymentService.executePaymentForActiveCart(body, userId);
        console.log(`[PAYMENT SUCCESS] Payment executed successfully via legacy endpoint`);
        return c.json(result);
    } catch (error) {
        console.error("[PAYMENT ERROR] Error executing payment:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to execute payment"
        }, 400);
    }
});

/**
 * GET /payment/details/:paymentId
 * - Get details of a PayPal payment
 */
paymentController.get("/details/:paymentId", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({ error: "Authentication required" }, 401);
        }

        const paymentId = c.req.param("paymentId");
        console.log(`[PAYMENT] Getting details for payment ${paymentId}`);

        const payment = await PaymentService.getPaymentDetails(paymentId);
        console.log(`[PAYMENT] Retrieved details for payment ${paymentId}`);

        return c.json(payment);
    } catch (error) {
        console.error("[PAYMENT ERROR] Error getting payment details:", error);
        return c.json({
            error: error instanceof Error ? error.message : "Failed to get payment details"
        }, 500);
    }
});

/**
 * GET /payment/cancel
 * - Handle payment cancellation (PayPal redirect)
 */
paymentController.get("/cancel", async (c) => {
    console.log("[PAYMENT] Payment cancelled by user");

    // Here you could either return JSON or redirect
    // Option 1: JSON
    return c.json({
        success: false,
        message: "Payment was cancelled"
    });

    // Option 2: Redirect (uncomment to use)
    // const frontUrl = Deno.env.get("FRONT_URL") || "http://localhost:3000";
    // return c.redirect(`${frontUrl}/payment/cancelled`);
});

export default paymentController;