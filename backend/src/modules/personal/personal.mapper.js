export function mapAccount(user) {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active,
  };
}
export function mapCustomerProfile(customer) {
  if (!customer) {
    return null;
  }
  return {
    id: customer.id,
    customer_type: customer.customer_type,
    customer_code: customer.customer_code,
    family_name: customer.family_name,
    last_name: customer.last_name,
    first_name: customer.first_name,
    register_no: customer.register_no,
    citizen_registration_no: customer.citizen_registration_no,
    phone: customer.phone,
    home_phone: customer.home_phone,
    email: customer.email,
    social: customer.social,
    activity_dir: customer.activity_dir,
    business_type: customer.business_type,
    education: customer.education,
    profession: customer.profession,
    birth_date: customer.birth_date,
    birth_place: customer.birth_place,
    official_address: customer.official_address,
    current_address: customer.current_address,
    living_address: customer.living_address,
    employment: customer.employment
      ? {
          organization_name: customer.employment.organization_name,
          position: customer.employment.position,
          worked_year: customer.employment.worked_year,
          monthly_salary: Number(customer.employment.monthly_salary || 0),
          organization_address: customer.employment.organization_address,
          manager_name: customer.employment.manager_name,
          manager_phone: customer.employment.phone,
        }
      : null,
  };
}
export function mapProfileResponse(user, customerProfile) {
  return {
    account: mapAccount(user),
    profile: mapCustomerProfile(customerProfile),
  };
}
export function mapRecentPayment(payment) {
  return {
    id: payment.id,
    loan_id: payment.loan_id,
    payment_amount: Number(payment.payment_amount),
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
    status: "paid",
  };
}
export function mapUpcomingInstallment(installment) {
  return {
    id: installment.id,
    loan_id: installment.loan_id,
    due_date: installment.due_date,
    total_amount: Number(installment.total_amount || 0),
    paid_amount: Number(installment.paid_amount || 0),
    remaining_amount: Number(installment.remaining_amount || 0),
    status: installment.status,
  };
}
export function mapDashboardResponse({
  customer,
  activeLoanCount,
  totalOutstandingAmount,
  recentPayments,
  upcomingInstallments,
  paymentStatusSummary,
}) {
  const nextInstallment = upcomingInstallments[0] ?? null;
  return {
    dashboardData: {
      name: customer.first_name,
      activeLoanCount,
      totalOutstandingAmount: Number(totalOutstandingAmount || 0),
      nextPaymentAmount: nextInstallment
        ? Number(nextInstallment.remaining_amount || 0)
        : null,
      nextPaymentDate: nextInstallment ? nextInstallment.due_date : null,
    },
    recentPayments: recentPayments.map(mapRecentPayment),
    upcomingInstallments: upcomingInstallments.map(mapUpcomingInstallment),
    paymentStatusSummary,
  };
}
export function mapPayment(payment) {
  return {
    id: payment.id,
    loan_id: payment.loan_id,
    payment_amount: Number(payment.payment_amount),
    payment_method: payment.payment_method,
    payment_date: payment.payment_date,
  };
}
export function mapInstallment(installment) {
  return {
    id: installment.id,
    due_date: installment.due_date,
    total_amount: Number(installment.total_amount),
    paid_amount: Number(installment.paid_amount),
    remaining_amount: Number(installment.remaining_amount),
    status: installment.status,
  };
}
