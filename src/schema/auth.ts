import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export const PromptReqSchema = z.object({
  prompt: z.string(),
  num_images: z.number(),
  color: z.string(),
  customColor:z.string(),
  iconStyle: z.string()
})
