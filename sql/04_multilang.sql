-- ============================================================
-- 약국 QR 시스템 V2.2 - 다국어 지원 (translations JSONB)
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- translations 컬럼 구조 예시 (id=7 드리클로 영문)
/*
UPDATE products
SET translations = jsonb_build_object(
  'en', jsonb_build_object(
    'name',             'Driclor Solution',
    'description',      'Hyperhidrosis (excessive sweating) relief / Topical antiperspirant',
    'usage_frequency',  'Once daily (before bed)',
    'usage_method',     'Apply to dry skin',
    'usage_target',     'Sweating areas only',
    'usage_note',       'Apply to completely dry skin, wash off in the morning. Once effective, reduce to 2-3 times per week.',
    'precautions',      jsonb_build_array('Do not use right after shaving', 'Broken or irritated skin', 'Avoid eye/mucous membrane contact', 'Children under 12'),
    'donts',            jsonb_build_array('Applying right after shower (skin must be completely dry)', 'Applying too much to a large area', 'Wrapping with occlusive dressing', 'Using right after hair removal/waxing'),
    'side_effects',     jsonb_build_array('Skin tingling', 'Itching', 'Skin dryness', 'Rash'),
    'side_effects_note','Tingling may occur initially but usually subsides. Discontinue if severe irritation occurs.',
    'tips',             jsonb_build_array('Always apply before bed on completely dry skin', 'Wash off with water in the morning', 'Once effective, 2-3 times per week is enough', 'Wearing cotton clothing reduces irritation'),
    'recommended_for',  jsonb_build_array('Those troubled by excessive underarm sweating', 'Those with sweaty hands affecting daily life', 'Those concerned about foot odor', 'Those for whom deodorant is not enough'),
    'usage_areas',      jsonb_build_array(
      jsonb_build_object('name', 'Underarms', 'icon', 'Wind'),
      jsonb_build_object('name', 'Palms', 'icon', 'Hand'),
      jsonb_build_object('name', 'Soles', 'icon', 'Footprints')
    )
  ),
  'zh', jsonb_build_object(
    'name',             'Driclor 止汗液',
    'description',      '多汗症（过度出汗）缓解 / 局部外用止汗剂',
    'usage_frequency',  '每日一次（睡前）',
    'usage_method',     '涂抹于干燥皮肤',
    'usage_target',     '仅限出汗部位',
    'usage_note',       '涂抹在完全干燥的皮肤上，早晨洗掉。效果出现后，可减少至每周2-3次。',
    'precautions',      jsonb_build_array('剃须后请勿立即使用', '皮肤破损或有刺激时', '避免接触眼睛和黏膜', '12岁以下儿童'),
    'donts',            jsonb_build_array('淋浴后立即涂抹（皮肤须完全干燥）', '大面积过量涂抹', '用密封敷料包裹', '除毛/蜡脱毛后立即使用'),
    'side_effects',     jsonb_build_array('皮肤刺痛', '瘙痒', '皮肤干燥', '皮疹'),
    'side_effects_note','初次使用时可能出现刺痛感，通常会逐渐消退。如出现严重刺激，请停止使用。',
    'tips',             jsonb_build_array('务必在睡前涂抹于完全干燥的皮肤上', '早晨用清水洗净', '效果出现后，每周2-3次即可', '穿棉质衣物可减少刺激'),
    'recommended_for',  jsonb_build_array('腋下出汗过多的人士', '手汗影响日常生活的人士', '担心脚臭的人士', '普通除臭剂无效的人士'),
    'usage_areas',      jsonb_build_array(
      jsonb_build_object('name', '腋下', 'icon', 'Wind'),
      jsonb_build_object('name', '手掌', 'icon', 'Hand'),
      jsonb_build_object('name', '脚底', 'icon', 'Footprints')
    )
  ),
  'ja', jsonb_build_object(
    'name',             'ドリクロール ソリューション',
    'description',      '多汗症（過度な発汗）の緩和 / 局所外用制汗剤',
    'usage_frequency',  '1日1回（就寝前）',
    'usage_method',     '乾燥した肌に塗布',
    'usage_target',     '発汗部位のみ',
    'usage_note',       '完全に乾燥した肌に塗布し、朝は洗い流してください。効果が出たら週2〜3回に減らしてもOKです。',
    'precautions',      jsonb_build_array('剃毛直後の使用禁止', '傷や炎症のある皮膚', '目・粘膜への接触注意', '12歳未満の小児'),
    'donts',            jsonb_build_array('シャワー直後の塗布（完全乾燥が必須）', '広範囲への過剰塗布', '密閉ドレッシングで覆うこと', '脱毛/ワックス直後の使用'),
    'side_effects',     jsonb_build_array('皮膚のひりひり感', 'かゆみ', '皮膚乾燥', '発疹'),
    'side_effects_note','初期使用時にひりひり感が生じることがありますが、通常は慣れてきます。強い刺激がある場合は使用を中止してください。',
    'tips',             jsonb_build_array('就寝前に完全に乾燥した肌に必ず塗布してください', '朝は水でしっかり洗い流してください', '効果が出たら週2〜3回で十分です', '綿素材の衣類を着ると刺激が軽減されます'),
    'recommended_for',  jsonb_build_array('脇の汗が多くて悩んでいる方', '手汗が多くて日常生活が不便な方', '足の臭いが気になる方', 'デオドラントで解決できない方'),
    'usage_areas',      jsonb_build_array(
      jsonb_build_object('name', '脇の下', 'icon', 'Wind'),
      jsonb_build_object('name', '手のひら', 'icon', 'Hand'),
      jsonb_build_object('name', '足の裏', 'icon', 'Footprints')
    )
  )
)
WHERE id = 7;
*/

-- 확인
-- SELECT id, name, translations FROM products WHERE id = 7;
