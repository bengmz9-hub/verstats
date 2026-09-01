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

const CSS_SRC = path.join(ASSETS_DIR, 'styles.css');
const CSS_LEGAL_SRC = path.join(ASSETS_DIR, 'legal.css');
const JS_SRC = path.join(ASSETS_DIR, 'script.js');
const JS_EXTRA_SRC = path.join(ASSETS_DIR, 'servicios-extra.js');

const CSS_OUT = path.join(ASSETS_DIR, 'styles.min.css');
const CSS_LEGAL_OUT = path.join(ASSETS_DIR, 'legal.min.css');
const JS_OUT = path.join(ASSETS_DIR, 'script.min.js');
const JS_EXTRA_OUT = path.join(ASSETS_DIR, 'servicios-extra.min.js');

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getFileHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

async function build() {
  try {
    const cssRaw = fs.readFileSync(CSS_SRC, 'utf8');
    const cssLegalRaw = fs.existsSync(CSS_LEGAL_SRC) ? fs.readFileSync(CSS_LEGAL_SRC, 'utf8') : null;
    const jsRaw = fs.readFileSync(JS_SRC, 'utf8');
    const jsExtraRaw = fs.existsSync(JS_EXTRA_SRC) ? fs.readFileSync(JS_EXTRA_SRC, 'utf8') : null;

    // 1. Minificación ultra-rápida y segura con esbuild
    const cssResult = await esbuild.transform(cssRaw, { loader: 'css', minify: true });
    const jsResult = await esbuild.transform(jsRaw, { loader: 'js', minify: true });

    fs.writeFileSync(CSS_OUT, cssResult.code, 'utf8');
    fs.writeFileSync(JS_OUT, jsResult.code, 'utf8');

    let cssLegalResult = null;
    let cssLegalHash = '';
    if (cssLegalRaw) {
      cssLegalResult = await esbuild.transform(cssLegalRaw, { loader: 'css', minify: true });
      fs.writeFileSync(CSS_LEGAL_OUT, cssLegalResult.code, 'utf8');
      cssLegalHash = getFileHash(cssLegalResult.code);
    }

    let jsExtraResult = null;
    let jsExtraHash = '';
    if (jsExtraRaw) {
      jsExtraResult = await esbuild.transform(jsExtraRaw, { loader: 'js', minify: true });
      fs.writeFileSync(JS_EXTRA_OUT, jsExtraResult.code, 'utf8');
      jsExtraHash = getFileHash(jsExtraResult.code);
    }

    // 2. Generar hashes para Cache-Busting
    const cssHash = getFileHash(cssResult.code);
    const jsHash = getFileHash(jsResult.code);

    // 3. Inyectar versión en index.html si existe
    const HTML_FILE = path.join(ROOT_DIR, 'index.html');
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

    // 4. Inyectar versión en servicios-extra.html si existe
    const EXTRA_HTML_FILE = path.join(ROOT_DIR, 'servicios-extra.html');
    if (fs.existsSync(EXTRA_HTML_FILE)) {
      let extraHtmlContent = fs.readFileSync(EXTRA_HTML_FILE, 'utf8');

      // Actualizar enlace CSS
      extraHtmlContent = extraHtmlContent.replace(
        /href=["']assets\/(?:styles|styles\.min)\.css(?:\?[^"']*)?["']/g,
        `href="assets/styles.min.css?v=${cssHash}"`
      );

      // Actualizar script JS extra
      if (jsExtraHash) {
        extraHtmlContent = extraHtmlContent.replace(
          /src=["']assets\/(?:servicios-extra|servicios-extra\.min)\.js(?:\?[^"']*)?["']/g,
          `src="assets/servicios-extra.min.js?v=${jsExtraHash}"`
        );
      }

      fs.writeFileSync(EXTRA_HTML_FILE, extraHtmlContent, 'utf8');
    }

    // 5. Inyectar versión en páginas legales si existen
    if (cssLegalHash) {
      ['aviso-legal.html', 'privacidad.html', 'cookies.html'].forEach(legalFile => {
        const lPath = path.join(ROOT_DIR, legalFile);
        if (fs.existsSync(lPath)) {
          let lHtml = fs.readFileSync(lPath, 'utf8');
          lHtml = lHtml.replace(
            /href=["']assets\/(?:legal|legal\.min)\.css(?:\?[^"']*)?["']/g,
            `href="assets/legal.min.css?v=${cssLegalHash}"`
          );
          fs.writeFileSync(lPath, lHtml, 'utf8');
        }
      });
    }

    // 6. Reporte
    const cssSaved = cssRaw.length - cssResult.code.length;
    const cssLegalSaved = cssLegalRaw && cssLegalResult ? cssLegalRaw.length - cssLegalResult.code.length : 0;
    const jsSaved = jsRaw.length - jsResult.code.length;
    const jsExtraSaved = jsExtraRaw && jsExtraResult ? jsExtraRaw.length - jsExtraResult.code.length : 0;
    const totalOriginal = cssRaw.length + (cssLegalRaw ? cssLegalRaw.length : 0) + jsRaw.length + (jsExtraRaw ? jsExtraRaw.length : 0);
    const totalSaved = cssSaved + cssLegalSaved + jsSaved + jsExtraSaved;

    process.stdout.write(`\n[Build] Minificacion completada (esbuild):\n`);
    process.stdout.write(`  CSS:          ${formatSize(cssRaw.length)} -> ${formatSize(cssResult.code.length)} (ahorro: ${((cssSaved / cssRaw.length) * 100).toFixed(1)}%) [v=${cssHash}]\n`);
    if (cssLegalRaw && cssLegalResult) {
      process.stdout.write(`  CSS (Legal):  ${formatSize(cssLegalRaw.length)} -> ${formatSize(cssLegalResult.code.length)} (ahorro: ${((cssLegalSaved / cssLegalRaw.length) * 100).toFixed(1)}%) [v=${cssLegalHash}]\n`);
    }
    process.stdout.write(`  JS (Main):    ${formatSize(jsRaw.length)} -> ${formatSize(jsResult.code.length)} (ahorro: ${((jsSaved / jsRaw.length) * 100).toFixed(1)}%) [v=${jsHash}]\n`);
    if (jsExtraRaw && jsExtraResult) {
      process.stdout.write(`  JS (Extra):   ${formatSize(jsExtraRaw.length)} -> ${formatSize(jsExtraResult.code.length)} (ahorro: ${((jsExtraSaved / jsExtraRaw.length) * 100).toFixed(1)}%) [v=${jsExtraHash}]\n`);
    }
    process.stdout.write(`  Total ahorrado: ${formatSize(totalSaved)} (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)\n`);
    process.stdout.write(`  Cache-busting inyectado en HTML con exito.\n\n`);

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();

