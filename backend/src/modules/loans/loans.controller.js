import * as loansCrudService from "./loans.Crud.service.js";
import * as loansBusinessService from "./loans.business.service.js";
export async function getLoans(req, res) {
  try {
    const loans = await loansCrudService.getLoans();
    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Зээлийн мэдээлэл авахад алдаа.",
      error: error.message,
    });
  }
}
export async function getLoan(req, res) {
  try {
    const {id} = req.params;
    const loan = await loansCrudService.getLoan(id);
    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Зээлийн мэдээлэл авахад алдаа.",
      error: error.message,
    });
  }
}
export async function createLoan(req, res) {
  try {
    const loanData = req.body;
    const result = await loansBusinessService.createLoanWithInstallments(loanData);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Зээл үүсгэхэд алдаа.",
      error: error.message,
    });
  }
}
export async function getInstallmentsByLoanId(req, res) {
  try {
    const { id } = req.params;
    const installments = await installmentsRepository.getInstallmentsByLoanId(id);
    res.status(200).json({
      success: true,
      data: installments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Төлбөрийн хуваарь авахад алдаа.",
      error: error.message,
    });
  }
}