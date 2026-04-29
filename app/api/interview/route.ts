import { NextResponse } from "next/server";

type InterviewMessage = {
  role: "user" | "assistant";
  content: string;
};

type InterviewBody = {
  role?: string;
  language?: string;
  messages?: InterviewMessage[];
  resumeContext?: string;
};

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Interview API request started`);

  try {
    const body = (await request.json()) as InterviewBody;
    console.log(`[${requestId}] Request body:`, JSON.stringify(body, null, 2));

    const role = body.role?.trim();
    const language = body.language?.trim();
    const messages = body.messages;
    const resumeContext = body.resumeContext?.trim();

    if (!role || !language || !Array.isArray(messages)) {
      console.error(`[${requestId}] Invalid request body:`, { role, language, messages });
      return NextResponse.json(
        {
          error: "Invalid request body. Expected: { role, language, messages }",
          received: { role, language, messages },
        },
        { status: 400 },
      );
    }

    // Try both GROQ_API_KEY and OPENAI_API_KEY for flexibility
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error(`[${requestId}] Missing API keys. Available env vars:`, {
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      });
      return NextResponse.json(
        { 
          error: "Missing API key. Please set GROQ_API_KEY or OPENAI_API_KEY in environment variables.",
          debug: {
            hasGroqKey: !!process.env.GROQ_API_KEY,
            hasOpenAIKey: !!process.env.OPENAI_API_KEY,
          }
        },
        { status: 500 },
      );
    }

    console.log(`[${requestId}] Using API key (first 10 chars):`, apiKey.substring(0, 10) + "...");

    const roleSpecificPrompts: Record<string, string> = {
      "Product Manager": "Focus on product thinking, prioritization skills, metrics understanding, and user research experience.",
      "Finance Analyst": "Focus on Excel skills, financial modeling, budgeting experience, and accounting fundamentals.",
      "Teacher / Educator": "Focus on lesson planning abilities, classroom management strategies, subject matter expertise, and student engagement.",
      "Business Development Executive": "Focus on client relationship management, sales techniques, negotiation skills, and market research capabilities.",
      "Web Developer": "Focus on HTML/CSS/JavaScript proficiency, framework knowledge, debugging skills, and project experience.",
      "Graphic Designer": "Focus on design tool proficiency, color theory understanding, portfolio quality, and client brief interpretation."
    };

    const roleSpecificGuidance = roleSpecificPrompts[role] || "Focus on relevant technical skills, problem-solving abilities, and industry knowledge.";
    
    let systemPrompt = `You are an expert interview coach for Indian college students. Conduct a mock interview for the role of ${role}. ${roleSpecificGuidance} Ask one question at a time. After the user answers, give brief feedback (2 lines), then ask the next question. After 5 questions, say INTERVIEW_COMPLETE and give a final score out of 10, 3 strengths, 3 areas to improve. Respond in ${language}.`;

    if (resumeContext) {
      systemPrompt += ` The candidate's resume: ${resumeContext}. Ask questions relevant to their actual experience and skills.`;
    }

    const normalizedMessages = normalizeMessages(messages);
    console.log(`[${requestId}] Normalized messages:`, JSON.stringify(normalizedMessages, null, 2));

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: "At least one valid message is required." },
        { status: 400 },
      );
    }

    const requestBody = {
      model: "llama-3.1-8b-instant",
      max_tokens: 700,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...normalizedMessages,
      ],
    };

    console.log(`[${requestId}] Sending request to Groq API:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`[${requestId}] Groq API response status:`, response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] Groq API error response:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
      });
      
      let details = errorText;
      try {
        const parsed = JSON.parse(errorText) as { error?: { message?: string } };
        details = parsed.error?.message ?? errorText;
      } catch {
        // Keep raw error text.
      }
      
      return NextResponse.json(
        {
          error: "Failed to generate interview response from Groq.",
          details,
          debug: {
            status: response.status,
            statusText: response.statusText,
            apiKeyLength: apiKey.length,
            apiKeyPrefix: apiKey.substring(0, 10) + "...",
          }
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    console.log(`[${requestId}] Groq API response data:`, JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content ?? "No response from model.";

    if (!text || text.trim().length === 0) {
      console.error(`[${requestId}] Empty response from model:`, data);
      return NextResponse.json(
        {
          error: "Empty response from Groq model.",
          debug: data,
        },
        { status: 500 },
      );
    }

    console.log(`[${requestId}] Successfully generated response (length: ${text.length})`);

    return NextResponse.json({ 
      response: text,
      usage: data.usage,
      requestId,
    });
  } catch (error) {
    console.error(`[${requestId}] Interview route unexpected error:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Interview API crashed before completing the request.",
        details: error instanceof Error ? error.message : String(error),
        requestId,
      },
      { status: 500 },
    );
  }
}

function normalizeMessages(messages: InterviewMessage[]) {
  const validMessages = messages.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0,
  );

  if (validMessages.length === 0) {
    return [];
  }

  if (validMessages[0].role !== "user") {
    validMessages.unshift({
      role: "user",
      content: "Start the mock interview now. Ask your first question.",
    });
  }

  return validMessages.map((message) => ({
    role: message.role,
    content: message.content.trim(),
  }));
}