/* Textos y proyectos del portafolio 3D */
export const I18N = {
  es:{
    'nav.home':'Inicio','nav.services':'Servicios','nav.work':'Portafolio','nav.about':'Nosotros','nav.contact':'Contacto','nav.cta':'Agendar llamada',
    'pf.badge':'Portafolio conceptual · Diseño web & marca','pf.t1':'Diseño que se ve bien y','pf.t2':'vende mejor.',
    'pf.sub':'Del crypto casino a la identidad de una marca: conceptos con marcas ficticias, no trabajos para clientes. Desliza para recorrerlos.',
    'hud.open':'Ver concepto','hud.hint':'Desliza para girar','hud.sample':'Marcas ficticias · Conceptos de ejemplo',
    'case.wa':'Más información por WhatsApp','case.waMsg':'Hola RD, vi el proyecto «{p}» en su portafolio y quiero más información.',
    'case.back':'Volver al portafolio','case.live':'Ver sitio en vivo','case.year':'Año','case.role':'Rol','case.cat':'Categoría',
    'case.next':'Siguiente proyecto','case.pull':'Sigue bajando para cerrar el proyecto','case.continue':'Cerrar proyecto',
    'ph.tag':'[ sección existente ]','after.title':'De la primera llamada al lanzamiento en 4 pasos',
    's1.t':'Llamada inicial','s1.d':'Entendemos tu negocio, tus metas y el alcance.',
    's2.t':'Plan y diseño','s2.d':'Arquitectura, flujos y prototipos visuales.',
    's3.t':'Desarrollo ágil','s3.d':'Sprints cortos con avances reales cada semana.',
    's4.t':'Lanzamiento','s4.d':'Puesta en producción, capacitación y soporte.',
    'ct.badge':'¿Listo para el siguiente paso?','ct.t1':'¿Tu marca es el','ct.t2':'próximo proyecto?','ct.wa':'Escríbenos por WhatsApp',
    'all':'Todos'
  },
  en:{
    'nav.home':'Home','nav.services':'Services','nav.work':'Work','nav.about':'About','nav.contact':'Contact','nav.cta':'Book a call',
    'pf.badge':'Concept portfolio · Web & brand design','pf.t1':'Design that looks good and','pf.t2':'sells better.',
    'pf.sub':'From crypto casinos to brand identities: concepts with fictional brands, not client work. Scroll to browse them.',
    'hud.open':'View concept','hud.hint':'Scroll to spin','hud.sample':'Fictional brands · Sample concepts',
    'case.wa':'More info on WhatsApp','case.waMsg':'Hi RD, I saw the "{p}" project in your portfolio and would like more information.',
    'case.back':'Back to work','case.live':'Visit live site','case.year':'Year','case.role':'Role','case.cat':'Category',
    'case.next':'Next project','case.pull':'Keep scrolling to close the project','case.continue':'Close project',
    'ph.tag':'[ existing section ]','after.title':'From first call to launch in 4 steps',
    's1.t':'Discovery call','s1.d':'We learn your business, goals and scope.',
    's2.t':'Plan & design','s2.d':'Architecture, flows and visual prototypes.',
    's3.t':'Agile build','s3.d':'Short sprints with real progress every week.',
    's4.t':'Launch','s4.d':'Go-live, team training and support.',
    'ct.badge':'Ready for the next step?','ct.t1':'Is your brand the','ct.t2':'next project?','ct.wa':'Message us on WhatsApp',
    'all':'All'
  },
  it:{
    'nav.home':'Home','nav.services':'Servizi','nav.work':'Portfolio','nav.about':'Chi siamo','nav.contact':'Contatti','nav.cta':'Prenota una call',
    'pf.badge':'Concept portfolio · Web & brand design','pf.t1':'Design che si fa notare e','pf.t2':'vende di più.',
    'pf.sub':'Dal crypto casinò all’identità di un brand: concept con marchi fittizi, non lavori per clienti. Scorri per sfogliarli.',
    'hud.open':'Vedi il concept','hud.hint':'Scorri per ruotare','hud.sample':'Marchi fittizi · Concept di esempio',
    'case.wa':'Più informazioni su WhatsApp','case.waMsg':'Ciao RD, ho visto il progetto «{p}» nel vostro portfolio e vorrei più informazioni.',
    'case.back':'Torna al portfolio','case.live':'Vedi il sito live','case.year':'Anno','case.role':'Ruolo','case.cat':'Categoria',
    'case.next':'Progetto successivo','case.pull':'Continua a scorrere per chiudere il progetto','case.continue':'Chiudi progetto',
    'ph.tag':'[ sezione esistente ]','after.title':'Dalla prima call al lancio in 4 passi',
    's1.t':'Call iniziale','s1.d':'Capiamo il tuo business, gli obiettivi e il perimetro.',
    's2.t':'Piano e design','s2.d':'Architettura, flussi e prototipi visivi.',
    's3.t':'Sviluppo agile','s3.d':'Sprint brevi con progressi reali ogni settimana.',
    's4.t':'Lancio','s4.d':'Messa online, formazione e supporto.',
    'ct.badge':'Pronto per il prossimo passo?','ct.t1':'Il tuo brand è il','ct.t2':'prossimo progetto?','ct.wa':'Scrivici su WhatsApp',
    'all':'Tutti'
  }
};

