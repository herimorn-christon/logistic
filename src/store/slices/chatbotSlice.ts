import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'voice' | 'image';
}

interface ChatbotState {
  messages: ChatMessage[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ChatbotState = {
  messages: [],
  isOpen: false,
  loading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setMessages, toggleChat, setLoading, setError } = chatbotSlice.actions;
export default chatbotSlice.reducer;