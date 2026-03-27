// import React, { useState } from 'react';
// import IncidentBoard from './IncidentBoard';
// import IncidentDetail from './IncidentDetail';

// export default function App() {
//   const [selectedIncident, setSelectedIncident] = useState(null);

//   return (
//     <div className="flex h-screen">
//       {/* Incident board links of rechts */}
//       <IncidentBoard
//         incidents={/* je incidenten */}
//         onIncidentClick={(incident) => setSelectedIncident(incident)}
//       />

//       {/* IncidentDetail popup */}
//       {selectedIncident && (
//         <IncidentDetail
//           incident={selectedIncident}
//           units={/* units */}
//           user={/* current user */}
//           onClose={() => setSelectedIncident(null)}
//           onRefresh={() => {/* herlaad incidenten */}}
//         />
//       )}

//       {/* Optioneel: knop om nieuw incident aan te maken */}
//       <button
//         onClick={() => setSelectedIncident({
//           incident_number: 'Nieuw',
//           title: '',
//           notes: [],
//           priority: 2,
//           assigned_units: [],
//           persons: [],
//           vehicles: [],
//         })}
//       >
//         + Nieuw Incident
//       </button>
//     </div>
//   );
// }