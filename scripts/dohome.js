#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener todas las sesiones
function getSessions() {
  const sessionsDir = path.join(__dirname, '../content/Sesiones');
  const files = fs.readdirSync(sessionsDir);
  
  return files
    .filter(file => file.endsWith('.md') && file.startsWith('Sesion'))
    .map(file => {
      const sessionNumber = file.match(/Sesion (\d+)\.md/)[1];
      return {
        number: parseInt(sessionNumber),
        filename: file,
        path: `Sesiones/${file}`
      };
    })
    .sort((a, b) => a.number - b.number);
}

// Función para leer el contenido de una sesión
function getSessionContent(sessionPath) {
  try {
    const fullPath = path.join(__dirname, '../content', sessionPath);
    return fs.readFileSync(fullPath, 'utf8').trim();
  } catch (error) {
    console.warn(`⚠️ No se pudo leer ${sessionPath}: ${error.message}`);
    return '*Contenido no disponible*';
  }
}

// Función para generar el contenido del home
function generateHomeContent() {
  const sessions = getSessions();
  
  const sessionsContent = sessions
    .map(session => {
      const content = getSessionContent(session.path);
      return `# Sesión ${session.number}\n\n${content}\n\n---\n`;
    })
    .join('\n');

  return `---
title: Todas las sesiones
---

${sessionsContent}
`;
}

// Ejecutar el script
try {
  const homeContent = generateHomeContent();
  const homePath = path.join(__dirname, '../content/index.md');
  fs.writeFileSync(homePath, homeContent);
  console.log('✅ Home actualizado automáticamente con todas las sesiones');
} catch (error) {
  console.error('❌ Error generando el home:', error);
  process.exit(1);
}
