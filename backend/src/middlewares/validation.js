export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]?.message ||
          "Оруулсан мэдээлэл буруу байна.",
        field: result.error.issues[0]?.path?.join("."),
      });
    }
    req.validated = result.data;
    next();
  };
}