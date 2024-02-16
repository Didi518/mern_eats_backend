import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Le nom est requis"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("L'adresse est requise"),
  body("city").isString().notEmpty().withMessage("La ville est requise"),
  body("country").isString().notEmpty().withMessage("Le pays est requis"),
  handleValidationError,
];

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .notEmpty()
    .withMessage("Le nom du restaurant est requis"),
  body("city").notEmpty().withMessage("La ville du restaurant est requis"),
  body("country").notEmpty().withMessage("Le pays du restaurant est requis"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Le prix de la livraison doit être un nombre positif"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage(
      "L'estimation du temps de livraison doit être un entier positif"
    ),
  body("cuisines")
    .isArray()
    .withMessage("Le type de nourritures doit être un tableau")
    .not()
    .isEmpty()
    .withMessage("Le tableau des types de nourritures ne peut pas être vide"),
  body("menuItems")
    .isArray()
    .withMessage("Les menus du restaurant doivent être un tableau"),
  body("menuItems.*.name").notEmpty().withMessage("Le nom du menu est requis"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Le prix du menu est requis et doit être un nombre positif"),
  handleValidationError,
];
