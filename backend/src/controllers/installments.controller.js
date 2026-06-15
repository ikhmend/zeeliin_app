import * as installmentsService from "../service/installments.service.js";
export async function getInstallmentsByLoanId(req, res) {
  try {
    const { id } = req.params;
    const installments = await installmentsService.getInstallmentsByLoanId(id);
    if (installments.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Зээлийн дугаартай төлбөрийн хуваарь олдсонгүй.",
    });
    }
    res.status(200).json({
    success: true,
    data: installments,
    });
} catch (error) {
    res.status(500).json({
    success: false,
    message: "Зээлийн дугаараар мэдээлэл хайхад алдаа.",
    error: error.message,
    });
  }
}
export async function generateInstallments(req, res) {
    try {
        const { id } = req.params;
        const installments = await installmentsService.generateInstallments(id);
        res.status(201).json({
        success: true,
        data: installments,
    });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Төлбөрийн хуваарь үүсгэхэд алдаа.",
        error: error.message,
    });
}
}