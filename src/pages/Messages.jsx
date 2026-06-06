import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, CheckCircle, Phone, User, MessageSquare } from 'lucide-react';

export default function Messages({
  conversations = [],
  onSendMessage,
  onBack,
  activeConversationId = null,
  onSetActiveConversation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Scroll to bottom when conversation messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages, isTyping]);

  // Handle simulated Agent responses
  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const msgText = typedMessage.trim();
    onSendMessage(activeConversationId, msgText, 'user');
    setTypedMessage('');

    // Trigger simulated typing indicator
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = "Obrigado pelo seu contacto. O imóvel está disponível para visitas. Quando gostaria de agendar?";
      if (activeConv.sender === "Fátima Machava") {
        replyText = "Perfeito, Alex. Agendado para Sábado às 9h00 na Sommerschield. Envio a localização exacta por SMS. Até lá!";
      } else if (activeConv.sender === "Carlos Mondlane") {
        replyText = "Combinado! Vou preparar a ficha técnica do apartamento da Polana e o rascunho de contrato. Encontro de si amanhã.";
      } else if (activeConv.sender === "Amina Sitoe") {
        replyText = "De nada! Acabei de enviar a certidão de registo predial para o seu email. Por favor verifique e diga-me algo.";
      }

      onSendMessage(activeConversationId, replyText, 'agent');
    }, 2000);
  };

  // Filter conversations list by search query
  const filteredConversations = conversations.filter(c => 
    c.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================================= */}
      {/* ======================= STATE 1: CONVERSATIONS LIST ===================== */}
      {/* ========================================================================= */}
      {!activeConversationId ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--space-2) 0' }}>
          <header style={{ marginBottom: 'var(--space-2)' }}>
            <h1 className="title-h1" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Mensagens</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0 16px',
              height: '48px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Search size={18} className="text-muted" />
              <input
                type="text"
                placeholder="Pesquisar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: 'var(--color-text)'
                }}
              />
            </div>
          </header>

          <section style={{ flex: 1, overflowY: 'auto', marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredConversations.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: 'var(--color-primary-light)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  <MessageSquare size={32} />
                </div>
                <h3 className="title-h3" style={{ marginBottom: '8px' }}>Sem Mensagens</h3>
                <p className="text-muted" style={{ maxWidth: '280px', fontSize: '0.85rem' }}>
                  Ainda não iniciou nenhuma conversa com anunciantes. Abra um imóvel e clique em Enviar Mensagem.
                </p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => onSetActiveConversation(conv.id)}
                  className="btn-clean"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <img
                    src={conv.senderAvatar}
                    alt={conv.sender}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{conv.sender}</h4>
                      <span className="text-xs" style={{ fontSize: '0.65rem' }}>{conv.time}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {conv.propertyTitle}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </section>
        </div>
      ) : (
        
        // =========================================================================
        // ======================= STATE 2: ACTIVE CONVERSATION ====================
        // =========================================================================
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Thread Header */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)'
          }}>
            <button
              onClick={() => onSetActiveConversation(null)}
              className="btn-clean"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Voltar para lista de conversas"
            >
              <ArrowLeft size={16} />
            </button>
            <img
              src={activeConv.senderAvatar}
              alt={activeConv.sender}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{activeConv.sender}</h4>
              <span className="text-xs" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-success)', borderRadius: '50%' }}></span>
                Activo
              </span>
            </div>
            <a
              href={`tel:+258 84 123 4567`}
              className="btn btn-outline btn-icon-only"
              style={{ width: '36px', height: '36px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
              aria-label="Telefonar para anunciante"
            >
              <Phone size={14} />
            </a>
          </header>

          {/* Pinned context card (Memory load reducer - Miller's Law) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <img
              src={activeConv.propertyImage}
              alt=""
              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeConv.propertyTitle}
              </h5>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{activeConv.propertyPrice}</span>
            </div>
          </div>

          {/* Message Stack area */}
          <div className="chat-messages" style={{ backgroundColor: 'var(--color-bg)' }}>
            {activeConv.messages.map(msg => (
              <div
                key={msg.id}
                className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user' : 'agent'}`}
              >
                <div className="chat-bubble">
                  {msg.text}
                </div>
                <span className="chat-timestamp">{msg.time}</span>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-bubble-wrapper agent">
                <div className="chat-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-text-muted)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.4s' }}></span>
                  <style>{`
                    @keyframes bounce {
                      to { transform: translateY(-4px); }
                    }
                  `}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input controls */}
          <form
            onSubmit={handleSendSubmit}
            style={{
              padding: '12px var(--space-2)',
              backgroundColor: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Escreva uma mensagem..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid var(--color-border-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                fontSize: '0.85rem',
                outline: 'none',
                color: 'var(--color-text)'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: 'var(--radius-md)' }}
              disabled={!typedMessage.trim()}
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
