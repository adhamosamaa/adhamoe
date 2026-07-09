import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Basic in-memory rate limiting.
// Note: In serverless environments, this will reset on cold starts.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Environment Variables
    if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL) {
      console.error('SERVER ERROR: Missing RESEND_API_KEY or TO_EMAIL environment variable.');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // 2. Rate Limiting (IP based)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW_MS) {
      rateLimitInfo.count = 0;
      rateLimitInfo.lastReset = now;
    }

    if (rateLimitInfo.count >= RATE_LIMIT) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    
    rateLimitInfo.count++;
    rateLimitMap.set(ip, rateLimitInfo);

    // 3. Parse Request Body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, message, _honeypot } = body;

    // 4. Honeypot Validation
    if (_honeypot !== undefined && _honeypot !== '') {
      console.warn(`Spam detected: Honeypot field filled by IP ${ip}`);
      // Return a fake success or 400 to deter bots
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    // 5. Input Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid input format.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return NextResponse.json({ error: 'Message must be between 10 and 5000 characters.' }, { status: 400 });
    }

    // Spam Check: excessive links
    const urlMatches = trimmedMessage.match(/https?:\/\/[^\s]+/g);
    if (urlMatches && urlMatches.length > 3) {
      console.warn(`Spam detected: Excessive URLs from IP ${ip}`);
      return NextResponse.json({ error: 'Message contains too many links.' }, { status: 400 });
    }

    // 6. Send Email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Implement timeout for Resend API call using Promise.race
    const sendEmailPromise = resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Should be a verified domain in prod
      to: process.env.TO_EMAIL,
      replyTo: trimmedEmail,
      subject: `New Portfolio Contact • ${trimmedName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${trimmedName}</p>
          <p><strong>Email:</strong> ${trimmedEmail}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <hr />
          <p style="white-space: pre-wrap;">${trimmedMessage}</p>
        </div>
      `,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Resend API request timed out')), 10000);
    });

    try {
      const result: any = await Promise.race([sendEmailPromise, timeoutPromise]);
      
      if (result.error) {
        console.error('Resend API Error:', result.error);
        return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: result.data });

    } catch (sendError: any) {
      console.error('Email sending exception/timeout:', sendError.message);
      return NextResponse.json({ error: 'Failed to send message due to a network timeout or error.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Unhandled POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
