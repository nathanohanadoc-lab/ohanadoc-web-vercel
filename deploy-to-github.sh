#!/bin/bash

echo "=== OhanaDoc Web Vercel Deployment Script ==="
echo ""
echo "This script will help you push to GitHub after creating the repo."
echo ""
echo "STEP 1: Create a new repository on GitHub"
echo "----------------------------------------"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: ohanadoc-web-vercel"
echo "3. Description: OhanaDoc Web App for Vercel Deployment"
echo "4. Public repository"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter when you've created the repository..."

echo ""
echo "STEP 2: Pushing code to GitHub"
echo "------------------------------"

# Remove existing remote if any
git remote remove origin 2>/dev/null

# Add the new remote
git remote add origin https://github.com/nathanohanadoc-lab/ohanadoc-web-vercel.git

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub."
echo ""
echo "STEP 3: Deploy to Vercel"
echo "------------------------"
echo "1. Go to: https://vercel.com/new"
echo "2. Import: nathanohanadoc-lab/ohanadoc-web-vercel"
echo "3. Just click Deploy - no configuration needed!"
echo ""
echo "This is a simple Next.js app - Vercel will handle everything!"