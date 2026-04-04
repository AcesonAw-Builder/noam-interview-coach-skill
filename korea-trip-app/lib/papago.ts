export function buildPapagoLinks(text: string): { deepLink: string; webUrl: string } {
  const encoded = encodeURIComponent(text);
  return {
    deepLink: `papago://translate?message=${encoded}&sourceLanguage=en&targetLanguage=ko`,
    webUrl: `https://papago.naver.com/?sk=en&tk=ko&st=${encoded}`,
  };
}

export function buildNaverMapsDirections(from: string, to: string): string {
  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  return `https://map.naver.com/v5/directions/-/-/${encodedFrom}/${encodedTo}/car`;
}

export function buildKakaoMapsTransit(from: string, to: string): string {
  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  return `https://map.kakao.com/?map_type=TYPE_MAP&from=${encodedFrom}&to=${encodedTo}&mode=transit`;
}

export function buildGoogleMapsDirections(from: string, to: string, mode: "driving" | "transit"): string {
  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  return `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedTo}&travelmode=${mode}`;
}

export function buildNaverMapsSearch(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://map.naver.com/v5/search/${encoded}`;
}
