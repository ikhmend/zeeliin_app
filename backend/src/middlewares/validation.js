import AppError from "../utility/AppError.js";
export function validateRequest(schema) {
  return function (req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError("Оруулсан мэдээлэл буруу байна.", 400, errors)
      );
    }
    req.validated = result.data;
    next();
  };
}