import React from 'react';
import { Home, Search, Mail, Heart, User } from 'lucide-react';

export default function BottomNav({
  currentTab,
  onTabChange,
  unreadNotifications = 0,
  unreadMessages = 0
}) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {/* Tab 1: Explorar (Search) */}
        <button
          onClick={() => onTabChange('search')}
          className={`bottom-nav-item btn-clean ${currentTab === 'search' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ir para Explorar Imóveis"
        >
          <Search size={22} />
          <span className="bottom-nav-label">Explorar</span>
        </button>

        {/* Tab 2: Mensagem (Chats) */}
        <button
          onClick={() => onTabChange('messages')}
          className={`bottom-nav-item btn-clean ${currentTab === 'messages' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Mensagens"
        >
          <Mail size={22} />
          <span className="bottom-nav-label">Mensagem</span>
          {unreadMessages > 0 && (
            <span className="bottom-nav-badge" style={{ backgroundColor: 'var(--color-primary)' }}>{unreadMessages}</span>
          )}
        </button>

        {/* Tab 3: Ofertas (Home Feed) */}
        <button
          onClick={() => onTabChange('home')}
          className={`bottom-nav-item btn-clean ${currentTab === 'home' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Ofertas"
        >
          <Home size={22} />
          <span className="bottom-nav-label">Ofertas</span>
        </button>

        {/* Tab 4: Favoritos (Saved Favorites) */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`bottom-nav-item btn-clean ${currentTab === 'favorites' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Favoritos"
        >
          <Heart size={22} />
          <span className="bottom-nav-label">Favoritos</span>
        </button>

        {/* Tab 5: Meu Perfil (Profile & Verification) */}
        <button
          onClick={() => onTabChange('profile')}
          className={`bottom-nav-item btn-clean ${currentTab === 'profile' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none' }}
          aria-label="Ver Meu Perfil"
        >
          <User size={22} />
          <span className="bottom-nav-label">Meu Perfil</span>
          {unreadNotifications > 0 && (
            <span className="bottom-nav-badge">{unreadNotifications}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
