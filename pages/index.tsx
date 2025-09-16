
import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}








export default function MistralChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de réponse IA." }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1 className="app-title">MistralChatApp</h1>
        <button className="new-chat" type="button" onClick={() => setMessages([])}>+ Nouvelle discussion</button>
      </div>
      <div style={{display:'flex', flex:1, height:'100%'}}>
        <div className="sidebar">
          <div className="menu-item">Démo IA</div>
          <div className="menu-item">Chat Mistral</div>
          <div className="menu-item premium">Expérience IA premium</div>
        </div>
        <div className="main-content">
          <div className="chat-area" ref={chatAreaRef} style={{flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'18px', padding:'30px'}}>
            {messages.length === 0 && !loading && (
              <div style={{opacity:0.7}}>Commencez une conversation avec l'IA...</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>{msg.content}</div>
            ))}
            {loading && <div className="message assistant">L’IA réfléchit...</div>}
          </div>
          <form className="input-area" onSubmit={e => {e.preventDefault(); sendMessage();}}>
            <input
              type="text"
              className="message-input"
              placeholder="Écris ton message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="send-btn" type="submit" disabled={loading || !input.trim()}>Envoyer</button>
            <button className="explain-btn" type="button" disabled>Expliquer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
