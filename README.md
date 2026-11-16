# Pulse Money

A production-grade, full-featured financial technology mobile application built with React Native, TypeScript, and Expo. Pulse Money provides real-time balances, peer-to-peer transfers, virtual card management, biometric authentication, and granular spending analytics.

The visual architecture and UX flows are based on the included design specification file: `PulseMoney.pen`.

---

## Technical Highlights

- Float-Safe Financial Math: Implements strict integer-cents arithmetic (`dollarsToCents`, `centsToDollars`) to prevent IEEE-754 floating-point rounding errors during multi-step ledger calculations.
- Native Biometric Security: Hardware-backed Face ID and Fingerprint authentication integrated via `expo-local-authentication`, paired with an interactive 4-digit PIN fallback pad.
- Native Event Notifications: Local push notification triggers powered by `expo-notifications` for immediate transfer receipts, wallet deposits, and virtual card activations.
- Strict Type Safety: 100% TypeScript coverage with centralized domain interfaces for transactions, cards, bank accounts, and analytics categories.
- Zero External UI Kits: Built entirely with standard React Native primitives (`StyleSheet`, `Pressable`, `ScrollView`, `Modal`) for maximum rendering speed and cross-platform reliability.

---

## Architecture and Project Structure

```text
pulse-money/
├── App.tsx                   # Root state: splash lifecycle, auth lock gate, tab routing
├── PulseMoney.pen            # Complete high-fidelity vector design source specification
├── package.json              # Project dependencies and script declarations
├── tsconfig.json             # TypeScript compiler configuration
└── src/
    ├── components/           # Reusable presentational components
    │   ├── BalanceCard.tsx   # Hero balance surface with Send, Receive, Top up, and Card actions
    │   ├── BottomTabBar.tsx  # Floating safe-area inset navigation bar
    │   ├── Header.tsx        # User greeting, initials badge, and unread notification bell
    │   └── TransactionItem.tsx # Financial ledger line item with signed values
    ├── constants/
    │   └── theme.ts          # Unified palette, spacing tokens, and border radii
    ├── data/
    │   └── mockData.ts       # Seed data for cards, linked banks, payees, and transactions
    ├── screens/              # Primary views and interactive modal workflows
    │   ├── AuthLockScreen.tsx # PIN pad and biometric Face ID / Fingerprint prompt
    │   ├── CardsScreen.tsx   # Virtual debit card, freeze toggle, online pay, limit controls
    │   ├── HelpCenterModal.tsx # Searchable FAQ accordion, live chat, and support phone actions
    │   ├── HomeScreen.tsx    # Reactive two-way ledger dashboard with transfer execution
    │   ├── InsightsScreen.tsx # Multi-timeframe analytics (Week, Month, Year) with period picker
    │   ├── NotificationsModal.tsx # Activity feed with read / unread status clearing
    │   ├── PersonalInfoModal.tsx # Tier 2 verified KYC status and legal identity overview
    │   ├── PrivacyTermsModal.tsx # Tabbed reader for Privacy Policy, Terms, and Card Rules
    │   ├── ProfileScreen.tsx # Security switches, biometrics toggle, manual app lock
    │   ├── ReceiveMoneyModal.tsx # Personal QR code, wallet handle, and account details
    │   ├── SendMoneyModal.tsx # Recipient selection, numeric keypad, and dynamic payee creator
    │   ├── SplashScreen.tsx  # Cold-start animated brand launch screen
    │   ├── TopUpModal.tsx    # Multi-source wallet deposit modal with FDIC insurance badge
    │   ├── TransactionHistoryModal.tsx # Filterable transaction archive with search
    │   └── TransferReceiptModal.tsx # Confirmation receipt with reference codes
    ├── types/
    │   └── index.ts          # TypeScript interfaces for all domain entities
    └── utils/
        ├── formatters.ts     # Currency formatting and integer cent float protection
        └── notifications.ts  # Permission handling and local notification dispatch
```

---

## Core Feature Overview

### 1. Authentication and Device Security
- Cold Start Splash Screen: Features an animated branding sequence transitioning seamlessly into the security lock.
- Biometric Gate: Automatically requests native device credentials (Face ID on iOS, Biometric Prompt on Android) upon application mount.
- Numeric Keypad: Fallback 4-digit PIN verification with haptic vibration feedback on incorrect combinations.
- Manual App Locking: Users can re-lock the application on demand from the Profile settings.

### 2. Reactive Financial Ledger
- Two-Way Accounting: Transfers deduct funds from the active balance and append an expense transaction; wallet deposits credit the balance and append an income record.
- Float Guard Utility: Mathematical additions and subtractions are executed in integer cents prior to rendering, preventing display discrepancies such as `$349.99999999999994`.

### 3. Payment and Transfer Engine
- Recent Payees Carousel: Quick-select horizontally scrolling avatars with initials badges.
- Dynamic Payee Creator: In-modal overlay to add new recipients with custom labels without nested modal conflicts.
- Preset Chips: Instant selection of common denominations ($50, $100, $250, $500) alongside custom keypad entry.
- Digital Receipts: Generates a unique transaction reference identifier (`TXN-xxxxxxx`) upon completion.

### 4. Virtual Cards and Payment Controls
- EMV Chip Card Representation: Card surface with metallic gold chip, contact-less icon, and formatted account digits.
- Security Overlays: One-tap freeze action renders a locked overlay blocking transactions.
- Virtual Credentials: Show / hide PIN toggle and online payment toggle for internet checkout control.
- Card Switcher: Create multiple virtual debit cards with custom monthly spending limits and cycle through them via pill navigation.
- Linked Accounts: Summary of external checking and savings bank accounts.

### 5. Multi-Period Spending Analytics
- Dynamic Timeframes: Toggle between Week, Month, and Year to recalculate expenditures, top expense categories, and percentage allocations.
- Period Calendar Selector: Interactive modal offering granular selection across recent weeks, billing cycles, or fiscal years.

### 6. Account, Support, and Legal Compliance
- Tier 2 KYC Verification: Identity confirmation card displaying legal name, SSN mask, citizenship, and residential address.
- Help Center: Real-time search across categorized financial FAQs with instant live chat and phone dispatch actions.
- Legal Reader: In-app compliance viewer for GLBA privacy disclosures, terms of service, and cardholder rules.

---

## Technology Stack

- Runtime: React Native 0.88.1, React 19.3.0
- Tooling: Expo SDK 58
- Language: TypeScript 6.0.3
- Iconography: `@expo/vector-icons` (Feather)
- Biometrics: `expo-local-authentication`
- Notifications: `expo-notifications`
- Layout & Insets: `react-native-safe-area-context`

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Expo Go on iOS or Android (or an active simulator)

### Installation
```bash
git clone https://github.com/osazuwamatthewogbebor/pulse-money-rn.git
cd pulse-money-rn
npm install
```

### Running Locally
```bash
npx expo start
```
Scan the displayed QR code with your iOS Camera or Android Expo Go app to launch the live application on your device.

---

## Testing Credentials

- Default Security PIN: `1234` (or `0000`)
- Biometric Simulation: On devices with enrolled biometrics, tap the biometric key in the keypad to trigger hardware authentication.
