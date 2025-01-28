import { Hono } from "hono";
import { PaymentService } from "./bll/payment.service.ts";

const router = new Hono();

router.post("/create-payment", async (c) => {
  try {
    const body = await c.req.json();
    const result = await PaymentService.createPayment(body);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 400);
  }
});

router.post("/execute-payment", async (c) => {
  try {
    const body = await c.req.json();
    const result = await PaymentService.executePayment(body);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 400);
  }
});

export default router;
