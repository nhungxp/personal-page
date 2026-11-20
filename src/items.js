// Alt innhold i skattejakten ligger her, så det er lett å endre.
//
// msg  = det personen sier når den finner tingen i mørket
// name = brukes som skjermleser-tekst

export const DECOYS = [
  { id: 'pad', icon: 'pad', name: 'Spillkontroller', msg: 'En spillkontroller! Ikke nå... vi må finne lys først.' },
  { id: 'book', icon: 'book', name: 'Skissebok', msg: 'Skisseboka mi! Her starter alle ideene.' },
  { id: 'mug', icon: 'mug', name: 'Tekopp', msg: 'En kopp kald te. Noen har vært her før.' },
  { id: 'sock', icon: 'sock', name: 'Sokk', msg: 'En sokk?! Hvor er den andre...' },
  { id: 'duck', icon: 'duck', name: 'Gummiand', msg: 'En gummiand. Den hjelper meg å finne bugs.' },
  { id: 'vr', icon: 'vr', name: 'VR-briller', msg: 'VR-briller! Men jeg ser fortsatt ingenting.' },
  { id: 'note', icon: 'note', name: 'Post-it-lapp', msg: 'En lapp: «Husk å teste med ekte brukere!»' },
];

export const LINES = {
  clickMe: 'Klikk på meg!',
  intro: 'Jeg ser ingenting! Før musa rundt, så leter vi sammen.',
  matches: 'Fyrstikker! *fsssj* Nå trenger vi noe å tenne på...',
  candleNoMatch: 'Et stearinlys! Men jeg har ingenting å tenne det med...',
  hint: (side) => `Psst... jeg kjenner lukten av svovel et sted mot ${side}.`,
  walkingHome: 'Sånn, ja!',
  welcome: 'Nå ser jeg deg. Velkommen inn!',
  candleLit: 'Lyset brenner så lenge du er her.',
  plane: 'Se, et papirfly! Fang det, så får du se prosjektene mine.',
  planeDodge: 'Haha, det er raskt! Prøv igjen.',
  planePoint: 'Prosjektene ligger i papirflyet. Fang det!',
};

// Mulige plasseringer i prosent av skjermen [x, y].
// Midten er holdt fri, der introteksten dukker opp.
export const SLOTS = [
  [9, 16], [19, 34], [10, 54], [89, 15], [81, 33], [91, 54], [36, 88],
  [52, 90], [70, 86], [86, 79], [40, 11], [62, 10],
];
// (Nede i venstre hjørne er holdt fritt – der står stearinlyset alltid.)

// Strektegninger i samme stil som fyrstikkpersonen (viewBox 0 0 80 80).
export const ICONS = {
  pad: `<path d="M22 28 h36 a14 14 0 0 1 14 14 v6 a10 10 0 0 1 -18 6 l-4 -6 h-20 l-4 6 a10 10 0 0 1 -18 -6 v-6 a14 14 0 0 1 14 -14 z"/>
        <line x1="24" y1="38" x2="24" y2="48"/><line x1="19" y1="43" x2="29" y2="43"/>
        <circle cx="54" cy="40" r="2.5"/><circle cx="60" cy="46" r="2.5"/>`,
  book: `<rect x="16" y="14" width="42" height="54" rx="3"/>
        <line x1="16" y1="22" x2="10" y2="22"/><line x1="16" y1="34" x2="10" y2="34"/>
        <line x1="16" y1="46" x2="10" y2="46"/><line x1="16" y1="58" x2="10" y2="58"/>
        <path d="M26 34 q6 -10 12 0 t12 0"/><line x1="26" y1="50" x2="48" y2="50"/>
        <line x1="56" y1="66" x2="72" y2="48"/>`,
  mug: `<path d="M18 28 h36 v24 a12 12 0 0 1 -12 12 h-12 a12 12 0 0 1 -12 -12 z"/>
        <path d="M54 34 h6 a8 8 0 0 1 0 16 h-6"/><line x1="14" y1="70" x2="62" y2="70"/>`,
  sock: `<path d="M30 10 h18 v32 l14 10 a10 10 0 0 1 -8 18 l-24 -10 a8 8 0 0 1 0 -2 z"/>
        <line x1="30" y1="19" x2="48" y2="19"/>`,
  duck: `<path d="M14 50 q0 18 24 18 h12 q16 0 16 -16 q0 -9 -12 -11 q4 -5 4 -11 a13 13 0 0 0 -26 0 q0 6 4 11 q-14 2 -22 9 z"/>
        <path d="M58 30 l10 2 l-10 5"/><circle class="dot" cx="50" cy="27" r="1.5"/>`,
  vr: `<rect x="12" y="28" width="56" height="26" rx="9"/>
        <circle cx="28" cy="41" r="6"/><circle cx="52" cy="41" r="6"/>
        <path d="M12 36 q-6 -10 6 -14 M68 36 q6 -10 -6 -14"/>`,
  note: `<path d="M18 16 h44 v32 l-16 16 h-28 z"/><path d="M62 48 h-16 v16"/>
        <line x1="26" y1="28" x2="52" y2="28"/><line x1="26" y1="38" x2="44" y2="38"/>`,
};
