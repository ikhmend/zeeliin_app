export function mapPayment(payment){
    return{
        id: payment.id,
        loan_id: payment.loan_id,
        payment_amount: Number(payment.payment_amount),
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
    }
}
export function mapInstallment(installment){
    return {
        id: installment.id,
        due_date: installment.due_date,
        total_amount: Number(installment.total_amount),
        remaining_amount: Number(installment.remaining_amount),
        status:installment.status,
    }
}