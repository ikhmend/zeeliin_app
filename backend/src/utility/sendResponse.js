export function Success(res, data, status=200, message = null){
  return res.status(status).json({
    success: true, 
    ...(message && { message }), 
    data,
  });
}