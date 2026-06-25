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
      payment_amount: z.coerce
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
      note: z
      .string()
      .trim()
      .max(500, "Тайлбар хамгийн ихдээ 500 тэмдэгт байна.")
      .optional(),
    }),
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
      phone: z
        .string()
        .trim()
        .min(8, "Утасны дугаар хэт богино байна.")
        .max(20, "Утасны дугаар хэт урт байна.")
        .optional(),

      home_phone: z
        .string()
        .trim()
        .max(20, "Гэрийн утасны дугаар хэт урт байна.")
        .nullable()
        .optional(),

      email: z
        .string()
        .trim()
        .email("Имэйл хаягийн формат буруу байна.")
        .nullable()
        .optional(),

      social: z
        .string()
        .trim()
        .max(100, "Сошиал мэдээлэл хэт урт байна.")
        .nullable()
        .optional(),

      activity_dir: z
        .string()
        .trim()
        .max(200, "Үйл ажиллагааны чиглэл хэт урт байна.")
        .nullable()
        .optional(),

      business_type: z
        .string()
        .trim()
        .max(100, "Бизнесийн төрөл хэт урт байна.")
        .nullable()
        .optional(),

      education: z
        .string()
        .trim()
        .max(100, "Боловсролын мэдээлэл хэт урт байна.")
        .nullable()
        .optional(),

      profession: z
        .string()
        .trim()
        .max(100, "Мэргэжлийн мэдээлэл хэт урт байна.")
        .nullable()
        .optional(),

      official_address: z
        .string()
        .trim()
        .max(500, "Албан хаяг хэт урт байна.")
        .nullable()
        .optional(),

      current_address: z
        .string()
        .trim()
        .max(500, "Оршин суугаа хаяг хэт урт байна.")
        .nullable()
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Өөрчлөх дор хаяж нэг мэдээлэл оруулна уу.",
      path: ["body"],
    }),

  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});