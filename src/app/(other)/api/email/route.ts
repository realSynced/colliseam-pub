import { NextResponse } from "next/server";
import mail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY || ""; // Set a default value if the environment variable is undefined
mail.setApiKey(apiKey);

export async function POST(req: Request) {
  const { name, email, message, subject } = await req.json();
  console.log("Name: ", name);
  console.log("Email: ", email);
  console.log("Message: ", message);
  console.log("Subject: ", subject);

  const msg = `
    Name: ${name}\r\n
    Email: ${email}\r\n
    Message: ${message}\r\n
    Subject: ${subject}\r\n
    `;

  const data = {
    to: "contact@nexdev.org",
    from: "nexus@nexdev.org",
    subject: `Contact Form Submission | ${subject}`,
    text: msg,
    html: msg.replace(/\r\n/g, "<br>"),
  };
  mail.send(data);

  return NextResponse.json({ status: "Ok", name, email, message });
}
