import { Book, StudentProfile } from '@/types/book';

export const CURRENT_STUDENT: StudentProfile = {
  id: 'usr_rule_92847',
  email: 'student.rule@gmail.com',
  fullName: 'Chan Sophea',
  studentId: 'RULE-2026-8812',
  institution: 'Royal University of Law and Economics (RULE)',
};

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book-commercial-law-cambodia',
    title: 'Commercial Law & Corporate Governance in Cambodia',
    author: 'Dr. Peng Hong & Prof. Vichea Seng',
    category: 'Law',
    priceUSD: 4.50,
    priceKHR: 18000,
    description: 'A comprehensive textbook and practical guide analyzing the Law on Commercial Enterprises, insolvency proceedings, investment law, and dispute resolution mechanisms in Cambodia.',
    coverGradient: 'from-blue-900 via-indigo-950 to-slate-900',
    totalPages: 12,
    previewPages: 3,
    publishDate: '2026 Edition',
    publisher: 'RULE Academic Publications',
    isbn: '978-99950-84-12-1',
    tableOfContents: [
      { title: 'Preface & Introduction', page: 1 },
      { title: 'Chapter 1: Legal Framework of Commercial Entities', page: 2 },
      { title: 'Chapter 2: Directors’ Fiduciary Duties & Governance', page: 3 },
      { title: 'Chapter 3: Secured Transactions & Commercial Contracts', page: 4 },
      { title: 'Chapter 4: Banking Regulations and Digital Assets', page: 7 },
      { title: 'Chapter 5: Dispute Resolution & Arbitration (NCAC)', page: 10 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Preface & Acknowledgements',
        isSample: true,
        paragraphs: [
          'The modern commercial landscape in the Kingdom of Cambodia has undergone rapid institutional maturity over the last two decades. As the economy transitions towards upper-middle-income status, the legal structures governing commercial enterprises must be understood with rigorous academic and practical clarity.',
          'This textbook is dedicated to law students at the Royal University of Law and Economics (RULE) as well as practicing corporate attorneys, judicial officers, and business owners operating in Phnom Penh and throughout ASEAN.',
          'Readers will find analytical breakdowns of statutory provisions alongside practical case studies drawn from recent commercial court rulings and arbitration awards issued by the National Commercial Arbitration Centre (NCAC).'
        ]
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter 1: Legal Framework of Commercial Entities',
        isSample: true,
        paragraphs: [
          'Under the Law on Commercial Enterprises (LCE) promulgated by royal decree, any individual or group of persons intending to conduct regular commercial activities within Cambodia must register their enterprise with the Ministry of Commerce through the single-portal business registration mechanism.',
          'The primary forms of business organizations recognized under Cambodian law include: (1) Sole Proprietorships; (2) General and Limited Partnerships; (3) Private Limited Companies (LLC); and (4) Public Limited Companies (PLC). Each entity carries distinct liability implications for founders and shareholders.',
          'A Private Limited Company is by far the most prevalent vehicle for foreign and local investments. Articles of Incorporation must specify the share capital, registered office address in Cambodia, and object clauses governing permissible commercial transactions.'
        ]
      },
      {
        pageNumber: 3,
        chapterTitle: 'Chapter 2: Directors’ Fiduciary Duties & Governance',
        isSample: true,
        paragraphs: [
          'Directors of a commercial company owe both a duty of care and a duty of loyalty to the legal entity itself, rather than solely to the majority appointing shareholders. Under Article 134 of the LCE, directors must exercise the care, diligence, and skill that a reasonably prudent person would exercise under comparable circumstances.',
          'Conflict of interest disclosures constitute an indispensable facet of corporate governance. Any transaction in which a director possesses a material direct or indirect personal interest must be disclosed to the board and recorded in official board minutes.',
          'Failure to uphold statutory fiduciary responsibilities can pierce the corporate veil, rendering officers personally liable to creditors in the event of fraudulent insolvency or asset dissipations.'
        ]
      },
      {
        pageNumber: 4,
        chapterTitle: 'Chapter 3: Secured Transactions & Commercial Contracts',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Secured transactions in movable property are governed by the Law on Secured Transactions. Security interests must be perfected through public filing with the Secured Transactions Registry Office (STRO) to ensure legal priority against competing unsecured creditors.',
          'Key topics covered in this chapter: Drafting enforceable standard sale agreements, breach remedies, retention of title clauses, and enforcement of mortgages over immovable property under the Civil Code.'
        ]
      },
      {
        pageNumber: 5,
        chapterTitle: 'Chapter 3: Collateral Perfection & Priorities',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'When multiple secured creditors claim an interest in identical collateral, priority is adjudicated based on the chronological sequence of perfection or filing with the STRO.',
          'This chapter delves into specialized hypothecs, pledge agreements on company shares, and bank guarantee enforcement standards recognized by commercial tribunals.'
        ]
      },
      {
        pageNumber: 6,
        chapterTitle: 'Chapter 4: Banking Regulations and Digital Assets',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'The National Bank of Cambodia (NBC) maintains regulatory oversight of all financial institutions under the Law on Banking and Financial Institutions. Capital adequacy ratios, reserve requirements, and anti-money laundering (AML/CFT) compliance guidelines are examined in rigorous detail.'
        ]
      },
      {
        pageNumber: 7,
        chapterTitle: 'Chapter 4: Bakong & Payment Systems Law',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Project Bakong, introduced by the National Bank of Cambodia, operates on distributed ledger technology (Hyperledger Iroha) to interlink commercial banks, microfinance institutions (MFIs), and payment service providers into a unified KHQR interoperable standard.',
          'This chapter assesses legal settlement finality, electronic signature recognition, and consumer protection duties placed upon payment gateway intermediaries.'
        ]
      },
      {
        pageNumber: 8,
        chapterTitle: 'Chapter 5: Commercial Dispute Resolution',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Commercial litigation in Cambodia has evolved with the development of the specialized Commercial Court. Parties may also elect arbitration through the National Commercial Arbitration Centre (NCAC) under the Law on Commercial Arbitration.'
        ]
      },
      {
        pageNumber: 9,
        chapterTitle: 'Chapter 5: Enforcement of NCAC Awards',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Arbitral awards rendered in Cambodia are final and binding upon the disputing parties. To execute against debtor assets, the prevailing party files an application for recognition and enforcement with the Phnom Penh Municipal Court of First Instance.'
        ]
      },
      {
        pageNumber: 10,
        chapterTitle: 'Appendix A: Sample Articles of Incorporation',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] Full bilingual drafting templates in Khmer and English.'
        ]
      },
      {
        pageNumber: 11,
        chapterTitle: 'Appendix B: Statutory Glossary & Case References',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] Complete cross-referenced case annotations and statutory index.'
        ]
      },
      {
        pageNumber: 12,
        chapterTitle: 'Index & Examination Review Questions',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] Model answers for university final examinations and bar examination preparation.'
        ]
      }
    ]
  },
  {
    id: 'book-digital-fintech-bakong',
    title: 'FinTech, Digital Currencies & The Bakong Ecosystem',
    author: 'Dr. Peng Hong',
    category: 'Technology',
    priceUSD: 5.00,
    priceKHR: 20000,
    description: 'An in-depth exploration of modern financial technology in Southeast Asia, exploring how Cambodia’s quasi-CBDC Bakong and KHQR are reshaping retail banking and cross-border remittances.',
    coverGradient: 'from-emerald-900 via-teal-950 to-slate-900',
    totalPages: 10,
    previewPages: 3,
    publishDate: '2026 Edition',
    publisher: 'FinTech Institute of Cambodia',
    isbn: '978-99950-84-45-9',
    tableOfContents: [
      { title: 'Introduction to FinTech in ASEAN', page: 1 },
      { title: 'The Architecture of Project Bakong', page: 2 },
      { title: 'KHQR Standard: Interoperability Analysis', page: 3 },
      { title: 'E-Payment Gateways & Developer APIs', page: 4 },
      { title: 'Cybersecurity & Financial Consumer Privacy', page: 7 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'Introduction: The Leapfrog Phenomenon',
        isSample: true,
        paragraphs: [
          'Cambodia has experienced one of the most remarkable digital financial transitions in the developing world. By bypassing traditional legacy banking infrastructures, the nation adopted mobile-first and QR-first financial rails at extraordinary speed.',
          'Between 2018 and 2025, digital payment volume expanded more than tenfold, largely powered by ubiquitous smartphone adoption, 4G/5G infrastructure across provincial centers, and pioneering initiatives by the National Bank of Cambodia.',
          'This textbook examines the technical, legal, and economic foundations underpinning this ongoing financial revolution.'
        ]
      },
      {
        pageNumber: 2,
        chapterTitle: 'The Architecture of Project Bakong',
        isSample: true,
        paragraphs: [
          'At the core of the Cambodian national payment switch lies Project Bakong. Launched by the central bank in collaboration with Soramitsu, Bakong utilizes Hyperledger Iroha—a permissioned distributed ledger technology.',
          'Unlike volatile cryptocurrencies, Bakong tokens represent direct digital claims on fiat currency (both Cambodian Riel and US Dollars) backed one-to-one with reserves held at the National Bank.',
          'Transactions settle within 2 to 3 seconds with immutable cryptographic proofs, delivering true real-time gross settlement (RTGS) directly to consumer and merchant wallets.'
        ]
      },
      {
        pageNumber: 3,
        chapterTitle: 'KHQR Standard: Interoperability in Practice',
        isSample: true,
        paragraphs: [
          'Prior to KHQR, merchants were forced to display dozens of conflicting QR stickers for separate commercial banks and telco wallets (ABA, Wing, ACLEDA, TrueMoney, Pi Pay).',
          'The introduction of the universal KHQR specification unified this fragmented landscape into a single EMV-compliant QR code. A consumer using ABA Mobile can instantly pay an ACLEDA merchant without friction or extra fees.',
          'In this chapter, we dissect the KHQR string structure, payload checksum verification algorithms, and dynamic vs. static QR implementations.'
        ]
      },
      {
        pageNumber: 4,
        chapterTitle: 'E-Payment Gateways: ABA PayWay & Merchant APIs',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'E-commerce platforms integrate with payment switches using merchant gateways such as ABA PayWay. We examine request hashing with HMAC-SHA512, cryptographic nonce validation, and server-to-server webhook callbacks.'
        ]
      },
      {
        pageNumber: 5,
        chapterTitle: 'Cross-Border QR Remittances',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Bilateral payment linkages connecting Cambodia with Thailand (PromptPay), Vietnam, Malaysia (DuitNow), and Laos have eliminated high forex charges for cross-border travelers.'
        ]
      }
    ]
  },
  {
    id: 'book-macroeconomics-southeast-asia',
    title: 'Macroeconomics & Monetary Policy in Dollarized Economies',
    author: 'Prof. Rithy Chhay & Dr. Peng Hong',
    category: 'Economics',
    priceUSD: 3.50,
    priceKHR: 14000,
    description: 'A study of dual-currency economies, exchange rate stability, inflation targeting, and dedollarization strategies in post-conflict developing nations.',
    coverGradient: 'from-amber-900 via-orange-950 to-slate-900',
    totalPages: 8,
    previewPages: 2,
    publishDate: '2025 Edition',
    publisher: 'Center for Economic Research',
    isbn: '978-99950-84-77-0',
    tableOfContents: [
      { title: 'The Origins of Dollarization', page: 1 },
      { title: 'Central Bank Policy Tools in Dual-Currency Regimes', page: 2 },
      { title: 'Exchange Rate Management and Foreign Reserves', page: 3 },
      { title: 'De-dollarization Strategies & Riel Promotion', page: 5 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'The Historical Origins of Dollarization',
        isSample: true,
        paragraphs: [
          'Following the restoration of civil administration in the early 1990s, high inflation and institutional rebuilding led to the spontaneous adoption of the US Dollar as a medium of exchange and store of value.',
          'While dollarization historically provided price stability and foreign direct investment confidence, it also constrained traditional independent monetary policy instruments, such as lender-of-last-resort capabilities and seigniorage revenue.',
          'We evaluate macroeconomic indicators from 1993 to the present day.'
        ]
      },
      {
        pageNumber: 2,
        chapterTitle: 'Central Bank Policy Tools',
        isSample: true,
        paragraphs: [
          'In a dual-currency environment, the central bank relies primarily on Liquidity-Providing Collateralized Operations (LPCO), reserve requirement differentials, and targeted interventions in the foreign exchange market to preserve the purchasing power of the national currency.',
          'The differential reserve requirement on foreign currency liabilities vs. local currency liabilities serves as an active macroeconomic stabilizer.'
        ]
      },
      {
        pageNumber: 3,
        chapterTitle: 'Promoting National Currency: Market-Driven De-dollarization',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Forced de-dollarization carries capital flight risks; hence, market-based incentives—such as mandating price listings in KHR, payment of utilities in KHR, and preferential interest rates on KHR deposits—form the core policy architecture.'
        ]
      }
    ]
  },
  {
    id: 'book-business-entrepreneurship-cambodia',
    title: 'Modern Business Law & Startup Entrepreneurship',
    author: 'Dr. Peng Hong & Sarah Jenkins, J.D.',
    category: 'Business',
    priceUSD: 4.00,
    priceKHR: 16000,
    description: 'Practical guide for modern business builders: structuring equity, intellectual property protection, venture financing, and compliance in emerging ASEAN markets.',
    coverGradient: 'from-purple-900 via-violet-950 to-slate-900',
    totalPages: 9,
    previewPages: 3,
    publishDate: '2026 Edition',
    publisher: 'RULE Business Incubator',
    isbn: '978-99950-84-99-2',
    tableOfContents: [
      { title: 'From Idea to Incorporation', page: 1 },
      { title: 'Founder Vesting & Shareholder Agreements', page: 2 },
      { title: 'Intellectual Property Protection', page: 3 },
      { title: 'Seed Capital & Convertible Notes (SAFE)', page: 4 },
      { title: 'Tax Incentives for SMEs in Cambodia', page: 6 },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterTitle: 'From Idea to Incorporation',
        isSample: true,
        paragraphs: [
          'Starting a technology venture or scalable business requires balancing operational agility with legal resilience from day one.',
          'Founders often make the fatal mistake of delaying legal incorporation until after receiving external funding. This creates severe ambiguities regarding ownership of source code, trademarks, and domain registrations.',
          'In this chapter, we outline the exact registration steps required on the Cambodia Business Registration Single Portal (CamDX).'
        ]
      },
      {
        pageNumber: 2,
        chapterTitle: 'Founder Vesting & Shareholder Agreements',
        isSample: true,
        paragraphs: [
          'A startup’s most critical legal shield is the Founders’ Agreement. Standard industry best practice mandates a 4-year vesting schedule with a 1-year cliff.',
          'If a co-founder departs after six months, unvested shares are repurchased by the company at nominal value, preventing dead equity from crippling subsequent investment rounds.'
        ]
      },
      {
        pageNumber: 3,
        chapterTitle: 'Intellectual Property Protection in Cambodia',
        isSample: true,
        paragraphs: [
          'Trademarks, trade secrets, and software copyrights must be registered with the Department of Intellectual Property Rights at the Ministry of Commerce.',
          'Cambodia’s accession to the Madrid Protocol allows local entrepreneurs to designate international trademark registrations across more than 120 member countries through a single centralized application.'
        ]
      },
      {
        pageNumber: 4,
        chapterTitle: 'Venture Capital & Convertible Instruments',
        isSample: false,
        paragraphs: [
          '🔒 [RESTRICTED CONTENT] This section requires a verified student license.',
          'Deep dive into Simple Agreements for Future Equity (SAFE), valuation caps, discount rates, and the enforceability of liquidation preferences under Cambodian commercial law.'
        ]
      }
    ]
  }
];
