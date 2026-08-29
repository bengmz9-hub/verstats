#!/usr/bin/env node

// Build Script para Verstats
// Minifica CSS y JavaScript con esbuild de forma segura y aplica cache-busting en index.html
// Uso: node build.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

const ROOT_DIR = __dirname;
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const HTML_FILE = path.join(ROOT_DIR, 'index.html');

const CSS_SRC = path.join(ASSETS_DIR, 'styles.css');
const JS_SRC = path.join(ASSETS_DIR, 'script.js');
const CSS_OUT = path.join(ASSETS_DIR, 'styles.min.css');
const JS_OUT = path.join(ASSETS_DIR, 'script.min.js');

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getFileHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

async function build() {
  try {
    const cssRaw = fs.readFileSync(CSS_SRC, 'utf8');
    const jsRaw = fs.readFileSync(JS_SRC, 'utf8');

    // 1. Minificación ultra-rápida y segura con esbuild
    const cssResult = await esbuild.transform(cssRaw, { loader: 'css', minify: true });
    const jsResult = await esbuild.transform(jsRaw, { loader: 'js', minify: true });

    fs.writeFileSync(CSS_OUT, cssResult.code, 'utf8');
    fs.writeFileSync(JS_OUT, jsResult.code, 'utf8');

    // 2. Generar hashes para Cache-Busting
    const cssHash = getFileHash(cssResult.code);
    const jsHash = getFileHash(jsResult.code);

    // 3. Inyectar versión en index.html si existe
    if (fs.existsSync(HTML_FILE)) {
      let htmlContent = fs.readFileSync(HTML_FILE, 'utf8');

      // Actualizar enlace CSS
      htmlContent = htmlContent.replace(
        /href=["']assets\/(?:styles|styles\.min)\.css(?:\?[^"']*)?["']/g,
        `href="assets/styles.min.css?v=${cssHash}"`
      );

      // Actualizar script JS
      htmlContent = htmlContent.replace(
        /src=["']assets\/(?:script|script\.min)\.js(?:\?[^"']*)?["']/g,
        `src="assets/script.min.js?v=${jsHash}"`
      );

      fs.writeFileSync(HTML_FILE, htmlContent, 'utf8');
    }

    // 4. Reporte
    const cssSaved = cssRaw.length - cssResult.code.length;
    const jsSaved = jsRaw.length - jsResult.code.length;
    const totalOriginal = cssRaw.length + jsRaw.length;
    const totalSaved = cssSaved + jsSaved;

    process.stdout.write(`\n[Build] Minificacion completada (esbuild):\n`);
    process.stdout.write(`  CSS: ${formatSize(cssRaw.length)} -> ${formatSize(cssResult.code.length)} (ahorro: ${((cssSaved / cssRaw.length) * 100).toFixed(1)}%) [v=${cssHash}]\n`);
    process.stdout.write(`  JS:  ${formatSize(jsRaw.length)} -> ${formatSize(jsResult.code.length)} (ahorro: ${((jsSaved / jsRaw.length) * 100).toFixed(1)}%) [v=${jsHash}]\n`);
    process.stdout.write(`  Total ahorrado: ${formatSize(totalSaved)} (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)\n`);
    process.stdout.write(`  Cache-busting inyectado en index.html con exito.\n\n`);

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();

