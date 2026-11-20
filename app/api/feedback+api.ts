import nodemailer from "nodemailer";

type FeedbackBody = {
  type?: string;
  email?: string;
  message?: string;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_PASS!,
  },
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackBody;

    const type = typeof body.type === "string" ? body.type.trim() : "other";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!email) {
      return Response.json(
        { ok: false, error: "Email address is required." },
        { status: 400 },
      );
    }

    if (!emailRegex.test(email)) {
      return Response.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (email.length > 255) {
      return Response.json(
        { ok: false, error: "Email address is too long." },
        { status: 400 },
      );
    }

    if (message.length < 5) {
      return Response.json(
        { ok: false, error: "Message must be at least 5 characters long." },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return Response.json(
        {
          ok: false,
          error: "Message cannot be longer than 5000 characters.",
        },
        { status: 400 },
      );
    }

    const safeMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    await transporter.sendMail({
      from: process.env.GMAIL_USER!,
      to: process.env.GMAIL_USER!,
      replyTo: email,
      subject: `Rock Miner Idle Clicker feedback: ${type}`,
      html: `
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br />")}</p>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Feedback error:", error);

    return Response.json(
      {
        ok: false,
        error: "Could not send your message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
