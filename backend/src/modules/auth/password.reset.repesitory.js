import PasswordReset from "../../models/password.reset.model.js";
import { Op } from "sequelize";
export async function createPassReset(userId, tokenHash, expiresAt){
    return await PasswordReset.create({user_id:userId, token_hash: tokenHash, expires_at:expiresAt });
}
export async function findValidPasswordReset(tokenHash) {
  return await PasswordReset.findOne({
    where: {
      token_hash: tokenHash,
      used_at: null,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });
}
export async function markPasswordResetAsUsed(resetId) {
  return await PasswordReset.update(
    {
      used_at: new Date(),
    },
    {
      where: { id: resetId },
    }
  );
}