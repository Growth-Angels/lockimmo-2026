import type React from 'react';
import { DataTransfer } from './motions/DataTransfer';

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
];
