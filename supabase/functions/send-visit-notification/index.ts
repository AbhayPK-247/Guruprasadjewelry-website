// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
//import { serve } from "https://deno.land/std@0.203.0/server/mod.ts";
//import { env } from "https://deno.land/std@0.203.0/os/mod.ts"; // Removed unused import

// @ts-ignore
// @ts-ignore
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// @ts-ignore
// @ts-ignore
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VisitRequest {
  name: string
  phone: string
  email: string
  date: string
  time: string
  message?: string
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const visitData: VisitRequest = await req.json()

    // Format date and time nicely
    const formattedDate = new Date(visitData.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Send email to admin
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Guruprasad Jewellers <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: '🔔 New Visit Scheduled - Guruprasad Jewellers',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #C9A961 0%, #8B6914 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #C9A961; border-radius: 5px; }
                .label { font-weight: bold; color: #8B6914; margin-bottom: 5px; }
                .value { color: #333; font-size: 16px; }
                .message-box { background: white; padding: 20px; border-radius: 5px; margin-top: 20px; border: 1px solid #e0e0e0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">📅 New Visit Scheduled</h1>
                  <p style="margin: 10px 0 0 0;">A customer wants to visit your store</p>
                </div>
                <div class="content">
                  <div class="info-row">
                    <div class="label">👤 Customer Name:</div>
                    <div class="value">${visitData.name}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">📞 Phone Number:</div>
                    <div class="value"><a href="tel:${visitData.phone}">${visitData.phone}</a></div>
                  </div>
                  <div class="info-row">
                    <div class="label">📧 Email Address:</div>
                    <div class="value"><a href="mailto:${visitData.email}">${visitData.email}</a></div>
                  </div>
                  <div class="info-row">
                    <div class="label">📅 Preferred Date:</div>
                    <div class="value">${formattedDate}</div>
                  </div>
                  <div class="info-row">
                    <div class="label">🕐 Preferred Time:</div>
                    <div class="value">${visitData.time}</div>
                  </div>
                  ${visitData.message ? `
                    <div class="message-box">
                      <div class="label">💬 Special Requests:</div>
                      <div class="value">${visitData.message}</div>
                    </div>
                  ` : ''}
                  <div class="footer">
                    <p>Please contact the customer to confirm the appointment.</p>
                    <p>© ${new Date().getFullYear()} Guruprasad Jewellers</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    const adminEmailData = await adminEmailRes.json()

    // Send confirmation email to customer
    const customerEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Guruprasad Jewellers <onboarding@resend.dev>',
        to: visitData.email,
        subject: '✅ Visit Confirmed - Guruprasad Jewellers',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #C9A961 0%, #8B6914 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .highlight-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #C9A961; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">✨ Thank You ${visitData.name}!</h1>
                  <p style="margin: 10px 0 0 0;">Your visit has been scheduled</p>
                </div>
                <div class="content">
                  <p>We're excited to welcome you to Guruprasad Jewellers!</p>
                  <div class="highlight-box">
                    <h3 style="margin-top: 0; color: #8B6914;">📅 Your Appointment Details:</h3>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${visitData.time}</p>
                    <p><strong>Location:</strong> Bangalore, Karnataka</p>
                    <p><strong>Contact:</strong> +91 9945 763133</p>
                  </div>
                  <p>Our team will contact you shortly to confirm your appointment. If you have any questions, feel free to call us.</p>
                  <p>We look forward to helping you find the perfect jewelry!</p>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Guruprasad Jewellers | All Rights Reserved</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    const customerEmailData = await customerEmailRes.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailData,
        customerEmail: customerEmailData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start`
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-visit-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"John Doe","phone":"9876543210","email":"test@example.com","date":"2025-10-15","time":"14:30","message":"Interested in gold necklaces"}'

*/
