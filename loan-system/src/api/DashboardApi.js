import api from "./api";
export default async function getDashboardData() {
    const res = await api.get(`/me/dashboard?t=${Date.now()}`);

    const root = res.data.data || {};
    const dashboardData = root.dashboardData || {};

    return {
        customer: {
            fullName: dashboardData.name ?? "Хэрэглэгч",
        },

        loan: {
            remainingAmount: dashboardData.totalOutstandingAmount ?? 0,
            monthlyPayment: dashboardData.nextPaymentAmount ?? 0,
            nextPaymentDate: dashboardData.nextPaymentDate ?? "-",
            activeLoansCount: dashboardData.activeLoanCount ?? 0,
        },

        schedule: root.upcomingInstallments || [],
        recentPayments: root.recentPayments || [],
    };
}
