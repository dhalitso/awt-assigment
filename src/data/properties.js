// Default properties database for Nopin (Maputo/Matola, Mozambique)
export const DEFAULT_PROPERTIES = [
  {
    id: "p1",
    title: "Moradia de Luxo em Sommerschield",
    type: "house",
    listingType: "rent",
    price: 85000,
    pricePeriod: "mês",
    location: "Sommerschield, Maputo",
    city: "Maputo",
    lat: -25.9555,
    lng: 32.6074,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    parking: true,
    status: "available",
    featured: true,
    tag: "Moradia",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"
    ],
    agent: {
      name: "Fátima Machava",
      phone: "+258 84 123 4567",
      email: "fatima.machava@nopin.co.mz",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
    },
    description: "Vende-se ou Arrenda-se Uma super Moradia tipologia 4 Com paredes duplas Construção (anti-sísmica). Excelente localização nobre na Sommerschield, próximo a embaixadas. Dispõe de 4 quartos suítes, duas salas imensas, cozinha moderna equipada, quintal com jardim e garagem fechada. Segurança 24h.",
    amenities: ["Piscina", "Ar Condicionado", "Segurança 24h", "Garagem", "Jardim", "Gerador"]
  },
  {
    id: "p2",
    title: "Apartamento Moderno na Polana",
    type: "apartment",
    listingType: "sale",
    price: 12500000,
    pricePeriod: "",
    location: "Polana Cimento, Maputo",
    city: "Maputo",
    lat: -25.9724,
    lng: 32.5990,
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    parking: true,
    status: "available",
    featured: true,
    tag: "Apartamento",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
    ],
    agent: {
      name: "Carlos Mondlane",
      phone: "+258 82 987 6543",
      email: "carlos.mondlane@nopin.co.mz",
      rating: 4.9,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
    },
    description: "Excelente apartamento T3 na prestigiada zona da Polana, próximo à Av. Julius Nyerere. Totalmente remodelado com materiais importados de alta qualidade. Vista maravilhosa sobre o mar, quartos com roupeiros, cozinha moderna e open-space, prédio seguro com elevadores e estacionamento privado.",
    amenities: ["Vista de Mar", "Elevador", "Varanda", "Cozinha Equipada", "Ar Condicionado", "Portaria"]
  },
  {
    id: "p3",
    title: "Estúdio Moderno no Centro",
    type: "studio",
    listingType: "rent",
    price: 18000,
    pricePeriod: "mês",
    location: "Bairro Central, Maputo",
    city: "Maputo",
    lat: -25.9688,
    lng: 32.5835,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    parking: false,
    status: "available",
    featured: false,
    tag: "Estúdio",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ],
    agent: {
      name: "Amina Sitoe",
      phone: "+258 86 456 7890",
      email: "amina.sitoe@nopin.co.mz",
      rating: 4.5,
      verified: false,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80"
    },
    description: "Lindo estúdio mobiliado no coração da cidade de Maputo. Ideal para estudantes ou jovens profissionais. Totalmente pronto a habitar, com internet rápida instalada, ar condicionado e facilidade de transportes públicos à porta.",
    amenities: ["Mobiliado", "Ar Condicionado", "Internet Fibra", "Termo Acumulador", "Máquina de Lavar"]
  },
  {
    id: "p4",
    title: "Moradia Familiar em Matola",
    type: "house",
    listingType: "sale",
    price: 9500000,
    pricePeriod: "",
    location: "Matola C, Matola",
    city: "Matola",
    lat: -25.9612,
    lng: 32.4678,
    bedrooms: 5,
    bathrooms: 4,
    area: 410,
    parking: true,
    status: "available",
    featured: true,
    tag: "Moradia",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
    ],
    agent: {
      name: "Fátima Machava",
      phone: "+258 84 123 4567",
      email: "fatima.machava@nopin.co.mz",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
    },
    description: "Moradia T5 espaçosa e moderna situada numa zona tranquila e residencial na Matola. Excelente quintal privativo ideal para crianças e reuniões familiares. Inclui uma sala de estar elegante, sala de jantar, cozinha espaçosa e garagem para 3 carros.",
    amenities: ["Quintal Amplo", "Anexo", "Garagem 3 Carros", "Cerca Elétrica", "Furo de Água"]
  },
  {
    id: "p5",
    title: "Terreno na Costa do Sol",
    type: "villa", // land represented as villa in original categories
    listingType: "sale",
    price: 6800000,
    pricePeriod: "",
    location: "Costa do Sol, Maputo",
    city: "Maputo",
    lat: -25.9180,
    lng: 32.6255,
    bedrooms: 0,
    bathrooms: 0,
    area: 1000,
    width: 20,
    length: 50,
    parking: false,
    status: "available",
    featured: true,
    tag: "Terreno",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
    ],
    agent: {
      name: "Carlos Mondlane",
      phone: "+258 82 987 6543",
      email: "carlos.mondlane@nopin.co.mz",
      rating: 4.9,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80"
    },
    description: "Terreno vedado com dimensões de 20m x 50m (1000 metros quadrados) situado na Costa do Sol, zona nobre de expansão de Maputo. Excelente oportunidade para construção de moradia unifamiliar dos seus sonhos, muito próximo à marginal e com fácil acesso a água e luz.",
    amenities: ["Vedado", "Acesso à Marginal", "Rede Elétrica", "Rede de Água"]
  },
  {
    id: "p6",
    title: "Espaço Comercial na Baixa",
    type: "commercial",
    listingType: "rent",
    price: 120000,
    pricePeriod: "mês",
    location: "Baixa da Cidade, Maputo",
    city: "Maputo",
    lat: -25.9740,
    lng: 32.5710,
    bedrooms: 0,
    bathrooms: 2,
    area: 280,
    parking: true,
    status: "available",
    featured: false,
    tag: "Comercial",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
    ],
    agent: {
      name: "Amina Sitoe",
      phone: "+258 86 456 7890",
      email: "amina.sitoe@nopin.co.mz",
      rating: 4.5,
      verified: false,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80"
    },
    description: "Escritório comercial moderno localizado na Baixa de Maputo, centro dos negócios. Ideal para delegações de empresas, bancos ou call-centers. Inclui copa equipada, duas casas de banho comuns, ar condicionado central e 2 lugares de estacionamento privativo.",
    amenities: ["AC Central", "Elevador", "Estacionamento", "Copa", "Divisórias", "Segurança Prédio"]
  },
  {
    id: "p8",
    title: "Apartamento em Sommerschield II",
    type: "apartment",
    listingType: "rent",
    price: 55000,
    pricePeriod: "mês",
    location: "Sommerschield II, Maputo",
    city: "Maputo",
    lat: -25.9450,
    lng: 32.6120,
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    parking: true,
    status: "available",
    featured: false,
    tag: "Apartamento",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80"
    ],
    agent: {
      name: "Fátima Machava",
      phone: "+258 84 123 4567",
      email: "fatima.machava@nopin.co.mz",
      rating: 4.8,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
    },
    description: "Apartamento T2 moderno situado no prestigiado condomínio seguro Sommerschield II. Condomínio com piscina comum, ginásio, segurança armada 24h e gerador geral. Apartamento com suíte, cozinha moderna equipada, varanda com churrasqueira privada e excelente vista panorâmica.",
    amenities: ["Churrasqueira", "Piscina Comum", "Ginásio", "Segurança Armada", "Cozinha Equipada"]
  }
];

