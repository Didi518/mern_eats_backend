import { InferSchemaType } from "mongoose";

import { menuItemsSchema } from "../models/restaurant";

export type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    zipCode: string;
    city: string;
  };
  restaurantId: string;
};

export type MenuItemType = InferSchemaType<typeof menuItemsSchema>;
