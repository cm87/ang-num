# Numbers Generator

Applicazione Angular per la generazione di righe di numeri casuali. Ogni riga contiene 6 numeri principali ordinati e un numero "superstar" univoco.

## Tecnologie

- [Angular](https://angular.dev) 21 (standalone components, signals, new control flow)
- [TypeScript](https://www.typescriptlang.org) 5.9
- [Bootstrap](https://getbootstrap.com) 5

## Prerequisiti

- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0`
- Angular CLI 21

## Avvio sviluppo

```bash
npm start
```

L'applicazione e' disponibile su `http://localhost:4200/`.

## Build

```bash
npm run build
```

Gli artefatti di build si trovano in `dist/angular-numbers/`.

## Test

```bash
npm test
```

I test unitari vengono eseguiti con Karma in modalita headless.

## Deploy su GitHub Pages

```bash
npm run deploy
```

Lo script builda l'applicazione in produzione e la pubblica tramite `angular-cli-ghpages` sul branch `gh-pages`.

## Struttura del progetto

- `src/app/app.component.ts` — root component standalone
- `src/app/app.routes.ts` — definizione delle route con lazy loading
- `src/app/components/dashboard/` — componente principale (generazione numeri)
- `src/app/service/number-generator.service.ts` — logica di generazione numeri

