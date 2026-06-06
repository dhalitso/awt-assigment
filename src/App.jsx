import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomeFeed from './pages/HomeFeed';
import PropertiesSearch from './pages/PropertiesSearch';
import PropertyDetail from './pages/PropertyDetail';
import ListProperty from './pages/ListProperty';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Onboarding from './pages/Onboarding';

import {
  getStoredProperties,
  saveProperty,
  getStoredUser,
  updateStoredUser,
  getStoredFavorites,
  toggleFavorite,
  clearAllFavorites,
  getStoredNotifications,
  markAllNotificationsRead,
  getStoredConversations,
  addMessageToConversation
} from './data/properties';

export default function App() {
  // 1. Navigation & Flow State Machine
  const [isOnboarded, setIsOnboarded] = useState(
    localStorage.getItem("nopin_onboarded") === "true"
  );
  const [currentTab, setCurrentTab] = useState('home'); // home, search, list-property, favorites, profile, messages
  const [currentPage, setCurrentPage] = useState('feed'); // feed, detail, notifications, messages
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  
  // Navigation History Stack (for consistent back button behavior)
  const [navHistory, setNavHistory] = useState([]);

  // 2. Global Sync States
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Cross-page filter parameters
  const [searchFilters, setSearchFilters] = useState({});

  // 3. Initial Load from LocalStorage
  useEffect(() => {
    setProperties(getStoredProperties());
    setUser(getStoredUser());
    setFavorites(getStoredFavorites());
    setNotifications(getStoredNotifications());
    setConversations(getStoredConversations());
  }, []);

  // 4. Navigation Helper with History Push
  const navigateTo = (tab, page, propId = null, extraParams = null) => {
    // Record current state in history before moving
    setNavHistory(prev => [...prev, { tab: currentTab, page: currentPage, propId: selectedPropertyId }]);
    
    if (tab) setCurrentTab(tab);
    if (page) setCurrentPage(page);
    if (propId !== undefined) setSelectedPropertyId(propId);
    if (extraParams) {
      if (extraParams.conversationId) setActiveConversationId(extraParams.conversationId);
    }
  };

  const handleBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(prevHistory => prevHistory.slice(0, -1));
      
      setCurrentTab(prev.tab);
      setCurrentPage(prev.page);
      setSelectedPropertyId(prev.propId);
    } else {
      // Fallback if history is empty
      setCurrentTab('home');
      setCurrentPage('feed');
      setSelectedPropertyId(null);
    }
  };

  const handleTabChange = (tab) => {
    // Clear history stack when changing main tabs to keep it clean
    setNavHistory([]);
    setCurrentTab(tab);
    setCurrentPage('feed');
    setSelectedPropertyId(null);
  };

  // 5. State Mutation Helpers (mutates LocalStorage and updates react state)
  const handleToggleFavorite = (id) => {
    const updatedFavs = toggleFavorite(id);
    setFavorites(updatedFavs);
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Tem a certeza que deseja limpar todos os seus imóveis salvos?')) {
      const updatedFavs = clearAllFavorites();
      setFavorites(updatedFavs);
    }
  };

  const handlePublishListing = (newProperty) => {
    const updatedProps = saveProperty(newProperty);
    setProperties(updatedProps);
  };

  const handleUpdateUser = (updates) => {
    const updatedUser = updateStoredUser(updates);
    setUser(updatedUser);
  };

  const handleMarkAllNotificationsRead = () => {
    const updatedNotifs = markAllNotificationsRead();
    setNotifications(updatedNotifs);
  };

  const handleSendMessage = (convId, text, sender) => {
    const updatedConvs = addMessageToConversation(convId, text, sender);
    setConversations(updatedConvs);
  };

  const handleStartChatFromProperty = (property) => {
    // Check if conversation already exists for this property
    let existingConv = conversations.find(c => c.propertyId === property.id);
    
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      navigateTo('messages', 'feed', null, { conversationId: existingConv.id });
    } else {
      // Create a new mock conversation
      const newConvId = `c_new_${Date.now()}`;
      const newConv = {
        id: newConvId,
        sender: property.agent.name,
        senderAvatar: property.agent.avatar,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: `${property.price.toLocaleString('pt-MZ')} MTn${property.pricePeriod ? `/${property.pricePeriod}` : ''}`,
        propertyImage: property.images[0],
        lastMessage: "Olá! Como posso ajudar?",
        time: "Agora mesmo",
        unread: 0,
        messages: [
          { id: "m_init", sender: "agent", text: `Olá! Vi que está interessado no anúncio: "${property.title}". Como posso ajudar?`, time: "Agora" }
        ]
      };

      const updatedConvs = [newConv, ...conversations];
      localStorage.setItem("nopin_conversations", JSON.stringify(updatedConvs));
      setConversations(updatedConvs);
      setActiveConversationId(newConvId);
      navigateTo('messages', 'feed', null, { conversationId: newConvId });
    }
  };

  const handleUpdatePropertyStatus = (id, newStatus) => {
    const updatedProps = properties.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    localStorage.setItem("nopin_properties", JSON.stringify(updatedProps));
    setProperties(updatedProps);
  };

  const handleSetSearchFilter = (key, value) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearSearchFilters = () => {
    setSearchFilters({});
  };

  const handleSignOut = () => {
    if (window.confirm('Tem a certeza que deseja terminar sessão?')) {
      // Clear data and refresh
      localStorage.clear();
      window.location.reload();
    }
  };

  // User-created properties selector
  const userProperties = properties.filter(p => p.agent?.email === user.email);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unread, 0);

  // 6. Router Renderer
  const renderPage = () => {
    if (currentPage === 'detail' && selectedPropertyId) {
      return (
        <PropertyDetail
          propertyId={selectedPropertyId}
          properties={properties}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onBack={handleBack}
          onNavigateTab={handleTabChange}
          onStartChat={handleStartChatFromProperty}
          onSelectProperty={(id) => navigateTo(null, 'detail', id)}
        />
      );
    }

    if (currentPage === 'notifications') {
      return (
        <Notifications
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onBack={handleBack}
        />
      );
    }

    // Tab Router
    switch (currentTab) {
      case 'home':
        return (
          <HomeFeed
            user={user}
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={(id) => navigateTo(null, 'detail', id)}
            onNavigateTab={handleTabChange}
            onNavigateToNotifications={() => navigateTo(null, 'notifications')}
            onNavigateToProfile={() => handleTabChange('profile')}
            onSetSearchFilter={handleSetSearchFilter}
          />
        );
      case 'search':
        return (
          <PropertiesSearch
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={(id) => navigateTo(null, 'detail', id)}
            initialFilters={searchFilters}
            onClearInitialFilters={handleClearSearchFilters}
          />
        );
      case 'messages':
        return (
          <Messages
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onBack={() => handleTabChange('home')}
            activeConversationId={activeConversationId}
            onSetActiveConversation={setActiveConversationId}
          />
        );
      case 'list-property':
        return (
          <ListProperty
            user={user}
            onUpdateUser={handleUpdateUser}
            onPublishListing={handlePublishListing}
            onNavigateTab={handleTabChange}
            onSelectProperty={(id) => navigateTo(null, 'detail', id)}
          />
        );
      case 'favorites':
        return (
          <Favorites
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onClearAllFavorites={handleClearAllFavorites}
            onSelectProperty={(id) => navigateTo(null, 'detail', id)}
            onNavigateTab={handleTabChange}
            userProperties={userProperties}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            onUpdateUser={handleUpdateUser}
            onNavigateTab={handleTabChange}
            onSignOut={handleSignOut}
            userProperties={userProperties}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
          />
        );
      default:
        return <div>Tab não encontrada.</div>;
    }
  };

  if (!isOnboarded) {
    return (
      <Onboarding
        onComplete={(userData) => {
          localStorage.setItem("nopin_onboarded", "true");
          localStorage.setItem("nopin_user", JSON.stringify(userData));
          setUser(userData);
          setIsOnboarded(true);
          setCurrentTab('home');
          setCurrentPage('feed');
        }}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <main className="main-content">
        {user.name ? renderPage() : (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 className="title-h2">A carregar aplicação...</h2>
          </div>
        )}
      </main>

      {/* Persistent Mobile-First Bottom Nav Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        unreadNotifications={unreadNotificationsCount}
        unreadMessages={unreadMessagesCount}
      />
    </div>
  );
}
