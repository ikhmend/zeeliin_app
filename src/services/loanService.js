import api from "./api";

export const getLoans = () =>
    api.get("/loans");

    export const getLoanById = (id) =>
    api.get(`/loans/${id}`);

    export const getSchedule = (id) =>
    api.get(`/loans/${id}/schedule`);