import React, { useState } from 'react';
import { Camera, Trash2, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Coins } from 'lucide-react';

export default function ListProperty({
  user,
  onUpdateUser,
  onPublishListing,
  onNavigateTab,
  onSelectProperty
}) {
  const [step, setStep] = useState(1); // 1: Details, 2: Photos, 3: Pricing, 4: Review/Visibility

  // Form Fields State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('house'); // house, apartment, villa, studio, commercial
  const [listingFor, setListingFor] = useState('rent'); // rent, sale
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('1');
  const [area, setArea] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Maputo');
  const [country, setCountry] = useState('Moçambique');
  const [description, setDescription] = useState('');
  
  // Step 2: Photos State
  const [images, setImages] = useState([]);
  
  // Step 3: Pricing State
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState('mês');
  const [phone, setPhone] = useState('+258 ');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // Step 4: Visibility State
  const [visibility, setVisibility] = useState('basic'); // basic, premium

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, success, error_no_credits
  const [createdPropertyId, setCreatedPropertyId] = useState(null);

  // Default listing images as fallbacks
  const fallbackImages = {
    house: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    apartment: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    villa: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    studio: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
  };

  const amenitiesList = [
    "Piscina", "Ar Condicionado", "Segurança 24h", "Garagem", "Jardim", 
    "Gerador", "Furo de Água", "Cerca Elétrica", "Vista de Mar", "Mobiliado"
  ];

  // 1. Validation Logic per Step
  const validateStep1 = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'O título é obrigatório.';
    if (!area || parseFloat(area) <= 0) errs.area = 'Forneça uma área válida.';
    if (!address.trim()) errs.address = 'A morada é obrigatória.';
    
    if (propertyType === 'villa') {
      if (!width || parseFloat(width) <= 0) errs.width = 'Largura é obrigatória.';
      if (!length || parseFloat(length) <= 0) errs.length = 'Comprimento é obrigatório.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (images.length === 0) {
      errs.images = 'Adicione pelo menos 1 foto do imóvel.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!price || parseFloat(price) <= 0) errs.price = 'O preço deve ser superior a zero.';
    
    // Validate Mozambican phone format (+258 8X XXXXXXX)
    const phoneClean = phone.replace(/\s+/g, '');
    const phoneRegex = /^\+2588[2-7]\d{7}$/;
    if (!phoneRegex.test(phoneClean)) {
      errs.phone = 'Número inválido. Use o formato: +258 84 123 4567';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 2. Navigation Triggers
  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // 3. Image Upload (Local Base64 Conversion)
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

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
  };

  // 4. Submit & Save
  const handlePublishSubmit = () => {
    // Credit Validation
    const cost = visibility === 'premium' ? 25 : 5; // e.g. 5 credits or 25 credits package
    if (user.credits < cost) {
      setSubmissionStatus('error_no_credits');
      return;
    }

    // Deduct user credits
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
      type: propertyType,
      listingType: listingFor,
      price: parseFloat(price),
      pricePeriod: listingFor === 'rent' ? pricePeriod : '',
      location: `${address}, ${city}`,
      city,
      lat: city === 'Matola' ? -25.9612 + (Math.random() - 0.5) * 0.02 : -25.9555 + (Math.random() - 0.5) * 0.02,
      lng: city === 'Matola' ? 32.4678 + (Math.random() - 0.5) * 0.02 : 32.6074 + (Math.random() - 0.5) * 0.02,
      bedrooms: propertyType !== 'villa' ? parseInt(bedrooms) : 0,
      bathrooms: propertyType !== 'villa' ? parseInt(bathrooms) : 0,
      area: parseFloat(area),
      width: propertyType === 'villa' ? parseFloat(width) : undefined,
      length: propertyType === 'villa' ? parseFloat(length) : undefined,
      parking: propertyType !== 'villa' ? true : false,
      status: "available",
      featured: visibility === 'premium',
      tag: propertyType === 'villa' ? 'Terreno' : propertyType === 'commercial' ? 'Comercial' : propertyType === 'apartment' ? 'Apartamento' : 'Moradia',
      images: images.length > 0 ? images : [fallbackImages[propertyType]],
      agent: {
        name: user.name,
        phone: phone,
        email: user.email,
        rating: user.rating,
        verified: user.verified,
        avatar: user.avatar
      },
      description: description.trim() || 'Sem descrição fornecida.',
      amenities: selectedAmenities
    };

    onPublishListing(newProperty);
    setCreatedPropertyId(newPropertyId);
    setSubmissionStatus('success');
  };

  // 5. Success/Error Screens Renderers
  if (submissionStatus === 'success') {
    return (
      <div style={{ padding: '64px var(--space-2) 0 var(--space-2)', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--color-success-light)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-success)',
          marginBottom: '24px'
        }}>
          <CheckCircle size={48} />
        </div>
        <h1 className="title-h1" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Anúncio Lançado com Sucesso!</h1>
        <p className="text-muted" style={{ maxWidth: '320px', marginBottom: '32px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          A sua propriedade já está visível para milhares de potenciais clientes no feed de exploração e mapa.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', maxWidth: '280px' }}>
          <button
            onClick={() => onSelectProperty(createdPropertyId)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Ver o meu anúncio
          </button>
          <button
            onClick={() => onNavigateTab('home')}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  if (submissionStatus === 'error_no_credits') {
    return (
      <div style={{ padding: '64px var(--space-2) 0 var(--space-2)', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--color-danger-light)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)',
          marginBottom: '24px'
        }}>
          <AlertTriangle size={48} />
        </div>
        <h1 className="title-h1" style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--color-danger)' }}>Créditos Insuficientes</h1>
        <p className="text-muted" style={{ maxWidth: '320px', marginBottom: '16px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Não dispõe de créditos Nopin suficientes para publicar com este plano de visibilidade.
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
          border: '1px solid var(--color-border-dark)'
        }}>
          <Coins size={16} style={{ color: 'var(--color-warning)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Saldo actual: <strong>{user.credits} nopins</strong></span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', maxWidth: '280px' }}>
          <button
            onClick={() => {
              setSubmissionStatus('idle');
              onNavigateTab('profile'); // Navigates to recharge profile section
            }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Recarregar Conta
          </button>
          <button
            onClick={() => {
              setSubmissionStatus('idle');
              setStep(4);
            }}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="list-property-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-3)' }}>
        <button
          onClick={step === 1 ? () => onNavigateTab('home') : handleBack}
          className="btn-clean"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Voltar etapa"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="title-h1" style={{ fontSize: '1.4rem' }}>Listar Propriedade</h1>
      </div>

      {/* 2. Wizard Steps Tracker */}
      <div className="wizard-steps">
        <div className="wizard-steps-line">
          <div className="wizard-steps-line-progress" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        </div>
        {['Detalhes', 'Fotos', 'Preço', 'Rever'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={idx} className={`wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="wizard-step-num">{stepNum}</div>
              <span className="wizard-step-label">{label}</span>
            </div>
          );
        })}
      </div>

      {/* 3. Wizard Steps Forms content */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-3)' }}>
        
        {/* ================= STEP 1: DETAILS ================= */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="title-h2" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Detalhes do Imóvel</h2>
            
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Título do Anúncio *</label>
              <input
                type="text"
                placeholder="Ex. Moradia T4 moderna com piscina"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors(prev => ({ ...prev, title: null }));
                }}
                className="form-input"
                style={{ borderColor: errors.title ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Type selector buttons */}
            <div className="form-group">
              <label className="form-label">Tipo de Imóvel *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
                {[
                  { id: 'house', label: 'Moradia' },
                  { id: 'apartment', label: 'Apartamento' },
                  { id: 'villa', label: 'Terreno' },
                  { id: 'studio', label: 'Estúdio' },
                  { id: 'commercial', label: 'Comercial' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPropertyType(opt.id)}
                    className="btn-clean"
                    style={{
                      padding: '10px 0',
                      border: '1px solid',
                      borderColor: propertyType === opt.id ? 'var(--color-primary)' : 'var(--color-border-dark)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: propertyType === opt.id ? 'var(--color-primary-light)' : 'white',
                      color: propertyType === opt.id ? 'var(--color-primary)' : 'var(--color-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rent/Sale selection */}
            <div className="form-group">
              <label className="form-label">Negócio *</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {['rent', 'sale'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setListingFor(opt)}
                    className="btn-clean"
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      border: '1px solid',
                      borderColor: listingFor === opt ? 'var(--color-primary)' : 'var(--color-border-dark)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: listingFor === opt ? 'var(--color-primary-light)' : 'white',
                      color: listingFor === opt ? 'var(--color-primary)' : 'var(--color-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {opt === 'rent' ? 'Arrendar' : 'Vender'}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Specs */}
            {propertyType === 'villa' ? (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Largura (metros) *</label>
                  <input
                    type="number"
                    placeholder="Ex. 20"
                    value={width}
                    onChange={(e) => {
                      setWidth(e.target.value);
                      setErrors(prev => ({ ...prev, width: null }));
                    }}
                    className="form-input"
                    style={{ borderColor: errors.width ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
                  />
                  {errors.width && <span className="form-error-msg">{errors.width}</span>}
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Comprimento (metros) *</label>
                  <input
                    type="number"
                    placeholder="Ex. 50"
                    value={length}
                    onChange={(e) => {
                      setLength(e.target.value);
                      setErrors(prev => ({ ...prev, length: null }));
                    }}
                    className="form-input"
                    style={{ borderColor: errors.length ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
                  />
                  {errors.length && <span className="form-error-msg">{errors.length}</span>}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Quartos</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="form-input"
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
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Area and Address details */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Área total (m²) *</label>
                <input
                  type="number"
                  placeholder="Ex. 150"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setErrors(prev => ({ ...prev, area: null }));
                  }}
                  className="form-input"
                  style={{ borderColor: errors.area ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
                />
                {errors.area && <span className="form-error-msg">{errors.area}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Cidade *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-select"
                >
                  <option value="Maputo">Maputo</option>
                  <option value="Matola">Matola</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Endereço / Bairro *</label>
              <input
                type="text"
                placeholder="Ex. Sommerschield, Av. Julius Nyerere"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors(prev => ({ ...prev, address: null }));
                }}
                className="form-input"
                style={{ borderColor: errors.address ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
              />
              {errors.address && <span className="form-error-msg">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Descrição adicional</label>
              <textarea
                placeholder="Descreva as principais características do imóvel, proximidades, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 2: PHOTOS ================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="title-h2" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Fotos do Imóvel</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Adicione fotos reais para atrair mais compradores. Carregue pelo menos 1 foto.</p>
            
            {/* Image selection card */}
            <div style={{
              border: '2px dashed var(--color-border-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 20px',
              textAlign: 'center',
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
                  zIndex: 10
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Camera size={40} className="text-muted" />
                <span className="form-label" style={{ color: 'var(--color-primary)' }}>Selecionar Fotos</span>
                <span className="text-xs">Formatos aceites: JPG, PNG.</span>
              </div>
            </div>

            {errors.images && <span className="form-error-msg">{errors.images}</span>}

            {/* Preview grid */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-dark)'
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => removeImage(idx)}
                      className="btn-clean"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 15
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: PRICING & CONTACTS ================= */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="title-h2" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Preço & Contactos</h2>
            
            {/* Price fields */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Preço de Venda / Renda (MTn) *</label>
                <input
                  type="number"
                  placeholder="Ex. 50000"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setErrors(prev => ({ ...prev, price: null }));
                  }}
                  className="form-input"
                  style={{ borderColor: errors.price ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
                />
                {errors.price && <span className="form-error-msg">{errors.price}</span>}
              </div>
              
              {listingFor === 'rent' && (
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Período</label>
                  <select
                    value={pricePeriod}
                    onChange={(e) => setPricePeriod(e.target.value)}
                    className="form-select"
                  >
                    <option value="mês">mês</option>
                    <option value="dia">dia</option>
                    <option value="ano">ano</option>
                  </select>
                </div>
              )}
            </div>

            {/* Contact Phone */}
            <div className="form-group">
              <label className="form-label">Contacto Telefónico *</label>
              <input
                type="text"
                placeholder="+258 84 123 4567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors(prev => ({ ...prev, phone: null }));
                }}
                className="form-input"
                style={{ borderColor: errors.phone ? 'var(--color-danger)' : 'var(--color-border-dark)' }}
              />
              {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
            </div>

            {/* Amenities Checkbox list */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Comodidades do Imóvel</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {amenitiesList.map((amenity, idx) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--color-bg)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isChecked ? 'var(--color-primary-light-active)' : 'var(--color-border)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(amenity)}
                        style={{
                          accentColor: 'var(--color-primary)',
                          width: '16px',
                          height: '16px'
                        }}
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & VISIBILITY ================= */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 className="title-h2" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Rever e Confirmar</h2>

            {/* Mini Summary */}
            <div style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--color-border-dark)',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div><strong>Título:</strong> {title}</div>
              <div><strong>Preço:</strong> {parseFloat(price).toLocaleString('pt-MZ')} MTn{listingFor === 'rent' ? `/${pricePeriod}` : ''}</div>
              <div><strong>Localização:</strong> {address}, {city}</div>
              <div><strong>Tipo:</strong> {propertyType === 'villa' ? 'Terreno' : propertyType === 'apartment' ? 'Apartamento' : 'Moradia'} ({listingFor === 'rent' ? 'Arrendamento' : 'Venda'})</div>
              {propertyType === 'villa' ? (
                <div><strong>Dimensões:</strong> {width}m x {length}m</div>
              ) : (
                <div><strong>Quartos:</strong> {bedrooms} | <strong>Casas de Banho:</strong> {bathrooms}</div>
              )}
            </div>

            {/* Visibility Options */}
            <div>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Plano de Visibilidade</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Basic Plan */}
                <div
                  onClick={() => setVisibility('basic')}
                  style={{
                    border: '2px solid',
                    borderColor: visibility === 'basic' ? 'var(--color-primary)' : 'var(--color-border-dark)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: visibility === 'basic' ? 'var(--color-primary-light)' : 'white',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: visibility === 'basic' ? 'var(--color-primary)' : 'var(--color-text)' }}>Plano Básico</h4>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>O seu anúncio fica visível no motor de busca padrão.</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>5 nopins</div>
                    <div className="text-xs" style={{ fontSize: '0.65rem' }}>Dedução única</div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div
                  onClick={() => setVisibility('premium')}
                  style={{
                    border: '2px solid',
                    borderColor: visibility === 'premium' ? 'var(--color-primary)' : 'var(--color-border-dark)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: visibility === 'premium' ? 'var(--color-primary-light)' : 'white',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: visibility === 'premium' ? 'var(--color-primary)' : 'var(--color-text)' }}>Plano Premium (Recomendado)</h4>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>Destaque no topo dos resultados de busca e página inicial.</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>25 nopins</div>
                    <div className="text-xs" style={{ fontSize: '0.65rem' }}>Dedução única</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Credit Warning Balance */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-dark)',
              fontSize: '0.85rem'
            }}>
              <span>Os seus créditos:</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{user.credits} nopins</span>
            </div>
          </div>
        )}

      </div>

      {/* 4. Wizard Action CTAs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {step > 1 && (
          <button
            onClick={handleBack}
            className="btn btn-outline"
            style={{ flex: 1, height: '48px' }}
          >
            Anterior
          </button>
        )}
        
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{ flex: 2, height: '48px' }}
          >
            Continuar
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handlePublishSubmit}
            className="btn btn-primary"
            style={{
              flex: 2,
              height: '48px',
              backgroundColor: user.credits >= (visibility === 'premium' ? 25 : 5) ? 'var(--color-primary)' : 'var(--color-text-light)',
              cursor: 'pointer'
            }}
          >
            Confirmar e Publicar
          </button>
        )}
      </div>
    </div>
  );
}
