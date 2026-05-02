-- ============================================================
-- 약국 QR 시스템 V2 - products 테이블 스키마 확장
-- Supabase SQL Editor에서 실행하세요
-- 기존 데이터(10개)는 유지됩니다 (모두 nullable)
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category         TEXT,
  ADD COLUMN IF NOT EXISTS volume           TEXT,
  ADD COLUMN IF NOT EXISTS price_per_unit   TEXT,
  ADD COLUMN IF NOT EXISTS image_url        TEXT,
  ADD COLUMN IF NOT EXISTS usage_areas      JSONB,
  ADD COLUMN IF NOT EXISTS usage_frequency  TEXT,
  ADD COLUMN IF NOT EXISTS usage_method     TEXT,
  ADD COLUMN IF NOT EXISTS usage_target     TEXT,
  ADD COLUMN IF NOT EXISTS usage_note       TEXT,
  ADD COLUMN IF NOT EXISTS precautions      JSONB,
  ADD COLUMN IF NOT EXISTS donts            JSONB,
  ADD COLUMN IF NOT EXISTS side_effects     JSONB,
  ADD COLUMN IF NOT EXISTS side_effects_note TEXT,
  ADD COLUMN IF NOT EXISTS tips             JSONB,
  ADD COLUMN IF NOT EXISTS recommended_for  JSONB,
  ADD COLUMN IF NOT EXISTS store_location   TEXT,
  ADD COLUMN IF NOT EXISTS ingredients      TEXT,
  ADD COLUMN IF NOT EXISTS description      TEXT;

-- 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
