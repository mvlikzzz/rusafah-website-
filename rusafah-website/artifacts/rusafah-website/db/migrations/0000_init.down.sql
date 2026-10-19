-- Reverts 0000_init.sql (E-09). Order respects foreign keys.
DROP TABLE IF EXISTS "rate_limit_buckets";
DROP TABLE IF EXISTS "notification_outbox";
DROP TABLE IF EXISTS "newsletter_subscribers";
DROP TABLE IF EXISTS "leads";
DROP TABLE IF EXISTS "posts";
DROP TABLE IF EXISTS "project_units";
DROP TABLE IF EXISTS "project_warranties";
DROP TABLE IF EXISTS "project_features";
DROP TABLE IF EXISTS "project_images";
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "legal_documents";
DROP TABLE IF EXISTS "certificates";
DROP TABLE IF EXISTS "partners";
DROP TABLE IF EXISTS "company_stats";
DROP TABLE IF EXISTS "site_settings";
