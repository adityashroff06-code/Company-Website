import { Buffer } from "buffer";

export interface MailAttachment {
  filename: string;
  content: Buffer;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

/**
 * Sends an email through Resend if RESEND_API_KEY is configured.
 * Returns true when the email was actually sent, false when email
 * delivery is not configured (the submission is still stored on disk).
 */
export async function sendMail(message: MailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const from = process.env.MAIL_FROM ?? "Product Armor Website <onboarding@resend.dev>";

  const body: Record<string, unknown> = {
    from,
    to: [message.to],
    subject: message.subject,
    text: message.text,
  };
  if (message.replyTo) {
    body.reply_to = message.replyTo;
  }
  if (message.attachments && message.attachments.length > 0) {
    body.attachments = message.attachments.map((a) => ({
      filename: a.filename,
      content: a.content.toString("base64"),
    }));
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Email delivery failed (${res.status}): ${detail}`);
  }
  return true;
}
