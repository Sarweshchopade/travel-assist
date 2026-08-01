-- Run once against your Postgres database (see server/db/migrate.js)

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trips (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination   TEXT NOT NULL,
  days          INTEGER NOT NULL,
  budget        NUMERIC NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'INR',
  trip_input    JSONB NOT NULL,
  plan          JSONB NOT NULL,
  weather       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
