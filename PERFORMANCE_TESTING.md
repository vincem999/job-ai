# Performance Testing Guide

Ce guide décrit comment effectuer des tests de performance sur l'application CV Optimizer selon les benchmarks définis dans le PRD.

## Métriques de Performance Cibles

### PRD Requirements (MVP - Phase 1-2)
- ⏱️ **Temps de génération** : < 10 secondes du clic au PDF téléchargeable
- 🎯 **Taux de réussite** : > 95% des générations sans erreur
- 📄 **Qualité PDF** : Format A4 professionnel, print-ready
- 💰 **Coût par génération** : < $0.05 (OpenAI API)

### Lighthouse Benchmarks
- **Performance Score** : > 85/100
- **Accessibility** : > 90/100
- **Best Practices** : > 90/100
- **SEO** : > 90/100

### Core Web Vitals
- **First Contentful Paint (FCP)** : < 1.5s
- **Time to Interactive (TTI)** : < 3s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **Cumulative Layout Shift (CLS)** : < 0.1

## Outils Installés

### Lighthouse CLI
- **lighthouse** : Lighthouse CLI standalone
- **@lhci/cli** : Lighthouse CI pour tests automatisés
- **@lhci/viewer** : Interface web pour visualiser les résultats

### Configuration
- **lighthouserc.json** : Configuration des tests automatisés
- **scripts/performance-test.js** : Script personnalisé de test de performance

## Scripts Disponibles

### Tests de Performance Complets
```bash
# Lancer les tests de performance complets avec validation
pnpm perf
```

Ce script :
1. Vérifie que le serveur dev est en cours d'exécution
2. Lance Lighthouse sur toutes les pages importantes
3. Valide les résultats contre les seuils PRD
4. Génère des rapports HTML et JSON détaillés
5. Affiche un résumé avec succès/échecs

### Tests Lighthouse CI
```bash
# Lancer Lighthouse CI (pour CI/CD)
pnpm perf:ci

# Ouvrir l'interface web Lighthouse CI
pnpm perf:open
```

### Test Lighthouse Manuel
```bash
# Test Lighthouse simple sur la page d'accueil
pnpm lighthouse
```

## Utilisation

### 1. Démarrer l'Application
```bash
pnpm dev
```

### 2. Lancer les Tests de Performance
```bash
# Dans un autre terminal
pnpm perf
```

### 3. Analyser les Résultats

Les rapports sont générés dans `./reports/` :
- **lighthouse-*.html** : Rapports détaillés Lighthouse (ouvrir dans le navigateur)
- **lighthouse-*.json** : Données brutes pour analysis programmatique
- **performance-summary.json** : Résumé de tous les tests avec validation

### 4. Interpréter les Résultats

#### ✅ Succès
Si tous les tests passent, l'application respecte les benchmarks PRD.

#### ❌ Échecs
Les échecs sont listés avec les seuils dépassés. Exemples d'optimisations :

**Performance < 85** :
- Optimiser les images (WebP, tailles multiples)
- Réduire le bundle JavaScript
- Implémenter le lazy loading

**FCP > 1.5s** :
- Prioriser le contenu above-the-fold
- Optimiser les fonts (preload, font-display)
- Réduire le CSS critique

**TTI > 3s** :
- Code splitting pour réduire le JS initial
- Preload des ressources critiques
- Optimiser les third-party scripts

**LCP > 2.5s** :
- Optimiser l'image/élément LCP principal
- Server-side rendering pour contenu critique
- CDN pour ressources statiques

**CLS > 0.1** :
- Réserver l'espace pour images/videos
- Éviter l'insertion de contenu dynamique
- Utiliser transform au lieu de layout properties

## Intégration CI/CD

Pour automatiser les tests en CI/CD, ajouter dans votre pipeline :

```yaml
# .github/workflows/performance.yml
- name: Install dependencies
  run: pnpm install

- name: Build application
  run: pnpm build

- name: Start application
  run: pnpm preview &

- name: Wait for server
  run: sleep 10

- name: Run performance tests
  run: pnpm perf
```

## Surveillance Continue

### Outils de Monitoring en Production
- **Lighthouse CI** : Tests automatisés sur chaque deploy
- **Sentry Performance** : Monitoring temps réel des métriques
- **Vercel Analytics** : Web Vitals en production

### Alertes Recommandées
- Score Performance < 80 en production
- FCP > 2s en moyenne
- TTI > 4s en moyenne
- Erreurs > 5% du trafic

## Troubleshooting

### Erreur: Server not running
```bash
# Démarrer le serveur en mode dev
pnpm dev

# Ou en mode preview (plus proche de la production)
pnpm build && pnpm preview
```

### Erreur: Chrome flags
Si vous rencontrez des erreurs Chrome, essayer :
```bash
# Alternative sans sandbox (Linux containers)
lighthouse http://localhost:3000 --chrome-flags="--no-sandbox --disable-dev-shm-usage --disable-gpu"
```

### Performances Variables
Les performances peuvent varier selon :
- Charge du système
- État du réseau
- Cache du navigateur

Pour des résultats cohérents :
1. Fermer les autres applications
2. Utiliser un réseau stable
3. Lancer plusieurs fois et faire la moyenne

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Nuxt Performance](https://nuxt.com/docs/guide/concepts/rendering#performance)
- [PRD Performance Requirements](./taskmaster/docs/prd.txt)