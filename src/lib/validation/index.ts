import * as z from "zod"

export const SignupValidation = z.object({
    name:z.string().min(2,{message:"Too Short"}),
    username: z.string().min(2,{message:"Too Short"}),
    email:z.string().email(),
    password: z.string().min(8,{message:"Password must have 8 Characters"})
  })

  export const SigninValidation = z.object({
    email:z.string().email(),
    password: z.string().min(8,{message:"Password must have 8 Characters"})
  })

  export const Postvalidation = z.object({
    caption:z.string().min(5).max(2200),
    file:z.custom<File[]>(),
    location:z.string().min(2,{message:"Location should have atleast 3 letters"}).max(2200),
    tags:z.string().min(5).max(2200),
  })