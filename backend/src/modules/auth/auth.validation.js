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