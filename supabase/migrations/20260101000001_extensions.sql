-- Extensions nécessaires au socle d'Pilot.
-- pgvector est activée dès maintenant (mais non utilisée) pour éviter une migration
-- disruptive lorsque les embeddings/RAG des agents IA seront implémentés.
create extension if not exists pgcrypto with schema extensions;
create extension if not exists vector with schema extensions;
