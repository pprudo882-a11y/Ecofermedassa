const MAKTUB_CONFIG = {
  name: "MAKTUB",

  contact: {
    phone: "",
    whatsapp: "2290129412340", // À VÉRIFIER : chiffres seulement, avec l'indicatif 229
    email: "",
    address: ""
  },

  modules: {
    hebergement: true,
    galerie: true,
    restaurant: true,
    piscine: false,
    experiences: true,
    evenements: true
  },




rooms: [
  {
    id: 1,
    name: "Chambre Standard 1",
    category: "Standard",
    price: 25000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Une chambre accueillante et confortable, idéale pour un séjour reposant en couple ou en solo.",

    features: [
      "Lit double",
      "Salle de bain privée",
      "Climatisation",
      "Télévision"
    ],

    images: [
      "images/rooms/standard/chambre-standard1.jpg"
    ],

    available: true
  },


    {
    id: 2,
    name: "Chambre Standard 2",
    category: "Standard",
    price: 30000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Une chambre spacieuse offrant un cadre agréable pour profiter pleinement de votre séjour.",

    features: [
      "Grand lit double",
      "Salle de bain privée",
      "Climatisation",
      "Télévision",
      "Petit espace de détente"
    ],

    images: [
      "images/rooms/chambre-standard.jpg"
    ],

    available: true
  },  {
    id: 3,
    name: "Chambre Standard 3",
    category: "Standard",
    price: 20000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Une chambre spacieuse offrant un cadre agréable pour profiter pleinement de votre séjour.",

    features: [
      "Grand lit double",
      "Salle de bain privée",
      "Climatisation",
      "Télévision",
      "Petit espace de détente"
    ],

    images: [
      "images/rooms/chambre-standard.jpg"
    ],

    available: true
  },

  {
    id: 4,
    name: "Chambre Premium 1",
    category: "Premium",
    price: 40000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Un espace élégant associant confort et raffinement pour une expérience de séjour privilégiée.",

    features: [
      "Grand lit double",
      "Salle de bain privée",
      "Climatisation",
      "Télévision",
      "Balcon"
    ],

    images: [
      "images/rooms/premium/chambre-premium-1.jpg"
    ],

    available: true
  },
    {
    id: 5,
    name: "Chambre Premium 2",
    category: "Premium",
    price: 50000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Un espace élégant associant confort et raffinement pour une expérience de séjour privilégiée.",

    features: [
      "Grand lit double",
      "Salle de bain privée",
      "Climatisation",
      "Télévision",
      "Balcon"
    ],

    images: [
      "images/rooms/premium/chambre-premium-1.jpg"
    ],

    available: true
  },

  {
    id: 6,
    name: "Chambre Premium 3",
    category: "Premium",
    price: 55000,
    currency: "FCFA",
    priceUnit: "nuit",
    capacity: 2,

    description: "Une chambre premium pensée pour offrir davantage d'espace et un séjour particulièrement agréable.",

    features: [
      "Très grand lit",
      "Salle de bain privée",
      "Climatisation",
      "Télévision",
      "Balcon privé",
      "Espace salon"
    ],

    images: [
      
      "images/rooms/premium/chambre-premium-1.jpg","images/rooms/premium/chambre-premium-1.jpg"
    ],

    available: true
  }
],

  restaurant: {
    title: "Notre restaurant",
    subtitle: "Une expérience gastronomique",
    description: "Découvrez notre espace de restauration et les saveurs proposées par notre établissement.",
    image: "images/gallery/restaurant.jpg",
    enabled: true,
    hours: "Horaires à confirmer",
    reservation: true,

    menu: [
      {
        id: "entrees",
        name: "Entrées",
        items: [
          {
            name: "Nom du plat",
            description: "Description à compléter.",
            price: 0,
            currency: "FCFA",
            image: ""
          }
        ]
      },
      {
        id: "plats",
        name: "Plats principaux",
        items: [
          {
            name: "Nom du plat",
            description: "Description à compléter.",
            price: 0,
            currency: "FCFA",
            image: ""
          }
        ]
      },
      {
        id: "boissons",
        name: "Boissons",
        items: [
          {
            name: "Nom de la boisson",
            description: "Description à compléter.",
            price: 0,
            currency: "FCFA",
            image: ""
          }
        ]
      },
      {
        id: "desserts",
        name: "Desserts",
        items: [
          {
            name: "Nom du dessert",
            description: "Description à compléter.",
            price: 0,
            currency: "FCFA",
            image: ""
          }
        ]
      }
    ]
  },

  piscine: {
    title: "Notre piscine",
    subtitle: "Un espace de détente",
    description: "Découvrez notre espace piscine et profitez d'un moment de détente.",
    image: "",
    enabled: true,
    hours: "Horaires à confirmer",

    pricing: {
      enabled: false,
      amount: 0,
      currency: "FCFA",
      description: "Tarif à confirmer."
    },

    features: ["Informations à compléter."]
  },

  experiences: {
    title: "Nos expériences",
    description: "Découvrez les expériences proposées par notre établissement.",
    enabled: true,

    items: [
      {
        id: 1,
        name: "Détente",
        description: "Des moments pour prendre soin de soi.",
        image: "images/gallery/detente.jpg",
        price: 0,
        currency: "FCFA",
        enabled: true
      },
      {
        id: 2,
        name: "Nature",
        description: "Reconnectez-vous avec votre environnement.",
        image: "images/gallery/nature.jpg",
        price: 0,
        currency: "FCFA",
        enabled: true
      },
      {
        id: 3,
        name: "Événements",
        description: "Célébrez vos moments importants.",
        image: "images/gallery/evenements.jpg",
        price: 0,
        currency: "FCFA",
        enabled: true
      }
    ]
  },

  evenements: {
    title: "Vos événements",
    description: "Un espace pour accueillir vos moments importants.",
    enabled: true,
    image: "images/gallery/evenements.jpg",

    types: [
      "Anniversaires",
      "Réceptions",
      "Rencontres professionnelles"
    ],

    pricing: {
      enabled: false,
      amount: 0,
      currency: "FCFA",
      description: "Tarif sur demande."
    }
  },

  gallery: [
    {
      category: "Hébergement",
      image: "images/rooms/chambre-standard.jpg"
    },
    {
      category: "Hébergement",
      image: "images/rooms/chambre-premium.jpg"
    },
    {
      category: "Restaurant",
      image: "images/gallery/restaurant.jpg"
    },
    //Piscine
    {
      category: "Piscine",
      image: ""
    },
    //nature
    {
      category: "Nature",
      image: "images/gallery/nature.jpg"
    },
    //evenements
    {
      category: "Événements",
      image: "images/gallery/evenements.jpg"
    },{
      category: "Détente",
      image: "images/gallery/detente.jpg"
    }
  ],
  
  reviews: [
    // Les témoignages approuvés seront ajoutés ici.
  ],


  services: [
    {
      id: "parking",
      name: "Parking",
      description: "Informations à compléter.",
      image: "",
      enabled: true
    },
    {
      id: "wifi",
      name: "Wi-Fi",
      description: "Informations à compléter.",
      image: "",
      enabled: true
    },
    {
      id: "climatisation",
      name: "Climatisation",
      description: "Informations à compléter.",
      image: "",
      enabled: true
    },
    {
      id: "securite",
      name: "Sécurité",
      description: "Informations à compléter.",
      image: "",
      enabled: true
    }
  ]
  
};
