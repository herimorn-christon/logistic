import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addMessage, toggleChat } from '../../store/slices/chatbotSlice';
import { Send, Mic, MicOff, Bot, User, X } from 'lucide-react';

const Chatbot: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, isOpen } = useSelector((state: RootState) => state.chatbot);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: input,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
      type: 'text' as const,
    };

    dispatch(addMessage(userMessage));
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        message: getBotResponse(input),
        sender: 'bot' as const,
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      };
      dispatch(addMessage(botMessage));
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('shipment')) {
      return "I can help you track deliveries, schedule new shipments, or provide delivery status updates. What specific information do you need about your deliveries?";
    }
    
    if (lowerMessage.includes('vehicle') || lowerMessage.includes('truck') || lowerMessage.includes('fleet')) {
      return "I can provide information about your fleet status, vehicle locations, maintenance schedules, and fuel consumption. Which vehicles would you like to know about?";
    }
    
    if (lowerMessage.includes('route') || lowerMessage.includes('navigation')) {
      return "I can help optimize routes, provide traffic updates, and suggest alternative paths. Would you like me to analyze your current routes or plan new ones?";
    }
    
    if (lowerMessage.includes('driver') || lowerMessage.includes('staff')) {
      return "I can provide driver performance metrics, schedule information, and safety alerts. What driver information are you looking for?";
    }
    
    if (lowerMessage.includes('fuel') || lowerMessage.includes('consumption')) {
      return "I can analyze fuel consumption patterns, identify efficiency opportunities, and detect potential fraud. Would you like a fuel usage report?";
    }
    
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
      return "I can predict maintenance needs, schedule service appointments, and track repair history. Which vehicles need maintenance attention?";
    }
    
    return "I'm your AI assistant for fleet management. I can help with deliveries, vehicle tracking, route optimization, driver management, fuel monitoring, and maintenance scheduling. What would you like to know?";
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setInput("What's the status of my deliveries today?");
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => dispatch(toggleChat())}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <button
          onClick={() => dispatch(toggleChat())}
          className="text-white hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Hello! I'm your AI assistant. How can I help you today?</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-lg ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
            } hover:bg-opacity-80 transition-colors`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;