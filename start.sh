#!/bin/bash
docker compose pull
docker compose up -d

echo "Waiting for the container to start..."
sleep 5

docker exec ollama ollama pull qwen2:0.5b

echo "Model qwen2:0.5b has been successfully pulled."