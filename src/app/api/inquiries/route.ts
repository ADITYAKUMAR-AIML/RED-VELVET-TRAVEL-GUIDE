import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role key for backend operations if available, 
// otherwise fallback to anon key (though service role is better for bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ehjvkszgyidkerornspx.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const CONTACT_EMAIL = "kumaradityasrm@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, subject, destination_id } = body;

    // 1. Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from("inquiries")
      .insert([
        { 
          name, 
          email, 
          message: subject ? `Subject: ${subject}\n\n${message}` : message,
          destination_id: destination_id || null,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
    }

    // 2. Send Email via Resend API (using fetch to avoid SDK dependency)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Orchids Travel <onboarding@resend.dev>",
            to: [CONTACT_EMAIL],
            subject: `New Inquiry from ${name}: ${subject || "Contact Form"}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
                <h2 style="color: #8a0000;">New Travel Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject || "N/A"}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #666;">This inquiry has also been saved to your database.</p>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          const errorData = await emailRes.json();
          console.error("Resend API error:", errorData);
          // We don't return 500 here because the inquiry IS saved to the DB
        }
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY is missing. Skipping email notification. Inquiry saved to DB.");
    }

    return NextResponse.json({ 
      success: true, 
      id: dbData.id,
      message: "Inquiry received successfully" 
    });

  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
