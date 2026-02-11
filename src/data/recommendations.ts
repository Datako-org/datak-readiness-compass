import { SectorRecommendation } from '@/types/diagnostic';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

// ============================================================
// TRANSPORT & LOGISTIQUE
// ============================================================

const transportRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité absolue : Centraliser vos données de flotte',
    actions: [
      'Centraliser toutes vos données dans une base unique (véhicules, maintenance, coûts, trajets)',
      'Créer un dashboard simple de suivi de votre flotte',
      'Automatiser l\'import des nouvelles données (carburant, maintenance, km)',
    ],
    impact: 'Gain de temps : 8-12h/semaine | Visibilité immédiate sur vos coûts réels | Détection rapide des anomalies',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez à l\'optimisation data-driven',
    actions: [
      'Analyser vos coûts en profondeur (par véhicule, par km, par trajet)',
      'Automatiser vos reportings mensuels et hebdomadaires',
      'Détecter les opportunités d\'optimisation (véhicules sous-utilisés, surconsommation)',
    ],
    impact: 'ROI : 10-15% de réduction des coûts opérationnels | Pilotage basé sur la data | Réactivité plus rapide sur les dérives',
  },
  avance: {
    title: 'Excellent niveau. Passez à l\'IA prédictive et automatisation avancée',
    actions: [
      'Mettre en place la prédiction de maintenance (anticiper les pannes)',
      'Déployer l\'optimisation automatique des routes et tournées',
      'Activer la détection d\'anomalies en temps réel (coûts, consommation)',
      'Automatiser complètement les workflows de gestion de flotte',
    ],
    impact: 'Réduction significative des pannes non prévues | 5-10% d\'économies supplémentaires | Automatisation des tâches répétitives',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'innovation continue',
    actions: [
      'Benchmarking sectoriel (comparer vos KPIs aux standards du marché)',
      'Innovation IA avancée (jumeaux numériques, simulations de scénarios)',
      'Écosystème data étendu (intégration partenaires, supply chain, clients)',
    ],
    impact: 'Innovation continue et amélioration constante | Avantage concurrentiel durable | Optimisation maximale des opérations',
  },
};

// ============================================================
// RECOMMANDATIONS GÉNÉRIQUES (fallback)
// ============================================================

const genericRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité : Structurer et centraliser vos données',
    actions: [
      'Identifier et centraliser vos sources de données clés',
      'Mettre en place un premier tableau de bord de suivi',
      'Définir vos KPIs prioritaires',
    ],
    impact: 'Gain de temps : 5-10h/semaine | Visibilité sur votre activité | Détection rapide des anomalies',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez à l\'optimisation',
    actions: [
      'Automatiser vos reportings et tableaux de bord',
      'Analyser vos données en profondeur pour identifier les leviers',
      'Former vos équipes à la culture data',
    ],
    impact: 'ROI : 10-15% d\'amélioration de la performance opérationnelle | Pilotage basé sur la data | Réactivité plus rapide sur les dérives',
  },
  avance: {
    title: 'Excellent niveau. Passez à l\'IA et l\'automatisation avancée',
    actions: [
      'Déployer des modèles prédictifs sur vos cas d\'usage clés',
      'Automatiser les processus répétitifs avec l\'IA',
      'Mettre en place la détection d\'anomalies en temps réel',
    ],
    impact: 'Réduction significative des incidents non prévus | Gains de productivité mesurables | Automatisation des tâches répétitives',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'innovation',
    actions: [
      'Benchmarking sectoriel avancé',
      'Innovation IA (modèles avancés, automatisation complète)',
      'Écosystème data étendu avec vos partenaires',
    ],
    impact: 'Innovation continue et amélioration constante | Avantage concurrentiel durable | Optimisation maximale des opérations',
  },
};

// ============================================================
// MAPPING PAR SECTEUR
// ============================================================

const recommendationsBySector: Record<string, Record<MaturityLevel, SectorRecommendation>> = {
  transport: transportRecommendations,
};

export const getRecommendations = (
  sector: string,
  maturityLevel: MaturityLevel
): SectorRecommendation => {
  const sectorRecs = recommendationsBySector[sector];
  if (sectorRecs) {
    return sectorRecs[maturityLevel];
  }
  return genericRecommendations[maturityLevel];
};

export const getMaturityLabel = (level: MaturityLevel): string => {
  const labels: Record<MaturityLevel, string> = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    expert: 'Expert',
  };
  return labels[level];
};

export const getMaturityColor = (level: MaturityLevel) => {
  const colors: Record<MaturityLevel, { text: string; bg: string; border: string }> = {
    debutant: {
      text: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/30',
    },
    intermediaire: {
      text: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
    },
    avance: {
      text: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
    },
    expert: {
      text: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/30',
    },
  };
  return colors[level];
};