export const CATS = {
  casino:   {es:'Crypto & Casino', en:'Crypto & Casino', it:'Crypto & Casinò'},
  branding: {es:'Branding',        en:'Branding',        it:'Branding'},
  ecommerce:{es:'E-commerce',      en:'E-commerce',      it:'E-commerce'},
  landing:  {es:'Landing pages',   en:'Landing pages',   it:'Landing page'},
  apps:     {es:'Apps',            en:'Apps',            it:'App'}
};
export const ROLES = {
  web:     {es:'UI/UX · Desarrollo web',          en:'UI/UX · Web development',     it:'UI/UX · Sviluppo web'},
  brand:   {es:'Identidad de marca · Dirección de arte', en:'Brand identity · Art direction', it:'Identità di marca · Art direction'},
  ecom:    {es:'Diseño e-commerce · Shopify',     en:'E-commerce design · Shopify', it:'Design e-commerce · Shopify'},
  landing: {es:'Diseño y desarrollo de landing',  en:'Landing design & build',      it:'Design e sviluppo landing'},
  app:     {es:'Diseño de producto · iOS / Android', en:'Product design · iOS / Android', it:'Product design · iOS / Android'}
};

/* =========================================================
   2. PROYECTOS
   Para añadir uno: copia un objeto y cambia los datos.
   - image: ruta a tu imagen horizontal (ej. 'img/nebula.jpg'). Si no hay, se genera una de ejemplo.
   - gallery: array de imágenes extra para el caso de estudio.
   ========================================================= */
