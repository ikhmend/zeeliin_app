import * as installmentsService from "./installments.service.js";
export async function getInstallmentsByLoanId(req, res) {
  try {
    const { id } = req.params;
    const installments = await installmentsService.getInstallmentsByLoanId(id);
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