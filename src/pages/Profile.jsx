import React, { useState } from 'react';
import { User, ShieldCheck, Coins, CreditCard, Award, ArrowRight, LogOut, CheckCircle, ShieldAlert, Key, HelpCircle, Star, MessageSquare } from 'lucide-react';
import Modal from '../components/Modal';

export default function Profile({
  user,
  onUpdateUser,
  onNavigateTab,
  onSignOut,
  userProperties = [],
  onUpdatePropertyStatus
}) {
  const [activeModal, setActiveModal] = useState(null); // 'recharge', 'verify_id', 'settings', 'reviews', 'security', 'support'
  
  // 1. Recharge Flow State
  const [rechargeStep, setRechargeStep] = useState(1); // 1: Select Pack, 2: Phone input, 3: Processing, 4: Success
  const [selectedPack, setSelectedPack] = useState(null);
  const [rechargePhone, setRechargePhone] = useState('+258 ');
  
  // 2. ID Verification Flow State
  const [verifyStep, setVerifyStep] = useState(1); // 1: Intro/Doc Select, 2: Scan front, 3: Selfie, 4: Submitting, 5: Success
  const [selectedDocType, setSelectedDocType] = useState('bi'); // bi, passport, driver
  const [verificationImage, setVerificationImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  // Recharge package specs
  const packs = [
    { id: 'starter', name: 'Starter Pack', credits: 10, price: 100, desc: '10 dias de visibilidade básica' },
    { id: 'standard', name: 'Standard Pack', credits: 50, price: 500, desc: '50 dias de visibilidade básica' },
    { id: 'premium', name: 'Premium Pack', credits: 120, price: 1000, desc: '120 dias de visibilidade (+20% Bónus)' }
  ];

  // Helper M-Pesa simulated prompt
  const handleRechargeSelect = (pack) => {
    setSelectedPack(pack);
    setRechargeStep(2);
  };

  const handleRechargeSubmit = () => {
    // Validate phone number
    const cleanNo = rechargePhone.replace(/\s+/g, '');
    if (!/^\+2588[2-7]\d{7}$/.test(cleanNo)) {
      alert('Número inválido. Use o formato: +258 84 123 4567');
      return;
    }

    setRechargeStep(3); // Show spinner
    
    // Simulate transaction delay
    setTimeout(() => {
      onUpdateUser({
        credits: user.credits + selectedPack.credits
      });
      setRechargeStep(4); // Show success tick
    }, 3000);
  };

  // ID Verification Process Simulators
  const handleVerifySubmit = () => {
    setVerifyStep(4); // Show spinner
    setTimeout(() => {
      onUpdateUser({
        verified: true
      });
      setVerifyStep(5); // Show success tick
    }, 3000);
  };

  return (
    <div className="profile-page-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Profile Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h1 className="title-h1" style={{ fontSize: '1.5rem' }}>O meu Perfil</h1>
        <button
          onClick={() => setActiveModal('settings')}
          className="btn btn-outline btn-icon-only"
          style={{ width: '40px', height: '40px', border: '1px solid var(--color-border)' }}
          aria-label="Definições do perfil"
        >
          <User size={18} />
        </button>
      </header>

      {/* 2. User info Card */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-light-active)' }}
          />
          {user.verified && (
            <span style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: 'var(--color-success)',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              ✓
            </span>
          )}
        </div>
        <div>
          <h2 className="title-h2" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {user.name}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>{user.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span style={{ color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.8rem' }}>★ {user.rating}</span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--color-text-light)' }}></span>
            <span className="badge-verified" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>
              Membro Verificado
            </span>
          </div>
        </div>
      </section>

      {/* 3. Credits Balance and Recharge widget */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Coins size={22} />
          </div>
          <div>
            <div className="text-xs">Créditos Nopin</div>
            <div className="title-h2" style={{ fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 800 }}>
              {user.credits} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>nopins</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setRechargeStep(1);
            setActiveModal('recharge');
          }}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.8rem' }}
        >
          Recarregar
        </button>
      </section>

      {/* 4. Verification ID Banner (only shown if not fully verified, or as mock flow link) */}
      {!user.verified ? (
        <section style={{
          backgroundColor: 'var(--color-warning-light)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} /> Verifique a sua Identidade
            </h3>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px', maxWidth: '240px' }}>
              Evite fraudes e publique os seus anúncios com a marca oficial 'Vendedor Confiável'.
            </p>
          </div>
          <button
            onClick={() => {
              setVerifyStep(1);
              setActiveModal('verify_id');
            }}
            className="btn btn-outline"
            style={{
              borderColor: 'var(--color-warning)',
              color: 'var(--color-warning)',
              backgroundColor: 'white',
              fontSize: '0.75rem',
              padding: '8px 14px'
            }}
          >
            Verificar
          </button>
        </section>
      ) : (
        <section style={{
          backgroundColor: 'var(--color-success-light)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: 'var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)' }}>Perfil Verificado com Sucesso</span>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>A sua conta nopin cumpre todos os requisitos de segurança.</p>
          </div>
        </section>
      )}

      {/* 5. User Activity Lists */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-3)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 700, fontSize: '0.9rem' }}>
          Atividade do Utilizador
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => onNavigateTab('favorites')}
            className="btn-clean"
            style={{
              padding: '16px 20px',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              background: 'none',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Imóveis Salvos</span>
            <ArrowRight size={14} className="text-muted" />
          </button>
          
          <button
            onClick={() => setActiveModal('reviews')}
            className="btn-clean"
            style={{
              padding: '16px 20px',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              background: 'none',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Avaliações do Vendedor</span>
            <ArrowRight size={14} className="text-muted" />
          </button>

          <button
            onClick={() => setActiveModal('security')}
            className="btn-clean"
            style={{
              padding: '16px 20px',
              border: 'none',
              borderBottom: '1px solid var(--color-border)',
              background: 'none',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Privacidade e Segurança</span>
            <ArrowRight size={14} className="text-muted" />
          </button>

          <button
            onClick={() => setActiveModal('support')}
            className="btn-clean"
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Ajuda e Suporte</span>
            <ArrowRight size={14} className="text-muted" />
          </button>
        </div>
      </section>

      {/* 6. User Listed Properties Management Area */}
      {userProperties.length > 0 && (
        <section style={{ marginBottom: 'var(--space-4)' }}>
          <h2 className="title-h2" style={{ marginBottom: '12px' }}>Os meus Anúncios ({userProperties.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userProperties.map(p => (
              <div key={p.id} style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <img src={p.images[0]} alt="" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {p.price.toLocaleString('pt-MZ')} MTn{p.pricePeriod ? `/${p.pricePeriod}` : ''}
                    </span>
                  </div>
                </div>
                
                {/* Active / Offmarket Toggle */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onUpdatePropertyStatus(p.id, p.status === 'sold' ? 'available' : 'sold')}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.7rem',
                      backgroundColor: p.status === 'sold' ? 'var(--color-border)' : 'var(--color-primary-light)',
                      color: p.status === 'sold' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                      border: 'none'
                    }}
                  >
                    {p.status === 'sold' ? 'Marcar Disponível' : 'Marcar Vendido'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Sign Out Button */}
      <button onClick={onSignOut} className="btn btn-danger" style={{ width: '100%', height: '48px' }}>
        <LogOut size={16} />
        Terminar Sessão
      </button>

      {/* ========================================================================= */}
      {/* ======================= RECHARGE CREDITS DIALOG ======================= */}
      {/* ========================================================================= */}
      <Modal isOpen={activeModal === 'recharge'} onClose={() => setActiveModal(null)} title="Recarregar Créditos">
        
        {/* Step 1: Select Package */}
        {rechargeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>Escolha um pacote de créditos Nopin para aumentar a visibilidade dos seus imóveis.</p>
            {packs.map(pack => (
              <div
                key={pack.id}
                onClick={() => handleRechargeSelect(pack)}
                style={{
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease'
                }}
                className="recharge-pack-item"
              >
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pack.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{pack.desc}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{pack.price} MT</div>
                  <span className="badge-verified" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>{pack.credits} nopins</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Payment Details */}
        {rechargeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Pacote selecionado:</span>
              <h4 style={{ fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>
                {selectedPack.name} ({selectedPack.credits} nopins) — {selectedPack.price} MZN
              </h4>
            </div>

            <div className="form-group">
              <label className="form-label">Número de Conta M-Pesa / e-Mola *</label>
              <input
                type="text"
                placeholder="+258 84 123 4567"
                value={rechargePhone}
                onChange={(e) => setRechargePhone(e.target.value)}
                className="form-input"
              />
              <span className="text-xs" style={{ fontSize: '0.7rem', marginTop: '2px', display: 'block' }}>
                Será enviado um pedido de transação (prompt USSD PIN) para o número fornecido.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setRechargeStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Voltar</button>
              <button onClick={handleRechargeSubmit} className="btn btn-primary" style={{ flex: 2 }}>Pagar com Carteira</button>
            </div>
          </div>
        )}

        {/* Step 3: Transaction processing spinner */}
        {rechargeStep === 3 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--color-primary-light-active)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h4 style={{ fontWeight: 700 }}>A Processar Transação...</h4>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '6px' }}>Por favor autorize o pedido inserindo o seu PIN no seu telemóvel.</p>
          </div>
        )}

        {/* Step 4: Success message */}
        {rechargeStep === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-success)',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 className="title-h3" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Recarga Efetuada!</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
              Adicionado <strong>{selectedPack.credits} nopins</strong> ao seu saldo actual de créditos.
            </p>
            <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ width: '100%' }}>Concluir</button>
          </div>
        )}

      </Modal>

      {/* ========================================================================= */}
      {/* ======================= ID VERIFICATION DIALOG ========================== */}
      {/* ========================================================================= */}
      <Modal isOpen={activeModal === 'verify_id'} onClose={() => setActiveModal(null)} title="Verificar Identidade">
        
        {/* Step 1: Doc Selection */}
        {verifyStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Para tornar a plataforma Nopin segura e livre de fraudes, necessitamos de digitalizar os seus documentos de identificação.</p>
            
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Escolha o Tipo de Documento</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'bi', name: 'Bilhete de Identidade (BI)' },
                  { id: 'passport', name: 'Passaporte Nacional' },
                  { id: 'driver', name: 'Carta de Condução' }
                ].map(doc => (
                  <label key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'var(--color-bg)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedDocType === doc.id ? 'var(--color-primary-light-active)' : 'var(--color-border)',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}>
                    <input
                      type="radio"
                      name="doc_type"
                      checked={selectedDocType === doc.id}
                      onChange={() => setSelectedDocType(doc.id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{doc.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => setVerifyStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Continuar</button>
          </div>
        )}

        {/* Step 2: Document Scanner Placeholder */}
        {verifyStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Etapa 2 de 4: Digitalizar Frente do Documento</span>
            
            {/* Camera viewport mock */}
            <div style={{
              width: '100%',
              aspectRatio: '1.6',
              backgroundColor: '#1e293b',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Document guide frame overlay */}
              <div style={{
                width: '85%',
                height: '75%',
                border: '3px dashed rgba(255,255,255,0.7)',
                borderRadius: 'var(--radius-md)',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  Posicione a frente do documento aqui
                </span>
              </div>
            </div>

            <button onClick={() => setVerifyStep(3)} className="btn btn-primary" style={{ width: '100%' }}>Capturar Documento</button>
          </div>
        )}

        {/* Step 3: Selfie capture */}
        {verifyStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Etapa 3 de 4: Foto de Autenticidade (Selfie)</span>
            
            {/* Selfie camera mock */}
            <div style={{
              width: '100%',
              aspectRatio: '1.2',
              backgroundColor: '#1e293b',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Oval guideline for face overlay */}
              <div style={{
                width: '180px',
                height: '220px',
                border: '3px dashed rgba(255,255,255,0.7)',
                borderRadius: '50%'
              }}></div>
            </div>

            <button onClick={handleVerifySubmit} className="btn btn-primary" style={{ width: '100%' }}>Capturar Selfie</button>
          </div>
        )}

        {/* Step 4: Loading progress */}
        {verifyStep === 4 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--color-primary-light-active)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <h4 style={{ fontWeight: 700 }}>Submetendo Documentos...</h4>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '6px' }}>Por favor guarde alguns segundos enquanto encriptamos e enviamos.</p>
          </div>
        )}

        {/* Step 5: Success tick */}
        {verifyStep === 5 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-success)',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 className="title-h3" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Perfil Verificado!</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
              Os seus documentos foram aprovados. A sua conta já dispõe da marca de <strong>Vendedor Confiável</strong>.
            </p>
            <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ width: '100%' }}>Concluir</button>
          </div>
        )}

      </Modal>

      {/* ========================================================================= */}
      {/* ======================= MOCK SUPPORT DIALOGS ============================ */}
      {/* ========================================================================= */}
      
      {/* Settings Modal */}
      <Modal isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} title="Definições">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Idioma</label>
            <select className="form-select" defaultValue="pt">
              <option value="pt">Português (MZ)</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notificações Push</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-primary)' }} />
              Ativar alertas de novos imóveis e mensagens.
            </label>
          </div>
          <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Guardar Alterações</button>
        </div>
      </Modal>

      {/* Reviews Modal */}
      <Modal isOpen={activeModal === 'reviews'} onClose={() => setActiveModal(null)} title="Avaliações do Vendedor">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { name: 'Michael Chen', rating: 5, comment: 'Excelente vendedor. Processo transparente de arrendamento.', date: 'Há 3 horas' },
            { name: 'Maria Tembe', rating: 5, comment: 'Respostas rápidas e muito prestável durante a visita.', date: 'Há 2 semanas' },
            { name: 'Dário Sitoe', rating: 4, comment: 'Correu tudo bem, o imóvel correspondia exatamente às fotografias.', date: 'Há 1 mês' }
          ].map((rev, idx) => (
            <div key={idx} style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700 }}>{rev.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{rev.date}</span>
              </div>
              <div style={{ color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.75rem', marginBottom: '6px' }}>
                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{rev.comment}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Security Modal */}
      <Modal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} title="Privacidade e Segurança">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} /> Atualizar Palavra-Passe
            </label>
            <input type="password" placeholder="Palavra-passe actual" className="form-input" style={{ marginBottom: '8px' }} />
            <input type="password" placeholder="Nova palavra-passe" className="form-input" />
          </div>
          <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Alterar Palavra-Passe</button>
        </div>
      </Modal>

      {/* Help & Support Modal */}
      <Modal isOpen={activeModal === 'support'} onClose={() => setActiveModal(null)} title="Ajuda e Suporte">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
          <p className="text-muted">Tem alguma dúvida ou encontrou problemas com um anúncio? Entre em contacto connosco.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={20} style={{ color: 'var(--color-primary)' }} />
              <div>
                <strong style={{ display: 'block' }}>Perguntas Frequentes (FAQ)</strong>
                <span className="text-xs">Consulte respostas rápidas no nosso site.</span>
              </div>
            </div>
            <a href="https://wa.me/258841234567" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <MessageSquare size={20} style={{ color: '#25D366' }} />
              <div>
                <strong style={{ display: 'block' }}>Suporte via WhatsApp</strong>
                <span className="text-xs">Fale directamente com o nosso assistente.</span>
              </div>
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
}
