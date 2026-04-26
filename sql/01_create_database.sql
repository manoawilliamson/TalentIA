-- =============================================================================
-- TalentIA Database Setup Script
-- =============================================================================
-- This script creates the database and initial structure
-- Run this first: psql -U postgres -f 01_create_database.sql

-- Create the database
CREATE DATABASE talentia;

-- Connect to the database (you'll need to run this separately in psql)
-- \c talentia

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON DATABASE talentia TO postgres;
