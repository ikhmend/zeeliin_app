export const customers = [
    {
        id: 1,
        name: "Bat",
        phone: "99112233",
        register: "AA123456",
        score: 750,
    },
    {
        id: 2,
        name: "Saruul",
        phone: "88112233",
        register: "BB123456",
        score: 620,
    },
    ];

    export const loanTypes = [
    { id: 1, name: "Хэрэглээний зээл" },
    { id: 2, name: "Бизнесийн зээл" },
    { id: 3, name: "Өрхийн зээл" },
    { id: 4, name: "Автомашины лизинг" },
    ];

    export const loans = [
    {
        id: 1,
        customerId: 1,
        typeId: 1,
        amount: 2000000,
        balance: 1240000,
        status: "ACTIVE",
    },
    {
        id: 2,
        customerId: 2,
        typeId: 2,
        amount: 5000000,
        balance: 0,
        status: "CLOSED",
    },
    ];

    export const payments = [
    {
        id: 1,
        loanId: 1,
        date: "2026-01-01",
        amount: 100000,
        principal: 80000,
        interest: 20000,
        balance: 1140000,
    },
];