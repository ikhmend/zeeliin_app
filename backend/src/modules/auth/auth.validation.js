import {z} from "zod";
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
  email: z
    .string({
      required_error: "И-мэйл хаяг заавал шаардлагатай.",
      invalid_type_error: "И-мэйл хаяг текст байх ёстой.",
    })
    .trim()
    .min(1, "И-мэйл хаяг оруулна уу.")
    .email("И-мэйл хаягийн формат буруу байна.")
    .max(255, "И-мэйл хаяг хэт урт байна.")
    .transform((email) => email.toLowerCase()),
});
export const resetPasswordSchema = z
  .object({
    token: z
      .string({
        required_error: "Нууц үг сэргээх token шаардлагатай.",
        invalid_type_error: "Token текст байх ёстой.",
      })
      .trim()
      .min(20, "Нууц үг сэргээх token буруу байна."),
    newPassword: z
      .string({
        required_error: "Шинэ нууц үг заавал шаардлагатай.",
        invalid_type_error: "Нууц үг текст байх ёстой.",
      })
      .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна.")
      .max(72, "Нууц үг хамгийн ихдээ 72 тэмдэгт байна.")
      .regex(/[a-z]/, "Нууц үг жижиг үсэг агуулсан байна.")
      .regex(/[A-Z]/, "Нууц үг том үсэг агуулсан байна.")
      .regex(/[0-9]/, "Нууц үг тоо агуулсан байна."),

    confirmPassword: z.string({
      required_error: "Нууц үгээ давтан оруулах шаардлагатай.",
      invalid_type_error: "Нууц үг текст байх ёстой.",
    }),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Нууц үгнүүд хоорондоо таарахгүй байна.",
      path: ["confirmPassword"],
    }
  );