# Avsaar Autofill Assistant (Chrome Extension)

Avsaar Autofill Assistant is a production-grade, highly secure Manifest V3 Chrome Extension designed specifically to solve the repetitive form-filling problem faced by university students during placement and internship drives. 

Optimized deeply for the unique DOM structure and dynamic accessibility system of **Google Forms**, it behaves like a polished, startup-grade tool (think "1Password or Grammarly for placement drives"), allowing students to save their academic, personal, and professional profiles once and intelligently autofill future forms instantly.

---

## ⚡ Key Features

1. **Intelligent Semantic Matching**: Bypasses rigid character checks using **Fuse.js** fuzzy matching algorithms and a customized dictionary of synonyms (e.g. mapping "Roll No", "University Roll", or "Kiit Roll Number" automatically to the same saved profile property).
2. **Robust Google Forms DOM Scanning**: Scans pages recursively targeting accessibility nodes like `role="listitem"`, `role="heading"`, `role="radio"`, and `role="listbox"`, ensuring resilience against dynamic Google styling.
3. **Controlled Input value Simulation**: Uses custom prototype value descriptors and triggers native input, change, and blur events, ensuring Google Form's React/Closure framework accurately binds and saves autofilled values.
4. **Dynamic Dropdowns & Radio Buttons**: Programmatically expands custom select menus (`role="listbox"`), identifies appropriate targets (`role="option"`), and automatically clicks matching radio buttons.
5. **Drag-Resilient FAB UI**: Injects a premium, modern floating pill button (`⚡ Fill Placement Form`) with subtle hover micro-animations into Google Forms pages.
6. **Encapsulated Shadow DOM Isolation**: Renders all injected UI (FAB, Side Review Drawer, Toasts) inside a private Shadow DOM container, avoiding any CSS style pollution, conflicts, or security warnings.
7. **Autofill Review Panel**: Displays a structured slide-out dashboard detailing successfully populated fields, warnings for low-confidence matches (50%-80% match thresholds), and unmatched fields requiring manual fill.
8. **Multi-Page Support**: Observes forms for dynamic transitions (using a `MutationObserver`). When a student navigates to a new page in a multi-page form, it automatically auto-populates the new section silently.
9. **Zero-Server Local Privacy**: Guarantees complete data privacy. All student credentials remain saved strictly inside the client's local Chrome browser storage via `chrome.storage.sync`.
10. **Visual Feedback Highlights**: Automatically triggers elegant, animated violet glowing border highlights around autofilled inputs.

---

## 🛠️ Tech Stack & Architecture

- **Extension Specification**: Manifest V3
- **Frontend Panel**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Matching Core**: Fuse.js, custom normalizers
- **Storage Driver**: Chrome Storage Sync (`chrome.storage.sync`)
- **Injection Sandbox**: Shadow DOM Encapsulated Vanilla JS + inline-compiled CSS

### Project Directory Structure

```text
avsaar-autofill-extension/
├── package.json                    # Extension metadata & dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite config for React popup compilation
├── vite.content.config.ts          # Vite library configuration for content scripts
├── vite.background.config.ts        # Vite library configuration for service workers
├── tailwind.config.js              # Tailwind setup with custom HSL brand colors
├── postcss.config.js               # CSS compile pipe
├── generate_icons.js               # Visual brand icon generator script
├── public/
│   ├── manifest.json               # Manifest V3 metadata
│   ├── icon-16.png                 # Brand icons (16x16)
│   ├── icon-48.png                 # Brand icons (48x48)
│   └── icon-128.png                # Brand icons (128x128)
└── src/
    ├── popup/                      # Popup dashboard directory
    │   ├── index.html              # Popup DOM template
    │   ├── main.tsx                # React entry
    │   ├── PopupApp.tsx            # Main tabbed dashboard
    │   └── index.css               # Popup Tailwind styles
    ├── content/                    # Injected runner directory
    │   ├── content.ts              # DOM runner and UI creator
    │   └── content.css             # Shadow DOM visual styles
    ├── background/                 # Background worker directory
    │   └── background.ts           # Extension lifecycle listener
    ├── storage/                    # Storage layer
    │   └── chromeStorage.ts        # chrome.storage.sync wrapper
    ├── parser/                     # Parsing layer
    │   └── googleFormsParser.ts    # DOM scanning engine
    ├── matcher/                    # Matching layer
    │   └── fuseMatcher.ts          # Fuzzy semantic matching
    └── utils/                      # Helper utilities
        └── nativeSetter.ts         # React value simulator
```

---

## 🚀 Setup & Build Instructions

Follow these simple steps to compile and install the extension locally in your Chrome browser:

### 1. Prerequisite Installations
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Install Dependencies
Open your terminal in the `avsaar-autofill-extension` directory and run:
```bash
npm install
```
*(On Windows systems where script execution is restricted under PowerShell, run `cmd /c npm install` instead).*

### 3. Build the Extension
Compile the React popup, background service worker, and injected content script bundles:
```bash
npm run build
```
*(Similarly, on restricted PowerShell systems, run `cmd /c npm run build`).*

This will compile and assemble all built files inside a single distributable production folder: **`dist/`**.

---

## 📦 How to Load Unpacked Extension in Chrome

1. Open Google Chrome.
2. In the URL bar, navigate to: `chrome://extensions/`
3. Toggle the **"Developer mode"** switch in the top-right corner of the page to **ON**.
4. Click the **"Load unpacked"** button in the top-left corner.
5. In the file explorer, select the **`dist`** directory located inside `avsaar-autofill-extension/`.
6. That's it! The **Avsaar Autofill Assistant** icon will now appear in your extension toolbar.

---

## 🧪 Functional Verification Guide

To test the extension's robust autofill capabilities:
1. Click the **Avsaar Assistant** extension icon in your browser toolbar to open the popup dashboard.
2. Click the **"Load Mock Profile"** button at the top. This instantly populates a complete mock KIIT B.Tech student profile (personal, academic with 10th/12th percentages, CGPA, backlogs, and professional links).
3. Click the **"Save Changes"** button at the bottom.
4. Navigate to any Google Form (e.g. a placement or internship registration sheet).
5. You will see a premium violet floating button: **`⚡ Fill Placement Form`** appear at the bottom right.
6. Click it! The extension will programmatically match labels, simulate React-controlled typing, automatically click radios/dropdown choices, and open the slide-out **Review Panel** showcasing your success rate!

---

## 📈 Future Scaling Recommendations

Designed as an extensible ecosystem companion, the codebase can easily support:
- **Resume Auto-Upload**: Programmatic triggers to automatically select and upload PDF resumes directly from local cache or connected GDrive paths.
- **Placement Analytics Integration**: Syncing form registration data directly back to the student's Avsaar account to track application history and deadlines automatically.
- **AI-Powered Label Embeddings**: Connecting the match engine to lightweight on-device AI models (e.g. Gemini Nano via Chrome's experimental Prompt API) for context-aware form understanding.
