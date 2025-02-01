import { Hono } from "hono";
import { PaymentService } from "./bll/payment.service.ts";

const paymentRouter = new Hono();

paymentRouter.get("/create-payment/:idCart", async (c) => {
  try {
    const idCart = c.req.url.searchParams.get("idCart");
    const result = await PaymentService.createPayment(idCart);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 400);
  }
});

paymentRouter.post("/execute-payment", async (c) => {
  try {
    const body = await c.req.json();
    const result = await PaymentService.executePayment(body);
    return c.json(result);
  } catch (err) {
    return c.json({ error: err.message }, 400);
  }
});

export default paymentRouter;
