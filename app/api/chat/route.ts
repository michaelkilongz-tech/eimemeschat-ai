import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { messages, model = 'mixtral-8x7b-32768' } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In production, you would verify the Firebase token here
    // const token = authHeader.split('Bearer ')[1];
    // await verifyFirebaseToken(token);

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      model: model,
      temperature: 0.7,
      max_tokens: 2048,
      stream: false,
    });

    // Return response
    return NextResponse.json({
      message: completion.choices[0]?.message?.content || 'No response generated',
      usage: completion.usage,
      model: completion.model,
    });

  } catch (error: any) {
    console.error('Groq API error:', error);

    // Handle specific errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Groq API endpoint is running',
    supported_models: ['mixtral-8x7b-32768', 'llama2-70b-4096', 'gemma-7b-it'],
  });
}
