import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { content, apiKey } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required. Please provide one or set OPENAI_API_KEY environment variable.' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const systemPrompt = `You are an expert YouTube SEO specialist for news channels. Your job is to:

1. Analyze the provided news content deeply
2. Research current YouTube trends for similar news topics
3. Generate SEO-optimized content that follows these rules:
   - TITLE: Must be engaging, curiosity-driven, and NOT reveal the full news. Use cliffhanger techniques, questions, or intrigue. Keep it under 60 characters when possible.
   - TAGS: Generate 25-30 relevant tags that mix broad and specific keywords related to the news topic
   - HASHTAGS: Provide exactly 3-4 hashtags that are trending and relevant to the news topic
   - Everything must be in ENGLISH

4. The title should:
   - Hide the actual news but hint at it
   - Create curiosity and urgency
   - Use emotional triggers (shock, surprise, controversy)
   - NOT give away the conclusion
   - Use patterns like: "You Won't Believe...", "Breaking:", "This Changed Everything...", "What Happened Next...", etc.

5. Analyze what makes similar viral news videos successful and incorporate those patterns.

Return your response in this JSON format:
{
  "title": "The optimized title",
  "tags": ["tag1", "tag2", ...],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "trendAnalysis": "Brief analysis of current trends for this news topic",
  "explanation": "Why this title/tags strategy will work"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Analyze this news content and generate optimized SEO content:\n\n${content}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Ensure hashtags have # symbol
    if (result.hashtags) {
      result.hashtags = result.hashtags.map((tag: string) =>
        tag.startsWith('#') ? tag : `#${tag}`
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
