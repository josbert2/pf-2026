import fs from 'fs';

let html = fs.readFileSync('seccion.html', 'utf-8');

// VERY basic conversion
let jsx = html.replace(/class="/g, 'className="');

// Convert style="..." to style={{...}}
jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
  const styles = p1.split(';').filter(s => s.trim() !== '');
  const styleObj = {};
  styles.forEach(s => {
    const colonIndex = s.indexOf(':');
    if (colonIndex > -1) {
      const key = s.substring(0, colonIndex).trim();
      const val = s.substring(colonIndex + 1).trim();
      
      let camelKey = key;
      if (!key.startsWith('--')) {
        camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      }
      styleObj[camelKey] = val;
    }
  });
  return 'style={' + JSON.stringify(styleObj) + '}';
});

// Self-closing tags
jsx = jsx.replace(/<img(.*?)>/g, (match, p1) => {
  if (!p1.endsWith('/')) {
    return `<img${p1} />`;
  }
  return match;
});

const componentCode = `import React from 'react';

export default function FramerHeader() {
  return (
    ${jsx}
  );
}
`;
fs.writeFileSync('src/components/FramerHeader.tsx', componentCode);
console.log("Created src/components/FramerHeader.tsx");
