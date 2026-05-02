-- ============================================================
-- 약국 QR 시스템 - Supabase Storage 설정
-- Supabase SQL Editor에서 실행하세요
-- product-images 버킷 생성 및 공개 접근 정책 설정
-- ============================================================

-- 1. 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 공개 조회 정책 (누구나 이미지 조회 가능)
CREATE POLICY "공개 이미지 조회"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- 3. 이미지 업로드 허용 (anon key로 업로드 가능)
CREATE POLICY "이미지 업로드 허용"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- 4. 이미지 수정 허용
CREATE POLICY "이미지 수정 허용"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- 5. 이미지 삭제 허용
CREATE POLICY "이미지 삭제 허용"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- 확인
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';
