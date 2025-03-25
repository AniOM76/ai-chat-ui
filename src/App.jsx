import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_N8N_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI Chat</h1>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.text}
          </div>
        ))}
        {loading && <div>AI is typing...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        style={{ width: '100%', padding: 10, marginTop: 10 }}
      />
      <button onClick={sendMessage} style={{ width: '100%', marginTop: 5 }}>
        Send
      </button>
    </div>
  );
}

export default App;
