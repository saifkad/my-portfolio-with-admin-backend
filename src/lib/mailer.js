import nodemailer from 'nodemailer';

function getTransport() {
  const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;
  if (!NODEMAILER_USER || !NODEMAILER_PASS) return null; // not configured — features degrade gracefully

  return nodemailer.createTransport({
    service: 'gmail', // works with a Gmail App Password; change if you use another provider
    auth: { user: NODEMAILER_USER, pass: NODEMAILER_PASS },
  });
}

export async function sendNewMessageEmail(contact) {
  const transport = getTransport();
  if (!transport) return false;

  await transport.sendMail({
    from: `"Portfolio Contact" <${process.env.NODEMAILER_USER}>`,
    to: process.env.NODEMAILER_USER,
    replyTo: contact.email,
    subject: `New message from ${contact.name}`,
    text: `${contact.message}\n\n---\nFrom: ${contact.name} <${contact.email}>\nHit reply to respond directly.`,
  });
  return true;
}

export async function sendReplyEmail(message, replyText) {
  const transport = getTransport();
  if (!transport) return false;

  await transport.sendMail({
    from: `"${process.env.NODEMAILER_USER.split('@')[0]}" <${process.env.NODEMAILER_USER}>`,
    to: message.email,
    subject: 'Re: your message',
    text: `Hi ${message.name},\n\nThanks for reaching out through my portfolio.\n\n${replyText}\n\n---\n\nYour original message:\n${message.message}`,
  });
  return true;
}