export const INITIAL_USER = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  rating: 4.9,
  verified: true,
  credits: 525,
  propertiesCount: 12,
  savedCount: 28,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
  badges: [
    { id: "b1", title: "Registado", icon: "user-check", desc: "Criou conta na plataforma" },
    { id: "b2", title: "Pioneiro", icon: "award", desc: "Um dos primeiros 100 utilizadores" },
    { id: "b3", title: "50 Propriedades", icon: "shield-alert", desc: "Listou ou negociou 50+ imóveis", locked: true }
  ]
};

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Propriedade Correspondente",
    message: "Uma nova moradia T3 em Sommerschield corresponde aos seus filtros salvos.",
    time: "Há 2 minutos",
    type: "match",
    read: false
  },
  {
    id: "n2",
    title: "Nova Mensagem",
    message: "Sarah Johnson enviou-lhe uma mensagem sobre a Moradia de Luxo.",
    time: "Há 1 hora",
    type: "message",
    read: false
  },
  {
    id: "n3",
    title: "Avaliação Recebida",
    message: "Michael Chen deixou uma classificação de 5 estrelas no seu perfil de vendedor.",
    time: "Há 3 horas",
    type: "review",
    read: true
  },
  {
    id: "n4",
    title: "Redução de Preço",
    message: "O preço do Apartamento na Costa do Sol caiu 10% para 6,120,000 MT.",
    time: "Há 1 dia",
    type: "price",
    read: true
  },
  {
    id: "n5",
    title: "Propriedade Aprovada",
    message: "O seu anúncio 'Terreno na Costa do Sol' foi verificado e já está ativo.",
    time: "Há 2 dias",
    type: "system",
    read: true
  }
];

