-- ============================================================
-- 약국 QR 시스템 V2 - 드리클로 데이터 업데이트
-- 대상: id=7 (드리클로) 모든 신규 필드 입력
-- ============================================================

UPDATE products
SET
  category = '일반의약품',
  volume = '20mL',
  price_per_unit = '1mL당 750원',
  description = '다한증(과다발한) 완화 / 외용 제한성 발한억제제',

  usage_areas = '[
    {"name": "겨드랑이", "icon": "Wind"},
    {"name": "손바닥", "icon": "Hand"},
    {"name": "발바닥", "icon": "Footprints"}
  ]'::jsonb,

  usage_frequency = '1일 1회 (취침 전)',
  usage_method = '건조한 피부에 도포',
  usage_target = '발한 부위에만',
  usage_note = '완전히 건조된 피부에 바르고, 아침에 씻어내세요. 자극이 줄면 주 2~3회로 줄이세요.',

  precautions = '[
    "면도 직후 사용 금지",
    "상처나 자극 있는 피부",
    "눈, 점막 접촉 주의",
    "12세 미만 소아"
  ]'::jsonb,

  donts = '[
    "샤워 직후 바로 바르기 (완전 건조 필수)",
    "넓은 부위에 과다 도포",
    "밀폐 드레싱(랩 등)으로 감싸기",
    "제모/왁싱 직후 사용"
  ]'::jsonb,

  side_effects = '[
    "피부 따끔거림",
    "가려움증",
    "피부 건조",
    "발진"
  ]'::jsonb,
  side_effects_note = '초기 사용 시 따끔거림이 있을 수 있으나 대부분 적응됩니다. 심한 자극 시 사용을 중단하세요.',

  tips = '[
    "반드시 취침 전 완전히 마른 피부에 바르세요",
    "아침에 물로 깨끗이 씻어내세요",
    "효과가 나타나면 주 2~3회로 줄여도 OK",
    "면 소재 옷을 입으면 자극이 줄어요"
  ]'::jsonb,

  recommended_for = '[
    "겨드랑이 땀이 많아 고민인 분",
    "손에 땀이 많아 일상이 불편한 분",
    "발 냄새가 걱정되는 분",
    "데오드란트로 해결이 안 되는 분"
  ]'::jsonb,

  store_location = NULL,
  ingredients = '알루미늄 클로라이드 헥사하이드레이트 20%'

WHERE id = 7;

-- 확인
SELECT id, name, category, description, usage_frequency, volume
FROM products
WHERE id = 7;
