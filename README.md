docker compose up -d --build

docker compose exec api NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db pull

docker compose exec api NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

docker compose exec api NODE_TLS_REJECT_UNAUTHORIZED=0 npm run seed
