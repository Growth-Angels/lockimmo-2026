import type React from 'react';
import { DataTransfer } from './motions/DataTransfer';
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
];
