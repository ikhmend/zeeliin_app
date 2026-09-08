import PasswordReset from "../../models/password.reset.model.js";
import { Op } from "sequelize";
export async function createPassReset(
  userId,
  tokenHash,
  expiresAt,
  transaction = null,
) {
  return await PasswordReset.create(
    { user_id: userId, token_hash: tokenHash, expires_at: expiresAt },
    { transaction },
  );
}
export async function findValidPasswordReset(tokenHash, transaction = null) {
  return await PasswordReset.findOne({
    where: {
      token_hash: tokenHash,
      used_at: null,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });
}
export async function invalidatePasswordResets(userId, transaction = null) {
  return await PasswordReset.update(
    { used_at: new Date() },
    { where: { user_id: userId, used_at: null }, transaction },
  );
}
