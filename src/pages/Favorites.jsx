import React, { useState } from 'react';
import { Heart, Trash2, Home, Building2, Trees, Store } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

export default function Favorites({
  properties = [],
  favorites = [],
  onToggleFavorite,
  onClearAllFavorites,
  onSelectProperty,
  onNavigateTab,
  userProperties = [],
  onUpdatePropertyStatus
}) {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'my_listings'
  
  // Filter only saved favorites
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="favorites-page-container" style={{ padding: 'var(--space-2) 0' }}>
      
      {/* 1. Header Segment Tabs (Slide 26) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="title-h1" style={{ fontSize: '1.5rem' }}>Os meus Imóveis</h1>
          {activeTab === 'saved' && favoriteProperties.length > 0 && (
            <button
              onClick={onClearAllFavorites}
              className="btn btn-clean"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-danger)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              aria-label="Limpar todos os favoritos"
            >
              <Trash2 size={14} />
              Limpar Tudo
            </button>
          )}
        </div>
        
        {/* Toggle Saved vs. My Listings */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-border)',
          padding: '4px',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            onClick={() => setActiveTab('saved')}
            className="btn-clean"
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'saved' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'saved' ? 'white' : 'var(--color-text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Imóveis Salvos ({favoriteProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('my_listings')}
            className="btn-clean"
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'my_listings' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'my_listings' ? 'white' : 'var(--color-text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Anunciados por Mim ({userProperties.length})
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: SAVED PROPERTIES */}
      {activeTab === 'saved' && (
        <section>
          {favoriteProperties.length === 0 ? (
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
                backgroundColor: 'var(--color-danger-light)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-danger)',
                marginBottom: 'var(--space-2)'
              }}>
                <Heart size={32} fill="currentColor" />
              </div>
              <h3 className="title-h3" style={{ marginBottom: '8px' }}>Lista Vazia</h3>
              <p className="text-muted" style={{ maxWidth: '280px', fontSize: '0.85rem', lineHeight: 1.4 }}>
                Ainda não guardou nenhum imóvel como favorito. Clique no ícone do coração em qualquer anúncio.
              </p>
            </div>
          ) : (
            <div className="grid-container">
              {favoriteProperties.map(p => (
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
          )}
        </section>
      )}

      {/* 3. TAB CONTENT: MY LISTED PROPERTIES */}
      {activeTab === 'my_listings' && (
        <section>
          {userProperties.length === 0 ? (
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
                <Home size={32} />
              </div>
              <h3 className="title-h3" style={{ marginBottom: '8px' }}>Sem Anúncios Criados</h3>
              <p className="text-muted" style={{ maxWidth: '280px', marginBottom: '24px', fontSize: '0.85rem', lineHeight: 1.4 }}>
                Ainda não listou nenhuma propriedade na plataforma. Comece a publicar clicando no botão central (+).
              </p>
              <button onClick={() => onNavigateTab('list-property')} className="btn btn-primary">
                Listar Meu Imóvel
              </button>
            </div>
          ) : (
            <div className="grid-container">
              {userProperties.map(p => (
                <div key={p.id} className="col-6" style={{ gridColumn: 'span 6', position: 'relative' }}>
                  
                  {/* Status Overlay Tag */}
                  {p.status === 'sold' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(1px)',
                      borderRadius: 'var(--radius-lg)',
                      zIndex: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}>
                      <span className="card-badge" style={{ backgroundColor: 'var(--color-danger)', fontSize: '0.9rem', padding: '6px 16px', position: 'static' }}>
                        VENDIDA / ALUGADA
                      </span>
                    </div>
                  )}

                  <PropertyCard
                    property={p}
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={onToggleFavorite}
                    onSelect={onSelectProperty}
                  />
                  
                  {/* Property Admin Options Panel */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px 12px 12px 12px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderTop: 'none',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    marginTop: '-16px',
                    position: 'relative',
                    zIndex: 25
                  }}>
                    <button
                      onClick={() => onUpdatePropertyStatus(p.id, p.status === 'sold' ? 'available' : 'sold')}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        fontSize: '0.7rem',
                        height: '32px',
                        backgroundColor: p.status === 'sold' ? 'var(--color-border)' : 'var(--color-primary-light)',
                        color: p.status === 'sold' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                        border: 'none'
                      }}
                    >
                      {p.status === 'sold' ? 'Reativar Anúncio' : 'Marcar como Vendido'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
