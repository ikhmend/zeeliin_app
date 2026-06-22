import {z} from "zod";
export const loanIdSchema = z.object({
    body: z.object({}),
    params: z.object({
        loanId: z.coerce.number().int("Зээлийн ID бүхэл тоо байна.").positive("Зээлийн ID эерэг тоо байна."),
    }),
    query: z.object({}),
});
export const makePaymentSchema= z.object({
    body:z.object({
        amount: z.coerce.number().positive("Төлөлтийн дүн 0-с дээш дүн байх ёстой."),
        payment_method: z.enum(["cash", "bank_transfer", "qpay", "card"], {error: "Төлбөрийн хэрэгсэл буруу."}),
    }).strict(),
    params:z.object({
        loanId:z.coerce.number().int().positive(),
    }),
    query:z.object({}),
})