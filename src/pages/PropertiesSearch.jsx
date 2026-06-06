import React, { useState, useEffect } from 'react';
import { Search, Map, List, SlidersHorizontal, Check, X, MapPin } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import MapComponent from '../components/MapComponent';

export default function PropertiesSearch({
  properties = [],
  favorites = [],
  onToggleFavorite,
  onSelectProperty,
  initialFilters = {},
  onClearInitialFilters
}) {
  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [listingType, setListingType] = useState('all'); // all, rent, sale
  const [category, setCategory] = useState('all'); // all, house, apartment, villa, commercial
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaMin, setAreaMin] = useState('');
  
  // UI Display States
  const [viewMode, setViewMode] = useState('list'); // list, map
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(properties);

  // Apply initial filters passed from Home shortcuts
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      if (initialFilters.category) setCategory(initialFilters.category);
      if (initialFilters.featured) {
        // Handle sorting/filter for featured
      }
      if (initialFilters.sort === 'new') {
        // Handle sort
      }
      onClearInitialFilters();
    }
  }, [initialFilters]);

  // 2. Perform Dynamic Filtering in Real-time
  useEffect(() => {
    let result = [...properties];

    // Text Search Match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Buy / Rent Toggle
    if (listingType !== 'all') {
      result = result.filter(p => p.listingType === listingType);
    }

    // Category Match
    if (category !== 'all') {
      result = result.filter(p => p.type === category);
    }

    // Price Bounds
    if (priceMin) {
      result = result.filter(p => p.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      result = result.filter(p => p.price <= parseFloat(priceMax));
    }

    // Spec Bounds
    if (bedrooms) {
      result = result.filter(p => p.bedrooms >= parseInt(bedrooms));
    }
    if (bathrooms) {
      result = result.filter(p => p.bathrooms >= parseInt(bathrooms));
    }
    if (areaMin) {
      result = result.filter(p => p.area >= parseInt(areaMin));
    }

    setFilteredProperties(result);
  }, [properties, searchQuery, listingType, category, priceMin, priceMax, bedrooms, bathrooms, areaMin]);

  const handleClearFilters = () => {
    setCategory('all');
    setPriceMin('');
    setPriceMax('');
    setBedrooms('');
    setBathrooms('');
    setAreaMin('');
    setSearchQuery('');
  };

  return (
    <div className="search-page-container" style={{ padding: 'var(--space-2) 0' }}>
      {/* 1. Page Header & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <h1 className="title-h1" style={{ fontSize: '1.5rem' }}>Explorar Imóveis</h1>
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-primary-light)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            onClick={() => setViewMode('list')}
            className={`btn-clean`}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'list' ? 'white' : 'var(--color-primary)'
            }}
            aria-label="Ver em lista"
          >
            <List size={14} />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn-clean`}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : 'transparent',
              color: viewMode === 'map' ? 'white' : 'var(--color-primary)'
            }}
            aria-label="Ver no mapa"
          >
            <Map size={14} />
            <span>Mapa</span>
          </button>
        </div>
      </div>

      {/* 2. Buy/Rent Segment bar & Search input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-3)' }}>
        {/* Toggle Buy/Rent */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-border)',
          padding: '4px',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            onClick={() => setListingType('all')}
            className="btn-clean"
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: listingType === 'all' ? 'var(--color-primary)' : 'transparent',
              color: listingType === 'all' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            Todos
          </button>
          <button
            onClick={() => setListingType('sale')}
            className="btn-clean"
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: listingType === 'sale' ? 'var(--color-primary)' : 'transparent',
              color: listingType === 'sale' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            Comprar
          </button>
          <button
            onClick={() => setListingType('rent')}
            className="btn-clean"
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: listingType === 'rent' ? 'var(--color-primary)' : 'transparent',
              color: listingType === 'rent' ? 'white' : 'var(--color-text-muted)'
            }}
          >
            Alugar
          </button>
        </div>

        {/* Input & Filters Trigger */}
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
              placeholder="Pesquisar por bairro, morada..."
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
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-clean" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={16} className="text-muted" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFiltersDrawer(true)}
            className="btn"
            style={{
              width: '48px',
              height: '48px',
              padding: 0,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)'
            }}
            aria-label="Filtros avançados"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* 3. Main Body: List vs. Map View */}
      {viewMode === 'map' ? (
        <section style={{ height: 'calc(100vh - 280px)', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <MapComponent
            properties={filteredProperties}
            onSelectProperty={onSelectProperty}
          />
        </section>
      ) : (
        <section>
          {filteredProperties.length === 0 ? (
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
                <Search size={32} />
              </div>
              <h3 className="title-h3" style={{ marginBottom: '8px' }}>Nenhum Imóvel Encontrado</h3>
              <p className="text-muted" style={{ maxWidth: '280px', marginBottom: '24px', fontSize: '0.85rem' }}>
                Tente ajustar os seus filtros de pesquisa para obter resultados correspondentes.
              </p>
              <button onClick={handleClearFilters} className="btn btn-secondary">
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid-container">
              {filteredProperties.map(p => (
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

      {/* 4. Advanced Filters Sheet Modal (Progressive Disclosure) */}
      {showFiltersDrawer && (
        <div className="modal-overlay" onClick={() => setShowFiltersDrawer(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" onClick={() => setShowFiltersDrawer(false)}></div>
            
            {/* Sheet Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="title-h2" style={{ fontSize: '1.2rem' }}>Filtros Avançados</h2>
              <button
                onClick={handleClearFilters}
                className="btn-clean"
                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Limpar Tudo
              </button>
            </div>

            {/* Sheet Scrollable Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Category selector */}
              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Tipo de Imóvel</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['all', 'house', 'apartment', 'villa', 'commercial'].map(cat => {
                    const labels = { all: 'Todos', house: 'Moradia', apartment: 'Apto', villa: 'Terreno', commercial: 'Comercial' };
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="btn-clean"
                        style={{
                          padding: '10px 0',
                          border: '1px solid',
                          borderColor: category === cat ? 'var(--color-primary)' : 'var(--color-border-dark)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: category === cat ? 'var(--color-primary-light)' : 'white',
                          color: category === cat ? 'var(--color-primary)' : 'var(--color-text)'
                        }}
                      >
                        {labels[cat]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="form-label">Faixa de Preço (MZN)</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Specs Counts (Bedrooms/Bathrooms) */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Quartos mínimo</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="form-select"
                    style={{ marginTop: '6px' }}
                  >
                    <option value="">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Casas de Banho</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="form-select"
                    style={{ marginTop: '6px' }}
                  >
                    <option value="">Qualquer</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>

              {/* Size Area */}
              <div>
                <label className="form-label">Área Mínima (m²)</label>
                <input
                  type="number"
                  placeholder="Ex. 100"
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                  className="form-input"
                  style={{ marginTop: '6px' }}
                />
              </div>

            </div>

            {/* Sheet Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <button
                onClick={() => setShowFiltersDrawer(false)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px' }}
              >
                Ver {filteredProperties.length} Imóveis
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
