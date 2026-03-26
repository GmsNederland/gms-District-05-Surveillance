/**
 * Service Configuration — District 05 Surveillance
 * 
 * Central config for all Dutch emergency services.
 * Colors, labels, icons mapped per service.
 */

export const SERVICES = {
  burger: {
    key: 'burger',
    label: 'Burger',
    sublabel: 'Inwoner',
    color: 'burger',
    cssColor: 'hsl(220, 15%, 40%)',
    icon: 'User',
    description: 'Burger meldpunt — 112 noodoproep',
  },
  meldkamer: {
    key: 'meldkamer',
    label: 'Meldkamer',
    sublabel: 'Centralist',
    color: 'meldkamer',
    cssColor: 'hsl(210, 80%, 55%)',
    icon: 'Radio',
    description: 'Gemeenschappelijke Meldkamer',
  },
  politie: {
    key: 'politie',
    label: 'Politie',
    sublabel: 'Agent',
    color: 'politie',
    cssColor: 'hsl(215, 80%, 42%)',
    icon: 'Shield',
    description: 'Nationale Politie — District 05',
  },
  brandweer: {
    key: 'brandweer',
    label: 'Brandweer',
    sublabel: 'Brandweerman',
    color: 'brandweer',
    cssColor: 'hsl(0, 72%, 48%)',
    icon: 'Flame',
    description: 'Veiligheidsregio Brandweer',
  },
  ambulance: {
    key: 'ambulance',
    label: 'Ambulance',
    sublabel: 'Verpleegkundige',
    color: 'ambulance',
    cssColor: 'hsl(145, 60%, 40%)',
    icon: 'Heart',
    description: 'Regionale Ambulancevoorziening',
  },
  kmar: {
    key: 'kmar',
    label: 'KMar',
    sublabel: 'Marechaussee',
    color: 'kmar',
    cssColor: 'hsl(215, 50%, 28%)',
    icon: 'ShieldCheck',
    description: 'Koninklijke Marechaussee',
  },
  dsi: {
    key: 'dsi',
    label: 'DSI',
    sublabel: 'Specialist',
    color: 'dsi',
    cssColor: 'hsl(270, 50%, 45%)',
    icon: 'Target',
    description: 'Dienst Speciale Interventies',
  },
  mmt: {
    key: 'mmt',
    label: 'MMT',
    sublabel: 'Traumachirurg',
    color: 'mmt',
    cssColor: 'hsl(45, 90%, 50%)',
    icon: 'Siren',
    description: 'Mobiel Medisch Team',
  },
  admin: {
    key: 'admin',
    label: 'Admin',
    sublabel: 'Beheerder',
    color: 'admin',
    cssColor: 'hsl(0, 0%, 60%)',
    icon: 'Settings',
    description: 'Systeembeheer — District 05',
  },
};

export const SERVICE_ORDER = [
  'burger', 'meldkamer', 'politie', 'brandweer', 
  'ambulance', 'kmar', 'dsi', 'mmt', 'admin'
];

// Priority levels for incidents
export const PRIORITY_LEVELS = {
  1: { label: 'PRIO 1', color: 'destructive', description: 'Spoedeisend — Levensgevaar' },
  2: { label: 'PRIO 2', color: 'mmt', description: 'Urgent — Snel ter plaatse' },
  3: { label: 'PRIO 3', color: 'primary', description: 'Gepland — Geen spoed' },
};

// Unit statuses
export const UNIT_STATUSES = {
  beschikbaar: { label: 'Beschikbaar', color: 'ambulance' },
  onderweg: { label: 'Onderweg', color: 'mmt' },
  ter_plaatse: { label: 'Ter Plaatse', color: 'primary' },
  niet_beschikbaar: { label: 'Niet Beschikbaar', color: 'destructive' },
};