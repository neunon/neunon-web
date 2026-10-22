"""
既存顧客企業クローズアップ　サンプルレポート（Standard・5枚）を生成する。

土台は Neunon Consulting の公式スライドテンプレート（ver3。サンプルの頁を除いたもの）。
実際の納品物と同じく「依頼元の商材との接点」から顧客を読む構成にし、
LPで見せることを前提に、情報の密度は保ったまま一目で要点が伝わる見せ方にしている。

  (1) 業績・事業構成  (2) 特徴・顧客・販売チャネル  (3) 商品ラインナップ
  (4) 変化のシグナルと取引状況  (5) 提案仮説

設定:
  分析対象   サンプル食品株式会社 … 関東の中堅食品メーカー（説明用のサンプル）
  依頼元     低温物流（冷凍・冷蔵の保管と配送）の会社
数値・出来事はすべて説明用に作ったもので、実在企業の情報ではない。

実行: py design/existing-customers-sample/build_report.py
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

HERE = Path(__file__).parent
ILL = HERE / "illustrations"
TEMPLATE = HERE / "neunon-template.pptx"
OUT = HERE / "existing-customers-sample.pptx"

COMPANY = "サンプル食品株式会社"
DATE = "2026/10/22"

# テンプレートの灰色階調＋実物のグラフと同じ青灰＋示唆の赤
INK = RGBColor(0x11, 0x11, 0x11)
G1 = RGBColor(0x2E, 0x2E, 0x2E)
G2 = RGBColor(0x4A, 0x4A, 0x4A)
G3 = RGBColor(0x62, 0x62, 0x62)
G4 = RGBColor(0x92, 0x92, 0x92)
G5 = RGBColor(0xBD, 0xBD, 0xBD)
G6 = RGBColor(0xD8, 0xDA, 0xDA)
PANEL = RGBColor(0xF2, 0xF3, 0xF4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RED = RGBColor(0xD9, 0x25, 0x1D)
B1, B2, B3, B4, B5 = (RGBColor(0xDF, 0xE5, 0xEF), RGBColor(0xC3, 0xCF, 0xE1),
                      RGBColor(0x9D, 0xB1, 0xCF), RGBColor(0x6F, 0x8D, 0xB9), RGBColor(0x3F, 0x5A, 0x8A))

prs = Presentation(TEMPLATE)
LAYOUT = next(l for l in prs.slide_layouts if l.name == "タイトル")


# ------------------------------------------------------------------ 文字
def style_run(run, size=10.5, bold=False, color=INK):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color


def set_bullet(p, level):
    """■（第1階層）と –（第2階層）を PowerPoint の箇条書きとして付ける"""
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", str(Inches(0.17 if level == 0 else 0.36)))
    ppr.set("indent", str(-Inches(0.17)))
    for tag in ("a:buFont", "a:buChar", "a:buNone"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    f = etree.SubElement(ppr, qn("a:buFont"))
    c = etree.SubElement(ppr, qn("a:buChar"))
    if level == 0:
        f.set("typeface", "Wingdings")
        c.set("char", "§")
    else:
        f.set("typeface", "Arial")
        c.set("char", "–")


def no_bullet(p):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", "0")
    ppr.set("indent", "0")
    for tag in ("a:buFont", "a:buChar", "a:buAutoNum"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    if ppr.find(qn("a:buNone")) is None:
        etree.SubElement(ppr, qn("a:buNone"))


def text(slide, x, y, w, h, paras, size=10.5, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line=1.0, margin=0.03):
    """paras: [str | (str, opts) | [(str, opts), ...]]  opts: size/bold/color/level/space"""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(margin))
    for i, para in enumerate(paras):
        runs = para if isinstance(para, list) else [para]
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line
        level = None
        space = None
        for r in runs:
            t, o = (r, {}) if isinstance(r, str) else r
            level = o.get("level", level)
            space = o.get("space", space)
            run = p.add_run()
            run.text = t
            style_run(run, o.get("size", size), o.get("bold", False), o.get("color", INK))
        if level is not None:
            set_bullet(p, level)
        else:
            no_bullet(p)
        if space is not None:
            p.space_before = Pt(space)
        elif level is not None:
            p.space_before = Pt(3 if level == 0 else 1)
    return tb


def bullets(slide, x, y, w, h, items, size=10, line=1.0):
    paras = []
    for it in items:
        level, t = it[0], it[1]
        color = it[2] if len(it) > 2 else INK
        bold = it[3] if len(it) > 3 else False
        paras.append((t, {"level": level, "color": color, "bold": bold, "size": size if level == 0 else size - 0.5}))
    return text(slide, x, y, w, h, paras, size=size, line=line)


def box(slide, x, y, w, h, fill=None, line=None, weight=0.75, shape=MSO_SHAPE.RECTANGLE, dash=False):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    s.shadow.inherit = False
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(weight)
        if dash:
            s.line.dash_style = 4
    s.text_frame.text = ""
    return s


def rule(slide, x, y, w, color=G2, weight=1.0, dash=False):
    ln = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x), Inches(y), Inches(x + w), Inches(y))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def vline(slide, x, y, h, color=G5, weight=1.0):
    ln = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x), Inches(y), Inches(x), Inches(y + h))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    return ln


def head(slide, x, y, w, t, size=12):
    """節見出し：左寄せの太字＋下線（テンプレートの罫線と同じ灰）"""
    text(slide, x, y, w, 0.32, [(t, {"size": size, "bold": True})], anchor=MSO_ANCHOR.BOTTOM, margin=0.0)
    rule(slide, x, y + 0.36, w, G2, 1.0)


def bar_label(slide, x, y, w, h, t, size=11, fill=G2, color=WHITE, align=PP_ALIGN.CENTER):
    box(slide, x, y, w, h, fill)
    text(slide, x, y, w, h, [(t, {"size": size, "bold": True, "color": color})], align=align, anchor=MSO_ANCHOR.MIDDLE)


def page(n, title, message, source):
    s = prs.slides.add_slide(LAYOUT)
    s.shapes.title.text = f"{COMPANY}（{n}）　{title}"
    for r in s.shapes.title.text_frame.paragraphs[0].runs:
        style_run(r, 20, False, INK)
    for ph in list(s.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    text(s, 0.36, 1.0, 10.11, 0.42, [(message, {"size": 14, "bold": True})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    # 頁番号・日付（マスターの位置に合わせる）と出所
    text(s, 1.7, 7.27, 1.0, 0.27, [(DATE, {"size": 9, "color": INK})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 9.6, 7.29, 0.85, 0.24, [(f"- {n} -", {"size": 9})], align=PP_ALIGN.RIGHT, margin=0)
    text(s, 0.36, 6.98, 9.4, 0.26, [[("出所：", {"size": 8, "color": G3}), (source, {"size": 8, "color": G3})]], margin=0)
    return s


SAMPLE = "説明用に作成したサンプル（実在企業の情報ではない）"


def legend(slide, x, y, entries, size=9, step=1.05):
    lx = x
    for entry in entries:
        color, label = entry[0], entry[1]
        w = entry[2] if len(entry) > 2 else step
        box(slide, lx, y + 0.05, 0.16, 0.13, color, G3, 0.5)
        text(slide, lx + 0.2, y - 0.01, w - 0.2, 0.24, [(label, {"size": size})], margin=0)
        lx += w


def style_chart(ch, size=9):
    ch.has_legend = False
    ch.font.size = Pt(size)
    ch.font.name = "Arial"


def picture_row(slide, names, x, bottom, width, max_h, gap=0.05):
    sizes = {"frozen-gyoza": (588, 831), "frozen-friedrice": (588, 831), "frozen-udon": (588, 831),
             "chilled-gyoza": (680, 515), "chilled-salad": (510, 619), "sauce-gyoza": (352, 763),
             "sauce-tsuyu": (440, 863), "sauce-dressing": (440, 863), "bulk-gyoza": (668, 819), "bulk-soup": (668, 819)}
    ratios = [sizes[n][0] / sizes[n][1] for n in names]
    h = min(max_h, (width - gap * (len(names) - 1)) / sum(ratios))
    total = h * sum(ratios) + gap * (len(names) - 1)
    cx = x + (width - total) / 2
    for n, r in zip(names, ratios):
        slide.shapes.add_picture(str(ILL / f"{n}-trim.png"), Inches(cx), Inches(bottom - h), height=Inches(h))
        cx += h * r + gap


# ====================================================== (1) 業績・事業構成
s = page(1, "業績・事業構成",
         "冷凍食品が成長をけん引し、3年で売上は約3割増。営業利益率も4.6%から5.3%へ改善",
         "決算公告・会社案内を想定。" + SAMPLE)

# 左：主要指標
tiles = [
    ("売上高（2026/3期予想）", "276", "億円", "前期比 +10%"),
    ("営業利益率", "5.3", "%", "2023年度 4.6% から +0.7pt"),
    ("冷凍食品の売上比率", "41", "%", "2023年度 32%。中計で50%へ"),
    ("従業員数", "640", "名", "単体・2026年3月"),
]
for i, (label, value, unit, sub) in enumerate(tiles):
    tx = 0.36 + (i % 2) * 2.18
    ty = 1.6 + (i // 2) * 1.18
    box(s, tx, ty, 2.08, 1.06, PANEL)
    text(s, tx + 0.1, ty + 0.06, 1.95, 0.26, [(label, {"size": 9, "color": G3, "bold": True})], margin=0)
    text(s, tx + 0.1, ty + 0.3, 1.95, 0.5, [[(value, {"size": 24, "bold": True}), (" " + unit, {"size": 11, "bold": True})]],
         margin=0, anchor=MSO_ANCHOR.MIDDLE)
    text(s, tx + 0.1, ty + 0.78, 1.95, 0.24, [(sub, {"size": 8.5, "color": G3})], margin=0)

head(s, 0.36, 4.0, 4.26, "読み取れること")
bullets(s, 0.36, 4.5, 4.26, 2.4, [
    (0, "増収64億円のうち61億円が冷凍食品と業務用"),
    (1, "冷凍は年18%、業務用は年15%で伸びている"),
    (0, "当社が取引するチルド惣菜は年2%弱で横ばい", RED, True),
    (1, "今の取引の延長では、取引額は増えにくい", RED),
    (0, "中計で冷凍比率を2028年度に50%へ。冷凍への投資と物量の増加が続く見込み"),
    (0, "業務用は外食チェーン3社との新規契約で、2026年度以降さらに伸びる見込み"),
], size=10)

# 右：事業別の売上推移（積み上げ＋合計の見出し）
head(s, 4.85, 1.55, 5.62, "事業別の売上推移（億円）")
legend(s, 4.88, 2.0, [(B1, "冷凍食品"), (B2, "チルド惣菜"), (B3, "調味料"), (B4, "業務用")], step=1.2)
data = CategoryChartData()
data.categories = ["2023", "2024", "2025", "2026予"]
for name, vals in [("業務用", (31, 34, 40, 47)), ("調味料", (52, 53, 52, 52)), ("チルド惣菜", (61, 62, 63, 64)),
                   ("冷凍食品", (68, 79, 96, 113)), ("合計", (0, 0, 0, 0))]:
    data.add_series(name, vals)
gf = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(4.85), Inches(2.25), Inches(5.62), Inches(2.62), data)
ch = gf.chart
style_chart(ch)
plot = ch.plots[0]
plot.gap_width = 70
plot.overlap = 100
for i, ser in enumerate(plot.series):
    fill = [B4, B3, B2, B1, None][i]
    if fill is None:
        ser.format.fill.background()
        ser.format.line.fill.background()
        for j, tot in enumerate((212, 228, 251, 276)):
            dl = ser.points[j].data_label
            dl.has_text_frame = True
            dl.text_frame.text = str(tot)
            dl.position = XL_LABEL_POSITION.INSIDE_BASE
            for r in dl.text_frame.paragraphs[0].runs:
                style_run(r, 10, True, INK)
        continue
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = WHITE
    ser.format.line.width = Pt(0.75)
    ser.data_labels.show_value = True
    ser.data_labels.position = XL_LABEL_POSITION.CENTER
    ser.data_labels.font.size = Pt(9)
    ser.data_labels.font.color.rgb = WHITE if fill in (B4, B5) else INK
va = ch.value_axis
va.visible = False
va.has_major_gridlines = False
va.maximum_scale = 300
va.minimum_scale = 0
ch.category_axis.tick_labels.font.size = Pt(10)
ch.category_axis.format.line.color.rgb = G2

# 右下：事業別の伸び
rows = [
    ("事業", "2023", "2026予", "年平均の伸び", "構成比"),
    ("冷凍食品", "68", "113", "+18.4%", "41%"),
    ("業務用", "31", "47", "+14.9%", "17%"),
    ("チルド惣菜", "61", "64", "+1.6%", "23%"),
    ("調味料", "52", "52", "±0.0%", "19%"),
    ("合計", "212", "276", "+9.2%", "100%"),
]
widths = [1.5, 0.85, 0.85, 1.3, 1.12]
tbl = s.shapes.add_table(len(rows), 5, Inches(4.85), Inches(5.0), Inches(5.62), Inches(1.86)).table
for j, w in enumerate(widths):
    tbl.columns[j].width = Inches(w)
for i, row in enumerate(rows):
    tbl.rows[i].height = Inches(0.31)
    for j, val in enumerate(row):
        c = tbl.cell(i, j)
        c.margin_left = c.margin_right = Inches(0.06)
        c.margin_top = c.margin_bottom = Inches(0.02)
        c.vertical_anchor = MSO_ANCHOR.MIDDLE
        c.fill.solid()
        c.fill.fore_color.rgb = G2 if i == 0 else (PANEL if i == len(rows) - 1 else WHITE)
        tf = c.text_frame
        tf.text = val
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT if j == 0 else PP_ALIGN.RIGHT
        emphasize = i in (1, 2) and j == 3
        style_run(p.runs[0], 9.5, i == 0 or emphasize or i == len(rows) - 1,
                  WHITE if i == 0 else (RED if emphasize else INK))
tbl.first_row = True


# ================================================ (2) 特徴・顧客・販売チャネル
s = page(2, "特徴・顧客・販売チャネル",
         "量販中心の販路から、業務用とECへ分散が進む。冷凍の「届け先」が増えている",
         "会社案内・プレスリリース・求人情報を想定。" + SAMPLE)

head(s, 0.36, 1.55, 4.95, "販売チャネル別の売上構成")
ch_data = CategoryChartData()
ch_data.categories = ["2026予", "2023"]
channel = [("量販", (55, 63), B5), ("CVS", (11, 12), B4), ("外食・中食", (17, 15), B3),
           ("EC・ふるさと納税", (6, 0), RED), ("その他", (11, 10), G6)]
for name, vals, _ in channel:
    ch_data.add_series(name, vals)
gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_STACKED_100, Inches(0.3), Inches(2.0), Inches(5.05), Inches(1.95), ch_data)
ch = gf.chart
style_chart(ch)
ch.plots[0].gap_width = 45
ch.plots[0].overlap = 100
for i, ser in enumerate(ch.plots[0].series):
    color = channel[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = color
    ser.format.line.color.rgb = WHITE
    ser.format.line.width = Pt(0.75)
    ser.data_labels.show_value = True
    ser.data_labels.number_format = '0"%";;;'
    ser.data_labels.number_format_is_linked = False
    ser.data_labels.font.size = Pt(9.5)
    ser.data_labels.font.bold = True
    ser.data_labels.font.color.rgb = WHITE if color in (B5, B4, RED) else INK
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.category_axis.tick_labels.font.size = Pt(10)
ch.category_axis.format.line.fill.background()
legend(s, 0.4, 3.98, [(c, n, w) for (n, _, c), w in zip(channel, (0.72, 0.68, 1.05, 1.55, 0.8))], size=8.5)

head(s, 0.36, 4.45, 4.95, "主な販売先")
sellers = [
    ("量販", "関東・関西の大手スーパー。上位5社で量販売上の約6割"),
    ("CVS", "大手コンビニのPB惣菜を製造"),
    ("外食・中食", "外食チェーン3社と新規契約（2026/06〜）、弁当事業者"),
    ("EC", "公式EC（2025/10〜）、ふるさと納税の返礼品"),
]
for i, (k, v) in enumerate(sellers):
    yy = 4.95 + i * 0.48
    box(s, 0.36, yy, 1.05, 0.4, PANEL)
    text(s, 0.36, yy, 1.05, 0.4, [(k, {"size": 9.5, "bold": True})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text(s, 1.5, yy, 3.8, 0.4, [(v, {"size": 9.5, "color": RED if k == "EC" else INK})], anchor=MSO_ANCHOR.MIDDLE)

head(s, 5.6, 1.55, 4.87, "特徴・強み")
strengths = [
    ("看板商品を持つ", "冷凍ギョーザ「羽根つき一番」が冷凍売上の約4割。量販の冷凍売場で定番の棚を確保している", False),
    ("2温度帯で作り、届ける", "チルドと冷凍を同じ工場群で製造。チルドは関西に即日配送の仕組みを持つ", False),
    ("生産拠点の増強", "埼玉第1（チルド・調味料）、群馬第1（冷凍）に加え、群馬第2（冷凍）が2026/04に稼働", False),
    ("物流の意思決定者ができた", "2026/04に物流部を新設。物流企画職の求人で「委託先の再編」に言及している", True),
]
for i, (t, body, hot) in enumerate(strengths):
    yy = 2.08 + i * 1.18
    circ = box(s, 5.6, yy + 0.02, 0.34, 0.34, RED if hot else G2, shape=MSO_SHAPE.OVAL)
    text(s, 5.6, yy + 0.02, 0.34, 0.34, [(str(i + 1), {"size": 10, "bold": True, "color": WHITE})],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 6.05, yy - 0.02, 4.42, 0.34, [(t, {"size": 11.5, "bold": True, "color": RED if hot else INK})], anchor=MSO_ANCHOR.MIDDLE)
    text(s, 6.05, yy + 0.34, 4.42, 0.74, [(body, {"size": 9.5, "color": INK})], line=1.05)
    if i < 3:
        rule(s, 6.05, yy + 1.08, 4.42, G6, 0.75)


# ============================================================ (3) 商品ラインナップ
s = page(3, "商品ラインナップ",
         "物流の接点が大きいのは冷凍食品と業務用。取引中のチルドは伸びが小さい",
         "自社サイト・商品カタログを想定。価格は店頭想定（税込）。" + SAMPLE)
cats = [
    ("冷凍食品", ["frozen-gyoza", "frozen-friedrice", "frozen-udon"], [
        ("主な商品", "羽根つき一番（ギョーザ）、香ばし炒飯、讃岐風うどん"),
        ("価格帯", "298〜498円"),
        ("温度帯", "冷凍（−18℃以下）"),
        ("主な販路", "量販・CVS・EC・ふるさと納税"),
        ("売上と伸び", "113億円　年+18%"),
    ], ("物流の接点：大", B5, WHITE)),
    ("チルド惣菜", ["chilled-gyoza", "chilled-salad"], [
        ("主な商品", "焼くだけ餃子、ポテトサラダ、きんぴら"),
        ("価格帯", "198〜398円"),
        ("温度帯", "チルド（10℃以下）・賞味3〜5日"),
        ("主な販路", "量販の惣菜売場に毎日納品"),
        ("売上と伸び", "64億円　年+2%"),
    ], ("当社取引中・伸び小", B3, INK)),
    ("調味料", ["sauce-gyoza", "sauce-tsuyu", "sauce-dressing"], [
        ("主な商品", "餃子のたれ、そばつゆ、胡麻ドレッシング"),
        ("価格帯", "198〜548円"),
        ("温度帯", "常温"),
        ("主な販路", "量販・EC（冷凍品と同梱）"),
        ("売上と伸び", "52億円　横ばい"),
    ], ("物流の接点：小", G6, INK)),
    ("業務用", ["bulk-gyoza", "bulk-soup"], [
        ("主な商品", "業務用冷凍ギョーザ（50個入）、スープの素"),
        ("価格帯", "ケース単位の取引"),
        ("温度帯", "冷凍中心"),
        ("主な販路", "外食チェーン・弁当事業者"),
        ("売上と伸び", "47億円　年+15%"),
    ], ("物流の接点：中・新規", B4, WHITE)),
]
cw = 2.4
for i, (name, pics, specs, (verdict, vfill, vcolor)) in enumerate(cats):
    x = 0.36 + i * (cw + 0.17)
    bar_label(s, x, 1.58, cw, 0.36, name, size=11)
    box(s, x, 1.94, cw, 1.62, PANEL)
    picture_row(s, pics, x + 0.08, 3.48, cw - 0.16, 1.42)
    yy = 3.64
    for k, (label, value) in enumerate(specs):
        rh = 0.66 if k == 0 else 0.48
        hot = label == "売上と伸び" and ("18" in value or "15" in value)
        text(s, x, yy, cw, 0.2, [(label, {"size": 8, "bold": True, "color": G3})], margin=0)
        text(s, x, yy + 0.19, cw, rh - 0.2, [(value, {"size": 9.5, "bold": hot, "color": RED if hot else INK})], margin=0, line=0.95)
        rule(s, x, yy + rh - 0.02, cw, G6, 0.5)
        yy += rh
    box(s, x, 6.3, cw, 0.42, vfill)
    text(s, x, 6.3, cw, 0.42, [(verdict, {"size": 10.5, "bold": True, "color": vcolor})],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# =================================================== (4) 変化のシグナルと取引状況
s = page(4, "変化のシグナルと取引状況",
         "冷凍の物量が3方面で増える一方、当社の取引はチルド・関西の1区画に留まる",
         "プレスリリース・求人情報と、依頼元の取引実績を突合して作成。" + SAMPLE)

head(s, 0.36, 1.55, 3.85, "直近の変化（2024〜2026）")
events = [
    ("2024/04", "中期経営計画を公表", "冷凍の売上比率を2028年度に50%へ", False),
    ("2025/03", "群馬第2工場を着工", "冷凍ギョーザ・冷凍麺の専用ライン", False),
    ("2025/10", "公式EC・ふるさと納税に参入", "冷凍ギョーザを個人宅へ直送", False),
    ("2026/04", "群馬第2工場が稼働", "冷凍の生産能力が約1.5倍に", False),
    ("2026/04", "物流部を新設", "求人で「委託先の再編」に言及", True),
    ("2026/06", "外食チェーン3社へ供給開始", "関西・中部の店舗へ業務用を納品", False),
]
vline(s, 0.52, 2.12, 4.55, G5, 1.25)
for i, (d, t, body, hot) in enumerate(events):
    yy = 2.05 + i * 0.8
    box(s, 0.44, yy + 0.07, 0.16, 0.16, RED if hot else G2, shape=MSO_SHAPE.OVAL)
    text(s, 0.72, yy - 0.02, 3.5, 0.3, [[(d + "　", {"size": 9.5, "bold": True, "color": G3}),
                                       (t, {"size": 10.5, "bold": True, "color": RED if hot else INK})]], margin=0)
    text(s, 0.72, yy + 0.29, 3.5, 0.3, [(body, {"size": 9.5, "color": RED if hot else G3})], margin=0)

head(s, 4.45, 1.55, 6.02, "商品カテゴリ × 物流工程の取引マップ")
steps = ["保管・横持ち", "量販・CVS\n配送", "EC・個人宅\n配送", "外食店舗\n配送"]
rows4 = ["冷凍食品", "チルド惣菜", "調味料", "業務用"]
grid = [["O", "O", "N", "X"], ["O", "T", "X", "X"], ["O", "O", "N", "X"], ["O", "X", "X", "N"]]
notes = [["大手3PL", "大手3PL", "2025/10〜", ""], ["自社倉庫", "関西のみ当社", "", ""],
         ["他社", "大手3PL", "冷凍と同梱", ""], ["他社", "", "", "2026/06〜"]]
STATE = {"T": (B5, WHITE, "当社取引中"), "O": (B2, INK, "他社委託"), "N": (WHITE, RED, "新規・未取引"),
         "X": (RGBColor(0xF6, 0xF6, 0xF6), G4, "対象外")}
GX, CW, CG, GY, RH, RG = 5.5, 1.2, 0.05, 2.54, 0.8, 0.06
for j, st in enumerate(steps):
    bar_label(s, GX + j * (CW + CG), 2.0, CW, 0.48, st, size=9, fill=G2)
for i, name in enumerate(rows4):
    yy = GY + i * (RH + RG)
    box(s, 4.45, yy, 0.98, RH, PANEL)
    text(s, 4.45, yy, 0.98, RH, [(name, {"size": 9.5, "bold": True})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    for j in range(4):
        k = grid[i][j]
        fill, fg, label = STATE[k]
        xx = GX + j * (CW + CG)
        box(s, xx, yy, CW, RH, fill, RED if k == "N" else G5, 1.75 if k == "N" else 0.5, dash=k == "N")
        paras = [(label, {"size": 9.5, "bold": True, "color": fg})]
        if notes[i][j]:
            paras.append((notes[i][j], {"size": 8.5, "color": fg, "space": 2}))
        text(s, xx, yy, CW, RH, paras, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
for k, key in enumerate(("T", "O", "N", "X")):
    fill, fg, label = STATE[key]
    lx = 4.5 + k * 1.5
    box(s, lx, 6.03, 0.22, 0.16, fill, RED if key == "N" else G5, 1.0, dash=key == "N")
    text(s, lx + 0.28, 5.98, 1.2, 0.26, [(label, {"size": 8.5})], margin=0)
text(s, 4.45, 6.32, 6.02, 0.6, [
    ("取引中は「チルド × 量販配送」の1区画だけ。伸びている冷凍側に、委託先が固まっていない区画が3つある",
     {"size": 10.5, "bold": True, "color": RED}),
], line=1.05)


# =================================================================== (5) 提案仮説
s = page(5, "提案仮説",
         "委託先の見直しを入口に、2温度帯の一括納品と年末の波動対応で取引を広げる",
         "(1)〜(4)の分析にもとづく仮説。" + SAMPLE)
hyps = [
    ("仮説1", "委託先の見直しが始まる前に、相見積もりの席を取る", "確度 高", "規模 大", [
        "2026/04に物流部を新設。求人に「委託先の再編」と記載",
        "冷凍の保管・配送は大手3PL1社に集中（推定）",
    ], "冷凍比率50%を前に、1社依存を見直す段階。入札の前で、候補先はまだ固まっていない",
       "物流部長に「冷凍の委託を2社体制にした場合のコストと災害時の備え」の比較を持ち込み、候補先に入る"),
    ("仮説2", "外食向けは「2温度帯の一括納品」で入る", "確度 中", "規模 中", [
        "2026/06から関西・中部の外食チェーン3社へ業務用を供給",
        "当社は関西で量販向けチルド便を毎日運行",
    ], "店舗は冷凍とチルドを別便で受けると、検品と収納の手間が倍になる。一括納品の要望が出やすい",
       "既存のチルド便に冷凍を混載した店舗への一括納品を提案。冷凍専用便の大手3PLにない切り口になる"),
    ("仮説3", "ふるさと納税の「12月の山」だけを請け負う", "確度 中", "規模 小", [
        "2025/10にふるさと納税へ参入。冷凍ギョーザが返礼品",
        "EC・ふるさと納税の発送体制は未公表",
    ], "寄付は12月に集中しやすい。自社出荷では年末に出荷が追いつかず、遅配の苦情につながりやすい",
       "11〜1月だけの冷凍小口出荷を、年間契約なしで請け負う。小さく実績を作り、仮説1の相見積もりにつなげる"),
]
colw = 3.26
for i, (tag, title, c1, c2, facts, read, prop) in enumerate(hyps):
    x = 0.36 + i * (colw + 0.16)
    box(s, x, 1.58, colw, 0.92, G1)
    text(s, x + 0.12, 1.62, colw - 0.24, 0.24, [(tag, {"size": 9, "bold": True, "color": G5})], margin=0)
    text(s, x + 0.12, 1.84, colw - 0.24, 0.62, [(title, {"size": 11.5, "bold": True, "color": WHITE})],
         line=1.0, margin=0, anchor=MSO_ANCHOR.MIDDLE)
    for k, (t, hot) in enumerate(((c1, "高" in c1), (c2, "大" in c2))):
        tx = x + k * 0.92
        box(s, tx, 2.58, 0.86, 0.26, RED if hot else WHITE, RED if hot else G4, 0.75)
        text(s, tx, 2.58, 0.86, 0.26, [(t, {"size": 8.5, "bold": True, "color": WHITE if hot else G2})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    # 根拠（事実）
    box(s, x, 2.95, colw, 1.18, PANEL)
    text(s, x + 0.1, 3.0, colw - 0.2, 0.22, [("根拠（事実）", {"size": 8.5, "bold": True, "color": G3})], margin=0)
    bullets(s, x + 0.06, 3.2, colw - 0.12, 0.92, [(0, f) for f in facts], size=9, line=0.98)
    text(s, x, 4.12, colw, 0.24, [("▼", {"size": 9, "color": G4})], align=PP_ALIGN.CENTER, margin=0)
    # 読み（推察）
    box(s, x, 4.36, colw, 0.98, WHITE, G5, 0.75)
    text(s, x + 0.1, 4.41, colw - 0.2, 0.22, [("読み（推察）", {"size": 8.5, "bold": True, "color": G3})], margin=0)
    text(s, x + 0.1, 4.62, colw - 0.2, 0.7, [(read, {"size": 9})], line=1.0, margin=0)
    text(s, x, 5.33, colw, 0.24, [("▼", {"size": 9, "color": RED})], align=PP_ALIGN.CENTER, margin=0)
    # 提案・初回の打ち手
    box(s, x, 5.57, colw, 1.1, WHITE, RED, 1.5)
    text(s, x + 0.1, 5.62, colw - 0.2, 0.22, [("提案・初回の打ち手", {"size": 8.5, "bold": True, "color": RED})], margin=0)
    text(s, x + 0.1, 5.83, colw - 0.2, 0.82, [(prop, {"size": 9.5, "bold": True})], line=1.0, margin=0)
text(s, 0.36, 6.72, 10.1, 0.26, [[("留意点：", {"size": 8.5, "bold": True, "color": G2}),
                                  ("冷凍の主委託先とは長期契約の可能性が高い。置き換えを正面から提案せず、新しく生まれる区画から入る",
                                   {"size": 8.5, "color": G2})]], margin=0)

prs.save(OUT)
print("saved", OUT)
