#!/usr/bin/env python3
"""
Generador de Landings por Barrio — Verstats (Impeccable Extract Engine)

Permite exportar landings estáticas personalizadas para cada barrio de L'Hospitalet
o de otras ciudades manteniendo la consistencia de diseño e identidad.

Uso:
  python generar_landing_barrio.py collblanc
  python generar_landing_barrio.py bellvitge
  python generar_landing_barrio.py florida
"""

import sys
import re
from pathlib import Path

BARRIOS = {
    "collblanc": {
        "nombre": "Collblanc y La Torrassa",
        "asociacion": "Asociados de Collblanc Comerç",
        "calle_demo": "C/ del Progrés 14, Collblanc",
        "codigo_postal": "08903",
        "archivo_salida": "index-collblanc.html"
    },
    "bellvitge": {
        "nombre": "Bellvitge y Gornal",
        "asociacion": "Asociados de Bellvitge Comerç",
        "calle_demo": "Rambla de Marina 140, Bellvitge",
        "codigo_postal": "08907",
        "archivo_salida": "index-bellvitge.html"
    },
    "florida": {
        "nombre": "La Florida y Les Planes",
        "asociacion": "Asociados de La Florida Comerç",
        "calle_demo": "Av. Masnou 50, La Florida",
        "codigo_postal": "08905",
        "archivo_salida": "index-florida.html"
    },
    "pubillacases": {
        "nombre": "Pubilla Cases y Can Serra",
        "asociacion": "Asociados de PubillaComerç",
        "calle_demo": "C/ de la Marina 12, Pubilla Cases",
        "codigo_postal": "08906",
        "archivo_salida": "index.html"
    }
}

def generar(barrio_key: str):
    if barrio_key not in BARRIOS:
        print(f"Error: Barrio '{barrio_key}' no encontrado. Opciones: {list(BARRIOS.keys())}")
        sys.exit(1)
    
    cfg = BARRIOS[barrio_key]
    base_dir = Path(__file__).resolve().parent.parent
    plantilla_path = base_dir / "index.html"
    
    if not plantilla_path.exists():
        print(f"Error: No se encuentra la plantilla base en {plantilla_path}")
        sys.exit(1)
        
    html = plantilla_path.read_text(encoding="utf-8")
    
    # Reemplazos quirúrgicos
    html = html.replace("Pubilla Cases y Can Serra", cfg["nombre"])
    html = html.replace("Asociados de PubillaComerç", cfg["asociacion"])
    html = html.replace("C/ de la Marina 12, Pubilla Cases", cfg["calle_demo"])
    
    salida_path = base_dir / cfg["archivo_salida"]
    salida_path.write_text(html, encoding="utf-8")
    print(f"✅ Landing generada con éxito para '{cfg['nombre']}' -> {salida_path.name}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python generar_landing_barrio.py <barrio>")
        print(f"Barrios disponibles: {list(BARRIOS.keys())}")
        sys.exit(0)
    generar(sys.argv[1].lower())
