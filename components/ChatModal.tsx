
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  username: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, messages, onSendMessage, username }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
        onSendMessage(inputText);
        setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-600 rounded-2xl w-full max-w-md h-[600px] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="text-green-400" /> Global Comm Link
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === username ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-[10px] font-bold ${msg.sender === username ? 'text-green-400' : 'text-slate-400'}`}>
                            {msg.sender}
                        </span>
                        <span className="text-[10px] text-slate-600">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] break-words
                        ${msg.sender === username 
                            ? 'bg-green-600/20 border border-green-600/50 text-green-100' 
                            : msg.isSystem 
                                ? 'bg-yellow-900/20 border border-yellow-700/50 text-yellow-200 w-full text-center italic'
                                : 'bg-slate-800 border border-slate-700 text-slate-200'}
                    `}>
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-800 border-t border-slate-700 rounded-b-2xl flex gap-2">
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Broadcast message..."
                autoComplete="off"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none text-base"
            />
            <button 
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
      </div>
    </div>
  );
};
