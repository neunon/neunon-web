"""
既存顧客企業クローズアップ　架空サンプルレポート（Standard・5枚）を生成する。

実際の納品物（竹本容器様向けクローズアップ等）と同じ型・同じ情報密度で作っている。
  (1) 会社概要  (2) 商品ラインナップ  (3) 直近の動向  (4) 取引状況の整理  (5) 提案・連携余地
書式も実物に合わせた: Arial＋ＭＳ Ｐゴシック、本文11pt、灰色の見出し箱、青灰の積み上げグラフ、
重要な示唆は赤字、右上に区分の札、左下に出所。

設定:
  分析対象   ミオリ食品株式会社（架空）… 関東の中堅食品メーカー
  依頼元     低温物流（冷凍・冷蔵の保管と配送）を営む企業（架空）
  → 依頼元の商材＝物流 の視点で、顧客の事業を読み解く（実物は容器メーカーの視点だった）

数値・出来事はすべて架空。実在企業の情報は一切含まない。
実行: py design/existing-customers-sample/build_report.py
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

HERE = Path(__file__).parent
ILL = HERE / "illustrations"
OUT = HERE / "existing-customers-sample.pptx"

BLACK = RGBColor(0x00, 0x00, 0x00)
INK = RGBColor(0x1A, 0x1A, 0x1A)
GRAY = RGBColor(0x59, 0x59, 0x59)
LABEL = RGBColor(0xEA, 0xEA, 0xEA)
RULE = RGBColor(0x26, 0x26, 0x26)
RED = RGBColor(0xE0, 0x1E, 0x1E)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
# 実物のグラフと同じ青灰の階調（淡→濃）
B1, B2, B3, B4, B5 = (RGBColor(0xDF, 0xE5, 0xEF), RGBColor(0xC3, 0xCF, 0xE1),
                      RGBColor(0x9D, 0xB1, 0xCF), RGBColor(0x6F, 0x8D, 0xB9), RGBColor(0x3F, 0x5A, 0x8A))

LATIN = "Arial"
EA = "ＭＳ Ｐゴシック"
COMPANY = "ミオリ食品株式会社"

prs = Presentation()
prs.slide_width = Inches(10.83)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


# ---------------------------------------------------------------- 文字の基本
def style_run(run, size=11, bold=False, color=INK):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = LATIN
    rpr = run._r.get_or_add_rPr()
    for tag in ("a:ea", "a:cs"):
        el = rpr.find(qn(tag))
        if el is None:
            el = etree.SubElement(rpr, qn(tag))
        el.set("typeface", EA)


def set_bullet(p, level):
    """■（第1階層）と –（第2階層）の箇条書きを PowerPoint の本物の箇条書きとして付ける"""
    ppr = p._p.get_or_add_pPr()
    indent = 0.2 if level == 0 else 0.42
    hang = 0.2
    ppr.set("marL", str(Inches(indent)))
    ppr.set("indent", str(-Inches(hang)))
    for tag in ("a:buFont", "a:buChar", "a:buNone"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    bu_font = etree.SubElement(ppr, qn("a:buFont"))
    bu_char = etree.SubElement(ppr, qn("a:buChar"))
    if level == 0:
        bu_font.set("typeface", "Wingdings")
        bu_char.set("char", "§")
    else:
        bu_font.set("typeface", LATIN)
        bu_char.set("char", "–")


def text_box(slide, x, y, w, h, paragraphs, size=11, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
             margin=0.04, line=1.0):
    """paragraphs: [str | (str, opts) | [(str, opts), ...]]。opts は size/bold/color/level/space"""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(margin))
    first = True
    for para in paragraphs:
        runs = para if isinstance(para, list) else [para]
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = align
        p.line_spacing = line
        level = None
        space = None
        for r in runs:
            text, opts = (r, {}) if isinstance(r, str) else r
            level = opts.get("level", level)
            space = opts.get("space", space)
            run = p.add_run()
            run.text = text
            style_run(run, opts.get("size", size), opts.get("bold", False), opts.get("color", INK))
        if level is not None:
            set_bullet(p, level)
        p.space_before = Pt(space if space is not None else (3 if level == 0 else 1))
    return tb


def bullets(slide, x, y, w, h, items, size=11, line=1.0):
    """items: [(level, text) | (level, text, color)]"""
    paras = []
    for it in items:
        level, text = it[0], it[1]
        color = it[2] if len(it) > 2 else INK
        paras.append((text, {"level": level, "color": color, "size": size if level == 0 else size - 0.5}))
    return text_box(slide, x, y, w, h, paras, size=size, line=line)


def label_box(slide, x, y, w, h, text, size=11, vertical=False, fill=LABEL, bold=False):
    """実物と同じ、灰色地＋細い黒枠の見出し箱"""
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    shp.line.color.rgb = BLACK
    shp.line.width = Pt(0.75)
    shp.shadow.inherit = False
    tf = shp.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(0.04))
    if vertical:
        tf._txBody.find(qn("a:bodyPr")).set("vert", "eaVert")
    lines = text.split("\n")
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = ln
        style_run(run, size, bold, INK)
    return shp


def rule(slide, x, y, w, weight=1.0, color=RULE, dash=False):
    ln = slide.shapes.add_connector(1, Inches(x), Inches(y), Inches(x + w), Inches(y))
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4  # sysDash
    return ln


def vrule(slide, x, y, h, weight=0.75, color=RULE, dash=False):
    ln = slide.shapes.add_connector(1, Inches(x), Inches(y), Inches(x), Inches(y + h))
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def section_head(slide, x, y, w, text, size=15):
    text_box(slide, x, y, w, 0.36, [(text, {"size": size})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.BOTTOM)
    rule(slide, x, y + 0.4, w, 1.25)


def rect(slide, x, y, w, h, fill, line=None, line_w=0.75):
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shp.shadow.inherit = False
    if fill is None:
        shp.fill.background()
    else:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(line_w)
    return shp


def page(n, title, message, source, note=None):
    """表題・メッセージ・札・出所・頁番号を置いた1枚を返す"""
    s = prs.slides.add_slide(BLANK)
    text_box(s, 0.4, 0.22, 10.03, 0.5, [(f"{COMPANY}（架空）（{n}）　{title}", {"size": 20})], align=PP_ALIGN.CENTER)
    text_box(s, 0.3, 0.86, 10.23, 0.5, [(message, {"size": 16})], align=PP_ALIGN.CENTER)
    tag = label_box(s, 9.38, 0.08, 1.32, 0.3, "架空サンプル", size=10, fill=WHITE)
    tag.shadow.inherit = False
    foot = [[("出所：", {"size": 9, "color": GRAY}), (source, {"size": 9, "color": GRAY})]]
    if note:
        foot.append([("注：", {"size": 9, "color": GRAY}), (note, {"size": 9, "color": GRAY})])
    text_box(s, 0.3, 7.0 if note else 7.16, 8.2, 0.42, foot, size=9)
    text_box(s, 8.5, 7.16, 1.2, 0.26, [("2026/10 時点", {"size": 9, "color": GRAY})], align=PP_ALIGN.RIGHT)
    text_box(s, 9.72, 7.16, 0.83, 0.26, [(f"- {n} -", {"size": 10})], align=PP_ALIGN.RIGHT)
    return s


SOURCE_FICTION = "数値・出来事・商品はすべて架空（実在企業の情報ではない）"


def stacked_chart(slide, x, y, w, h, categories, series, colors, totals=True, gap=70, label_size=9,
                  value_axis_max=None):
    data = CategoryChartData()
    data.categories = categories
    for name, values in series:
        data.add_series(name, values)
    gf = slide.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(x), Inches(y), Inches(w), Inches(h), data)
    ch = gf.chart
    ch.has_legend = False
    ch.font.size = Pt(label_size)
    ch.font.name = LATIN
    plot = ch.plots[0]
    plot.gap_width = gap
    plot.overlap = 100
    for i, s in enumerate(plot.series):
        s.format.fill.solid()
        s.format.fill.fore_color.rgb = colors[i]
        s.format.line.color.rgb = RGBColor(0x40, 0x40, 0x40)
        s.format.line.width = Pt(0.5)
        s.data_labels.show_value = True
        s.data_labels.number_format = '0'
        s.data_labels.number_format_is_linked = False
        s.data_labels.position = XL_LABEL_POSITION.CENTER
        s.data_labels.font.size = Pt(label_size)
        s.data_labels.font.color.rgb = WHITE if colors[i] in (B4, B5) else INK
    va = ch.value_axis
    va.visible = False
    va.has_major_gridlines = False
    if value_axis_max:
        va.maximum_scale = value_axis_max
    va.minimum_scale = 0
    ca = ch.category_axis
    ca.tick_labels.font.size = Pt(10)
    ca.format.line.color.rgb = BLACK
    ca.has_major_gridlines = False
    return gf


def legend(slide, x, y, entries, size=10, step=0.27):
    for i, (color, text) in enumerate(entries):
        rect(slide, x, y + i * step + 0.04, 0.2, 0.16, color, line=RGBColor(0x40, 0x40, 0x40), line_w=0.5)
        text_box(slide, x + 0.26, y + i * step - 0.02, 1.9, 0.26, [(text, {"size": size})])


TRIM = {"frozen-gyoza": (588, 831), "frozen-friedrice": (588, 831), "frozen-udon": (588, 831),
        "chilled-gyoza": (680, 515), "chilled-salad": (510, 619), "sauce-gyoza": (352, 763),
        "sauce-tsuyu": (440, 863), "sauce-dressing": (440, 863), "bulk-gyoza": (668, 819), "bulk-soup": (668, 819)}


def product_row(slide, names, x, bottom, width, max_h, gap=0.05):
    """商品図を1列に並べる。列幅を超えるときは高さを縮める（重ねない）"""
    ratios = [TRIM[n][0] / TRIM[n][1] for n in names]
    h = min(max_h, (width - gap * (len(names) - 1)) / sum(ratios))
    total = h * sum(ratios) + gap * (len(names) - 1)
    cx = x + (width - total) / 2
    for n, r in zip(names, ratios):
        slide.shapes.add_picture(str(ILL / f"{n}-trim.png"), Inches(cx), Inches(bottom - h), height=Inches(h))
        cx += h * r + gap


# ================================================================= (1) 会社概要
s = page(1, "会社概要",
         "冷凍食品を成長の柱に、3年で売上を約2割伸ばした関東の中堅食品メーカー",
         "架空の決算公告・会社案内・プレスリリースを想定して作成。" + SOURCE_FICTION)

section_head(s, 0.3, 1.5, 4.85, "基本情報・業績")
section_head(s, 5.55, 1.5, 4.95, "特徴")

label_box(s, 0.3, 2.04, 0.42, 2.95, "売上・利益", vertical=True)
text_box(s, 0.8, 2.0, 1.2, 0.24, [("単位：億円", {"size": 9, "color": GRAY})])
cats = ["2023", "2024", "2025", "2026予"]
seg = [("業務用", (31, 34, 40, 47)), ("調味料", (52, 53, 52, 52)), ("チルド惣菜", (61, 62, 63, 64)), ("冷凍食品", (68, 79, 96, 113))]
stacked_chart(s, 0.78, 2.2, 3.12, 2.62, cats, seg, [B4, B3, B2, B1], gap=60, value_axis_max=300)
# 合計（積み上げの上）を実物同様に棒の上へ
for cx, tot in zip((1.279, 1.983, 2.687, 3.391), (212, 228, 251, 276)):
    top = 4.468 - 0.006979 * tot
    text_box(s, cx - 0.33, top - 0.27, 0.66, 0.24, [(f"{tot}", {"size": 10.5, "bold": True})], align=PP_ALIGN.CENTER)
legend(s, 3.96, 2.28, [(B1, "冷凍食品"), (B2, "チルド惣菜"), (B3, "調味料"), (B4, "業務用")])
text_box(s, 3.96, 3.5, 1.2, 1.4, [
    ("営業利益", {"size": 10, "bold": True}),
    ("2023　9.8", {"size": 10}), ("2024　11.2", {"size": 10}), ("2025　12.9", {"size": 10}), ("2026予　14.6", {"size": 10}),
], line=1.05)

label_box(s, 0.3, 5.07, 1.2, 0.34, "従業員数")
text_box(s, 1.58, 5.07, 3.5, 0.34, [("640名（2026/3、単体）", {"size": 11})], anchor=MSO_ANCHOR.MIDDLE)
label_box(s, 0.3, 5.49, 1.2, 0.34, "上場区分")
text_box(s, 1.58, 5.49, 3.5, 0.34, [("非上場（創業家が過半を保有）", {"size": 11})], anchor=MSO_ANCHOR.MIDDLE)
label_box(s, 0.3, 5.91, 1.2, 1.0, "事業内容")
bullets(s, 1.55, 5.86, 3.62, 1.1, [
    (0, "冷凍食品・チルド惣菜・調味料の製造販売"),
    (0, "外食・中食向けの業務用食品"),
    (0, "埼玉・群馬に3工場、関西に配送拠点"),
], size=10.5)

label_box(s, 5.55, 2.04, 1.08, 2.62, "特徴・強み")
bullets(s, 6.72, 1.98, 3.82, 2.72, [
    (0, "冷凍ギョーザ「羽根つき一番」が主力"),
    (1, "冷凍食品売上の約4割を占める看板商品"),
    (0, "冷凍食品の売上比率は32%→41%（2023→26予）"),
    (1, "中計で2028年度に50%を目標", RED),
    (0, "具材の下処理から包装まで自社工場で完結"),
    (0, "チルドと冷凍の両温度帯を持ち、量販の惣菜売場と冷凍売場の双方に棚を持つ"),
    (0, "創業家の社長が経営判断を主導、投資判断は比較的速い"),
    (0, "2026年4月に物流部を新設し、配送体制を見直し中", RED),
    (1, "物流企画職の求人で「委託先の再編」に言及"),
], size=10.5)

label_box(s, 5.55, 4.74, 1.08, 2.18, "顧客・\n販売チャネル")
bullets(s, 6.72, 4.68, 3.82, 2.3, [
    (0, "量販店（関東・関西のSM）が売上の約6割"),
    (0, "CVS向けはPB惣菜を中心に約1割"),
    (0, "業務用は外食チェーン・弁当事業者向け"),
    (1, "2026年度から関西・中部の外食へ拡販"),
    (0, "2025年10月に公式ECを開設"),
    (1, "ふるさと納税の返礼品にも冷凍ギョーザを提供"),
], size=10.5)


# ============================================================ (2) 商品ラインナップ
s = page(2, "商品ラインナップ",
         "冷凍とチルドの2温度帯を持ち、冷凍は量販・EC・業務用へ販路が広がっている",
         "架空の自社サイト・商品カタログを想定して作成。" + SOURCE_FICTION,
         note="*1. 店頭想定価格（税込）。温度帯は冷凍＝−18℃以下、チルド＝10℃以下、常温＝温度管理不要")
cols = [
    ("冷凍食品", [
        (0, "冷凍ギョーザ・炒飯・麺の3本柱"),
        (1, "羽根つき一番、香ばし炒飯、讃岐風うどん など"),
        (1, "298〜498円*1"),
        (0, "冷凍（−18℃以下）"),
        (0, "量販・CVSに加え、ECとふるさと納税へ拡大"),
        (0, "群馬第2工場の稼働で生産量が約1.5倍に", RED),
        (0, "物流の接点が最も大きく、伸びも大きい", RED),
    ], ["frozen-gyoza", "frozen-friedrice", "frozen-udon"]),
    ("チルド惣菜", [
        (0, "焼くだけ餃子、ポテトサラダ、きんぴら等"),
        (1, "198〜398円*1"),
        (0, "チルド（10℃以下）、賞味期限3〜5日"),
        (0, "量販の惣菜売場向けに毎日納品"),
        (0, "当社が関西の配送を担当中", RED),
        (1, "売上は横ばいで、物量の伸びは小さい"),
    ], ["chilled-gyoza", "chilled-salad"]),
    ("調味料", [
        (0, "餃子のたれ、そばつゆ、胡麻ドレッシング"),
        (1, "198〜548円*1"),
        (0, "常温（温度管理不要）"),
        (0, "冷凍ギョーザとの同梱・セット販売あり"),
        (0, "常温品のため当社の強みは出にくい"),
        (1, "EC向けの冷凍品との同梱出荷は論点"),
    ], ["sauce-gyoza", "sauce-tsuyu", "sauce-dressing"]),
    ("業務用", [
        (0, "業務用冷凍ギョーザ（50個入）、スープの素"),
        (1, "外食チェーン・弁当事業者向け"),
        (0, "冷凍が中心、ケース単位の多店舗配送"),
        (0, "2026年度から関西・中部の外食へ拡販", RED),
        (1, "店舗別の定期配送が新たに発生"),
        (0, "当社の関西配送網と重なる", RED),
    ], ["bulk-gyoza", "bulk-soup"]),
]
CONTACT = {
    "冷凍食品": ("物流の接点：大　物量の伸び：大", B5, WHITE),
    "チルド惣菜": ("当社取引中　物量は横ばい", B3, INK),
    "調味料": ("物流の接点：小（常温）", LABEL, INK),
    "業務用": ("物流の接点：中　新規に発生", B4, WHITE),
}
cw = 2.47
for i, (head, items, pics) in enumerate(cols):
    x = 0.28 + i * (cw + 0.07)
    section_head(s, x, 1.48, cw, head, size=14)
    bullets(s, x, 1.98, cw, 2.9, items, size=10)
    product_row(s, pics, x + 0.04, 6.44, cw - 0.08, 2.05)
    # 実物の「容器接点は大きい」に当たる評価を、列の最下段に帯で示す
    verdict, fill, fg = CONTACT[head]
    rect(s, x, 6.54, cw, 0.34, fill, line=BLACK, line_w=0.5)
    text_box(s, x, 6.54, cw, 0.34, [(verdict, {"size": 10.5, "bold": True, "color": fg})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ================================================================ (3) 直近の動向
s = page(3, "直近の動向",
         "中計で冷凍比率50%を掲げ、新工場・EC・業務用の3方面で冷凍の物量が増える局面にある",
         "架空のプレスリリース・中期経営計画を想定して作成。" + SOURCE_FICTION,
         note="*1. 冷凍食品の売上・生産能力から推計した出荷量の伸び。実際の物量は要確認")
section_head(s, 0.3, 1.48, 10.23, "主な出来事（2024〜2026年）")
events = [
    ("2024/04", "中期経営計画\n「冷凍シフト2028」", "冷凍食品の売上比率を\n2028年度に50%へ"),
    ("2025/03", "群馬第2工場\n着工", "冷凍ギョーザ・冷凍麺の\n専用ライン"),
    ("2025/10", "公式EC開設\nふるさと納税参入", "冷凍ギョーザを中心に\n個人宅へ直送"),
    ("2026/04", "群馬第2工場\n稼働", "冷凍の生産能力が\n約1.5倍に"),
    ("2026/06", "業務用の\n関西・中部拡販", "外食チェーン3社と\n供給開始（予定）"),
]
y0 = 2.22
rule(s, 0.5, y0 + 0.2, 9.85, 2.0, RGBColor(0x3F, 0x5A, 0x8A))
for i, (d, head, body) in enumerate(events):
    cx = 0.3 + i * 2.05
    dot = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx + 0.88), Inches(y0 + 0.12), Inches(0.17), Inches(0.17))
    dot.fill.solid(); dot.fill.fore_color.rgb = B5 if i in (0, 3) else B4
    dot.line.fill.background(); dot.shadow.inherit = False
    text_box(s, cx, y0 - 0.24, 1.93, 0.3, [(d, {"size": 11, "bold": True})], align=PP_ALIGN.CENTER)
    box = rect(s, cx, y0 + 0.44, 1.93, 1.3, WHITE, line=BLACK)
    text_box(s, cx + 0.02, y0 + 0.5, 1.89, 0.56, [(ln, {"size": 10.5, "bold": True}) for ln in head.split("\n")],
             align=PP_ALIGN.CENTER, line=0.92)
    rule(s, cx + 0.25, y0 + 1.08, 1.43, 0.5, RGBColor(0xA0, 0xA0, 0xA0))
    text_box(s, cx + 0.02, y0 + 1.12, 1.89, 0.58, [(ln, {"size": 9.5}) for ln in body.split("\n")],
             align=PP_ALIGN.CENTER, line=0.92)

section_head(s, 0.3, 4.06, 10.23, "動向が当社（低温物流）の領域に与える影響")
hdr_y = 4.66
for x, w, t in ((0.3, 2.3, "動向"), (2.66, 4.58, "物流への影響"), (7.3, 1.66, "物量の伸び*1"), (9.02, 1.5, "当社の現状")):
    label_box(s, x, hdr_y, w, 0.3, t, size=10.5, bold=True)
rows = [
    ("群馬第2工場の稼働", "【推察】関東発の冷凍品の保管・横持ち・量販センター配送が増える。既存の冷凍倉庫の容量が不足する可能性",
     "大（約1.5倍）", "未取引"),
    ("公式EC・ふるさと納税", "【推察】冷凍の個人宅向け小口配送が新たに発生。年末の需要集中に対応できる体制が要る",
     "中（新規）", "未取引"),
    ("業務用の関西・中部拡販", "【推察】外食店舗へのケース単位の定期配送が発生。関西は当社の既存配送網と重なる",
     "中（新規）", "一部隣接"),
]
for r, (a, b, c, d) in enumerate(rows):
    yy = 5.02 + r * 0.6
    if r:
        rule(s, 0.3, yy - 0.04, 10.22, 0.5, RGBColor(0x90, 0x90, 0x90), dash=True)
    text_box(s, 0.32, yy, 2.3, 0.54, [(a, {"size": 10.5, "bold": True})], anchor=MSO_ANCHOR.MIDDLE)
    text_box(s, 2.66, yy, 4.6, 0.54, [(b, {"size": 10})], anchor=MSO_ANCHOR.MIDDLE, line=0.95)
    text_box(s, 7.3, yy, 1.66, 0.54, [(c, {"size": 10.5, "bold": True, "color": RED if "大" in c else INK})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text_box(s, 9.02, yy, 1.5, 0.54, [(d, {"size": 10.5})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================== (4) 取引状況の整理
s = page(4, "取引状況の整理",
         "当社の取引はチルドの関西配送に限られ、伸びている冷凍の物流はほぼ未取引",
         "依頼元の取引実績（架空）と公開情報を突合して作成。" + SOURCE_FICTION,
         note="他社委託は求人情報・取引先公表などからの推定を含む。現行の委託先・契約条件は要確認")
section_head(s, 0.3, 1.48, 7.05, "商品カテゴリ × 物流工程の取引マップ")
section_head(s, 7.62, 1.48, 2.9, "読み取れること")

steps = ["工場〜倉庫\n保管・横持ち", "量販・CVS\nセンター配送", "EC・ギフト\n個人宅配送", "外食・中食\n店舗配送"]
cats4 = ["冷凍食品", "チルド惣菜", "調味料", "業務用"]
# 取引状況: T=当社取引中, O=他社委託（推定）, N=新規発生・未取引, X=対象外
grid = [
    ["O", "O", "N", "X"],
    ["O", "T", "X", "X"],
    ["O", "O", "N", "X"],
    ["O", "X", "X", "N"],
]
notes = [
    ["関東・他社", "大手3PL", "2025/10〜", "—"],
    ["自社倉庫", "関西のみ当社", "—", "—"],
    ["常温・他社", "大手3PL", "冷凍と同梱", "—"],
    ["関東・他社", "—", "—", "2026/06〜"],
]
STATE = {
    "T": (B5, WHITE, "当社取引中"),
    "O": (B2, INK, "他社委託（推定）"),
    "N": (WHITE, RED, "新規発生・未取引"),
    "X": (RGBColor(0xF4, 0xF4, 0xF4), GRAY, "対象外"),
}
gx, gy, lw, cwid, rh = 0.3, 2.06, 1.24, 1.42, 0.86
for j, st in enumerate(steps):
    label_box(s, gx + lw + 0.06 + j * (cwid + 0.06), gy, cwid, 0.56, st, size=10)
for i, cat in enumerate(cats4):
    yy = gy + 0.62 + i * (rh + 0.06)
    label_box(s, gx, yy, lw, rh, cat, size=11)
    for j in range(4):
        fill, fg, _ = STATE[grid[i][j]]
        xx = gx + lw + 0.06 + j * (cwid + 0.06)
        cell = rect(s, xx, yy, cwid, rh, fill, line=RED if grid[i][j] == "N" else BLACK,
                    line_w=1.75 if grid[i][j] == "N" else 0.75)
        if grid[i][j] == "N":
            cell.line.dash_style = 4
        text_box(s, xx, yy + 0.08, cwid, 0.36, [(STATE[grid[i][j]][2], {"size": 10, "bold": True, "color": fg})],
                 align=PP_ALIGN.CENTER)
        text_box(s, xx, yy + 0.42, cwid, 0.34, [(notes[i][j], {"size": 9.5, "color": fg})], align=PP_ALIGN.CENTER)
for k, key in enumerate(("T", "O", "N", "X")):
    fill, fg, txt = STATE[key]
    lx = 0.3 + k * 1.78
    sw = rect(s, lx, 6.42, 0.24, 0.18, fill, line=RED if key == "N" else BLACK, line_w=1.2 if key == "N" else 0.6)
    if key == "N":
        sw.line.dash_style = 4
    text_box(s, lx + 0.3, 6.37, 1.5, 0.28, [(txt, {"size": 9.5})])

bullets(s, 7.62, 2.02, 2.92, 4.7, [
    (0, "【事実】当社の取引は「チルド惣菜×関西の量販センター配送」の1区画のみ"),
    (0, "【推定】冷凍の保管・配送は関東の大手3PLに委託されている"),
    (1, "冷凍の売上は3年で約1.7倍に伸びている"),
    (0, "【事実】EC・業務用で新しい配送区画が発生している", RED),
    (1, "まだ委託先が固まっていない可能性がある", RED),
    (0, "既存の大手3PLとの正面からの置換より、新規発生区画からの参入が現実的", RED),
], size=10.5)


# ============================================================= (5) 提案・連携余地
s = page(5, "提案・連携余地",
         "新工場の稼働に伴う関東の冷凍保管を入口に、EC小口と業務用配送へ取引を広げる",
         "(1)〜(4)の分析にもとづく仮説。" + SOURCE_FICTION,
         note="提案の確度は公開情報から判断した目安。実際の提案前に、顧客の物流部門への確認が必要")
props = [
    ("群馬第2工場の\n冷凍保管・横持ち", "優先度 高", [
        (0, "【事実】2026/04稼働で冷凍の生産能力が約1.5倍"),
        (0, "【推察】既存の冷凍倉庫だけでは保管が不足し、外部倉庫の追加が必要になる可能性が高い"),
        (0, "工場近隣の当社冷凍倉庫での一時保管と、量販センターへの横持ちを提案", RED),
        (1, "想定規模（推計）：冷凍保管 300〜500パレット、横持ち 日2〜3便"),
        (1, "初回の打ち手：年末の繁忙期前に、物流部へ保管枠の空き状況を提示"),
        (1, "確認事項：工場内の保管能力、現行3PLとの契約更新時期"),
    ]),
    ("EC・ふるさと納税の\n冷凍小口配送", "優先度 中", [
        (0, "【事実】2025/10に公式ECを開設、返礼品にも採用"),
        (0, "【推察】年末に出荷が集中し、大手3PLの通常便では波動に対応しにくい"),
        (0, "繁忙期の出荷代行と、調味料との同梱出荷をセットで提案", RED),
        (1, "想定規模（推計）：年末のピーク時に日1,000件前後"),
        (1, "初回の打ち手：11月までに、年末の波動に合わせた出荷代行プランを提示"),
        (1, "確認事項：月間出荷件数、現在の発送方法（自社出荷か委託か）"),
    ]),
    ("業務用の\n関西・中部店舗配送", "優先度 中", [
        (0, "【事実】2026/06から外食チェーン3社へ供給開始の予定"),
        (0, "【推察】関西は当社のチルド配送網と経路が重なり、混載で単価を抑えられる"),
        (0, "既存の関西チルド便に冷凍の店舗配送を加える提案", RED),
        (1, "想定規模（推計）：関西・中部の約120店舗へ週2回"),
        (1, "初回の打ち手：既存チルド便の経路図に店舗を重ねた混載案を作って持参"),
        (1, "確認事項：店舗数・納品頻度、冷凍・チルドの混載可否"),
    ]),
]
for r, (head, prio, items) in enumerate(props):
    yy = 1.5 + r * 1.62
    if r:
        rule(s, 0.3, yy - 0.08, 10.22, 0.75, RGBColor(0x80, 0x80, 0x80), dash=True)
    label_box(s, 0.3, yy, 2.7, 1.44, head, size=12.5)
    tag = rect(s, 0.42, yy + 0.08, 0.92, 0.26, RED if "高" in prio else WHITE, line=RED)
    text_box(s, 0.42, yy + 0.07, 0.92, 0.28, [(prio, {"size": 9.5, "bold": True, "color": WHITE if "高" in prio else RED})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    bullets(s, 3.2, yy - 0.06, 7.32, 1.56, items, size=10, line=0.94)

rule(s, 0.3, 6.38, 10.22, 0.75, RGBColor(0x80, 0x80, 0x80), dash=True)
label_box(s, 0.3, 6.46, 1.3, 0.44, "留意点", size=11)
text_box(s, 1.7, 6.42, 8.8, 0.52, [
    [("冷凍の主委託先（大手3PL）とは長期契約の可能性が高く、既存区画の置換は難しい。", {"size": 10}),
     ("意思決定は物流部ではなく生産本部が持つ可能性があり、提案先の確認から始める", {"size": 10})]
], anchor=MSO_ANCHOR.MIDDLE, line=0.95)


prs.save(OUT)
print("saved", OUT)
