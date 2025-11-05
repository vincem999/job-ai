<template>
  <div class="home-page">
    <div class="hero">
      <h1 class="title">CV Optimizer</h1>
      <p class="subtitle">
        Générateur automatique de CV et lettres de motivation adaptés à vos offres d'emploi
      </p>

      <div class="actions">
        <NuxtLink to="/test-cv" class="btn btn-primary">
          Tester le Template CV
        </NuxtLink>
      </div>
    </div>

    <div class="features">
      <h2>Fonctionnalités (en développement)</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>🔍 Analyse d'offres</h3>
          <p>Analyse automatique des offres d'emploi pour extraire les compétences et mots-clés importants</p>
        </div>

        <div class="feature-card">
          <h3>📄 Adaptation CV</h3>
          <p>Adaptation intelligente de votre CV master pour chaque offre d'emploi</p>
        </div>

        <div class="feature-card">
          <h3>✉️ Lettres personnalisées</h3>
          <p>Génération automatique de lettres de motivation personnalisées</p>
        </div>

        <div class="feature-card">
          <h3>📁 Export PDF</h3>
          <p>Export direct en PDF professionnel prêt à être envoyé</p>
        </div>
      </div>
    </div>

    <div class="tech-stack">
      <h2>Stack Technique</h2>
      <div class="tech-tags">
        <span class="tech-tag">Nuxt 4</span>
        <span class="tech-tag">Vue 3</span>
        <span class="tech-tag">TypeScript</span>
        <span class="tech-tag">Nuxt UI</span>
        <span class="tech-tag">OpenAI API</span>
        <span class="tech-tag">Vercel</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Métadonnées de la page
useHead({
  title: 'CV Optimizer - Générateur de CV et lettres personnalisés',
  meta: [
    {
      name: 'description',
      content: 'Générez automatiquement des CV et lettres de motivation adaptés à chaque offre d\'emploi avec l\'intelligence artificielle.'
    }
  ]
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
  line-height: 1.6;
}

.actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.features, .tech-stack {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features {
  background: white;
}

.features h2, .tech-stack h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 3rem 0;
  color: #1f2937;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.tech-stack {
  background: #f9fafb;
  text-align: center;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
}

.tech-tag {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: transform 0.2s ease;
}

.tech-tag:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.125rem;
  }

  .hero {
    padding: 3rem 1rem;
  }

  .features, .tech-stack {
    padding: 3rem 1rem;
  }

  .features h2, .tech-stack h2 {
    font-size: 2rem;
  }
}
</style>