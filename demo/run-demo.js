#!/usr/bin/env node
/**
 * asset-crunch: Interactive Live Demo
 */

import { optimizeSvg } from '../src/svg-optimizer.js';

console.log('\n🚀 Starting asset-crunch Interactive Demo...\n');

// Sample unoptimized SVG exported from an editor with bloated metadata and excessive precision
const bloatedSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In . SVG Version: 1.2.0 Build 709) -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 100 100">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <cc:Work rdf:about="" xmlns:cc="http://creativecommons.org/ns#">
        <dc:format xmlns:dc="http://purl.org/dc/elements/1.1/">image/svg+xml</dc:format>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g>
    <!-- Circle Icon Path with excessive floating point precision -->
    <path d="M 10.45689123 20.91238491 C 30.12398512 40.54829102 50.19283749 60.19283749 80.99283719 90.11928374" stroke="#ff0055" fill="none" />
  </g>
</svg>
`;

console.log(`Original SVG Size: ${Buffer.byteLength(bloatedSvg, 'utf8')} Bytes`);
const result = optimizeSvg(bloatedSvg, { precision: 2 });

console.log(`Optimized SVG Size: ${result.optimizedSize} Bytes`);
console.log(`Byte Reduction:     ${result.savedBytes} Bytes (${result.savingsPct}% savings)\n`);

console.log('Optimized SVG Output:');
console.log('------------------------------------------------------------');
console.log(result.content);
console.log('------------------------------------------------------------');
console.log('🎉 Demo completed successfully!\n');

