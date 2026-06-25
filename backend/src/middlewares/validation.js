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
        message: result.error.issues[0].message,
        field: result.error.issues[0].path.join("."),
      });
    }
    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
}