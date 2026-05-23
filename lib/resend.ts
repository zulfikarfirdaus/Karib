import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM = `${process.env.RESEND_FROM_NAME ?? "Ustadzi"} <${process.env.RESEND_FROM_EMAIL ?? "newsletter@ustadzi.id"}>`;
