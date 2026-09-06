# TapGo Rwanda 🇷🇼
### Modern Public Transport Wallet & Tap & Go Card Management

A modern, mobile-first fintech web application inspired by Rwanda's **Tap & Go** public transport payment experience. Designed with a clean, banking-grade aesthetic influenced by premier Rwandan financial applications (such as Bank of Kigali, Equity Bank, and MyMTN/MoMo).

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 💳 1. Digital Tap & Go Transport Card
- **Physical-Digital Card Representation**: Realistic card with EMV microchip graphic, contactless NFC wave indicator, holographic subtle background, and active status pill.
- **Real-Time Balance Display**: Clean Rwandan Francs formatting (`RWF 12,500`), with balance hide/unhide toggle for passenger privacy.
- **Card Security Controls**: Masked card numbers (`**** **** 4821`), with quick unmasking and instant **Freeze/Unfreeze Card** toggle to prevent unauthorized taps.
- **Multiple Card Management**: Manage multiple passes (e.g. "Daily Commute", "Student Pass"), switch primary card, and view per-card last used route & timestamp.
- **Card Registration Flow**: Link physical cards with live validation covering all 5 edge cases (Invalid format, Already registered, Card not found in central registry, Network error simulation, Successfully linked).

### ⚡ 2. Mobile Money Top-Up Flow (MTN MoMo & Airtel Money)
- **Presets & Custom Amounts**: Quick selection chips (`RWF 500`, `RWF 1,000`, `RWF 2,000`, `RWF 5,000`, `RWF 10,000`, `RWF 20,000`) and custom input with validation.
- **Provider Cards**: Dedicated selector cards for **MTN MoMo** and **Airtel Money** featuring restrained official brand accents.
- **Transparent Summary Breakdown**: Clear display of amount, transaction fees (`Free - RWF 0 promo`), total charge, destination card, and commuter phone number.
- **Security-First UX**: Reassures users that their secret PIN is never entered inside the web app. Instead, a prompt is dispatched to their phone (`*182#` USSD push).
- **Payment Lifecycle States**:
  - *Initiating / Processing*: Animated USSD push simulation dialog.
  - *Successful*: Celebration checkmark, updated card balance (`RWF 12,500 -> RWF 17,500`), official transaction ID (`TXN-MTN-RW-XXXXXXXX`), and one-tap receipt options.
  - *Failed*: Non-technical helpful guidance (insufficient funds, timeout, network error), with "Try Again" and "Choose Another Method".

### 📊 3. Transactions History & Official Receipts
- **Category Filter Tabs**: Filter across *All*, *Bus Fare*, *Top Up*, *Refund*, and *Failed*.
- **Live Search**: Instant keyword search across route descriptions, bus operators, plates, and receipt IDs.
- **Fintech Visual Cues**: Emerald green for wallet top-ups (`+RWF 5,000`), crisp navy for bus trip debits (`-RWF 500`).
- **Interactive Digital Receipt Drawer**:
  - Itemized breakdown: Transaction type, amount, status, date/time, card number, bus route, operator, bus plate, and RURA compliance badge.
  - **Download Receipt**: Generates and downloads a clean text receipt (`Receipt_TG-XXXXXXXX.txt`).
  - **Share Receipt**: Uses the native Web Share API or falls back to clipboard copying.

### 🚌 4. Kigali Bus Route Fare Estimator
- Commuter reference widget for major Kigali transit routes:
  - *Nyabugogo Bus Park ↔ Kimironko Market* (`RWF 500`)
  - *Kigali Downtown ↔ Remera Corner* (`RWF 430`)
  - *Kicukiro Centre ↔ Nyabugogo* (`RWF 480`)
  - *Kacyiru MINAFFET ↔ Downtown* (`RWF 320`)
- Built-in **"Tap Board" simulator** to test live card debiting (-RWF 500) and balance updates.

### 🔔 5. Passenger Notifications Feed
- Real-time alerts for successful recharges, bus trip boarding debits, and low balance warnings (when card drops below RWF 1,000).
- Unread badge counters, mark as read, and clear-all controls.

### 👤 6. Profile, Security & Preferences
- Personal information editing (Full name, phone, email).
- Biometric authentication (Face ID / Fingerprint) toggle.
- App access PIN settings.
- Multilingual selection: **English**, **Ikinyarwanda (RW)**, and **Français (FR)**.
- **Integration Mode Switcher**: Seamlessly toggle between **Demo Mode** (mock payments with USSD push simulation) and **Production Mode** (live API endpoints).

### 🔐 7. Authentication Flow
- Commuter Login with Rwanda phone (`+250 78/79/72/73`) and security PIN.
- One-tap **"Fill Demo Commuter (Jean Bosco)"** button for rapid evaluation.
- Commuter Registration with optional immediate Tap & Go card link.
- 6-digit SMS OTP phone verification with resend timer and demo auto-fill.
- PIN recovery and reset flow.

---

## 🏗️ Architecture & Decoupled Payment Layer

The application separates UI components from payment gateway implementations through a clean service abstraction:

```
services/
├── payment/
│   ├── payment-provider.ts    # Abstract IPaymentProvider interface
│   ├── mock-provider.ts       # Realistic Rwanda MoMo/Airtel simulation with USSD delays
│   ├── mtn-provider.ts        # Production adapter for MTN MoMo Open API (POST /collection/v1_0/requesttopay)
│   ├── airtel-provider.ts     # Production adapter for Airtel Money API (POST /merchant/v1/payments/)
│   └── index.ts               # PaymentService orchestrator switching Demo / Production mode
├── cards/
│   └── card-service.ts        # Tap & Go card validation, masking, and status management
├── transactions/
│   └── transaction-service.ts # Filtering, search, and receipt generator
└── auth/
    └── auth-service.ts        # Session persistence, login, and OTP verification
```

---

## 📱 Responsive Layout
- **Mobile Phones**: Bottom navigation bar (`Home`, `Cards`, `Top Up`, `Activity`, `Profile`) with touch targets $\ge 44\text{px}$ and safe-area padding.
- **Desktop & Tablets**: Left navigation sidebar with real-time active card mini-widget, bus simulator button, and environment switcher.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node v20 or v22 recommended)
- NPM or PNPM

### Installation
```bash
# Clone the repository
git clone https://github.com/benisson-beep/Tap-GoApp.git
cd Tap-GoApp

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security Principles
- **Zero PIN harvesting**: The application never collects or stores sensitive MTN MoMo or Airtel Money wallet PINs.
- **Masked Data**: Sensitive card and phone numbers are partially masked by default (`**** **** 4821`).
- **Data Protection Compliance**: Built in alignment with Rwanda Law N° 058/2021 relating to the protection of personal data and privacy.

---

## 📄 License
MIT © TapGo Rwanda Team
