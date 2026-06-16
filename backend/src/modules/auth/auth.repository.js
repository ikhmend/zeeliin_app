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
