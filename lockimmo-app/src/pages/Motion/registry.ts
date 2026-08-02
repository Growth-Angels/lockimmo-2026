import React from 'react';
import { DataTransfer } from './motions/DataTransfer';
import { GestionLocative } from '../Mockups/mockups/GestionLocative';
import { Syndic } from '../Mockups/mockups/Syndic';
import { Saisonnier } from '../Mockups/mockups/Saisonnier';
import { Transactions } from '../Mockups/mockups/Transactions';
import { AiAutomation } from './motions/AiAutomation';
import { SupportChat } from './motions/SupportChat';
import { Academie } from './motions/Academie';
import { AuditScan } from './motions/AuditScan';
import { LiveDashboard } from './motions/LiveDashboard';

/**
 * Registre des motions.
 *
 * Convention : 1 motion = 1 fichier autonome dans ./motions/.
 * Pour en ajouter une : créer le fichier, l'importer, ajouter une entrée ici.
 * Aucun autre fichier de l'app n'a besoin d'être touché.
 */
export type MotionDef = {
  id: string;
  title: string;
  description: string;
  ratio: string;
  width: number;
  height: number;
  Component: React.FC;
};

export const MOTIONS: MotionDef[] = [
  {
    id: 'data-transfer',
    title: 'Transfert de données',
    description: "Migration des données d'un logiciel tiers vers LOCKimmo : les enregistrements quittent la source en vrac et arrivent structurés et catégorisés.",
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: DataTransfer,
  },
  {
    id: 'ai-automation',
    title: 'IA · Automatisation des tâches',
    description: "L'IA balaye la liste des tâches récurrentes de gestion locative et les traite une à une, sans intervention : chaque ligne bascule de « En attente » à « Automatisé ».",
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: AiAutomation,
  },
  {
    id: 'support-chat',
    title: 'Support · Chat en direct',
    description: "Une conversation d'assistance qui se joue message par message, indicateurs de saisie compris : le client expose son problème, le support LOCKimmo prend la main.",
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: SupportChat,
  },
  {
    id: 'academie',
    title: "LOCK'Académie",
    description: 'Un carrousel de modules de formation qui défile en continu : miniatures vidéo, durées et progression, pour évoquer la montée en compétence à son rythme.',
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: Academie,
  },
  {
    id: 'audit-scan',
    title: 'Contrôle · Vérification',
    description: "Un flux de pièces défile vers le haut et traverse une zone de scan : chaque document ressort vérifié, les anomalies sont signalées au passage.",
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: AuditScan,
  },
  {
    id: 'live-dashboard',
    title: 'Tableaux de bord temps réel',
    description: 'Mockup figuratif d\'une interface de pilotage financier : les KPI se posent, la courbe se trace, les barres poussent, sous un indicateur « en direct ».',
    ratio: '4:3',
    width: 640,
    height: 480,
    Component: LiveDashboard,
  },

  /* ── Versions animées des mockups produit ──
     Même source que les écrans figés de /mockups : c'est le même composant,
     rendu avec `animated`. Aucune duplication, la version statique reste
     strictement inchangée. */
  {
    id: 'gestion-locative-motion',
    title: 'Gestion locative · animé',
    description: "L'écran de gestion locative qui se construit : KPI, encaissements, automatisations qui se cochent, conformité validée.",
    ratio: '3:2',
    width: 960,
    height: 640,
    Component: () => React.createElement(GestionLocative, { animated: true }),
  },
  {
    id: 'syndic-motion',
    title: 'Syndic · animé',
    description: "L'assemblée générale qui se déroule : le quorum se remplit, les résolutions se votent une à une, le PV part.",
    ratio: '3:2',
    width: 960,
    height: 640,
    Component: () => React.createElement(Syndic, { animated: true }),
  },
  {
    id: 'saisonnier-motion',
    title: 'Locations saisonnières · animé',
    description: 'Le planning qui se remplit séjour après séjour, jusqu’à ne plus laisser un trou, puis les canaux qui se synchronisent.',
    ratio: '3:2',
    width: 960,
    height: 640,
    Component: () => React.createElement(Saisonnier, { animated: true }),
  },
  {
    id: 'transactions-motion',
    title: 'Transactions · animé',
    description: 'Le pipeline qui se remplit de gauche à droite, des mandats jusqu’aux ventes actées et aux honoraires.',
    ratio: '3:2',
    width: 960,
    height: 640,
    Component: () => React.createElement(Transactions, { animated: true }),
  },
];
