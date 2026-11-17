#!/usr/bin/env bash
# Scan the frontend with the local SonarQube (started from Homelab-app-API/docker-compose.sonar.yml).
# Run from the root of Homelab-App-Frontend:   SONAR_TOKEN=<token> ./sonar-local.sh
set -euo pipefail

: "${SONAR_TOKEN:?Set SONAR_TOKEN first, e.g. SONAR_TOKEN=sqp_xxx ./sonar-local.sh}"
PROJECT_KEY="Homelab-App-Frontend"

# The JavaScript scanner runs in Docker, so nothing has to be installed.
# --network host lets the container reach SonarQube on localhost:9000.
docker run --rm --network host \
  -e SONAR_HOST_URL="http://localhost:9000" \
  -e SONAR_TOKEN \
  -v "$PWD:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey="$PROJECT_KEY"

echo "Done: open http://localhost:9000/dashboard?id=$PROJECT_KEY"
