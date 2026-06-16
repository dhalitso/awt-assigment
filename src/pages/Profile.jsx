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
  const [rechargeStep, setRechargeStep] = useState(1); // 1: Cart, 2: Phone/Method details, 3: Processing (Push sent), 4: Success
  const [selectedPack, setSelectedPack] = useState(null); // Selected predefined pack (or null for custom)
  const [customCredits, setCustomCredits] = useState(10); // Number of custom credits if no pack is selected
  const [rechargePhone, setRechargePhone] = useState('+258 ');
  const [selectedMethod, setSelectedMethod] = useState('mpesa'); // mpesa, emola
  const [rechargeError, setRechargeError] = useState('');

  // 2. ID Verification Flow State (9 Steps)
  // 1: Entry, 2: Select Doc, 3: Scan Front, 4: Review Front, 5: Selfie Intro, 6: Scan Selfie, 7: Review Selfie, 8: Submitting, 9: Success
  const [verifyStep, setVerifyStep] = useState(1);
  const [selectedDocType, setSelectedDocType] = useState('bi'); // bi, passport, driver
  const [verificationImage, setVerificationImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [shutterEffect, setShutterEffect] = useState(false);
  const [docNumber, setDocNumber] = useState('');

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

  const handleCheckoutStart = () => {
    setRechargeStep(2);
  };

  const sendReceiptEmail = async (creditsPurchased, amountPaid) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn("Credentials missing. Skipping real email receipt.");
      return;
    }

    const transactionId = "TXN_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    const formattedDate = new Date().toLocaleString('pt-MZ', { timeZone: 'Africa/Maputo' });
    const message = `COMPRA DE CRÉDITOS CONFIRMADA\n--------------------------------------\nCliente: ${user.name}\nE-mail: ${user.email}\nTelefone: ${rechargePhone}\nData: ${formattedDate}\nID Transação: ${transactionId}\nQuantidade: ${creditsPurchased} Nopins\nValor Pago: ${amountPaid},00 MT\n--------------------------------------\nObrigado por usar o Nopin!`;

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            otp_code: message, // Pass the receipt message in otp_code to fit your current template
            to_email: user.email // Uses the exact email of the logged-in account
          }
        })
      });
      if (!response.ok) {
        console.error("EmailJS sending error response:", await response.text());
      }
    } catch (e) {
      console.error("Failed to send receipt email:", e);
    }
  };

  const handleRechargeSubmit = async () => {
    // Validate phone number
    const cleanNo = rechargePhone.replace(/\s+/g, '');
    
    // Accept standard Mozambican numbers (e.g. +258 84/85/87/86/82/83/89...)
    if (!/^\+2588[2-79]\d{7}$/.test(cleanNo)) {
      alert('Número inválido. Use o formato: +258 84 123 4567');
      return;
    }

    setRechargeStep(3); // Go to processing (Waiting for M-Pesa push confirmation on phone)
    setRechargeError('');

    const creditsPurchased = selectedPack ? selectedPack.credits : customCredits;
    const amountPaid = selectedPack ? selectedPack.price : customCredits * 10;

    try {
      // Call the serverless M-Pesa API endpoint (triggers STK Push)
      const response = await fetch('/api/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: cleanNo,
          amount: amountPaid
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update user balance
        onUpdateUser({
          credits: user.credits + creditsPurchased
        });

        // Send receipt email to the logged in account email address
        sendReceiptEmail(creditsPurchased, amountPaid);
        
        setRechargeStep(4); // Show success screen
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.error || 'A transação M-Pesa falhou ou foi cancelada pelo utilizador.');
        setRechargeStep(2); // Go back to checkout details
      }
    } catch (e) {
      console.error('M-Pesa payment request failed:', e);
      alert('Falha ao conectar com o serviço M-Pesa. Tente novamente.');
      setRechargeStep(2); // Go back to checkout details
    }
  };

  // Helper function to simulate camera flash shutter effect
  const triggerShutterFlash = (callback) => {
    setShutterEffect(true);
    setTimeout(() => {
      setShutterEffect(false);
      callback();
    }, 350);
  };

  const captureDocument = () => {
    triggerShutterFlash(() => {
      // Mock captured doc image using the prototype image background reference
      setVerificationImage('/high-fidelity/UNVERIFIED%20PROFILE%20PAGE%20ALTERNATIVO-1.jpg');
      setVerifyStep(4);
    });
  };

  const captureSelfie = () => {
    triggerShutterFlash(() => {
      // Mock captured selfie image using the prototype image background reference
      setSelfieImage('/high-fidelity/UNVERIFIED%20PROFILE%20PAGE%20ALTERNATIVO-2.jpg');
      setVerifyStep(7);
    });
  };

  // ID Verification Process Simulators
  const handleVerifySubmit = () => {
    setVerifyStep(8); // Show spinner
    setTimeout(() => {
      onUpdateUser({
        verified: true,
        badges: [
          { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" },
          { id: "b2", title: "Vendedor Confiável", icon: "shield-check", desc: "Identidade verificada através de biometria" }
        ]
      });
      setVerifyStep(9); // Show success tick
    }, 3500);
  };

  return (
    <div className="profile-page-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Profile Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h1 className="title-h1" style={{ fontSize: '1.5rem', margin: 0 }}>O meu Perfil</h1>
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
          <h2 className="title-h2" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            {user.name}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', margin: '2px 0 6px 0' }}>{user.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.8rem' }}>★ {user.rating}</span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--color-text-light)' }}></span>
            {user.verified ? (
              <span className="badge-verified" style={{ padding: '2px 8px', fontSize: '0.65rem', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-success)', borderRadius: '4px', fontWeight: 600 }}>
                Vendedor Confiável
              </span>
            ) : (
              <span className="badge-verified" style={{ padding: '2px 8px', fontSize: '0.65rem', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-warning)', borderRadius: '4px', fontWeight: 600 }}>
                Não Verificado
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Banner: Publicar uma propriedade */}
      <section 
        onClick={() => onNavigateTab('list-property')}
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        <div style={{ flex: 1, zIndex: 1 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.3px' }}>
            Publicar uma propriedade
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '6px', maxWidth: '210px', lineHeight: 1.4, margin: '6px 0 0 0' }}>
            Anuncie a sua casa ou terreno e alcance milhares de compradores.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontWeight: 600, fontSize: '0.8rem' }}>
            <span>Começar agora</span>
            <ArrowRight size={14} />
          </div>
        </div>
        <div style={{ zIndex: 1, position: 'relative' }}>
          {/* Vector representation of purple house mockup */}
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        
        {/* Decorative background shapes */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}></div>
      </section>

      {/* 4. Wallet Section: Credits Balance and side-by-side Recharge */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
              <div className="text-xs" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Créditos Nopin</div>
              <div className="title-h2" style={{ fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 800, margin: 0 }}>
                {user.credits} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>nopins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-side M-Pesa and e-Mola top-up buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setRechargeStep(1);
              setSelectedMethod('mpesa');
              setActiveModal('recharge');
            }}
            className="btn btn-outline"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: '#e11d48',
              color: '#e11d48',
              backgroundColor: '#fff1f2',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '12px',
              borderWidth: '1.5px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e11d48' }}></span>
            M-Pesa
          </button>
          
          <button
            onClick={() => {
              setRechargeStep(1);
              setSelectedMethod('emola');
              setActiveModal('recharge');
            }}
            className="btn btn-outline"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: '#ea580c',
              color: '#ea580c',
              backgroundColor: '#fff7ed',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '12px',
              borderWidth: '1.5px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span>
            e-Mola
          </button>
        </div>
      </section>

      {/* 5. Verification ID Banner (only shown if not fully verified, or as mock flow link) */}
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
            <h3 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <ShieldAlert size={16} /> Verifique a sua Identidade
            </h3>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px', maxWidth: '240px', lineHeight: 1.4, margin: '4px 0 0 0' }}>
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
              padding: '8px 14px',
              fontWeight: 600
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
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px', margin: '2px 0 0 0' }}>A sua conta nopin cumpre todos os requisitos de segurança.</p>
          </div>
        </section>
      )}

      {/* 6. User Activity Lists */}
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
        
        {/* Step 1: Cart & Package Selection */}
        {rechargeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: selectedMethod === 'mpesa' ? '#fff1f2' : '#fff7ed', border: '1px solid', borderColor: selectedMethod === 'mpesa' ? '#fecdd3' : '#ffedd5' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: selectedMethod === 'mpesa' ? '#e11d48' : '#ea580c' }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedMethod === 'mpesa' ? '#9f1239' : '#9a3412' }}>
                Carteira Activa: {selectedMethod === 'mpesa' ? 'M-Pesa (Vodacom)' : 'e-Mola (Movitel)'}
              </span>
            </div>

            {/* Packages Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>1. Escolha um Pacote de Créditos:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {packs.map(pack => {
                  const isSelected = selectedPack && selectedPack.id === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => {
                        setSelectedPack(pack);
                        setCustomCredits(pack.credits);
                      }}
                      style={{
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#f5f3ff' : 'white',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(124, 58, 237, 0.1)' : 'none'
                      }}
                    >
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0, color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>{pack.name}</h4>
                        <p className="text-muted" style={{ fontSize: '0.7rem', margin: '2px 0 0 0' }}>{pack.desc}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>{pack.price} MT</div>
                        <span className="badge-verified" style={{ padding: '1px 6px', fontSize: '0.6rem', display: 'inline-block', marginTop: '2px' }}>{pack.credits} nopins</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', color: '#9ca3af' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              <span style={{ padding: '0 12px', fontSize: '0.75rem', fontWeight: 600 }}>OU</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            </div>

            {/* Custom Quantity Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Quantidade Customizada:</span>
                {selectedPack && (
                  <button
                    onClick={() => {
                      setSelectedPack(null);
                      setCustomCredits(10);
                    }}
                    style={{ fontSize: '0.75rem', color: 'var(--color-primary)', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Usar Customizado
                  </button>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                border: !selectedPack ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                backgroundColor: !selectedPack ? '#f5f3ff' : '#f9fafb'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPack(null);
                    setCustomCredits(prev => Math.max(1, prev - 1));
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    value={customCredits}
                    onChange={(e) => {
                      setSelectedPack(null);
                      const val = parseInt(e.target.value);
                      setCustomCredits(isNaN(val) ? 1 : val);
                    }}
                    style={{
                      width: '80px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: 'var(--color-text)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>nopins</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPack(null);
                    setCustomCredits(prev => prev + 1);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Shopping Cart Summary */}
            <div style={{
              marginTop: '12px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.8rem', margin: '0 0 12px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>
                🛒 Resumo do Carrinho
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Item:</span>
                  <span style={{ fontWeight: 600 }}>{selectedPack ? `Pacote: ${selectedPack.name}` : 'Créditos Personalizados'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Quantidade:</span>
                  <span style={{ fontWeight: 600 }}>{selectedPack ? selectedPack.credits : customCredits} nopins</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Preço Unitário:</span>
                  <span style={{ fontWeight: 600 }}>10,00 MT / nopin</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e5e7eb', paddingTop: '8px', marginTop: '4px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700 }}>Total a pagar:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    {selectedPack ? selectedPack.price : customCredits * 10},00 MT
                  </span>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleCheckoutStart}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '48px',
                fontWeight: 600,
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Ir para o Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Checkout / Payment Details */}
        {rechargeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Total do pedido:</span>
              <h4 style={{ fontWeight: 800, color: 'var(--color-primary)', margin: '2px 0 0 0', fontSize: '1.2rem' }}>
                {selectedPack ? selectedPack.name : `${customCredits} nopins`} — {selectedPack ? selectedPack.price : customCredits * 10},00 MT
              </h4>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Número de Celular M-Pesa / e-Mola *</label>
              <input
                type="text"
                placeholder="+258 84 123 4567"
                value={rechargePhone}
                onChange={(e) => setRechargePhone(e.target.value)}
                className="form-input"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
                required
              />
              <span className="text-xs" style={{ fontSize: '0.7rem', marginTop: '6px', display: 'block', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Introduza o seu número de conta associado ao M-Pesa (Vodacom) ou e-Mola (Movitel). Será enviado um pedido de pagamento por SMS/USSD.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setRechargeStep(1)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Voltar</button>
              <button
                onClick={handleRechargeSubmit}
                className="btn btn-primary"
                style={{
                  flex: 2,
                  height: '44px',
                  fontWeight: 600,
                  backgroundColor: selectedMethod === 'mpesa' ? '#e11d48' : '#ea580c',
                  borderColor: selectedMethod === 'mpesa' ? '#e11d48' : '#ea580c'
                }}
              >
                Pagar com {selectedMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Transaction processing spinner (Real STK push wait) */}
        {rechargeStep === 3 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div className="loading-spinner" style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(124, 58, 237, 0.15)',
              borderTopColor: selectedMethod === 'mpesa' ? '#e11d48' : '#ea580c',
              borderRadius: '50%',
              margin: '0 auto 18px auto',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <h4 style={{ fontWeight: 700, margin: 0 }}>Aguardando PIN no telemóvel...</h4>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '8px', margin: '8px 0 0 0', lineHeight: 1.4 }}>
              Enviámos um pedido de transacção para <strong>{rechargePhone}</strong>.
              <br /><br />
              Por favor, introduza o seu PIN M-Pesa no seu telemóvel para autorizar o pagamento de <strong>{selectedPack ? selectedPack.price : customCredits * 10},00 MT</strong>.
            </p>
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
            <h3 className="title-h3" style={{ fontSize: '1.2rem', marginBottom: '8px', margin: '0 0 8px 0', color: 'var(--color-success)' }}>Compra Confirmada!</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '16px', margin: '0 0 16px 0' }}>
              Adicionado <strong>{selectedPack ? selectedPack.credits : customCredits} nopins</strong> ao seu saldo actual de créditos.
            </p>

            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#374151',
              textAlign: 'left',
              marginBottom: '20px',
              lineHeight: '1.4'
            }}>
              📧 <strong>Recibo de Pagamento Enviado!</strong>
              <br />
              Um e-mail de confirmação foi enviado para <strong>{user.email}</strong> com todos os detalhes desta compra.
            </div>

            <button onClick={() => setActiveModal(null)} className="btn btn-primary" style={{ width: '100%', height: '44px', fontWeight: 600 }}>Concluir</button>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* ======================= ID VERIFICATION DIALOG ========================== */}
      {/* ========================================================================= */}
      <Modal isOpen={activeModal === 'verify_id'} onClose={() => setActiveModal(null)} title="Verificação de Identidade">
        
        {/* Step 1: Entry Landing (UNVERIFIED PROFILE PAGE ALTERNATIVO-6.jpg) */}
        {verifyStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <Award size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0' }}>Torne-se um Vendedor Confiável</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
                Para garantir a segurança nas transações e aumentar a visibilidade dos seus anúncios, verifique a sua identidade digitalizando um documento oficial e tirando uma selfie biométrica.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center' }}>
                <span style={{ color: 'var(--color-primary)' }}>✓</span>
                <span>Selo Oficial de Vendedor Confiável no seu perfil</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center' }}>
                <span style={{ color: 'var(--color-primary)' }}>✓</span>
                <span>Maior relevância nos resultados de pesquisa</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center' }}>
                <span style={{ color: 'var(--color-primary)' }}>✓</span>
                <span>Redução de suspensões e maior confiança dos compradores</span>
              </div>
            </div>

            <button onClick={() => setVerifyStep(2)} className="btn btn-primary" style={{ width: '100%', height: '44px', fontWeight: 700 }}>
              Iniciar Verificação
            </button>
          </div>
        )}

        {/* Step 2: Select Document (UNVERIFIED PROFILE PAGE ALTERNATIVO.jpg) */}
        {verifyStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Escolha o documento de identidade nacional que pretende digitalizar:</p>
            
            <div className="form-group">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'bi', name: 'Bilhete de Identidade (BI)' },
                  { id: 'passport', name: 'Passaporte Nacional' },
                  { id: 'driver', name: 'Carta de Condução' }
                ].map(doc => (
                  <label key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'var(--color-bg)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: '1.5px solid',
                    borderColor: selectedDocType === doc.id ? 'var(--color-primary)' : 'var(--color-border)',
                    fontWeight: 700,
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

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => setVerifyStep(1)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Voltar</button>
              <button onClick={() => setVerifyStep(3)} className="btn btn-primary" style={{ flex: 2, height: '44px', fontWeight: 600 }}>Continuar</button>
            </div>
          </div>
        )}

        {/* Step 3: Scan Document Front (UNVERIFIED PROFILE PAGE ALTERNATIVO-1.jpg) */}
        {verifyStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Digitalizar Frente do Documento</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>Passo 3 de 9</span>
            </div>
            
            {/* Camera viewport mock */}
            <div className="scanner-container">
              {/* Shutter flash overlay */}
              {shutterEffect && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#ffffff',
                  zIndex: 1000,
                  opacity: 1,
                  animation: 'fadeOut 0.3s ease-out'
                }}></div>
              )}
              
              {/* Green scanning laser line */}
              <div className="scanner-laser"></div>
              
              {/* Clean camera viewport background showing document outline icon */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#0f172a', // Zinc 900 dark slate
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.95
              }}>
                <CreditCard size={100} style={{ color: 'rgba(255, 255, 255, 0.12)' }} />
              </div>

              {/* Document guide frame overlay */}
              <div className="scanner-frame-id">
                {/* Mock credit/ID card placed inside camera area */}
                <div style={{
                  width: '90%',
                  height: '85%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '10px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  border: '1.5px solid #475569',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '20px', borderRadius: '4px', backgroundColor: '#cbd5e1', border: '1px solid #cbd5e1' }}></div>
                    <div style={{ width: '40px', height: '8px', borderRadius: '2px', backgroundColor: '#94a3b8' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* User silhouette icon representing person on document */}
                    <div style={{
                      width: '32px',
                      height: '40px',
                      borderRadius: '4px',
                      backgroundColor: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <User size={20} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ width: '70%', height: '6px', backgroundColor: '#94a3b8', borderRadius: '1px' }}></div>
                      <div style={{ width: '50%', height: '5px', backgroundColor: '#cbd5e1', borderRadius: '1px' }}></div>
                      <div style={{ width: '90%', height: '5px', backgroundColor: '#cbd5e1', borderRadius: '1px' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6px', color: '#94a3b8', fontWeight: 600 }}>
                    <span>REPÚBLICA DE MOÇAMBIQUE</span>
                    <span>BI Nº 110204928X</span>
                  </div>
                </div>
                
                <span style={{ position: 'absolute', bottom: '-28px', left: 0, right: 0, textAlign: 'center', color: '#ffffff', fontSize: '0.7rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  Alinhe o BI dentro da moldura
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => setVerifyStep(2)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Voltar</button>
              <button onClick={captureDocument} className="btn btn-primary" style={{ flex: 2, height: '44px', fontWeight: 700 }}>
                Capturar Documento
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Doc Photo (UNVERIFIED PROFILE PAGE ALTERNATIVO-3.jpg) */}
        {verifyStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Verificar Nitidez</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>Passo 4 de 9</span>
            </div>

            {/* Document preview box */}
            <div style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-border-dark)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1.6', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Simulated taken photo card */}
                <div style={{
                  width: '75%',
                  height: '75%',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '40px',
                      borderRadius: '2px',
                      backgroundColor: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <User size={20} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '7px', fontWeight: 800 }}>DHALITSO USER</span>
                      <span style={{ fontSize: '5px', color: '#64748b' }}>Nacionalidade: Moçambicana</span>
                      <span style={{ fontSize: '5px', color: '#64748b' }}>Nascimento: 02 Abr 1999</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '6px', color: '#475569', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>BILHETE DE IDENTIDADE Nº 110204928X</span>
                    <span>✓ LIDO</span>
                  </div>
                </div>
                {/* Photo stamp effect */}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(16, 185, 129, 0.9)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  FRENTE CAPTURADA
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>A foto está nítida?</span>
              <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>Certifique-se de que os dados escritos do documento e a sua fotografia facial estão perfeitamente visíveis e sem reflexos.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => setVerifyStep(3)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Repetir Foto</button>
              <button onClick={() => setVerifyStep(5)} className="btn btn-primary" style={{ flex: 2, height: '44px', fontWeight: 700 }}>
                Sim, Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Selfie Intro Landing (UNVERIFIED PROFILE PAGE ALTERNATIVO-7.jpg) */}
        {verifyStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <User size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0' }}>Autenticação por Selfie</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
                Para verificar que o Bilhete de Identidade pertence de facto a si, precisamos de tirar uma foto rápida do seu rosto (selfie).
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)', gap: '10px' }}>
              <div>• Procure um local bem iluminado.</div>
              <div>• Remova óculos de sol, bonés ou máscaras.</div>
              <div>• Mantenha o rosto neutro e olhe directamente para a câmara.</div>
            </div>

            <button onClick={() => setVerifyStep(6)} className="btn btn-primary" style={{ width: '100%', height: '44px', fontWeight: 700 }}>
              Iniciar Câmara
            </button>
          </div>
        )}

        {/* Step 6: Scan Face Selfie (UNVERIFIED PROFILE PAGE ALTERNATIVO-2.jpg) */}
        {verifyStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tirar Selfie de Validação</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>Passo 6 de 9</span>
            </div>
            
            {/* Selfie camera mock viewport */}
            <div className="scanner-container" style={{ height: '360px' }}>
              {shutterEffect && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#ffffff',
                  zIndex: 1000,
                  opacity: 1,
                  animation: 'fadeOut 0.3s ease-out'
                }}></div>
              )}
              
              {/* Green scanning laser line */}
              <div className="scanner-laser"></div>
              
              {/* Clean camera viewport background showing person outline icon */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#0f172a', // Zinc 900 dark slate
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.95
              }}>
                <User size={140} style={{ color: 'rgba(255, 255, 255, 0.15)' }} />
              </div>

              {/* Oval guideline for face overlay */}
              <div className="scanner-frame-face">
                <span style={{ position: 'absolute', bottom: '-40px', left: '-50px', right: '-50px', textAlign: 'center', color: '#ffffff', fontSize: '0.7rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  Enquadre a sua cara no círculo
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => setVerifyStep(5)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Voltar</button>
              <button onClick={captureSelfie} className="btn btn-primary" style={{ flex: 2, height: '44px', fontWeight: 700 }}>
                Capturar Selfie
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Review Selfie Photo (UNVERIFIED PROFILE PAGE ALTERNATIVO-4.jpg) */}
        {verifyStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Confirmar Selfie</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>Passo 7 de 9</span>
            </div>

            {/* Selfie photo preview box */}
            <div style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-border-dark)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1.2', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <User size={72} />
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(16, 185, 129, 0.9)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  SELFIE APROVADA
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>A selfie está nítida?</span>
              <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>Garante que os seus olhos estão abertos e que não há reflexos de luz ocultando os seus traços faciais.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => setVerifyStep(6)} className="btn btn-outline" style={{ flex: 1, height: '44px', fontWeight: 600 }}>Tirar Outra</button>
              <button onClick={handleVerifySubmit} className="btn btn-primary" style={{ flex: 2, height: '44px', fontWeight: 700 }}>
                Sim, Enviar
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Submission Loading Spinner (UNVERIFIED PROFILE PAGE ALTERNATIVO-5.jpg) */}
        {verifyStep === 8 && (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
            <div className="loading-spinner" style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(124, 58, 237, 0.15)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              margin: '0 auto 24px auto',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px 0' }}>A Processar Dados Biométricos...</h3>
            
            <div style={{ width: '80%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', margin: '0 auto 16px auto', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'var(--color-primary)',
                animation: 'fillProgress 3.2s linear forwards',
                borderRadius: '3px'
              }}></div>
            </div>
            
            <p className="text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
              Estamos a comparar a selfie capturada com a fotografia presente no Bilhete de Identidade. Este processo leva apenas alguns segundos.
            </p>
            
            <style>{`
              @keyframes fillProgress {
                0% { width: 0%; }
                15% { width: 12%; }
                45% { width: 48%; }
                80% { width: 78%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        )}

        {/* Step 9: Submission Success Tick (UNVERIFIED PROFILE PAGE ALTERNATIVO-8.jpg) */}
        {verifyStep === 9 && (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-success)',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--color-success)' }}>Identidade Verificada!</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '28px', margin: '0 0 28px 0' }}>
              Parabéns! A sua biometria e o Bilhete de Identidade coincidem perfeitamente. O seu perfil foi actualizado com o selo de <strong>Vendedor Confiável</strong>.
            </p>
            <button onClick={() => {
              setActiveModal(null);
              // Reset state back to step 1 for next time if testing
              setTimeout(() => setVerifyStep(1), 500);
            }} className="btn btn-primary" style={{ width: '100%', height: '46px', fontWeight: 700 }}>
              Voltar ao Meu Perfil
            </button>
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
