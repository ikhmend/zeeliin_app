import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Токен байхгүй.",
      });
    }
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Токен буруу",
      });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authRepository.findUserById(decoded.id);
    if (
      !user?.is_active ||
      Number(user.customer_id) !== Number(decoded.customer_id)
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Хэрэглэгчийн эрх хүчингүй болсон." });
    }
    req.user = { id: user.id, customer_id: user.customer_id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Хугацаа дууссан? хүчингүй?",
    });
  }
}
