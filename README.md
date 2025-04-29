# Next.js Admin Dashboard – Frontend Test

## ✨ Projektové Info
Tato aplikace je admin dashboard postavený v Next.js 15 pomocí TypeScriptu, NextAuth.js a shadcn/ui komponent.  
Dashboard umožňuje správu uživatelů, analýzu jejich přihlášení, detekci podezřelých aktivit a správu účtu admina.

> Projekt je připravený podle zadání frontend testu od ProCorp.

---

## 🔧 Technologie
- Next.js 15 (App Router, Server Components)
- TypeScript
- NextAuth.js (GitHub OAuth + přihlašování přes email+heslo)
- Tailwind CSS a shadcn/ui
- Recharts pro vizualizace (grafy)
- Sonner pro notifikace
- Zustand pro správu stavu (volitelné)
- Cypress pro end-to-end testy

---

## 🚀 Instalace

1. Nainstaluj závislosti:
```
pnpm install
```
(nebo `npm install` / `yarn install` podle správce balíčků)

2. Připrav environment:
- Vytvoř soubor `.env` podle `.env.example`
- Vyplň přihlašovací údaje pro GitHub OAuth a email přihlášení.

3. Spusť vývojový server:
```
pnpm dev
```
Aplikace poběží na [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Environment Variables

`.env`:
```
NEXTAUTH_SECRET=nějaký-silný-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

ADMIN_EMAIL=test@email.com
ADMIN_PASSWORD=123456
```

Soubor `.env.example` je součástí repozitáře.

---

## 📚 Funkcionality

- Přihlášení přes GitHub OAuth a Credentials (email + heslo)
- Dashboard chráněný AuthGuardem
- Správa uživatelů (listování, filtrování, editace, mazání na client-side)
- Detail uživatele (/users/[id])
- Analytika aktivity (graf frekvence přihlášení za posledních 30 dní)
- Seznam posledních přihlášení
- Detekce podezřelých aktivit (skoky v přihlášeních)
- Mocknuté API routy (/api/users, /api/activity)
- Podpora Dark/Light módu
- Základní Cypress testy

---

## 🧪 Testování

Spusť Cypress:
```
pnpm cypress open
```
Nebo přímo:
```
pnpm cypress run
```

---

## 🐳 Docker (volitelné)

Chceš-li buildit jako Docker kontejner:
```
docker build -t nextjs-admin-dashboard .
docker run -p 3000:3000 nextjs-admin-dashboard
```

---

## 🛡️ Role Management (Bonus)

- Aktuálně je implementovaný pouze admin přístup.
- Lze snadno rozšířit na RBAC (Role-Based Access Control).

---

## 🖌️ UX/UI

- Komponenty přizpůsobené světlému i tmavému režimu.
- Responsivní layout.
- Srozumitelný design.

---

## 👨‍💻 Autor

- [Šimon Buchta](https://github.com/simonbuchta)

---

> Poznámka: Tento projekt byl vytvořený čistě pro účely zadání frontendového testu.
