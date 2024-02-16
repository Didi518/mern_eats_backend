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
