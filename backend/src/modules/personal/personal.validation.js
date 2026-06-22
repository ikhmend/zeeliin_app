import {z} from "zod";
export const loanIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    loanId: z.coerce
      .number()
      .int("Зээлийн ID бүхэл тоо байна.")
      .positive("Зээлийн ID эерэг тоо байна."),
  }),
  query: z.object({}).optional().default({}),
});
export const makePaymentSchema = z.object({
  body: z
    .object({
      amount: z.coerce
        .number()
        .positive(
          "Төлөлтийн дүн 0-ээс их байх ёстой."
        ),

      payment_method: z.enum([
        "cash",
        "bank_transfer",
        "qpay",
        "card",
      ]),
    })
    .strict(),

  params: z.object({
    loanId: z.coerce
      .number()
      .int("Зээлийн ID бүхэл тоо байна.")
      .positive("Зээлийн ID эерэг тоо байна."),
  }),

  query: z.object({}).optional().default({}),
});
export const updateProfileSchema = z.object({
  body: z
    .object({
      phone: z.string().trim().min(8, "Утасны дугаар хэт богино байна.").max(20, "Утасны дугаар хэт урт байна.").optional(),
      home_phone: z.string().trim().max(20).optional().nullable(),
      email: z.string().email("Имэйл хаягийн формат буруу байна.").optional().nullable(),
      current_address: z.string().trim().min(1, "Одоогийн хаяг хоосон байж болохгүй.").max(500).optional(),
    })
    .strict()
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "Өөрчлөх дор хаяж нэг талбар оруулна уу.",
      }
    ),
  params: z.object({}),
  query: z.object({}),
});