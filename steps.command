
# go to sic folder
cd opt/sic

# run container docker and pm2 backend
docker compose up -d && cd backend && pm2 start ecosystem.config.js

# run my-redis and 
docker start my-redis && docker start phpmyadmin-8080