import React, { useState, useEffect } from 'react';
import { Heart, Share2, MapPin, Bed, Bath, Maximize2, Phone, MessageSquare, ArrowLeft, CheckCircle, Check } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import MapComponent from '../components/MapComponent';
import PropertyCard from '../components/PropertyCard';

export default function PropertyDetail({
  propertyId,
  properties = [],
  favorites = [],
  onToggleFavorite,
  onBack,
  onNavigateTab,
  onStartChat,
  onSelectProperty
}) {
  const property = properties.find(p => p.id === propertyId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);

  // Scroll to top when property changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
  }, [propertyId]);

  if (!property) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <h3 className="title-h3">Propriedade não encontrada.</h3>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '16px' }}>Voltar</button>
      </div>
    );
  }

  const isFavorite = favorites.includes(property.id);
  const formattedPrice = property.price.toLocaleString('pt-MZ') + ' MTn';
  const period = property.pricePeriod ? `/${property.pricePeriod}` : '';

  // Filter similar properties (same category, excluding current one)
  const similarProperties = properties
    .filter(p => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel: ${property.title} em ${property.location}`,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const breadcrumbItems = [
    { label: 'Início', onClick: () => onNavigateTab('home') },
    { label: property.listingType === 'rent' ? 'Alugar' : 'Comprar', onClick: () => onNavigateTab('search') },
    { label: property.title }
  ];

  return (
    <div className="property-detail-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
        <button
          onClick={onBack}
          className="btn-clean"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Voltar para página anterior"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleShareClick}
            className="btn-clean"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
            aria-label="Partilhar imóvel"
          >
            <Share2 size={18} className="text-muted" />
          </button>
          <button
            onClick={() => onToggleFavorite(property.id)}
            className="btn-clean"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              color: isFavorite ? 'var(--color-danger)' : 'var(--color-text-muted)'
            }}
            aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart size={18} fill={isFavorite ? "var(--color-danger)" : "none"} />
          </button>
        </div>
      </div>

      {/* 2. Breadcrumbs Nav */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 3. Image Gallery */}
      <section style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{
          width: '100%',
          aspectRatio: '16/10',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}>
          <img
            src={property.images[activeImageIndex]}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {property.listingType && (
            <span className="card-badge" style={{ top: '16px', left: '16px', background: 'var(--color-primary-active)' }}>
              {property.listingType === 'rent' ? 'ARRENDAR' : 'COMPRAR'}
            </span>
          )}
        </div>

        {/* Thumbnails strip */}
        {property.images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className="btn-clean"
                style={{
                  width: '64px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  padding: 0,
                  cursor: 'pointer',
                  border: activeImageIndex === idx ? '2px solid var(--color-primary)' : '2px solid transparent',
                  opacity: activeImageIndex === idx ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. Details Container (Grid layout for Desktop, Stack for Mobile) */}
      <div className="grid-container">
        
        {/* Left Side: Property details */}
        <div className="col-8">
          
          {/* Price and Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-2)' }}>
            <span className="title-display" style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 800 }}>
              {formattedPrice}{period}
            </span>
            <h1 className="title-h1" style={{ fontSize: '1.4rem', lineHeight: 1.3 }}>{property.title}</h1>
            <div className="card-location" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Core specs strip */}
          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-3)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {property.bedrooms > 0 && (
              <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Bed size={20} className="text-muted" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.bedrooms} Quartos</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Bath size={20} className="text-muted" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.bathrooms} Banheiros</span>
              </div>
            )}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={20} className="text-muted" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.area} m²</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <h3 className="title-h3" style={{ marginBottom: '8px' }}>Descrição</h3>
            <p className="text-body" style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 className="title-h3" style={{ marginBottom: '12px' }}>Comodidades</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {property.amenities?.map((amenity, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border-dark)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={12} style={{ color: 'var(--color-success)' }} />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Map Location */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 className="title-h3" style={{ marginBottom: '12px' }}>Localização</h3>
            <div style={{ height: '220px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <MapComponent
                properties={[property]}
                center={[property.lat, property.lng]}
                zoom={14}
                selectedPropertyId={property.id}
                onSelectProperty={() => {}}
              />
            </div>
          </div>

        </div>

        {/* Right Side: Agent Card (Floating style for desktop) */}
        <div className="col-4">
          <div style={{
            position: 'sticky',
            top: '24px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 className="title-h3" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              Anunciante
            </h3>
            
            {/* Agent profile info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {property.agent.name}
                  {property.agent.verified && (
                    <span className="badge-verified" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>
                      Vendedor Fiel
                    </span>
                  )}
                </h4>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>{property.agent.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-warning)', fontWeight: 600, marginTop: '2px' }}>
                  ★ {property.agent.rating}
                </div>
              </div>
            </div>

            {/* Quick Contact buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => onStartChat(property)}
                className="btn btn-primary"
                style={{ width: '100%', height: '48px' }}
              >
                <MessageSquare size={16} />
                Enviar Mensagem
              </button>
              <a
                href={`tel:${property.agent.phone}`}
                className="btn btn-outline"
                style={{ width: '100%', height: '48px', textDecoration: 'none' }}
              >
                <Phone size={16} />
                Ligar para {property.agent.phone}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Similar listings */}
      {similarProperties.length > 0 && (
        <section style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <h2 className="title-h2" style={{ marginBottom: '16px' }}>Imóveis Semelhantes</h2>
          <div className="grid-container">
            {similarProperties.map(p => (
              <div key={p.id} className="col-4" style={{ gridColumn: 'span 4' }}>
                <PropertyCard
                  property={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectProperty}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Share Toast Notification */}
      {showShareToast && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--color-text)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 3000,
          animation: 'slideUp 0.2s ease-out'
        }}>
          <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
          Link copiado para a área de transferência!
        </div>
      )}
    </div>
  );
}
