-- Reverts 0001_old_human_fly.sql (E-09). Order respects foreign keys.
DROP TABLE IF EXISTS "audit_log";
DROP TABLE IF EXISTS "admin_users";
