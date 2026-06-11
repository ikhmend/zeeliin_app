import api from "./api";

export const makePayment = (data) =>
    api.post("/payments", data);

    export const getPayments = (
    loanId
    ) =>
    api.get(
        `/loans/${loanId}/payments`
    );