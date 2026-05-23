export const defaultPortfolio = {
  profile: {
    key: 'main',
    name: 'Shubham Karkhile',
    title: 'Senior Angular Developer',
    location: 'Pune, India',
    email: 'shubh.karkhile@gmail.com',
    phone: '+91 88880 52579',
    linkedin: 'https://www.linkedin.com/in/shubham-karkhile-a7aa52168/',
    github: 'https://github.com/shubhz6599',
    resumeUrl: 'assets/Shubham_Karkhile_Front_End_Developer_CV.pdf',
    summary:
      'Performance-driven Angular engineer building enterprise portals, MEAN-stack products, AI-enabled workflows, and high-traffic dashboards with a sharp focus on speed, accessibility, and maintainable architecture.'
  },
  metrics: [
    { value: '3.6+', label: 'years shipping', note: 'enterprise Angular and MEAN-stack products' },
    { value: '50k+', label: 'daily users', note: 'supplier portal scale and compliance' },
    { value: '30%', label: 'load time cut', note: 'OnPush, lazy loading, and reusable architecture' },
    { value: '25%', label: 'API latency cut', note: 'RxJS caching and communication tuning' }
  ],
  projects: [
    {
      order: 1,
      slug: 'mahindra-supplier-portal',
      title: 'Mahindra Supplier Portal',
      role: 'Frontend Architecture Owner',
      summary:
        'Modern procurement and invoicing portal engineered with Angular standalone components, NgRx, Angular Material, and enterprise accessibility standards.',
      problem:
        'Supplier registration, invoicing, and procurement workflows needed consistency, speed, and compliance for a high-volume enterprise user base.',
      solution:
        'Designed a modular Angular architecture with lazy features, NgRx effects, typed service boundaries, OnPush change detection, and reusable workflow components.',
      impact:
        'Improved load time by 30%, increased component reuse by 40%, and helped keep deployed features aligned with enterprise security and accessibility requirements.',
      metrics: [
        { value: '50k+', label: 'daily users', note: 'enterprise portal usage' },
        { value: '30%', label: 'faster loads', note: 'measured frontend optimization' },
        { value: '40%', label: 'reuse lift', note: 'shared component architecture' }
      ],
      stack: ['Angular 16+', 'Standalone Components', 'NgRx', 'RxJS', 'Angular Material', 'a11y'],
      featured: true,
      links: {}
    },
    {
      order: 2,
      slug: 'icici-lombard-insurance',
      title: 'ICICI Lombard Insurance Workbench',
      role: 'Frontend Engineer',
      summary:
        'High-traffic health and motor insurance dashboards with OTP validation, policy search, dynamic add-on selection, quote generation, and eKYC flows.',
      problem:
        'Agents and admins needed secure, fast workflows across policy lookup, customer validation, quote creation, and certificate generation.',
      solution:
        'Implemented reactive forms, custom validators, RxJS streams, CERSAI eKYC integration, and optimized HTTP caching for dashboard-heavy experiences.',
      impact:
        'Reduced API latency by 25% and delivered reliable dashboards for policy analytics and automated certificate generation.',
      metrics: [
        { value: '25%', label: 'latency drop', note: 'HTTP and RxJS optimization' },
        { value: 'OTP', label: 'secure flows', note: 'customer verification' },
        { value: 'eKYC', label: 'identity checks', note: 'CERSAI integration' }
      ],
      stack: ['Angular', 'Reactive Forms', 'RxJS', 'CERSAI APIs', 'Dashboards', 'SASS'],
      featured: true,
      links: {}
    },
    {
      order: 3,
      slug: 'itrendss-ecommerce-platform',
      title: 'iTrendss E-Commerce Platform',
      role: 'Full-stack Developer',
      summary:
        'Production-grade commerce platform with user/admin panels, JWT authentication, Razorpay payments, MongoDB persistence, and email notifications.',
      problem:
        'The product needed a reliable commerce stack that could handle storefront browsing, admin controls, secure transactions, and customer communication.',
      solution:
        'Built a MEAN-stack architecture with Angular, Node.js, Express, MongoDB, JWT sessions, Razorpay checkout, and Nodemailer delivery events.',
      impact:
        'Delivered a scalable live commerce system with automated order and delivery status notifications.',
      metrics: [
        { value: 'JWT', label: 'auth', note: 'secure user and admin flows' },
        { value: 'Razorpay', label: 'payments', note: 'transaction handling' },
        { value: 'MongoDB', label: 'storage', note: 'product and order data' }
      ],
      stack: ['Angular', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Razorpay', 'Nodemailer'],
      featured: true,
      links: {}
    }
  ],
  skills: [
    {
      order: 1,
      name: 'Angular Core',
      signal: 'Interface systems',
      tools: ['Angular 2+', 'Angular 17+', 'Standalone Components', 'Signals', 'OnPush', 'Dependency Injection']
    },
    {
      order: 2,
      name: 'Reactive State',
      signal: 'Data movement',
      tools: ['RxJS', 'NgRx Store', 'Effects', 'Selectors', 'BehaviorSubject', 'switchMap', 'takeUntil']
    },
    {
      order: 3,
      name: 'Full Stack',
      signal: 'Product delivery',
      tools: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT', 'Postman']
    },
    {
      order: 4,
      name: 'Integrations',
      signal: 'Business workflows',
      tools: ['Razorpay', 'Twilio', 'CERSAI eKYC', 'OpenAI APIs', 'Gemini APIs', 'ElevenLabs']
    },
    {
      order: 5,
      name: 'Quality',
      signal: 'Production readiness',
      tools: ['Jasmine', 'Karma', 'TestBed', 'Accessibility', 'GitHub Actions', 'Agile/Scrum']
    }
  ],
  experiences: [
    {
      order: 1,
      company: 'Digital Crown IT Systems',
      location: 'Mumbai, India',
      role: 'Angular Developer',
      period: 'Dec 2024 - Present',
      highlights: [
        'Modernized procurement and invoicing workflows for Mahindra & Mahindra Supplier Portal.',
        'Built NgRx-backed state layers for complex supplier registration modules.',
        'Integrated Twilio and OpenAI/Gemini chatbot workflows for real-time voice and text communication.'
      ]
    },
    {
      order: 2,
      company: 'Setu Net Pvt. Ltd.',
      location: 'Vapi, India',
      role: 'Jr. Full-stack Developer',
      period: 'Mar 2024 - Jul 2024',
      highlights: [
        'Migrated core enterprise applications from Angular 6 to Angular 11.',
        'Resolved RxJS and Angular Material breaking changes across legacy modules.',
        'Mentored junior developers on TypeScript, DI, and modular architecture.'
      ]
    },
    {
      order: 3,
      company: 'One Roof Technologies LLP',
      location: 'Mumbai, India',
      role: 'Software Developer',
      period: 'Aug 2022 - Jan 2024',
      highlights: [
        'Built ICICI Lombard health and motor insurance dashboards.',
        'Implemented policy search, OTP validation, quote flows, add-ons, and CERSAI eKYC.',
        'Reduced API latency through optimized RxJS communication and caching strategies.'
      ]
    },
    {
      order: 4,
      company: 'Techivies Solutions Pvt. Ltd.',
      location: 'Ahmedabad, India',
      role: 'Full-stack Developer Intern',
      period: 'Feb 2022 - Aug 2022',
      highlights: [
        'Contributed to a MEAN-stack Supplier Relationship Management project.',
        'Built responsive UI layouts and integrated REST APIs for a US-based client.'
      ]
    }
  ]
};
