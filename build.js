#!/usr/bin/env node

// Build Script para Verstats
// Minifica CSS y JavaScript para produccion
// Uso: node build.js

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const CSS_SRC = path.join(ASSETS_DIR, 'styles.css');
const JS_SRC = path.join(ASSETS_DIR, 'script.js');
const CSS_OUT = path.join(ASSETS_DIR, 'styles.min.css');
const JS_OUT = path.join(ASSETS_DIR, 'script.min.js');

// Minify CSS: remove comments, extra whitespace
function minifyCSS(content) {
  let minified = content
    // Remove multi-line comments /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove single-line comments //
    .replace(/\/\/.*$/gm, '')
    // Remove leading/trailing whitespace
    .replace(/^\s+|\s+$/gm, '')
    // Remove empty lines
    .replace(/\n\n+/g, '\n')
    // Compress spaces around selectors and properties
    .replace(/\s*([{};:,>+~])\s*/g, '$1')
    // Remove spaces inside @media, @keyframes, etc
    .replace(/(@[a-z-]+)\s+/gi, '$1 ')
    // Remove last semicolon before }
    .replace(/;}/g, '}')
    // Trim final newlines
    .trim();

  return minified;
}

// Minify JavaScript: remove comments, extra whitespace
function minifyJS(content) {
  let minified = content
    // Preserve string literals by replacing them with placeholders
    .split('\n')
    .map(line => {
      // Remove line comments (but not inside strings)
      if (line.includes('//')) {
        const idx = line.indexOf('//');
        // Simple check: count quotes before comment
        const before = line.substring(0, idx);
        const quotes = (before.match(/["']/g) || []).length;
        if (quotes % 2 === 0) {
          return line.substring(0, idx);
        }
      }
      return line;
    })
    .join('\n')
    // Remove multi-line comments /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove leading/trailing whitespace from lines
    .replace(/^\s+|\s+$/gm, '')
    // Remove empty lines
    .replace(/\n\n+/g, '\n')
    // Compress whitespace around operators (but preserve in strings)
    .replace(/\s*([\{\}=;:,\(\)])\s*/g, '$1')
    // Add back space after keywords
    .replace(/(if|for|while|function|return|const|let|var)\(/g, '$1(')
    .trim();

  return minified;
}

// Format file size for display
function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

// Main build function
function build() {


  try {
    // Read source files

    const cssContent = fs.readFileSync(CSS_SRC, 'utf8');
    const jsContent = fs.readFileSync(JS_SRC, 'utf8');

    const cssSizeOriginal = cssContent.length;
    const jsSizeOriginal = jsContent.length;

    // Minify

    const cssMinified = minifyCSS(cssContent);
    const jsMinified = minifyJS(jsContent);

    const cssSizeMin = cssMinified.length;
    const jsSizeMin = jsMinified.length;

    // Write output

    fs.writeFileSync(CSS_OUT, cssMinified, 'utf8');
    fs.writeFileSync(JS_OUT, jsMinified, 'utf8');

    // Calculate and display results
    const cssSaved = cssSizeOriginal - cssSizeMin;
    const jsSaved = jsSizeOriginal - jsSizeMin;
    const totalSaved = cssSaved + jsSaved;



    } -> ${formatSize(cssSizeMin)} (ahorro: ${((cssSaved / cssSizeOriginal) * 100).toFixed(1)}%)`);
    } -> ${formatSize(jsSizeMin)} (ahorro: ${((jsSaved / jsSizeOriginal) * 100).toFixed(1)}%)`);
    } (${(((totalSaved) / (cssSizeOriginal + jsSizeOriginal)) * 100).toFixed(1)}%)\n`);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
build();
