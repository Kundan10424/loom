import { body } from 'express-validator';


export const signupValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty()
];