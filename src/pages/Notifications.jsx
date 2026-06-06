import React from 'react';
import { ArrowLeft, Bell, CheckCircle, MessageSquare, Star, ArrowDownCircle, Info } from 'lucide-react';

export default function Notifications({
  notifications = [],
  onMarkAllRead,
  onBack
}) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'match':
        return <Bell size={18} />;
      case 'message':
        return <MessageSquare size={18} />;
      case 'review':
        return <Star size={18} />;
      case 'price':
        return <ArrowDownCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'match': return 'var(--color-primary-light)';
      case 'message': return 'var(--color-info-light)';
      case 'review': return 'var(--color-warning-light)';
      case 'price': return 'var(--color-success-light)';
      default: return 'var(--color-border)';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'match': return 'var(--color-primary)';
      case 'message': return 'var(--color-info)';
      case 'review': return 'var(--color-warning)';
      case 'price': return 'var(--color-success)';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div className="notifications-page-container" style={{ padding: 'var(--space-2) 0' }}>
      
      {/* 1. Page Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-3)' }}>
        <button
          onClick={onBack}
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
          aria-label="Voltar para página anterior"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="title-h1" style={{ fontSize: '1.4rem', flex: 1 }}>Notificações</h1>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="btn-clean"
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--color-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lidas todas
          </button>
        )}
      </header>

      {/* 2. Notifications List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 ? (
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
              <Bell size={32} />
            </div>
            <h3 className="title-h3" style={{ marginBottom: '8px' }}>Sem Notificações</h3>
            <p className="text-muted" style={{ maxWidth: '280px', fontSize: '0.85rem' }}>
              Não dispõe de alertas ou avisos no momento. Volte a consultar mais tarde.
            </p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: notif.read ? 'var(--color-surface)' : 'rgba(124, 58, 237, 0.04)',
                border: '1px solid',
                borderColor: notif.read ? 'var(--color-border)' : 'var(--color-primary-light-active)',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: notif.read ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {/* Type colored icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: getIconBg(notif.type),
                color: getIconColor(notif.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(notif.type)}
              </div>

              {/* Text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{notif.title}</h4>
                  {!notif.read && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '4px'
                    }}></span>
                  )}
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
                <span className="text-xs" style={{ fontSize: '0.65rem', marginTop: '6px', display: 'block' }}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

    </div>
  );
}