export const PROJECTS = [
  {id:'nebula-bet', name:'Nebula Bet', cat:'casino', year:2026, role:'web',
   pal:{bg:['#0b0420','#1c0838'], ac:'#b026ff', ac2:'#2f5bff'},
   desc:{es:'Casino cripto con lobby de juegos, cajero en BTC/USDT y bonos de bienvenida. Rediseñamos el flujo de depósito para llevarlo a tres pasos.',
         en:'Crypto casino with a game lobby, BTC/USDT cashier and welcome bonuses. We redesigned the deposit flow down to three steps.',
         it:'Casinò crypto con lobby giochi, cassa in BTC/USDT e bonus di benvenuto. Abbiamo ridisegnato il flusso di deposito in tre passaggi.'}},
  {id:'lumen', name:'Lumen Coffee', cat:'branding', year:2025, role:'brand', mark:'arch',
   pal:{bg:['#f2ece1','#e6dccb'], ac:'#c8562b', ac2:'#1f2a24', ink:'#1d1a16'},
   desc:{es:'Identidad completa para una cafetería de especialidad: logotipo, paleta, empaques y señalética.',
         en:'Full identity for a specialty coffee shop: logo, palette, packaging and signage.',
         it:'Identità completa per una caffetteria specialty: logo, palette, packaging e segnaletica.'}},
  {id:'kairo', name:'Kairo Store', cat:'ecommerce', year:2026, role:'ecom',
   pal:{bg:['#eef0f5','#dfe3ec'], ac:'#2f5bff', ac2:'#ff7a45', ink:'#11131a'},
   desc:{es:'Tienda de calzado urbano con checkout en un clic y fichas de producto pensadas para móvil.',
         en:'Streetwear footwear store with one-click checkout and mobile-first product pages.',
         it:'Store di calzature streetwear con checkout in un clic e schede prodotto pensate per il mobile.'}},
  {id:'orbit-pay', name:'Orbit Pay', cat:'apps', year:2025, role:'app',
   pal:{bg:['#120a2a','#2a0d4a'], ac:'#8f5bff', ac2:'#22d3a5'},
   desc:{es:'Billetera digital para pagos y remesas en LatAm. Diseñamos la app de cero, del onboarding al historial.',
         en:'Digital wallet for payments and remittances in LatAm. We designed the app from scratch, from onboarding to history.',
         it:'Wallet digitale per pagamenti e rimesse in LatAm. Abbiamo progettato l’app da zero, dall’onboarding allo storico.'}},
  {id:'vela', name:'Vela Studio', cat:'landing', year:2026, role:'landing',
   pal:{bg:['#06070d','#101530'], ac:'#4f7bff', ac2:'#e21cff'},
   desc:{es:'Landing de lanzamiento para una herramienta de IA creativa. Más de 8.000 registros en la primera semana.',
         en:'Launch landing for a creative AI tool. Over 8,000 sign-ups in the first week.',
         it:'Landing di lancio per uno strumento di IA creativa. Oltre 8.000 iscrizioni nella prima settimana.'}},
  {id:'royal-spin', name:'Royal Spin', cat:'casino', year:2025, role:'web',
   pal:{bg:['#1a0610','#3a0a1e'], ac:'#ffb020', ac2:'#ff2b6b'},
   desc:{es:'Sportsbook y casino en vivo con ruleta destacada, jackpots en tiempo real y modo oscuro nativo.',
         en:'Sportsbook and live casino with a featured roulette, real-time jackpots and native dark mode.',
         it:'Sportsbook e casinò live con roulette in evidenza, jackpot in tempo reale e dark mode nativa.'}},
  {id:'terra', name:'Terra Botanica', cat:'branding', year:2024, role:'brand', mark:'leaf',
   pal:{bg:['#e7efe4','#d5e2cf'], ac:'#2f6b3f', ac2:'#d9a441', ink:'#16241a'},
   desc:{es:'Marca para una línea de cosmética natural: sistema de logotipo, etiquetas y guía de estilo.',
         en:'Brand for a natural cosmetics line: logo system, labels and style guide.',
         it:'Brand per una linea di cosmetica naturale: sistema logo, etichette e guida di stile.'}},
  {id:'pulse', name:'Pulse Fit', cat:'apps', year:2026, role:'app',
   pal:{bg:['#0b1a1f','#0c2f35'], ac:'#22e3b2', ac2:'#ff4fd8'},
   desc:{es:'App de entrenamiento con planes personalizados, métricas semanales y suscripción integrada.',
         en:'Training app with personalised plans, weekly metrics and built-in subscription.',
         it:'App di allenamento con piani personalizzati, metriche settimanali e abbonamento integrato.'}},
  {id:'nord', name:'Nord Atelier', cat:'ecommerce', year:2025, role:'ecom',
   pal:{bg:['#f4f1ec','#e8e2d8'], ac:'#151515', ac2:'#b08a5a', ink:'#151515'},
   desc:{es:'E-commerce de moda minimalista con lookbook editorial y catálogo filtrable.',
         en:'Minimalist fashion e-commerce with an editorial lookbook and filterable catalogue.',
         it:'E-commerce di moda minimalista con lookbook editoriale e catalogo filtrabile.'}},
  {id:'helix', name:'Helix AI', cat:'landing', year:2025, role:'landing',
   pal:{bg:['#05050a','#140b26'], ac:'#9b30ff', ac2:'#22c3ff'},
   desc:{es:'Landing SaaS para una plataforma de automatización: hero animado, precios y prueba gratis.',
         en:'SaaS landing for an automation platform: animated hero, pricing and free trial.',
         it:'Landing SaaS per una piattaforma di automazione: hero animato, prezzi e prova gratuita.'}},
  {id:'gold-rush', name:'Gold Rush', cat:'casino', year:2026, role:'web',
   pal:{bg:['#0d0a02','#271c05'], ac:'#ffc93c', ac2:'#ff7a1a'},
   desc:{es:'Sala de póker y slots cripto con torneos diarios, VIP club y retiros instantáneos.',
         en:'Crypto poker room and slots with daily tournaments, VIP club and instant withdrawals.',
         it:'Poker room e slot crypto con tornei giornalieri, club VIP e prelievi istantanei.'}},
  {id:'mareva', name:'Mareva', cat:'branding', year:2026, role:'brand', mark:'wave',
   pal:{bg:['#e6eef5','#d2e0ec'], ac:'#123c6b', ac2:'#f2785c', ink:'#0d2238'},
   desc:{es:'Identidad para un restaurante de mar en la costa: logotipo, menú, uniformes y redes sociales.',
         en:'Identity for a seaside seafood restaurant: logo, menu, uniforms and social media.',
         it:'Identità per un ristorante di mare: logo, menù, divise e social media.'}}
];


/* mismo formato que el resto del sitio: clave -> [es, en, it] */
export const T = Object.fromEntries(Object.keys(I18N.es).map(k => [k, ['es','en','it'].map(l => I18N[l][k] ?? I18N.es[k])]));
