import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getRilaneResponse } from '../services/geminiService';
import { useAppContext } from '../App';
import { SendHorizonal, Bot } from 'lucide-react';
import { db, serverTimestamp } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) return "Bom dia 🌞 Que seu dia seja leve e consciente.";
    if (hour >= 21 && hour < 23) return "Boa noite 🌙 Que sua mente descanse em paz.";
    const randomTips = [
        "Lembre-se de fazer uma pausa e respirar fundo por um minuto. Isso pode mudar sua energia.",
        "Que tal alongar o corpo por alguns instantes? Libere qualquer tensão acumulada.",
        "Um copo de água agora pode ser um ato de carinho com seu corpo. Hidrate-se!",
        "Pense em três coisas pelas quais você é grata hoje. A gratidão acalma o coração.",
        "Como posso te ajudar a encontrar um momento de calma agora?",
    ];
    return randomTips[Math.floor(Math.random() * randomTips.length)];
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const animationClass = !isUser ? 'animate-fade-in-message' : '';
  
  const formatTimestamp = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate();
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} ${animationClass}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-lilac flex items-center justify-center text-white flex-shrink-0">
          <Bot size={20}/>
        </div>
      )}
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'bg-lilac text-white rounded-br-none' : 'bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {message.createdAt && <p className="text-xs text-right mt-1 opacity-50">{formatTimestamp(message.createdAt)}</p>}
      </div>
    </div>
  );
};

const RilaneChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addPoints, userData } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const userId = userData.profile.email; // Using email as a unique ID for the user.

  useEffect(() => {
    if (!userId) return;

    const messagesCollectionRef = collection(db, 'rilane_messages', userId, 'items');
    const q = query(messagesCollectionRef, orderBy('createdAt'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        
        if (msgs.length === 0) {
            setMessages([{ role: 'model', text: getGreeting() }]);
        } else {
            setMessages(msgs);
        }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading || !userId) return;

    const userMessage: Omit<ChatMessage, 'id'> = { role: 'user', text: prompt, createdAt: serverTimestamp() };
    
    setUserInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const messagesCollectionRef = collection(db, 'rilane_messages', userId, 'items');

    try {
      // Save user message to Firestore
      await addDoc(messagesCollectionRef, userMessage);
      
      // Award points for first conversation
      if (!userData.gamification.badges.includes('conversa_amiga')) {
          addPoints('CHAT_MESSAGE');
      }

      const history = messages.slice(-10);
      const response = await getRilaneResponse(history, prompt);
      
      const modelMessage: Omit<ChatMessage, 'id'> = { role: 'model', text: response, createdAt: serverTimestamp() };

      // Save model response to Firestore
      await addDoc(messagesCollectionRef, modelMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Omit<ChatMessage, 'id'> = { role: 'model', text: 'Desculpe, tive um problema. Tente novamente.', createdAt: serverTimestamp() };
      await addDoc(messagesCollectionRef, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, addPoints, userData, userId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage(userInput);
      }
  };


  return (
    <div className="flex flex-col h-full bg-transparent">
        <style>{`
            @keyframes fadeInMessage {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-message {
                animation: fadeInMessage 0.8s ease-in-out;
            }
        `}</style>
      <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-4">
        {messages.map((msg, index) => <ChatBubble key={msg.id || index} message={msg} />)}
        {isLoading && <ChatBubble message={{ role: 'model', text: 'Digitando...' }} />}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200/50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm dark:border-gray-700/50">
        <div className="flex items-end gap-2">
            <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Escreva aqui o que está sentindo... 🌿"
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none dark:text-white resize-none max-h-32"
                rows={1}
                disabled={isLoading}
            />
            <button
                onClick={() => handleSendMessage(userInput)}
                disabled={isLoading || !userInput.trim()}
                className="w-10 h-10 flex items-center justify-center bg-[#9A8DF5] text-white rounded-full disabled:bg-gray-400 transition-transform hover:scale-110 active:scale-95 flex-shrink-0"
            >
                <SendHorizonal size={20}/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default RilaneChat;