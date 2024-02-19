import Stripe from "stripe";
import { Request, Response } from "express";

import { CheckoutSessionRequest } from "../types/types";
import Restaurant from "../models/restaurant";
import stripeServices from "../services/stripeServices";
import Order from "../models/orderSchema";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Erreur webhook: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "payée";

    await order.save();
  }

  res.status(200).send();
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant introuvable");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "commandée",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const lineItems = stripeServices.createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await stripeServices.createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de session Stripe" });
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

export default { stripeWebhookHandler, createCheckoutSession };
