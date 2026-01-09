#!/bin/bash
set -e

git pull
npm run build:ssr
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize

