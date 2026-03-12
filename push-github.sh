#!/bin/bash
cd /c/Users/keqin/Desktop/portfolio

# Supprimer l'historique et recommencer
rm -rf .git
git init

# Configuration Git (après init)
git config user.email "lemondedutravail803@gmail.com"
git config user.name "Cédric AUGUSTO"

# Ajouter uniquement les fichiers autorisés
git add .
git commit -m "Initial commit - Portfolio Cédric AUGUSTO"

git branch -M main
git remote add origin https://github.com/lemondedutravail803-lang/portfolio.git
git push -u origin main --force
