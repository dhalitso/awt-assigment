import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, X, ArrowLeft } from 'lucide-react';

const NopinLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '2.8rem', color: '#ffffff', letterSpacing: '-1px', fontFamily: 'var(--font-title)' }}>
    <span>n</span>
    <span style={{ position: 'relative', display: 'inline-block' }}>
      o
      <svg style={{ position: 'absolute', top: '-11px', left: '-2px', width: '120%', height: '14px', color: '#ffffff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" />
      </svg>
    </span>
    <span>pin</span>
  </div>
);

const NopinLogoPurple = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 800, fontSize: '2rem', color: 'var(--color-primary)', letterSpacing: '-0.5px', fontFamily: 'var(--font-title)' }}>
    <span>n</span>
    <span style={{ position: 'relative', display: 'inline-block' }}>
      o
      <svg style={{ position: 'absolute', top: '-9px', left: '-2px', width: '120%', height: '12px', color: 'var(--color-primary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" />
      </svg>
    </span>
    <span>pin</span>
  </div>
);

export default function Onboarding({ onComplete }) {
  const [stage, setStage] = useState('splash'); // 'splash', 'onboarding', 'signin', 'signup', 'otp'
  const [slideIndex, setSlideIndex] = useState(0);

  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification States
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [expectedOtpCode, setExpectedOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(59);
  const [pendingUser, setPendingUser] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [showOtpToast, setShowOtpToast] = useState(false);

  // Splash auto-transition
  useEffect(() => {
    if (stage === 'splash') {
      const timer = setTimeout(() => {
        setStage('onboarding');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // OTP Timer countdown
  useEffect(() => {
    let timerId;
    if (stage === 'otp' && otpTimer > 0) {
      timerId = setTimeout(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timerId);
  }, [stage, otpTimer]);

  const triggerOtp = (mockUser) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedOtpCode(code);
    setPendingUser(mockUser);
    setOtpDigits(['', '', '', '']);
    setOtpTimer(59);
    setOtpError('');
    setStage('otp');
    setShowOtpToast(true);
  };

  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;
    
    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue.substring(cleanValue.length - 1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (cleanValue && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode === expectedOtpCode) {
      onComplete(pendingUser);
    } else {
      setOtpError('Código de verificação incorreto. Tente novamente.');
      setOtpDigits(['', '', '', '']);
      const firstInput = document.getElementById('otp-input-0');
      if (firstInput) firstInput.focus();
    }
  };

  const handleResendOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedOtpCode(code);
    setOtpTimer(59);
    setOtpError('');
    setOtpDigits(['', '', '', '']);
    setShowOtpToast(true);
  };

  const handleNextSlide = () => {
    if (slideIndex < 2) {
      setSlideIndex(prev => prev + 1);
    } else {
      setStage('signin');
    }
  };

  const handleSkip = () => {
    setStage('signin');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!signInEmail) {
      alert('Por favor introduza o seu email');
      return;
    }
    // Mock authentication details
    const mockUser = {
      name: signInEmail.split('@')[0],
      email: signInEmail,
      rating: 5.0,
      verified: false,
      credits: 0,
      propertiesCount: 0,
      savedCount: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      badges: [
        { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" }
      ]
    };
    triggerOtp(mockUser);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpUsername || !signUpEmail || !signUpPassword) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      alert('As palavras-passe não coincidem');
      return;
    }
    if (!agreeTerms) {
      alert('Deve concordar com os termos e condições');
      return;
    }

    const mockUser = {
      name: signUpUsername,
      email: signUpEmail,
      rating: 5.0,
      verified: false,
      credits: 0,
      propertiesCount: 0,
      savedCount: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      badges: [
        { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" }
      ]
    };
    triggerOtp(mockUser);
  };

  const handleSocialLogin = (platform) => {
    const mockUser = {
      name: `User_${platform}`,
      email: `${platform.toLowerCase()}user@email.com`,
      rating: 5.0,
      verified: false,
      credits: 0,
      propertiesCount: 0,
      savedCount: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      badges: [
        { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" }
      ]
    };
    onComplete(mockUser);
  };

  const handleSkipAuth = () => {
    // Guest bypass
    const guestUser = {
      name: "Dhalitso",
      email: "dhalitso.user@nopin.mz",
      rating: 4.9,
      verified: false,
      credits: 10,
      propertiesCount: 0,
      savedCount: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      badges: [
        { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" }
      ]
    };
    onComplete(guestUser);
  };

  // 1. Splash Screen
  if (stage === 'splash') {
    return (
      <div className="splash-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', animation: 'scaleLogo 1.5s ease-in-out' }}>
          <NopinLogo />
        </div>
        <style>{`
          @keyframes scaleLogo {
            0% { transform: scale(0.85); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Slider Onboarding
  if (stage === 'onboarding') {
    const slides = [
      {
        image: '/high-fidelity/START%20PAGE.jpg',
        title: 'Encontre a casa dos teus sonhos'
      },
      {
        image: '/high-fidelity/STARTUP%20PAGE-1.jpg',
        title: 'Venda propriedades com um clique'
      },
      {
        image: '/high-fidelity/STARTUP%20PAGE-2.jpg',
        title: 'Mais de 80k propriedades na plataforma'
      }
    ];

    const currentSlide = slides[slideIndex];

    return (
      <div className="onboarding-screen">
        {/* Top Illustration Wrapper (Clips original mockup illustration portion) */}
        <div className="onboarding-image-container">
          <img
            src={currentSlide.image}
            alt=""
            className="onboarding-bg-image"
          />
        </div>

        {/* Content Box with real HTML elements over prototype */}
        <div className="onboarding-content-box">
          <h1 className="onboarding-title">{currentSlide.title}</h1>

          {/* Dots Indicator */}
          <div className="dot-indicators">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`dot-indicator ${slideIndex === idx ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="onboarding-footer">
            <button onClick={handleSkip} className="btn-skip">
              Skip
            </button>
            <button
              onClick={handleNextSlide}
              className="btn-circle-next"
              aria-label="Seguinte"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Sign In Screen
  if (stage === 'signin') {
    return (
      <div className="auth-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => setStage('onboarding')}
            className="btn-clean"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Sign In</span>
          </button>
          <button onClick={handleSkipAuth} className="btn-skip" style={{ textTransform: 'lowercase', padding: 0 }}>
            skip
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 500 }}>Email</label>
            <input
              type="email"
              placeholder="Ex: dhalitso@email.com"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="form-input"
              style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '14px' }}
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" style={{ fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showSignInPassword ? 'text' : 'password'}
                placeholder="Introduza a palavra-passe"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="form-input"
                style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '14px', paddingRight: '48px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(p => !p)}
                className="btn-clean"
                style={{ position: 'absolute', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark"
            style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.95rem', marginTop: '12px' }}
          >
            sign in
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0', color: '#6b7280', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ padding: '0 16px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          <button
            onClick={() => handleSocialLogin('Google')}
            className="btn btn-white-border"
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.02c2.36-2.17 3.77-5.37 3.77-8.74Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.02-3.12c-1.12.75-2.55 1.19-3.94 1.19-3.03 0-5.6-2.05-6.51-4.82H1.31v3.22A12.01 12.01 0 0 0 12 24Z"/>
              <path fill="#FBBC05" d="M5.49 14.34a7.15 7.15 0 0 1 0-4.68V6.44H1.31a12 12 0 0 0 0 11.12l4.18-3.22Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.95 11.95 0 0 0 12 0C7.3 0 3.2 2.68 1.31 6.56L5.49 9.78c.91-2.77 3.48-4.82 6.51-4.82Z"/>
            </svg>
            <span>continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="btn btn-white-border"
            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>continue with Facebook</span>
          </button>
        </div>

        {/* Footer text */}
        <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', color: '#4b5563' }}>
          <span>I don't have an account? </span>
          <button
            onClick={() => setStage('signup')}
            className="btn-clean"
            style={{ fontWeight: 700, textDecoration: 'underline', color: '#0f172a', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Sign up
          </button>
          
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '24px' }}>
            2024 @nopin all rights reserved
          </div>
        </div>
      </div>
    );
  }

  // 4. Sign Up Screen (Modal Bottom Sheet Style)
  if (stage === 'signup') {
    return (
      <div className="auth-container" style={{ animation: 'fadeIn 0.3s ease-out', backgroundColor: '#f3f4f6' }}>
        {/* Mock background signin page behind sheet */}
        <div style={{ opacity: 0.3, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Sign In</span>
            <span className="btn-skip">skip</span>
          </div>
        </div>

        {/* Bottom Sheet wrapper */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '24px 20px',
          maxHeight: '92vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => setStage('signin')}
              className="btn-clean"
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#000', padding: '4px' }}
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sign Up</h2>
            <div style={{ width: '32px' }}></div> {/* Spacer */}
          </div>

          {/* Form */}
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500 }}>Username</label>
              <input
                type="text"
                placeholder="Insira o seu nome de utilizador"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
                className="form-input"
                style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '12px' }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500 }}>Email</label>
              <input
                type="email"
                placeholder="Ex: dhalitso@email.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="form-input"
                style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '12px' }}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  placeholder="Criar palavra-passe"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="form-input"
                  style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '12px', paddingRight: '64px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(p => !p)}
                  className="btn-clean"
                  style={{ position: 'absolute', right: '16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#111' }}
                >
                  {showSignUpPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ fontWeight: 500 }}>Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showSignUpConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar palavra-passe"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ borderRadius: '8px', border: '1px solid #d1d5db', padding: '12px', paddingRight: '64px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpConfirmPassword(p => !p)}
                  className="btn-clean"
                  style={{ position: 'absolute', right: '16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#111' }}
                >
                  {showSignUpConfirmPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '4px 0 10px 0' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', marginTop: '4px' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4, cursor: 'pointer' }}>
                By selecting agree & continue, I agree with the{' '}
                <a href="#terms" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>terms and conditions</a>
                , payment terms & privacy policy.
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-dark"
              style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Agree & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 5. OTP Verification Screen
  if (stage === 'otp') {
    return (
      <div className="auth-container" style={{ animation: 'fadeIn 0.3s ease-out', position: 'relative' }}>
        
        {/* Simulated OTP Notification Toast */}
        {showOtpToast && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: '#ede9fe', // Light violet 100
            border: '1.5px solid #c084fc', // Purple 400
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out'
          }}>
            <span style={{ fontSize: '1.25rem' }}>📧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-primary)' }}>SIMULAÇÃO DE SMS/E-MAIL (OTP)</div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '2px' }}>
                Código enviado para <strong>{pendingUser?.email}</strong>: <strong style={{ fontSize: '1.1rem', color: '#7c3aed' }}>{expectedOtpCode}</strong>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setShowOtpToast(false)} 
              className="btn-clean"
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <style>{`
          @keyframes slideDown {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => setStage('signin')}
            className="btn-clean"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Verificação</span>
          </button>
        </div>

        {/* Info */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>Insira o código</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
            Enviámos um código de verificação temporário de 4 dígitos para o e-mail: <br />
            <strong style={{ color: '#111827' }}>{pendingUser?.email}</strong>
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '12px 0' }}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength="1"
                pattern="[0-9]*"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: digit ? 'var(--color-primary)' : '#d1d5db',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  backgroundColor: digit ? '#f5f3ff' : 'transparent',
                  outline: 'none',
                  boxShadow: digit ? '0 0 0 3px rgba(124, 58, 237, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                required
              />
            ))}
          </div>

          {otpError && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', margin: '-8px 0' }}>
              {otpError}
            </div>
          )}

          {/* Resend Actions */}
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            {otpTimer > 0 ? (
              <span>Reenviar código em <strong style={{ color: '#111827' }}>0:{otpTimer < 10 ? '0' : ''}{otpTimer}s</strong></span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>Não recebeu o e-mail?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="btn-clean"
                  style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}
                >
                  Reenviar código OTP
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-dark"
            style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.95rem', marginTop: '12px' }}
          >
            Confirmar e Entrar
          </button>
        </form>

        {/* Back Link */}
        <button
          type="button"
          onClick={() => setStage('signin')}
          className="btn-clean"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'none', margin: '24px auto 0 auto', fontSize: '0.85rem', color: '#6b7280' }}
        >
          <ArrowLeft size={16} />
          <span>Voltar ao e-mail e password</span>
        </button>

      </div>
    );
  }

  return null;
}
