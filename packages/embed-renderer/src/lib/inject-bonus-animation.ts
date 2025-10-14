const POSITIVE_FILL = 'fill="#10b981"';
const GRADIENT_PREFIX = "embed-stat-shine";
const GRADIENT_DEFS_ID = "embed-stat-shine-defs";
const HIGHLIGHT_PRIMARY = "#10b981";
const HIGHLIGHT_MID = "#34d399";
const HIGHLIGHT_PEAK = "#ecfdf5";

/**
 * Satori에서 생성한 SVG 문자열에 샤이닝 애니메이션을 삽입합니다.
 * `fill="#10b981"` 경로를 탐지해 좌→우로 이동하는 하이라이트를 적용합니다.
 */
export function injectBonusAnimation(svg: string): string {
  if (!svg.includes(POSITIVE_FILL)) {
    return svg;
  }

  if (svg.includes(`${GRADIENT_PREFIX}-`)) {
    return svg;
  }

  let index = 0;
  const gradients: string[] = [];
  const positivePathRegex = /<path\b[^>]*fill="#10b981"[^>]*\/>/g;

  const transformedSvg = svg.replace(positivePathRegex, (match) => {
    const gradientId = `${GRADIENT_PREFIX}-${index}`;
    index += 1;

    gradients.push(`<linearGradient id="${gradientId}" gradientUnits="objectBoundingBox">
    <stop offset="0%" stop-color="${HIGHLIGHT_PRIMARY}" stop-opacity="1"/>
    <stop offset="40%" stop-color="${HIGHLIGHT_PRIMARY}" stop-opacity="1"/>
    <stop offset="48%" stop-color="${HIGHLIGHT_MID}" stop-opacity="1"/>
    <stop offset="50%" stop-color="${HIGHLIGHT_PEAK}" stop-opacity="0.95"/>
    <stop offset="52%" stop-color="${HIGHLIGHT_MID}" stop-opacity="1"/>
    <stop offset="100%" stop-color="${HIGHLIGHT_PRIMARY}" stop-opacity="1"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0" dur="2.6s" repeatCount="indefinite"/>
  </linearGradient>`);

    return match.replace(POSITIVE_FILL, `fill="url(#${gradientId})"`);
  });

  if (gradients.length === 0 || transformedSvg === svg) {
    return svg;
  }

  const defsBlock = `<defs id="${GRADIENT_DEFS_ID}">
${gradients.join("\n")}
</defs>`;

  return transformedSvg.replace(/<\/svg>\s*$/, `${defsBlock}</svg>`);
}
