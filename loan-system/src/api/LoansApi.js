import api from "./api";

export async function getMyLoans() {
    const res = await api.get(`/me/loans?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    console.log("MY LOANS RAW:", res.data);

    return res.data.data || [];
}

export async function getLoanDetail(loanId) {
    const res = await api.get(`/me/loans/${loanId}?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    console.log("LOAN DETAIL RAW:", res.data);

    return res.data.data || null;
}

export async function getLoanInstallments(loanId) {
    const res = await api.get(`/me/loans/${loanId}/installments?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    console.log("LOAN INSTALLMENTS RAW:", res.data);

    return res.data.data || [];
}

export async function getLoanPayments(loanId) {
    const res = await api.get(`/me/loans/${loanId}/payments?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    console.log("LOAN PAYMENTS RAW:", res.data);

    return res.data.data || [];
}
export async function getMyPayments() {
    const res = await api.get(`/me/payments?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        },
    });

    console.log("MY PAYMENTS RAW:", res.data);

    return res.data.data || [];
}
export async function makeLoanPayment(loanId, paymentData) {
    const res = await api.post(
        `/me/loans/${loanId}/payments?t=${Date.now()}`,
        paymentData,
        {
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
        }
    );

    console.log("MAKE MY PAYMENT RAW:", res.data);

    return res.data.data || res.data;
}