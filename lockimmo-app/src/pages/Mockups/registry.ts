import type React from 'react';
import { GestionLocative } from './mockups/GestionLocative';
import { Syndic } from './mockups/Syndic';
import { Saisonnier } from './mockups/Saisonnier';
import { Transactions } from './mockups/Transactions';

/**
 * Registre des mockups produit (écrans statiques, sans animation).
 *
 * Convention : 1 mockup = 1 fichier autonome dans ./mockups/.
 * Pour en ajouter un : créer le fichier, l'importer, ajouter une entrée ici.
 */
export type MockupDef = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  width: number;
  height: number;
  Component: React.FC;
};

export const MOCKUPS: MockupDef[] = [
  {
    id: 'gestion-locative',
    title: 'Logiciel de gestion locative',
    description: "Une gestion sous contrôle : occupation pleine, aucun impayé, et les quittances qui partent sans vous.",
    tags: ['Automatisation des tâches', 'Gestion des baux', 'Obligations comptables', 'Encaissements', 'Facturation électronique'],
    width: 960,
    height: 640,
    Component: GestionLocative,
  },
  {
    id: 'syndic',
    title: 'Logiciel de syndic de copropriété',
    description: "L'assemblée générale maîtrisée : quorum atteint, résolutions votées, PV généré et diffusé automatiquement.",
    tags: ['Centralisation des documents', 'Gestion des AG', 'Gestion des copropriétés', 'Rappels'],
    width: 960,
    height: 640,
    Component: Syndic,
  },
  {
    id: 'saisonnier',
    title: 'Logiciel de locations saisonnières',
    description: 'Un planning qui ne désemplit pas, des annonces synchronisées partout et zéro double réservation.',
    tags: ['Planning multi-biens', 'Synchronisation des canaux', 'Ménage & check-in', 'Taxe de séjour'],
    width: 960,
    height: 640,
    Component: Saisonnier,
  },
  {
    id: 'transactions',
    title: 'Logiciel de transactions',
    description: 'Un pipeline qui avance : offres acceptées, compromis signés électroniquement, honoraires en vue.',
    tags: ['Pipeline de vente', 'Mandats', 'Signature électronique', 'Honoraires'],
    width: 960,
    height: 640,
    Component: Transactions,
  },
];
