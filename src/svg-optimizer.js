/**
 * asset-crunch: Zero-Dependency SVG Optimizer
 */

export function optimizeSvg(svgContent, options = {}) {
  if (typeof svgContent !== 'string') return '';
  const precision = options.precision ?? 2;

  let clean = svgContent;

  // 1. Remove XML prolog and doctype
  clean = clean.replace(/<\?xml[\s\S]*?\?>/gi, '');
  clean = clean.replace(/<!DOCTYPE[\s\S]*?>/gi, '');

  // 2. Remove comments
  clean = clean.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Remove editor metadata tags (Inkscape, Illustrator, Sketch)
  clean = clean.replace(/<(?:metadata|sodipodi:[^>]+|inkscape:[^>]+)[\s\S]*?<\/(?:metadata|sodipodi:[^>]+|inkscape:[^>]+)>/gi, '');
  clean = clean.replace(/<sodipodi:[^>]+\/>/gi, '');
  clean = clean.replace(/<(?:i:pgf|sketch:[^>]+)[\s\S]*?<\/(?:i:pgf|sketch:[^>]+)>/gi, '');

  // 4. Remove editor namespace attributes
  clean = clean.replace(/\s*(?:xmlns:inkscape|xmlns:sodipodi|xmlns:sketch|xmlns:adobe|inkscape:[a-z-]+|sodipodi:[a-z-]+)="[^"]*"/gi, '');

  // 5. Remove empty groups: <g></g> or <g/>
  clean = clean.replace(/<g\s*>\s*<\/g>/gi, '');
  clean = clean.replace(/<g\s*\/>/gi, '');

  // 6. Round coordinate floats in path d="..." attributes
  clean = clean.replace(/\bd="([^"]+)"/g, (match, dVal) => {
    const rounded = dVal.replace(/(-?\d+\.\d{3,})/g, (num) => {
      return parseFloat(Number(num).toFixed(precision)).toString();
    });
    return `d="${rounded}"`;
  });

  // 7. Collapse redundant whitespace
  clean = clean.replace(/\s+/g, ' ').replace(/> </g, '><').trim();

  const originalSize = Buffer.byteLength(svgContent, 'utf8');
  const optimizedSize = Buffer.byteLength(clean, 'utf8');
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const savingsPct = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;

  return {
    content: clean,
    originalSize,
    optimizedSize,
    savedBytes,
    savingsPct: Math.round(savingsPct * 100) / 100
  };
}

