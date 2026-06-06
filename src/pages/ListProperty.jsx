import React, { useState } from 'react';
import { Camera, Trash2, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Coins, HelpCircle } from 'lucide-react';
import Modal from '../components/Modal';

export default function ListProperty({
  user,
  onUpdateUser,
  onPublishListing,
  onNavigateTab,
  onSelectProperty
}) {
  // Page States: 'form' | 'visibility' | 'success' | 'error'
  const [pageState, setPageState] = useState('form');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('arrendar'); // 'terreno' | 'arrendar' | 'venda'
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('1');
  const [parking, setParking] = useState('yes'); // 'yes' | 'no'
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Maputo');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('mês');
  const [phone, setPhone] = useState('+258 ');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  // Visibility selection
  const [visibility, setVisibility] = useState('basic'); // 'basic' | 'premium'

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [createdPropertyId, setCreatedPropertyId] = useState(null);

  // Default fallback images
  const fallbackImages = {
    terreno: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    arrendar: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    venda: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
  };

  // 1. Image Upload (Local Base64 Conversion)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
        setErrors(prev => ({ ...prev, images: null }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // 2. Validation
  const validateForm = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'O título do anúncio é obrigatório.';
    if (!address.trim()) errs.address = 'A localização / bairro é obrigatória.';
    if (!price || parseFloat(price) <= 0) errs.price = 'Insira um preço válido superior a zero.';
    if (images.length === 0) errs.images = 'Carregue pelo menos 1 fotografia do imóvel.';

    // Validate Mozambican phone format (+258 8X XXXXXXX)
    const phoneClean = phone.replace(/\s+/g, '');
    const phoneRegex = /^\+2588[2-7]\d{7}$/;
    if (!phoneRegex.test(phoneClean)) {
      errs.phone = 'Número inválido. Use o formato: +258 84 123 4567';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGoToVisibility = () => {
    if (validateForm()) {
      setPageState('visibility');
    } else {
      // Scroll to top or show alert if there are errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 3. Submit Publication
  const handlePublishSubmit = () => {
    setShowConfirmModal(false);
    const cost = visibility === 'premium' ? 5 : 1; // 5 credits for Premium, 1 credit for Basic

    if (user.credits < cost) {
      setPageState('error');
      return;
    }

    // Deduct credits and update user properties count
    const remainingCredits = user.credits - cost;
    onUpdateUser({
      credits: remainingCredits,
      propertiesCount: user.propertiesCount + 1
    });

    // Generate property object
    const newPropertyId = `p_user_${Date.now()}`;
    const newProperty = {
      id: newPropertyId,
      title,
      type: category === 'terreno' ? 'villa' : 'house',
      listingType: category === 'arrendar' ? 'rent' : 'sale',
      price: parseFloat(price),
      pricePeriod: category === 'arrendar' ? pricePeriod : '',
      location: `${address}, ${city}`,
      city,
      lat: city === 'Matola' ? -25.9612 + (Math.random() - 0.5) * 0.02 : -25.9555 + (Math.random() - 0.5) * 0.02,
      lng: city === 'Matola' ? 32.4678 + (Math.random() - 0.5) * 0.02 : 32.6074 + (Math.random() - 0.5) * 0.02,
      bedrooms: category !== 'terreno' ? parseInt(bedrooms) : 0,
      bathrooms: category !== 'terreno' ? parseInt(bathrooms) : 0,
      area: area ? parseFloat(area) : 100,
      parking: category !== 'terreno' && parking === 'yes',
      status: "available",
      featured: visibility === 'premium',
      tag: category === 'terreno' ? 'Terreno' : category === 'arrendar' ? 'Arrendamento' : 'Moradia',
      images: images.length > 0 ? images : [fallbackImages[category]],
      agent: {
        name: user.name,
        phone: phone,
        email: user.email,
        rating: user.rating,
        verified: user.verified,
        avatar: user.avatar
      },
      description: description.trim() || 'Sem descrição adicional fornecida.',
      amenities: category !== 'terreno' ? ["Segurança 24h", "Furo de Água"] : []
    };

    onPublishListing(newProperty);
    setCreatedPropertyId(newPropertyId);
    setPageState('success');
  };

  // =========================================================================
  // SUCCESS SCREEN
  // =========================================================================
  if (pageState === 'success') {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--color-success-light)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-success)',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle size={48} />
        </div>
        <h1 className="title-h1" style={{ fontSize: '1.6rem', marginBottom: '12px', fontWeight: 800 }}>Sucesso!</h1>
        <p className="text-muted" style={{ maxWidth: '320px', marginBottom: '32px', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 auto 32px auto' }}>
          O seu anúncio foi publicado com sucesso na plataforma nôpin e já está visível para potenciais clientes!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', maxWidth: '280px' }}>
          <button
            onClick={() => onSelectProperty(createdPropertyId)}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontWeight: 700 }}
          >
            Ver o meu Anúncio
          </button>
          <button
            onClick={() => onNavigateTab('home')}
            className="btn btn-outline"
            style={{ width: '100%', height: '48px', fontWeight: 600 }}
          >
            Voltar para Explorar
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ERROR SCREEN (NO CREDITS)
  // =========================================================================
  if (pageState === 'error') {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#ffe4e6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e11d48',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)'
        }}>
          <AlertTriangle size={48} />
        </div>
        <h1 className="title-h1" style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 800, color: '#e11d48' }}>Créditos Insuficientes!</h1>
        <p className="text-muted" style={{ maxWidth: '320px', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 auto 24px auto' }}>
          Não dispõe de créditos Nopin suficientes para activar o plano <strong>{visibility === 'premium' ? 'Premium' : 'Básico'}</strong>.
        </p>
        
        <div style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px',
          width: '100%',
          maxWidth: '280px',
          border: '1px solid var(--color-border)'
        }}>
          <Coins size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Saldo actual: <span style={{ color: 'var(--color-primary)' }}>{user.credits} nopins</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', maxWidth: '280px' }}>
          <button
            onClick={() => {
              setPageState('form');
              onNavigateTab('profile'); // Direct user to profile to buy credits
            }}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontWeight: 700, backgroundColor: '#e11d48', borderColor: '#e11d48' }}
          >
            Recarregar Conta
          </button>
          <button
            onClick={() => {
              setPageState('visibility');
            }}
            className="btn btn-outline"
            style={{ width: '100%', height: '48px', fontWeight: 600 }}
          >
            Escolher Outro Plano
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PAGE STATE: VISIBILITY REVIEW SHEET
  // =========================================================================
  if (pageState === 'visibility') {
    const cost = visibility === 'premium' ? 5 : 1;
    return (
      <div className="list-property-container" style={{ padding: 'var(--space-2) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setPageState('form')}
            className="btn-clean"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="title-h1" style={{ fontSize: '1.4rem', margin: 0 }}>Visibilidade do Anúncio</h1>
        </div>

        {/* Preview Summary Card */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0' }}>
            Resumo da Propriedade
          </h3>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <img
              src={images[0] || fallbackImages[category]}
              alt=""
              style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h4>
              <p className="text-muted" style={{ fontSize: '0.75rem', margin: '3px 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{address}, {city}</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {parseFloat(price).toLocaleString('pt-MZ')} MTn{category === 'arrendar' ? `/${pricePeriod}` : ''}
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'var(--color-border-dark)' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {category === 'terreno' ? 'Terreno' : `${bedrooms} Quartos`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>Seleccionar Plano de Visibilidade:</label>
          
          {/* Basic Option */}
          <div
            onClick={() => setVisibility('basic')}
            style={{
              backgroundColor: visibility === 'basic' ? 'var(--color-primary-light)' : 'var(--color-surface)',
              border: '2.5px solid',
              borderColor: visibility === 'basic' ? 'var(--color-primary)' : 'var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: visibility === 'basic' ? 'var(--color-primary)' : 'var(--color-text)', margin: 0 }}>
                Plano Básico
              </h4>
              <p className="text-muted" style={{ fontSize: '0.75rem', margin: '4px 0 0 0', lineHeight: 1.3, maxWidth: '220px' }}>
                O anúncio é publicado por 1 dia no motor de busca e feed geral.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>1 crédito</div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>Por dia</span>
            </div>
          </div>

          {/* Premium Option */}
          <div
            onClick={() => setVisibility('premium')}
            style={{
              backgroundColor: visibility === 'premium' ? 'var(--color-primary-light)' : 'var(--color-surface)',
              border: '2.5px solid',
              borderColor: visibility === 'premium' ? 'var(--color-primary)' : 'var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: visibility === 'premium' ? 'var(--color-primary)' : 'var(--color-text)', margin: 0 }}>
                Plano Premium
              </h4>
              <p className="text-muted" style={{ fontSize: '0.75rem', margin: '4px 0 0 0', lineHeight: 1.3, maxWidth: '220px' }}>
                Destaque com grande visibilidade no topo de pesquisas, mapa e página inicial.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>5 créditos</div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>Por dia</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="btn btn-primary"
          style={{ width: '100%', height: '52px', fontWeight: 700, fontSize: '0.95rem' }}
        >
          Confirmar e Publicar Anúncio
        </button>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar Publicação"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '5px 0' }}>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
              Deseja activar a visibilidade <strong>{visibility === 'premium' ? 'Premium' : 'Básica'}</strong> para esta propriedade?
            </p>
            
            <div style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Saldo Actual:</span>
                <span style={{ fontWeight: 700 }}>{user.credits} créditos</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Custo do Plano:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>-{cost} créditos</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--color-text)' }}>Saldo Restante:</strong>
                <strong style={{ color: user.credits >= cost ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {user.credits - cost} créditos
                </strong>
              </div>
            </div>

            {user.credits < cost && (
              <div style={{
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: '#ffe4e6',
                color: '#be123c',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <AlertTriangle size={14} />
                <span>Saldo insuficiente. Por favor altere o plano ou recarregue.</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline"
                style={{ flex: 1, height: '44px', fontWeight: 600 }}
              >
                Voltar
              </button>
              <button
                onClick={handlePublishSubmit}
                className="btn btn-primary"
                style={{
                  flex: 2,
                  height: '44px',
                  fontWeight: 700,
                  backgroundColor: user.credits >= cost ? 'var(--color-primary)' : 'var(--color-text-light)',
                  borderColor: user.credits >= cost ? 'var(--color-primary)' : 'var(--color-text-light)',
                  cursor: user.credits >= cost ? 'pointer' : 'not-allowed'
                }}
                disabled={user.credits < cost}
              >
                Sim, Publicar
              </button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }

  // =========================================================================
  // PAGE STATE: FORM (SINGLE SHEET CREATE LISTING-1.jpg)
  // =========================================================================
  return (
    <div className="list-property-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => onNavigateTab('home')}
          className="btn-clean"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Voltar para Explorar"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="title-h1" style={{ fontSize: '1.4rem', margin: 0 }}>Criar Anúncio</h1>
      </div>

      {/* Single Scrollable Form Sheet */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Photos grid upload area */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700 }}>Fotos do Imóvel *</label>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px', marginBottom: '10px' }}>Carregue fotografias de alta qualidade. Pelo menos 1 foto é necessária.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Upload Box */}
            <div style={{
              aspectRatio: '1',
              border: '2px dashed var(--color-border-dark)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'var(--color-bg)',
              position: 'relative'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 20
                }}
              />
              <Camera size={24} className="text-muted" />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>Adicionar</span>
            </div>

            {/* Uploaded Previews */}
            {images.map((img, idx) => (
              <div key={idx} style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)'
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 25
                  }}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
          {errors.images && <span className="form-error-msg" style={{ marginTop: '6px', display: 'block' }}>{errors.images}</span>}
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700 }}>Título do Anúncio *</label>
          <input
            type="text"
            placeholder="Ex. Vivenda T3 moderna Sommerschield"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors(prev => ({ ...prev, title: null }));
            }}
            className="form-input"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-dark)', borderColor: errors.title ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
          />
          {errors.title && <span className="form-error-msg">{errors.title}</span>}
        </div>

        {/* Address */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700 }}>Endereço / Bairro *</label>
          <input
            type="text"
            placeholder="Ex. Sommerschield, Av. Julius Nyerere"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setErrors(prev => ({ ...prev, address: null }));
            }}
            className="form-input"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-dark)', borderColor: errors.address ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
          />
          {errors.address && <span className="form-error-msg">{errors.address}</span>}
        </div>

        {/* Category: Terreno / Arrendar / A Venda buttons */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 700 }}>Categoria *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
            {[
              { id: 'terreno', label: 'Terreno' },
              { id: 'arrendar', label: 'Arrendar' },
              { id: 'venda', label: 'A Venda' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCategory(opt.id)}
                className="btn-clean"
                style={{
                  padding: '12px 0',
                  border: '1.5px solid',
                  borderColor: category === opt.id ? 'var(--color-primary)' : 'var(--color-border-dark)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: category === opt.id ? 'var(--color-primary-light)' : 'white',
                  color: category === opt.id ? 'var(--color-primary)' : 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specifications Section (Quartos, WCs, Estacionamento) */}
        {category !== 'terreno' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Quartos</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="form-input"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
                  min="0"
                />
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Casas de Banho</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="form-input"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
                  min="0"
                />
              </div>
            </div>

            {/* Parking buttons (Sim/Não) */}
            <div className="form-group">
              <label className="form-label">Garagem / Estacionamento</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                {[
                  { id: 'yes', label: 'Sim' },
                  { id: 'no', label: 'Não' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setParking(opt.id)}
                    className="btn-clean"
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      border: '1px solid',
                      borderColor: parking === opt.id ? 'var(--color-primary)' : 'var(--color-border-dark)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: parking === opt.id ? 'var(--color-primary-light)' : 'white',
                      color: parking === opt.id ? 'var(--color-primary)' : 'var(--color-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dimensions/Area details */}
        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">{category === 'terreno' ? 'Área total (m²)' : 'Área do Imóvel (m²)'}</label>
            <input
              type="number"
              placeholder="Ex. 180"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="form-input"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Cidade *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-select"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
            >
              <option value="Maputo">Maputo</option>
              <option value="Matola">Matola</option>
            </select>
          </div>
        </div>

        {/* Pricing details */}
        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Preço (MTn) *</label>
            <input
              type="number"
              placeholder="Ex. 45000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors(prev => ({ ...prev, price: null }));
              }}
              className="form-input"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)', borderColor: errors.price ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
            />
            {errors.price && <span className="form-error-msg">{errors.price}</span>}
          </div>
          
          {category === 'arrendar' && (
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Período</label>
              <select
                value={pricePeriod}
                onChange={(e) => setPricePeriod(e.target.value)}
                className="form-select"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border-dark)' }}
              >
                <option value="mês">mês</option>
                <option value="dia">dia</option>
                <option value="ano">ano</option>
              </select>
            </div>
          )}
        </div>

        {/* Contacts details */}
        <div className="form-group" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Contacto Telefónico *</label>
          <input
            type="text"
            placeholder="+258 84 123 4567"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors(prev => ({ ...prev, phone: null }));
            }}
            className="form-input"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-dark)', borderColor: errors.phone ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
          />
          {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
        </div>

        {/* Description details */}
        <div className="form-group" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Descrição Adicional</label>
          <textarea
            placeholder="Descreva as principais características do imóvel, proximidades, acessos..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border-dark)', height: '100px', resize: 'vertical' }}
          />
        </div>

      </div>

      {/* Continue CTA */}
      <button
        onClick={handleGoToVisibility}
        className="btn btn-primary"
        style={{ width: '100%', height: '52px', fontWeight: 700, fontSize: '0.95rem' }}
      >
        Continuar para Rever
      </button>

    </div>
  );
}
