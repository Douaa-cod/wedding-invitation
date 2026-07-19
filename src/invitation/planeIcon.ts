/**
 * Tracé SVG unique de l'avion — partagé par le mini-avion de la ligne de vol
 * (CoverSection, route France → Tunisie) et l'avion continu du parcours de
 * scroll (FlightJourney) : un seul dessin, jamais deux icônes différentes.
 *
 * Orientation native du tracé : pointe vers le HAUT (nez en haut). Chaque
 * usage applique sa propre rotation selon le sens de vol voulu :
 *  - CoverSection tourne de 82° pour pointer vers la droite (route horizontale).
 *  - FlightJourney tourne de 180° pour pointer vers le bas (descend avec le scroll).
 */
export const PLANE_PATH =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'
