import React from 'react';
import { Bell, Search, SlidersHorizontal, Home, Building2, Trees, Store, TrendingUp, Star } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function HomeFeed({
  user,
  properties = [],
  favorites = [],
  onToggleFavorite,
  onSelectProperty,
  onNavigateTab,
  onNavigateToNotifications,
  onNavigateToProfile,
  onSetSearchFilter
}) {
  const featuredProperties = properties.filter(p => p.featured);
  const recommendedProperties = properties.filter(p => !p.featured).slice(0, 4);

  const handleCategoryClick = (category) => {
    onSetSearchFilter('category', category);
    onNavigateTab('search');
  };

  const handleFilterClick = () => {
    onNavigateTab('search');
  };

  return (
    <div className="home-feed-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Header Greeting & Actions */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <div>
          <span className="text-muted" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500 }}>Localização Atual</span>
          <h2 className="title-h2" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.1rem' }}>
            Maputo, Moçambique
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onNavigateToNotifications}
            className="btn-clean"
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
            aria-label="Ver Notificações"
          >
            <Bell size={18} className="text-muted" />
            <span style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%'
            }}></span>
          </button>
          <button
            onClick={onNavigateToProfile}
            className="btn-clean"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--color-primary-light-active)',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Ver Perfil"
          >
            <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        </div>
      </header>

      {/* 2. Hero Headline */}
      <section style={{ marginBottom: 'var(--space-3)' }}>
        <h1 className="title-h1" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Encontre o seu <span style={{ color: 'var(--color-primary)' }}>Lar de Sonho</span>
        </h1>
        <p className="text-muted" style={{ marginTop: '2px' }}>Descubra imóveis exclusivos em Maputo e Matola</p>
      </section>

      {/* 3. Global Search & Filters shortcut */}
      <section style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            flex: 1,
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
              placeholder="Pesquise por localização, bairro..."
              onClick={handleFilterClick}
              readOnly
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                outline: 'none',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            />
          </div>
          <button
            onClick={handleFilterClick}
            className="btn"
            style={{
              width: '48px',
              height: '48px',
              padding: 0,
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              color: 'white'
            }}
            aria-label="Filtros avançados"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </section>

      {/* 4. Categories shortcuts strip */}
      <section className="category-strip">
        <button
          onClick={() => handleCategoryClick('house')}
          className="category-card btn-clean"
          style={{ background: 'none', border: 'none' }}
        >
          <div className="category-icon-box"><Home size={22} /></div>
          <span className="category-label">Moradia</span>
        </button>
        <button
          onClick={() => handleCategoryClick('apartment')}
          className="category-card btn-clean"
          style={{ background: 'none', border: 'none' }}
        >
          <div className="category-icon-box"><Building2 size={22} /></div>
          <span className="category-label">Apartamento</span>
        </button>
        <button
          onClick={() => handleCategoryClick('villa')}
          className="category-card btn-clean"
          style={{ background: 'none', border: 'none' }}
        >
          <div className="category-icon-box"><Trees size={22} /></div>
          <span className="category-label">Terreno</span>
        </button>
        <button
          onClick={() => handleCategoryClick('commercial')}
          className="category-card btn-clean"
          style={{ background: 'none', border: 'none' }}
        >
          <div className="category-icon-box"><Store size={22} /></div>
          <span className="category-label">Comercial</span>
        </button>
      </section>

      {/* 5. Featured Carousel section */}
      <section style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <h2 className="title-h2">Em Destaque</h2>
          <button
            onClick={() => {
              onSetSearchFilter('featured', true);
              onNavigateTab('search');
            }}
            className="btn-clean"
            style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Ver todos
          </button>
        </div>
        <div className="horizontal-scroll" style={{ paddingBottom: '10px' }}>
          {featuredProperties.map(p => (
            <div key={p.id} className="horizontal-scroll-item" style={{ width: '280px', flexShrink: 0 }}>
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

      {/* 6. List Property banner card */}
      <section style={{
        backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ flex: 1, paddingRight: '16px' }}>
          <h3 className="title-h3" style={{ color: 'white', marginBottom: '4px' }}>Publique o seu Imóvel</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.4 }}>
            Alcance milhares de compradores e inquilinos em Maputo e Matola sem intermediários.
          </p>
          <button
            onClick={() => onNavigateTab('list-property')}
            className="btn"
            style={{
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              fontSize: '0.8rem',
              padding: '10px 20px',
              border: 'none'
            }}
          >
            Começar Agora
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '70px' }}>
            <TrendingUp size={16} style={{ margin: '0 auto 2px auto', color: 'white' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>2.4k</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>Anúncios</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '70px' }}>
            <Star size={16} style={{ margin: '0 auto 2px auto', color: 'white' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>4.9</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>Avaliação</div>
          </div>
        </div>
      </section>

      {/* 7. Recommended Section */}
      <section style={{ marginBottom: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <h2 className="title-h2">Recomendados para Si</h2>
          <button
            onClick={() => {
              onSetSearchFilter('sort', 'new');
              onNavigateTab('search');
            }}
            className="btn-clean"
            style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Ver todos
          </button>
        </div>
        <div className="grid-container">
          {recommendedProperties.map(p => (
            <div key={p.id} className="col-6" style={{ gridColumn: 'span 6' }}>
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
    </div>
  );
}