export const DEFAULT_CONVERSATIONS = [
  {
    id: "c1",
    sender: "Fátima Machava",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
    propertyId: "p1",
    propertyTitle: "Moradia de Luxo em Sommerschield",
    propertyPrice: "85,000 MT/mês",
    propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&q=80",
    lastMessage: "O imóvel está disponível para visitas neste fim de semana, a partir das 9h.",
    time: "Há 2 min",
    unread: 2,
    messages: [
      { id: "m1", sender: "user", text: "Olá Fátima, estou interessado na moradia de luxo em Sommerschield. Qual é o melhor preço e quando posso visitar?", time: "Ontem, 16:30" },
      { id: "m2", sender: "agent", text: "Olá! A moradia está em excelente estado. Podemos agendar uma visita. Qual é a sua disponibilidade?", time: "Ontem, 17:00" },
      { id: "m3", sender: "user", text: "Estou livre no sábado de manhã.", time: "Ontem, 18:15" },
      { id: "m4", sender: "agent", text: "Excelente. O imóvel está disponível para visitas neste fim de semana, a partir das 9h. Confirma esse horário?", time: "Há 2 min" }
    ]
  },
  {
    id: "c2",
    sender: "Carlos Mondlane",
    senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    propertyId: "p2",
    propertyTitle: "Apartamento Moderno na Polana",
    propertyPrice: "12,500,000 MT",
    propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80",
    lastMessage: "Posso agendar uma visita guiada amanhã de manhã se desejar.",
    time: "Há 1 hora",
    unread: 0,
    messages: [
      { id: "m5", sender: "user", text: "Olá Carlos, o preço do apartamento na Polana é negociável?", time: "Hoje, 10:00" },
      { id: "m6", sender: "agent", text: "Olá. O proprietário está aberto a propostas razoáveis de pagamento à vista. Posso agendar uma visita guiada amanhã de manhã se desejar.", time: "Há 1 hora" }
    ]
  },
  {
    id: "c3",
    sender: "Amina Sitoe",
    senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    propertyId: "p4",
    propertyTitle: "Moradia Familiar em Matola",
    propertyPrice: "9,500,000 MT",
    propertyImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80",
    lastMessage: "Por favor, informe-me se tiver alguma dúvida sobre a documentação do imóvel.",
    time: "Há 3 horas",
    unread: 1,
    messages: [
      { id: "m7", sender: "agent", text: "Olá Alex, tem interesse em ver os documentos do imóvel de Matola?", time: "Hoje, 14:00" },
      { id: "m8", sender: "user", text: "Sim, gostaria de verificar a certidão de registo predial.", time: "Hoje, 14:15" },
      { id: "m9", sender: "agent", text: "Perfeito, vou digitalizar e enviar. Por favor, informe-me se tiver alguma dúvida sobre a documentação do imóvel.", time: "Há 3 horas" }
    ]
  }
];

// Helper functions for LocalStorage persistence
export const getStoredProperties = () => {
  const data = localStorage.getItem("nopin_properties");
  if (!data) {
    localStorage.setItem("nopin_properties", JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  }
  return JSON.parse(data);
};

export const saveProperty = (property) => {
  const properties = getStoredProperties();
  properties.unshift(property);
  localStorage.setItem("nopin_properties", JSON.stringify(properties));
  return properties;
};

export const getStoredUser = () => {
  const data = localStorage.getItem("nopin_user");
  if (!data) {
    localStorage.setItem("nopin_user", JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }
  return JSON.parse(data);
};

export const updateStoredUser = (updates) => {
  const user = getStoredUser();
  const updatedUser = { ...user, ...updates };
  localStorage.setItem("nopin_user", JSON.stringify(updatedUser));
  return updatedUser;
};

export const getStoredFavorites = () => {
  const data = localStorage.getItem("nopin_favorites");
  if (!data) {
    // Default favorites are p1, p2, p4
    const initialFavs = ["p1", "p2", "p4"];
    localStorage.setItem("nopin_favorites", JSON.stringify(initialFavs));
    return initialFavs;
  }
  return JSON.parse(data);
};

export const toggleFavorite = (id) => {
  const favs = getStoredFavorites();
  const index = favs.indexOf(id);
  if (index === -1) {
    favs.push(id);
  } else {
    favs.splice(index, 1);
  }
  localStorage.setItem("nopin_favorites", JSON.stringify(favs));
  return favs;
};

export const clearAllFavorites = () => {
  localStorage.setItem("nopin_favorites", JSON.stringify([]));
  return [];
};

export const getStoredNotifications = () => {
  const data = localStorage.getItem("nopin_notifications");
  if (!data) {
    localStorage.setItem("nopin_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  return JSON.parse(data);
};

export const markAllNotificationsRead = () => {
  const notifs = getStoredNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem("nopin_notifications", JSON.stringify(notifs));
  return notifs;
};

export const getStoredConversations = () => {
  const data = localStorage.getItem("nopin_conversations");
  if (!data) {
    localStorage.setItem("nopin_conversations", JSON.stringify(DEFAULT_CONVERSATIONS));
    return DEFAULT_CONVERSATIONS;
  }
  return JSON.parse(data);
};

export const addMessageToConversation = (conversationId, messageText, sender = "user") => {
  const convs = getStoredConversations();
  const convIndex = convs.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `m_new_${Date.now()}`,
      sender,
      text: messageText,
      time: `Hoje, ${timeNow}`
    };
    convs[convIndex].messages.push(newMsg);
    convs[convIndex].lastMessage = messageText;
    convs[convIndex].time = "Agora mesmo";
    if (sender !== "user") {
      convs[convIndex].unread += 1;
    }
    localStorage.setItem("nopin_conversations", JSON.stringify(convs));
  }
  return convs;
};
