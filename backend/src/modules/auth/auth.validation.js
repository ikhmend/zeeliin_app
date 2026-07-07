import {z} from "zod";
export const registerSchema = z.object({
  body: z
    .object({
      first_name: z.string().trim().min(1, "Нэр оруулна уу.").max(100),
      last_name: z.string().trim().min(1, "Овог оруулна уу.").max(100),
      register_no: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[А-ЯӨҮЁA-Z]{2}\d{8}$/, "Регистрийн дугаарын формат буруу байна."),
      birth_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Төрсөн огноо YYYY-MM-DD форматтай байна."),
      phone: z.string().trim().regex(/^\d{8}$/, "Утасны дугаар яг 8 оронтой байна."),
      email: z.string().trim().email("И-мэйл хаягийн формат буруу байна.").toLowerCase(),
      username: z.string().trim().min(3, "Username хамгийн багадаа 3 тэмдэгт байна.").max(50).toLowerCase().optional(),
    })
    .strict(),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});
export const loginSchema= z.object({
    body: z.object({
        login: z.string({
            error: "Нэвтрэх нэр текст байх ёстой.",
        })
        .trim().min(1, "Нэвтрэх нэр оруулна уу."),
        password: z.string({
            error: "Нэвтрэх нэр тескт байх ёстой.",
        })
        .trim().min(1, "Нууц үг оруулна уу."),
    }),
    params: z.object({}),
    query: z.object({}),
});
export const passwordSchema= z.object({
    body: z.object({
        currentPass: z.string().min(1, "Одоогийн нууц үгийг оруулна уу."),
        newPass: z.string().min(8, "Дор хаяж 8 тэмдэгттэй шинэ нууц үгийг оруулна уу."),
        confirmPass: z.string().min(1, "Шинэ нууц үгээ дахин оруулна уу."),
    }).refine(
        (data)=> data.newPass === data.confirmPass, {message: "Шинэ нууц үг болон давтан оруулсан шинэ нууц үг таарахгүй байна.", path: ["confirmPass"]}
    ),
    params: z.object({}),
    query: z.object({}),
});
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("И-мэйл хаягийн формат буруу байна.")
      .transform((email) => email.toLowerCase()),
  }),
});
export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z
        .string()
        .trim()
        .min(20, "Нууц үг сэргээх token буруу байна."),
      newPassword: z
        .string()
        .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна.")
        .max(72, "Нууц үг хамгийн ихдээ 72 тэмдэгт байна.")
        .regex(/[a-z]/, "Нууц үг жижиг үсэг агуулсан байна.")
        .regex(/[A-Z]/, "Нууц үг том үсэг агуулсан байна.")
        .regex(/[0-9]/, "Нууц үг тоо агуулсан байна."),
      confirmPassword: z
        .string()
        .min(1, "Нууц үгээ давтан оруулна уу."),
    })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: "Нууц үгнүүд хоорондоо таарахгүй байна.",
        path: ["confirmPassword"],
      }
    ),
  params: z.object({}),
  query: z.object({}),
});
