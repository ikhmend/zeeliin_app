import { Op } from "sequelize";
import User from "../../models/user.model.js";
import Session from "../../models/sessions.model.js";
export async function findUserById(id){
    return await User.findByPk(id);
}
export async function findUserByLogin(login) {
  return await User.findOne({
    where: {
      [Op.or]: [
        {username: login},
        {email: login},
        {phone: login},
      ],
    },
  });
}
export async function createUser(userData, transaction) {
  return await User.create(userData, {
    transaction,
  });
}
export async function findUserByUnique({username, phone, email,}){
  const conditions = [];
  if (username){
    conditions.push({ username });
  }
  if (phone){
    conditions.push({ phone });
  }
  if (email) {
    conditions.push({ email });
  }
  if (conditions.length === 0){
    return null;
  }
  return await User.findOne({
    where: {
      [Op.or]: conditions,
    },
  });
}
export async function findUserByCustomerId(customerId){
  return await User.findOne({
    where:{customer_id: customerId}
  });
}
export async function changePassword(userId, newHash){
  return await User.update({password_hash: newHash}, 
    {where:{id: userId,}})
}
export async function createRefreshSession(sessionData){
  return await Session.create(sessionData);
}
export async function findSessionByHash(refreshTokenHash){
  return await Session.findOne({
    where: {
      token_hash: refreshTokenHash,
    },
  });
}
export async function revokeSessionByHash(tokenHash) {
  const session = await Session.findOne({
    where: {
      token_hash: tokenHash,
    },
  });

  if (!session) {
    return null;
  }
  session.revoked_at = new Date();
  await session.save();
  return session;
}
export async function revokeAllSessions(userId, transaction){
  const sessions = await Session.update({
    revoked_at: new Date(), 
  },
  {
    where: {
      user_id: userId,
      revoked_at:null
    },
    transaction,
  }
);
}
export async function updateUserPassword(userId, passwordHash, transaction=null) {
  return await User.update(
    {
      password_hash: passwordHash,
    },
    {
      where: { id: userId },
    },
    transaction,
  );
}