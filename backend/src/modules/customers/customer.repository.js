import Customer from "../../models/customer.model.js";
import Employment from "../../models/employments.model.js";
export async function findCustomer(id, transaction = null) {
  return await Customer.findByPk(id, { transaction });
}
export async function findCustomerProfile(id) {
  return await Customer.findByPk(id, {
    include: [
      {
        model: Employment,
        as: "employment",
        required: false,
      },
    ],
  });
}
export async function createCustomer(customerData, transaction) {
  return await Customer.create(customerData, {
    transaction,
  });
}
export async function findCustomerByRegisterNo(reg_no) {
  return await Customer.findOne({
    where: { register_no: reg_no },
  });
}
export async function updateCustomer(
  customerId,
  updateData,
  transaction = null,
) {
  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    return null;
  }
  return await customer.update(updateData, { transaction });
}

export async function upsertEmployment(customerId, employmentData, transaction) {
  const employment = await Employment.findOne({
    where: { customer_id: customerId },
    transaction,
  });
  return employment
    ? employment.update(employmentData, { transaction })
    : Employment.create({ customer_id: customerId, ...employmentData }, { transaction });
}
