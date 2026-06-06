import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Navegação Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {index > 0 && <ChevronRight size={12} className="text-muted" style={{ opacity: 0.6 }} />}
            
            {isLast ? (
              <span className="breadcrumbs-item active" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="breadcrumbs-item"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
