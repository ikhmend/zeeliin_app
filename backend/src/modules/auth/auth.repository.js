import { Op } from "sequelize";
import User from "../../models/user.model.js";
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
export async function findUserByUnique({username, phone, email}){
  const ok=[];
  if(username){ok.push(username)}
  else if(phone){ok.push(phone)}
  else {ok.push(email)}
  if(ok.length===0){return null}
  return await User.findOne({
    where:{[Op.or]:ok},
  });
}
export async function findUserByCustomerId(customerId){
  return await User.findOne({
    where:{customer_id: customerId}
  });
}