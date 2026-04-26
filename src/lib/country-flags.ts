const countryFlags: { [key: string]: string } = {
  'Afganistán': '🇦🇫',
  'Alemania': '🇩🇪',
  'Argentina': '🇦🇷',
  'Australia': '🇦🇺',
  'Bélgica': '🇧🇪',
  'Brasil': '🇧🇷',
  'Canadá': '🇨🇦',
  'Chile': '🇨🇱',
  'China': '🇨🇳',
  'Colombia': '🇨🇴',
  'Corea del Sur': '🇰🇷',
  'Dinamarca': '🇩🇰',
  'Egipto': '🇪🇬',
  'España': '🇪🇸',
  'Estados Unidos': '🇺🇸',
  'Finlandia': '🇫🇮',
  'Francia': '🇫🇷',
  'Grecia': '🇬🇷',
  'Hong Kong': '🇭🇰',
  'Hungría': '🇭🇺',
  'India': '🇮🇳',
  'Irán': '🇮🇷',
  'Irlanda': '🇮🇪',
  'Islandia': '🇮🇸',
  'Israel': '🇮🇱',
  'Italia': '🇮🇹',
  'Japón': '🇯🇵',
  'México': '🇲🇽',
  'Noruega': '🇳🇴',
  'Nueva Zelanda': '🇳🇿',
  'Países Bajos': '🇳🇱',
  'Polonia': '🇵🇱',
  'Portugal': '🇵🇹',
  'Reino Unido': '🇬🇧',
  'República Checa': '🇨🇿',
  'Rumania': '🇷🇴',
  'Rusia': '🇷🇺',
  'Suecia': '🇸🇪',
  'Suiza': '🇨🇭',
  'Taiwán': '🇹🇼',
  'Turquía': '🇹🇷',
  'URSS': '☭',
};

export function getCountryFlag(countryName: string): string {
  if (countryFlags[countryName]) {
    return countryFlags[countryName];
  }

  const countries = countryName.split(/, | y /);
  const flags = countries.map(c => countryFlags[c.trim()]).filter(Boolean);

  if (flags.length > 0) {
    return flags.join(' ');
  }

  return '🏳️';
}
