#!/bin/bash
cd "/home/jl/Documentos/DOC_706"

# Añade cambios, haz commit y sube
git add .
git commit -m "Sincronización automática en UNSIS"
git push

# Baja los cambios de otros dispositivos
git pull
