import React from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2, CheckCircle } from 'lucide-react';

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onSelect
}) {
  const formattedPrice = property.price.toLocaleString('pt-MZ') + ' MTn';
  const period = property.pricePeriod ? `/${property.pricePeriod}` : '';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(property.id);
  };

  return (
    <article className="card" onClick={() => onSelect(property.id)} style={{ cursor: 'pointer' }}>
      <div className="card-img-wrapper">
        <img
          src={property.images[0]}
          className="card-img"
          alt={property.title}
          loading="lazy"
        />
        {property.featured && (
          <span className="card-badge">DESTAQUE</span>
        )}
        <button
          onClick={handleFavoriteClick}
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
        >
          <Heart size={18} fill={isFavorite ? "var(--color-danger)" : "none"} />
        </button>
      </div>
      
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="card-price">{formattedPrice}{period}</span>
          {property.agent?.verified && (
            <span className="badge-verified">
              <CheckCircle size={10} fill="currentColor" style={{ color: 'white' }} />
              Verificado
            </span>
          )}
        </div>
        
        <h3 className="card-title">{property.title}</h3>
        
        <div className="card-location">
          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
          <span>{property.location}</span>
        </div>

        <div className="card-specs">
          {property.bedrooms > 0 && (
            <div className="card-spec-item">
              <Bed size={14} />
              <span>{property.bedrooms} Qts</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="card-spec-item">
              <Bath size={14} />
              <span>{property.bathrooms} WC</span>
            </div>
          )}
          <div className="card-spec-item">
            <Maximize2 size={14} />
            <span>{property.area} {property.type === 'villa' ? 'm²' : 'm²'}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
