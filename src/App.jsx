import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

function App() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:3000/text',
    }),
  });
  const [input, setInput] = useState('');

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-kicker">Signal Desk</p>
          <h1 className="app-title">Pulse Chat</h1>
        </div>
        <span className={`status ${status === 'ready' ? 'online' : 'busy'}`}>
          {status === 'ready' ? 'Online' : 'Thinking'}
        </span>
      </header>

      <section className="chat-panel">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start the signal.</h2>
            <p>Ask anything and watch the conversation pulse to life.</p>
          </div>
        ) : null}

        <div className="messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-label">
                {message.role === 'user' ? 'You' : 'Pulse'}
              </div>
              <div className="message-bubble">
                {message.parts.map((part, index) =>
                  part.type === 'text' ? (
                    <span key={index}>{part.text}</span>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <form
        className="composer"
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <div className="composer-field">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={status !== 'ready'}
            placeholder="Say something..."
          />
        </div>
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App
