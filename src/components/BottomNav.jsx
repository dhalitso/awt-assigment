import React from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';

export default function BottomNav({
  currentTab,
  onTabChange,
  unreadNotifications = 0,
  unreadMessages = 0
}) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <button
          onClick={() => onTabChange('home')}
          className={`bottom-nav-item btn-clean ${currentTab === 'home' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ir para Página Inicial"
        >
          <Home size={22} />
          <span className="bottom-nav-label">Início</span>
        </button>

        <button
          onClick={() => onTabChange('search')}
          className={`bottom-nav-item btn-clean ${currentTab === 'search' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Pesquisar Imóveis"
        >
          <Search size={22} />
          <span className="bottom-nav-label">Pesquisar</span>
        </button>

        <button
          onClick={() => onTabChange('list-property')}
          className={`bottom-nav-center-item btn-clean`}
          style={{ border: 'none' }}
          aria-label="Publicar Novo Imóvel"
        >
          <Plus size={24} />
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`bottom-nav-item btn-clean ${currentTab === 'favorites' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Imóveis Salvos"
        >
          <Heart size={22} />
          <span className="bottom-nav-label">Salvos</span>
          {unreadNotifications > 0 && (
            <span className="bottom-nav-badge">{unreadNotifications}</span>
          )}
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`bottom-nav-item btn-clean ${currentTab === 'profile' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Perfil"
        >
          <User size={22} />
          <span className="bottom-nav-label">Perfil</span>
          {unreadMessages > 0 && (
            <span className="bottom-nav-badge" style={{ backgroundColor: 'var(--color-primary)' }}>{unreadMessages}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
