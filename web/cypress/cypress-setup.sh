#!/usr/bin/env sh

export NODE_ENV=development
export API_URL="http://api:8081"
export DEV_DB_NAME="apd_cypress_test"
export CYPRESS_TESTS=true

# Bring up the containers
docker compose -f ../docker-compose.cypress.yml up web -d

# drop the DB
docker compose -f ../docker-compose.yml exec db sh -c 'PGPASSWORD=cms psql -U postgres -tc "DROP DATABASE IF EXISTS apd_cypress_test;"'
docker compose -f ../docker-compose.cypress.yml exec db sh -c 'PGPASSWORD=cms psql -U postgres -tc "CREATE DATABASE apd_cypress_test;"'

# migrate and seed the db
docker compose -f ../docker-compose.cypress.yml exec -e NODE_ENV=development -e DEV_DB_NAME=apd_cypress_test api npm run migrate
docker compose -f ../docker-compose.cypress.yml exec -e NODE_ENV=development -e DEV_DB_NAME=apd_cypress_test api npm run seed

# run the tests
docker compose -f ../docker-compose.cypress.yml run cypress npm run cy:run:ci


