import * as loansRepository from "..repository/loans.repository.js";
import * as installmentsRepository from "..repository/installments.repository.js";
export async function generateInstallments(id){ //eniig installments.service.js ruu zuunu
    const loan=await loansRepository.getLoan(id);
    const hasInstallments= await installmentsRepository.findInstallmentsByLoanId(id); //uusgeegu bga
    if(!loan){
        throw new Error("Зээл алга байна.");
    }
    else if (hasInstallments.length>0){
        throw new Error("Төлбөрийн хуваарьтай зээл байна.")
    }
    else if(!loan.loan_amount ||loan.loan_amount<=0 || loan.interest_rate<0 || loan.duration_month<=0 || !loan.start_date ){
        throw new Error("Төлбөрийн хуваарь үүсгэхэд шаардлагатай мэдээлэл бүрэн биш байна.");
    }
    let remaining=loan.loan_amount;
    const sariin_tulbur=loan.loan_amount/loan.duration_month;
    let i=1;
    const installments=[];
    while(i<=loan.duration_month){
        const interestAmount=remaining*loan.interest_rate/100;
        const totalAmount=sariin_tulbur+interestAmount;
        const dueDate = new Date(loan.start_date);
        dueDate.setMonth(dueDate.getMonth() + i);
        installments.push({loan_id: loan.id, installment_no:i, due_date: loan.start_date+i, principal_amount: sariin_tulbur, interest_amount: interestAmount, total_amount:totalAmount, remaining_amount: totalAmount, status: "pending", paid_date: null});
        remaining=remaining-sariin_tulbur;
        i++;
    }
    const newInstallments=await installmentsRepository.generateInstallments(installments);
}