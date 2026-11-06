# asset-crunch 🎨

[![CI](https://github.com/dani-s-h007/asset-crunch/actions/workflows/ci.yml/badge.svg)](https://github.com/dani-s-h007/asset-crunch/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> **Zero-dependency SVG optimizer & media asset size budget guard for web performance.**

Uncompressed images and bloated SVGs committed to git repositories degrade website Core Web Vitals (Largest Contentful Paint - LCP), inflate page loads, and bloat git clone operations. Vector assets exported from Illustrator, Inkscape, or Figma are loaded with unnecessary XML doctypes, metadata tags, editor namespaces, and 8-decimal coordinate precision. `asset-crunch` optimizes SVGs and enforces image size budgets across your project in CI.

---

## ✨ Features

- **Zero-Dependency SVG Optimization**: Strips XML prologs, doctypes, comments, Inkscape/Illustrator metadata, and rounds excessive coordinate decimals for 40-70% size reduction.
- **Media Size Budget Guard**: Recursively audits repository assets (`.png`, `.jpg`, `.svg`, `.webp`, `.mp4`) against team budgets (`--max-kb 200`).
- **Actionable Format Recommendations**: Advises when to convert legacy PNGs or JPEGs to modern WebP/AVIF.
- **Zero Runtime Dependencies**: Ultra-fast execution with zero third-party dependencies.

---

## 🚀 Installation & Demo

```bash
# Run on-demand with npx
npx asset-crunch --help

# Run the live demo:
npm run demo
```

---

## 🛠️ CLI Usage

```bash
# Check media size budgets across current repository:
asset-crunch

# Fail CI if any image exceeds 250 KB:
asset-crunch --max-kb 250 --strict

# Optimize an SVG file:
asset-crunch --optimize-svg logo.svg -o logo.min.svg

# Output structured JSON:
asset-crunch --json
```

---

## 💻 Programmatic TypeScript API

```typescript
import { optimizeSvg, auditMediaBudgets } from 'asset-crunch';

const result = optimizeSvg(rawSvg, { precision: 2 });
console.log(`Saved ${result.savingsPct}% (${result.savedBytes} bytes)`);
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © Essentials Toolkit Authors

