import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface EducationChatbotProps {
  educationContent: string;
}

const EducationChatbot: React.FC<EducationChatbotProps> = ({ educationContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Luna, your friendly loan assistant! I'm here to help answer questions about student loans based on the Education page content. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `You are Luna, a friendly and helpful AI assistant helping students understand student loans. You have a warm, approachable personality and you're here to make loan information easy to understand. You should ONLY answer based on the following Education page content. If a question cannot be answered from this content, politely say you can only answer questions based on the Education page information.

IMPORTANT FORMATTING INSTRUCTIONS:
- DO NOT use asterisks (**) or any markdown formatting
- DO NOT use em dashes (—) - use regular dashes (-) if needed
- Use line breaks (double newlines) to separate paragraphs
- For lists of items, use simple bullet points with dashes (-)
- For key-value pairs (like "Year Level: Freshman"), put each on a new line with a colon
- Keep responses clean, simple, and easy to read
- Write naturally without special formatting characters
- Break up long paragraphs into shorter, digestible chunks

Education Page Content:
${educationContent}

User Question: ${currentInput}

Please provide a helpful, friendly answer based only on the Education page content above. Write in a clean, natural way without asterisks, em dashes, or markdown formatting. Use simple line breaks and colons for structure. Remember to be warm and approachable.`;

      // Use OpenAI API directly (proxy will be used in production)
      const API_KEY = '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';
      
      let response: Response;
      let responseData: any;

      // Try proxy first (for production), then direct call
      try {
        response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt })
        });
        
        const responseText = await response.text();
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from proxy');
        }
        
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
      } catch (proxyError: any) {
        // Fallback to direct OpenAI API call
        console.log('Proxy failed, using direct API call...', proxyError.message);
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        });

        const responseText = await response.text();
        
        if (!responseText) {
          throw new Error('Empty response from OpenAI API');
        }

        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(`Invalid JSON response from OpenAI: ${responseText.substring(0, 100)}`);
        }

        // Transform OpenAI response to expected format
        if (response.ok && responseData.choices?.[0]?.message?.content) {
          responseData = {
            candidates: [{
              content: {
                parts: [{
                  text: responseData.choices[0].message.content
                }]
              }
            }]
          };
        }
      }
      
      if (!response.ok) {
        console.error('API Error:', responseData);
        const errorMsg = responseData.error?.message || responseData.error || responseData.message || `API Error: ${response.status}`;
        throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }

      if (!responseData.candidates || !responseData.candidates[0]) {
        console.error('Unexpected response format:', responseData);
        throw new Error(`Unexpected response format: ${JSON.stringify(responseData).substring(0, 200)}`);
      }

      const text = responseData.candidates[0]?.content?.parts[0]?.text;
      
      if (!text) {
        console.error('No text in response:', responseData);
        throw new Error('No text response from API');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: text
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your question. Please try again later.';
      
      if (error.message) {
        if (error.message.includes('API key') || error.message.includes('API_KEY')) {
          errorMessage = 'There was an issue with the API configuration. Please contact support.';
        } else if (error.message.includes('CORS') || error.message.includes('cors')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('quota') || error.message.includes('Quota')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else {
          // Show more detailed error in development
          errorMessage = process.env.NODE_ENV === 'development' 
            ? `Error: ${error.message}` 
            : 'Sorry, I encountered an error. Please try again.';
        }
      }
      
      const errorMsg: Message = {
        role: 'assistant',
        content: errorMessage
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format text for better readability - clean and simple
  const formatMessage = (text: string) => {
    // Remove asterisks and em dashes, clean up the text
    let cleanedText = text
      .replace(/\*\*/g, '') // Remove all asterisks
      .replace(/—/g, '-') // Replace em dashes with regular dashes
      .replace(/–/g, '-') // Replace en dashes with regular dashes
      .trim();
    
    // Split by double newlines for paragraphs
    const paragraphs = cleanedText.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, pIndex) => {
      const trimmedPara = paragraph.trim();
      
      // Check if it's a list item (but skip if it's just a colon-separated label)
      if (trimmedPara.includes('\n') && trimmedPara.split('\n').some(line => line.trim().match(/^[-•*]\s/))) {
        const items = trimmedPara.split(/\n/).filter(line => {
          const trimmed = line.trim();
          return trimmed.match(/^[-•*]\s/) && trimmed.length > 3;
        });
        
        if (items.length > 0) {
          return (
            <ul key={pIndex} className="list-disc list-inside space-y-1 my-2 ml-2">
              {items.map((item, iIndex) => (
                <li key={iIndex} className="text-sm">{item.replace(/^[-•*]\s/, '').trim()}</li>
              ))}
            </ul>
          );
        }
      }
      
      // Check if it's a numbered list
      if (trimmedPara.includes('\n') && trimmedPara.split('\n').some(line => line.trim().match(/^\d+\.\s/))) {
        const items = trimmedPara.split(/\n/).filter(line => line.trim().match(/^\d+\.\s/));
        if (items.length > 0) {
          return (
            <ol key={pIndex} className="list-decimal list-inside space-y-1 my-2 ml-2">
              {items.map((item, iIndex) => (
                <li key={iIndex} className="text-sm">{item.replace(/^\d+\.\s/, '').trim()}</li>
              ))}
            </ol>
          );
        }
      }
      
      // Format colon-separated key-value pairs nicely
      if (trimmedPara.includes(':') && trimmedPara.split('\n').every(line => line.includes(':'))) {
        const lines = trimmedPara.split(/\n/).filter(l => l.trim());
        return (
          <div key={pIndex} className="my-2 space-y-1.5">
            {lines.map((line, lIndex) => {
              const [label, ...valueParts] = line.split(':');
              const value = valueParts.join(':').trim();
              if (label.trim() && value) {
                return (
                  <div key={lIndex} className="text-sm">
                    <span className="font-medium">{label.trim()}:</span> {value}
                  </div>
                );
              }
              return <div key={lIndex} className="text-sm">{line.trim()}</div>;
            })}
          </div>
        );
      }
      
      // Regular paragraph with line breaks
      const lines = trimmedPara.split(/\n/).filter(l => l.trim());
      return (
        <p key={pIndex} className="my-2 text-sm leading-relaxed">
          {lines.map((line, lIndex) => (
            <span key={lIndex}>
              {line.trim()}
              {lIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-cap-red text-white rounded-full shadow-lg hover:bg-cap-red-hover transition-all duration-200 flex items-center justify-center z-50 hover:scale-110"
          aria-label="Open chatbot"
        >
          <MessageCircle size={20} className="md:w-6 md:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl flex flex-col z-50 border-2 border-cap-red/20"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2)'
          }}
        >
          {/* Header */}
          <div className="bg-cap-red text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold">Luna</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-cap-red/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-cap-red" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-cap-red text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-cap-red/10 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-cap-red" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-cap-red/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-cap-red" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about student loans..."
                className="flex-1 px-4 py-2 border-2 border-cap-red/20 rounded-lg focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-cap-red text-white px-4 py-2 rounded-lg hover:bg-cap-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Answers based on Education page content only
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EducationChatbot;
