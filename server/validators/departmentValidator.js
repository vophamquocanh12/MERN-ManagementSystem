// ✅ 2. Backend: Joi Validation Middleware (validators/departmentValidator.js)
import Joi from "joi";

export const validateDepartment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(255).allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};