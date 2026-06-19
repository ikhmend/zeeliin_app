import api from "./api";

// бүх customer авах
export const getCustomers = () => {
    return api.get("/customers");
};

// нэг customer авах
export const getCustomerById = (id) => {
    return api.get(`/customers/${id}`);
};

// search хийх
export const searchCustomers = (keyword) => {
    return api.get("/customers/search", {
    params: { q: keyword },
    });
};