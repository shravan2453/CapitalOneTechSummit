// OpenAI API Key
const OPENAI_API_KEY = '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';

// Validate API key format
if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 20) {
  console.warn('Warning: API key may be invalid');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt must be a string' });
    }

    // Using OpenAI API chat completions endpoint
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    };

    console.log('Making OpenAI API request...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await openaiResponse.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      return res.status(500).json({ 
        error: 'Invalid response from API',
        details: responseText.substring(0, 200)
      });
    }

    if (!openaiResponse.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(openaiResponse.status).json({ 
        error: data.error?.message || 'OpenAI API error',
        details: data
      });
    }

    // Transform OpenAI response to match expected format
    const responseText_content = data.choices?.[0]?.message?.content;
    
    if (!responseText_content) {
      console.error('No content in response:', data);
      return res.status(500).json({ 
        error: 'No response content from API',
        details: data
      });
    }

    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{
            text: responseText_content
          }]
        }
      }]
    });
  } catch (error: any) {
    console.error('Error in OpenAI proxy:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
