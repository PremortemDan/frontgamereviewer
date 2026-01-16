#!/bin/bash

# Colores para terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================"
echo "VERIFICACIÓN DE INSTALACIÓN PINOS"
echo "================================"
echo ""

# Función para imprimir un check o cruz
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    return 0
  else
    echo -e "${RED}✗${NC} $1/"
    return 1
  fi
}

echo "📁 Verificando estructura de carpetas..."
echo ""

check_dir "src"
check_dir "src/components"
check_dir "src/views"
check_dir "src/composables"
check_dir "src/router"
check_dir "src/assets/styles"

echo ""
echo "📄 Verificando componentes Vue..."
echo ""

check_file "src/App.vue"
check_file "src/components/Layout.vue"
check_file "src/components/GameCard.vue"
check_file "src/views/Home.vue"
check_file "src/views/Login.vue"
check_file "src/views/Register.vue"
check_file "src/views/GameDetail.vue"

echo ""
echo "🔧 Verificando composables..."
echo ""

check_file "src/composables/useApi.js"
check_file "src/composables/useTheme.js"
check_file "src/composables/useColorblindMode.js"
check_file "src/composables/useStars.js"
check_file "src/composables/useParticles.js"

echo ""
echo "🎨 Verificando estilos..."
echo ""

check_file "src/assets/styles/main.css"
check_file "src/assets/styles/ux-styles.css"
check_file "src/assets/styles/colorblind-mode.css"

echo ""
echo "⚙️ Verificando configuración..."
echo ""

check_file "vite.config.js"
check_file "package.json"
check_file "index.html"
check_file ".gitignore"
check_file "tsconfig.json"

echo ""
echo "📚 Verificando documentación..."
echo ""

check_file "README.md"
check_file "MIGRATION_GUIDE.md"
check_file ".env.example"

echo ""
echo "================================"
echo "PRÓXIMOS PASOS:"
echo "================================"
echo ""
echo "1. Instalar dependencias:"
echo -e "   ${YELLOW}npm install${NC}"
echo ""
echo "2. Ejecutar en desarrollo:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Abrir en navegador:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "4. (Opcional) Construir para producción:"
echo -e "   ${YELLOW}npm run build${NC}"
echo ""
echo "================================"
