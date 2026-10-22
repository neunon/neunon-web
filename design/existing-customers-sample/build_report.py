"""
既存顧客企業クローズアップ　サンプルレポート（表紙＋12ページ）を生成する。

土台は Neunon Consulting の公式スライドテンプレート（ver3。サンプルの頁を除いたもの）の
マスター（フッター・ロゴ・表紙）。本文はコンサルティングの報告書の作法で組む:
  白地に黒とグレー。色はブランドの青1色だけを、強調したい数字・区画・線に使う。
  塗りの箱やラベルの飾りは使わず、罫線と文字の太さで区切る。結論はタイトルに書く。

実際の納品物（ボリューム大）の構成にならったページ:
  (1) サマリー (2) 会社概要・グループ (3) 業績推移 (4) 事業別の売上構成 (5) 主要組織図
  (6) 顧客・販売チャネル (7) 商品ラインナップ (8) ブランド別売上推移 (9) ブランド詳細
  (10) 変化のシグナル (11) 取引マップ (12) 提案のヒント
ページの構成は依頼ごとに決めるもので、プランとの対応は固定しない。

設定:
  分析対象   サンプル食品株式会社 … 関東の中堅食品メーカー（説明用のサンプル）
  依頼元     サンプル物流株式会社 … 低温物流（冷凍・冷蔵の保管と配送）
数値・出来事・組織・提案のヒントはすべて説明用に作ったもので、実在企業の情報ではない。

実行: py design/existing-customers-sample/build_report.py
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION, XL_MARKER_STYLE
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
FONT = "BIZ UDPゴシック"

INK = RGBColor(0x11, 0x11, 0x11)
G1 = RGBColor(0x33, 0x33, 0x33)
G2 = RGBColor(0x59, 0x59, 0x59)
G3 = RGBColor(0x7F, 0x7F, 0x7F)
G4 = RGBColor(0xA6, 0xA6, 0xA6)
G5 = RGBColor(0xD0, 0xD0, 0xD0)
G6 = RGBColor(0xE6, 0xE6, 0xE6)
PANEL = RGBColor(0xF2, 0xF2, 0xF2)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BLUE = RGBColor(0x12, 0x5B, 0x84)
BLUE_L = RGBColor(0xD6, 0xE5, 0xEE)

SAMPLE = "説明用に作成したサンプル（実在企業の情報ではない）"

prs = Presentation(TEMPLATE)
LAYOUT = next(l for l in prs.slide_layouts if l.name == "タイトル")
R = PP_ALIGN.RIGHT
L = PP_ALIGN.LEFT
C = PP_ALIGN.CENTER


# ------------------------------------------------------------------ 文字
def set_font(font, size=None, bold=None, color=None):
    if size is not None:
        font.size = Pt(size)
    if bold is not None:
        font.bold = bold
    if color is not None:
        font.color.rgb = color
    font.name = FONT
    rpr = font._rPr
    for tag in ("a:ea", "a:cs"):
        for el in rpr.findall(qn(tag)):
            rpr.remove(el)
        etree.SubElement(rpr, qn(tag)).set("typeface", FONT)


def style_run(run, size=10, bold=False, color=INK):
    set_font(run.font, size, bold, color)


def set_bullet(p, level):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", str(Inches(0.15 if level == 0 else 0.32)))
    ppr.set("indent", str(-Inches(0.15)))
    for tag in ("a:buFont", "a:buChar", "a:buNone", "a:buClr"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    f = etree.SubElement(ppr, qn("a:buFont"))
    c = etree.SubElement(ppr, qn("a:buChar"))
    f.set("typeface", "Arial")
    c.set("char", "•" if level == 0 else "–")


def no_bullet(p):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", "0")
    ppr.set("indent", "0")
    for tag in ("a:buFont", "a:buChar", "a:buAutoNum"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    if ppr.find(qn("a:buNone")) is None:
        etree.SubElement(ppr, qn("a:buNone"))


def text(slide, x, y, w, h, paras, size=10, align=L, anchor=MSO_ANCHOR.TOP, line=1.1, margin=0.0):
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
            p.space_before = Pt(4 if level == 0 else 1)
    return tb


def bullets(slide, x, y, w, h, items, size=10, line=1.1):
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


def line(slide, x1, y1, x2, y2, color=G5, weight=0.75, dash=False):
    ln = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def head(slide, x, y, w, t, note=None):
    """節見出し：太字＋黒の細い罫線"""
    text(slide, x, y, w, 0.3, [(t, {"size": 11, "bold": True})], anchor=MSO_ANCHOR.BOTTOM)
    if note:
        text(slide, x, y, w, 0.3, [(note, {"size": 8, "color": G3})], align=R, anchor=MSO_ANCHOR.BOTTOM)
    line(slide, x, y + 0.36, x + w, y + 0.36, INK, 1.0)


def takeaway(slide, x, y, w, h, body):
    """そのページで言いたいこと。薄いグレーの地に太字で"""
    box(slide, x, y, w, h, PANEL)
    text(slide, x + 0.18, y + 0.1, 0.6, h - 0.2, [("示唆", {"size": 9.5, "bold": True, "color": BLUE})], anchor=MSO_ANCHOR.MIDDLE)
    text(slide, x + 0.72, y + 0.08, w - 0.9, h - 0.16, [(body, {"size": 10.5, "bold": True})], anchor=MSO_ANCHOR.MIDDLE, line=1.2)


def grid_table(slide, x, y, widths, rows, row_h=0.32, size=9.5, align=None, hot=None, bold_first=True, total_last=False):
    """罫線だけの表。rows[0] は見出し。hot: {(i, j)} は青の太字"""
    hot = hot or set()
    for i, row in enumerate(rows):
        yy = y + i * row_h
        cx = x
        for j, val in enumerate(row):
            w = widths[j]
            a = align[j] if align else L
            is_head = i == 0
            color = G3 if is_head else (BLUE if (i, j) in hot else INK)
            bold = is_head or (bold_first and j == 0) or (i, j) in hot or (total_last and i == len(rows) - 1)
            text(slide, cx + (0.04 if a == L else 0), yy, w - 0.08, row_h, [(val, {"size": size - (1 if is_head else 0), "bold": bold, "color": color})],
                 align=a, anchor=MSO_ANCHOR.MIDDLE, line=1.0)
            cx += w
        if i == 0:
            line(slide, x, yy + row_h, x + sum(widths), yy + row_h, INK, 1.0)
        else:
            line(slide, x, yy + row_h, x + sum(widths), yy + row_h, G5 if i < len(rows) - 1 else INK, 0.5 if i < len(rows) - 1 else 1.0)


def style_chart(ch, size=9):
    ch.has_title = False
    ch.has_legend = False
    set_font(ch.font, size, None, G2)


def legend(slide, x, y, entries, size=8.5):
    lx = x
    for color, label, w in entries:
        box(slide, lx, y + 0.07, 0.13, 0.13, color)
        text(slide, lx + 0.18, y, w - 0.18, 0.27, [(label, {"size": size, "color": G2})], anchor=MSO_ANCHOR.MIDDLE)
        lx += w


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


PAGE_NO = [0]


def page(section, title, source):
    """本文ページの枠：章名・結論のタイトル・出所・日付・頁番号"""
    PAGE_NO[0] += 1
    n = PAGE_NO[0]
    s = prs.slides.add_slide(LAYOUT)
    for ph in list(s.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    tf = s.shapes.title.text_frame
    tf.text = title
    tf.vertical_anchor = MSO_ANCHOR.BOTTOM
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = L
    p.line_spacing = 1.0
    style_run(p.runs[0], 17, True, INK)
    text(s, 0.38, 0.06, 5.0, 0.22, [(f"{COMPANY}　企業クローズアップ", {"size": 8, "color": G3})], anchor=MSO_ANCHOR.MIDDLE)
    text(s, 5.47, 0.06, 5.0, 0.22, [[(f"{n:02d}  ", {"size": 8, "bold": True, "color": BLUE}), (section, {"size": 8, "bold": True, "color": G2})]],
         align=R, anchor=MSO_ANCHOR.MIDDLE)
    text(s, 1.7, 7.27, 1.0, 0.27, [(DATE, {"size": 9})], anchor=MSO_ANCHOR.MIDDLE)
    text(s, 9.6, 7.29, 0.85, 0.24, [(f"- {n} -", {"size": 9})], align=R)
    text(s, 0.36, 6.98, 9.8, 0.26, [[("出所：", {"size": 7.5, "color": G3}), (source + "。" + SAMPLE, {"size": 7.5, "color": G3})]])
    return s


YEARS = ["2022", "2023", "2024", "2025", "2026予"]

# ======================================================================= (1) サマリー
s = page("サマリー", "冷凍と業務用が成長をけん引。物流の接点は冷凍・EC・外食の3方面で広がる",
         "決算公告・会社案内・プレスリリース・求人情報を想定")
head(s, 0.36, 1.1, 2.95, "企業プロフィール")
profile = [("本社", "埼玉県さいたま市"), ("設立", "1968年"), ("従業員", "640名（単体）"), ("売上高", "276億円（2026/3期予）"),
           ("主な事業", "冷凍食品・チルド惣菜・調味料・業務用"), ("生産拠点", "埼玉工場、群馬第1・第2工場")]
for i, (k, v) in enumerate(profile):
    yy = 1.6 + i * 0.62
    text(s, 0.36, yy, 2.95, 0.22, [(k, {"size": 8, "color": G3})])
    text(s, 0.36, yy + 0.2, 2.95, 0.36, [(v, {"size": 10, "bold": True})])
    line(s, 0.36, yy + 0.56, 3.31, yy + 0.56, G5, 0.5)

head(s, 3.6, 1.1, 6.87, "4つの要点")
finds = [
    ("業績", "276", "億円", "3年で売上は約3割増。増収64億円の7割が冷凍食品", False),
    ("顧客・販路", "55", "%", "量販の比率は63%から55%へ。外食・中食とEC・ふるさと納税が伸びる", False),
    ("商品", "約2", "倍", "主力の冷凍ギョーザ「羽根つき一番」は4年で売上が約2倍の55億円に", False),
    ("変化", "2026/04", "", "物流部を新設。物流企画職の求人に「委託先の再編」と記載", True),
]
for i, (cat, num, unit, body, hot) in enumerate(finds):
    x = 3.6 + (i % 2) * 3.5
    y = 1.6 + (i // 2) * 1.86
    text(s, x, y, 3.3, 0.24, [(cat, {"size": 9, "bold": True, "color": G2})])
    text(s, x, y + 0.24, 3.3, 0.62, [[(num, {"size": 26, "bold": True, "color": BLUE if hot else INK}), (" " + unit, {"size": 11, "bold": True})]],
         anchor=MSO_ANCHOR.MIDDLE)
    text(s, x, y + 0.9, 3.25, 0.62, [(body, {"size": 9.5, "color": G1})], line=1.2)
    if i // 2 == 0:
        line(s, x, y + 1.66, x + 3.3, y + 1.66, G5, 0.5)
line(s, 7.0, 1.7, 7.0, 5.0, G5, 0.5)

head(s, 0.36, 5.38, 10.11, "当社（低温物流）との接点")
touch = [("冷凍の幹線輸送", "群馬の2工場から関東・関西へ"), ("冷凍の小口配送", "公式EC・ふるさと納税の返礼品"), ("外食店舗への配送", "関西・中部の外食チェーン3社")]
for i, (t, b) in enumerate(touch):
    x = 0.36 + i * 3.42
    text(s, x, 5.86, 0.35, 0.5, [(str(i + 1), {"size": 18, "bold": True, "color": BLUE})])
    text(s, x + 0.36, 5.86, 2.9, 0.3, [(t, {"size": 11, "bold": True})])
    text(s, x + 0.36, 6.17, 2.9, 0.3, [(b, {"size": 9, "color": G2})])


# ================================================================ (2) 会社概要・グループ
s = page("会社概要", "群馬に冷凍の生産を集約。製造子会社2社と販売子会社1社のグループで事業を運営",
         "会社案内・登記情報・プレスリリースを想定")
head(s, 0.36, 1.1, 4.3, "基本情報")
basic = [("項目", "内容"), ("商号", COMPANY), ("設立", "1968年4月"), ("本社", "埼玉県さいたま市"), ("資本金", "4.8億円"),
         ("従業員数", "640名（単体）／1,120名（連結）"), ("売上高", "276億円（2026/3期予・単体）"),
         ("事業内容", "冷凍食品・チルド惣菜・調味料の製造販売、業務用食品の販売"), ("上場", "非上場")]
grid_table(s, 0.36, 1.52, [1.1, 3.2], basic, row_h=0.43, size=9.5)
takeaway(s, 0.36, 5.6, 4.3, 1.2, "保管・配送はすべて外部に委託しており、自社の物流拠点を持たない")

head(s, 4.95, 1.1, 5.52, "グループ構成")
box(s, 6.27, 1.6, 2.9, 0.62, WHITE, INK, 1.25)
text(s, 6.27, 1.6, 2.9, 0.62, [(COMPANY, {"size": 10.5, "bold": True}), ("本社・商品開発・量販営業", {"size": 8, "color": G3, "space": 1})],
     align=C, anchor=MSO_ANCHOR.MIDDLE)
line(s, 7.72, 2.22, 7.72, 2.45, G3, 1.0)
line(s, 5.87, 2.45, 9.57, 2.45, G3, 1.0)
children = [("群馬サンプル食品（株）", "冷凍食品の製造", "群馬第1・第2工場", True), ("サンプルデリカ（株）", "チルド惣菜の製造", "埼玉工場", False),
            ("サンプル食品販売（株）", "業務用の営業・販売", "関東・関西", False)]
for i, (name, role, site, hot) in enumerate(children):
    x = 5.0 + i * 1.86
    line(s, x + 0.87, 2.45, x + 0.87, 2.63, G3, 1.0)
    box(s, x, 2.63, 1.74, 1.25, WHITE, BLUE if hot else G4, 1.5 if hot else 0.75)
    text(s, x + 0.08, 2.7, 1.58, 1.12, [(name, {"size": 9, "bold": True, "color": BLUE if hot else INK}), (role, {"size": 9, "space": 6}),
                                        (site, {"size": 8, "color": G3, "space": 1})], align=C, anchor=MSO_ANCHOR.MIDDLE)
head(s, 4.95, 4.2, 5.52, "主な拠点")
sites = [("本社", "埼玉県さいたま市", False), ("埼玉工場", "チルド惣菜・調味料", False), ("群馬第1工場", "冷凍食品", False),
         ("群馬第2工場", "冷凍ギョーザ・冷凍麺（2026/04稼働）", True), ("関西営業所", "大阪府大阪市", False)]
for i, (k, v, hot) in enumerate(sites):
    yy = 4.64 + i * 0.42
    text(s, 4.95, yy, 1.5, 0.38, [(k, {"size": 9.5, "bold": True, "color": BLUE if hot else INK})], anchor=MSO_ANCHOR.MIDDLE)
    text(s, 6.5, yy, 3.97, 0.38, [(v, {"size": 9.5, "color": BLUE if hot else INK, "bold": hot})], anchor=MSO_ANCHOR.MIDDLE)
    line(s, 4.95, yy + 0.4, 10.47, yy + 0.4, G5, 0.5)


# =================================================================== (3) 業績推移
s = page("業績", "5期連続の増収。営業利益率は4.3%から5.3%へ改善した", "決算公告を想定。2026年度は会社予想")
head(s, 0.36, 1.1, 6.4, "売上高の推移", "単位：億円")
d = CategoryChartData()
d.categories = YEARS
d.add_series("売上高", (198, 212, 228, 251, 276))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(0.3), Inches(1.55), Inches(6.5), Inches(3.0), d).chart
style_chart(ch)
ch.plots[0].gap_width = 70
ser = ch.plots[0].series[0]
ser.format.fill.solid()
ser.format.fill.fore_color.rgb = G4
ser.points[4].format.fill.solid()
ser.points[4].format.fill.fore_color.rgb = BLUE
ser.data_labels.show_value = True
ser.data_labels.position = XL_LABEL_POSITION.OUTSIDE_END
set_font(ser.data_labels.font, 11, True, INK)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.minimum_scale = 0
ch.value_axis.maximum_scale = 320
ch.category_axis.format.line.color.rgb = INK
set_font(ch.category_axis.tick_labels.font, 10, None, G1)

head(s, 0.36, 4.7, 6.4, "営業利益率の推移")
d = CategoryChartData()
d.categories = YEARS
d.add_series("営業利益率", (4.3, 4.6, 4.8, 5.0, 5.3))
ch = s.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, Inches(0.3), Inches(5.12), Inches(6.5), Inches(1.75), d).chart
style_chart(ch)
ser = ch.plots[0].series[0]
ser.smooth = False
ser.format.line.color.rgb = INK
ser.format.line.width = Pt(1.75)
ser.marker.style = XL_MARKER_STYLE.CIRCLE
ser.marker.size = 6
ser.marker.format.fill.solid()
ser.marker.format.fill.fore_color.rgb = INK
ser.marker.format.line.color.rgb = INK
ser.data_labels.show_value = True
ser.data_labels.number_format = '0.0"%"'
ser.data_labels.number_format_is_linked = False
ser.data_labels.position = XL_LABEL_POSITION.ABOVE
set_font(ser.data_labels.font, 9.5, True, INK)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.minimum_scale = 3.4
ch.value_axis.maximum_scale = 5.9
ch.category_axis.visible = False

head(s, 7.05, 1.1, 3.42, "主要な指標")
kpis = [("売上高（2026/3期予）", "276", "億円", "前期比 +10%", False), ("営業利益（同）", "14.6", "億円", "営業利益率 5.3%", False),
        ("年平均の伸び", "+8.7", "%", "2022 → 2026予", False), ("冷凍食品の売上比率", "41", "%", "2022年度は30%", True)]
for i, (a, b, c, e, hot) in enumerate(kpis):
    yy = 1.58 + i * 0.86
    text(s, 7.05, yy, 3.42, 0.22, [(a, {"size": 8.5, "color": G3})])
    text(s, 7.05, yy + 0.22, 1.9, 0.5, [[(b, {"size": 22, "bold": True, "color": BLUE if hot else INK}), (" " + c, {"size": 10, "bold": True})]],
         anchor=MSO_ANCHOR.MIDDLE)
    text(s, 8.95, yy + 0.22, 1.52, 0.5, [(e, {"size": 8.5, "color": G2})], align=R, anchor=MSO_ANCHOR.MIDDLE)
    line(s, 7.05, yy + 0.78, 10.47, yy + 0.78, G5, 0.5)
takeaway(s, 7.05, 5.2, 3.42, 1.6, "増収の主因は冷凍食品。群馬第2工場の稼働で、2027年度以降も冷凍の物量は増え続ける見込み")


# ============================================================ (4) 事業別の売上構成
s = page("業績", "増収64億円の7割が冷凍食品。当社が取引するチルド惣菜は横ばい", "決算公告・会社案内を想定")
head(s, 0.36, 1.1, 5.55, "事業別の売上推移", "単位：億円")
seg = [("調味料", (52, 53, 52, 52), G6), ("チルド惣菜", (61, 62, 63, 64), G5), ("業務用", (31, 34, 40, 47), G3),
       ("冷凍食品", (68, 79, 96, 113), BLUE)]
legend(s, 0.36, 1.55, [(BLUE, "冷凍食品", 1.1), (G3, "業務用", 0.95), (G5, "チルド惣菜", 1.2), (G6, "調味料", 0.9)])
d = CategoryChartData()
d.categories = ["2023", "2024", "2025", "2026予"]
for name, vals, _ in seg:
    d.add_series(name, vals)
d.add_series("合計", (0, 0, 0, 0))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(0.3), Inches(1.88), Inches(5.65), Inches(4.0), d).chart
style_chart(ch)
plot = ch.plots[0]
plot.gap_width = 70
plot.overlap = 100
for i, ser in enumerate(plot.series):
    if i == 4:
        ser.format.fill.background()
        ser.format.line.fill.background()
        for j, tot in enumerate((212, 228, 251, 276)):
            dl = ser.points[j].data_label
            dl.has_text_frame = True
            dl.text_frame.text = str(tot)
            dl.position = XL_LABEL_POSITION.INSIDE_BASE
            style_run(dl.text_frame.paragraphs[0].runs[0], 11, True, INK)
        continue
    fill = seg[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = WHITE
    ser.format.line.width = Pt(1)
    ser.data_labels.show_value = True
    ser.data_labels.position = XL_LABEL_POSITION.CENTER
    set_font(ser.data_labels.font, 9, True, WHITE if fill in (BLUE, G3) else INK)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.maximum_scale = 300
ch.value_axis.minimum_scale = 0
ch.category_axis.format.line.color.rgb = INK
set_font(ch.category_axis.tick_labels.font, 10, None, G1)

head(s, 6.2, 1.1, 4.27, "事業別の伸び")
rows = [("事業", "2023", "2026予", "年平均", "構成比"), ("冷凍食品", "68", "113", "+18.4%", "41%"), ("業務用", "31", "47", "+14.9%", "17%"),
        ("チルド惣菜※", "61", "64", "+1.6%", "23%"), ("調味料", "52", "52", "±0.0%", "19%"), ("合計", "212", "276", "+9.2%", "100%")]
grid_table(s, 6.2, 1.52, [1.17, 0.7, 0.75, 0.85, 0.8], rows, row_h=0.36, align=[L, R, R, R, R], hot={(1, 3), (2, 3)}, total_last=True)
text(s, 6.2, 3.74, 4.27, 0.26, [("※ 当社の取引先事業", {"size": 8, "color": G3})])
bullets(s, 6.2, 4.05, 4.27, 1.3, [(0, "冷凍は年18%、業務用は年15%で伸びる"), (0, "中計で冷凍比率を2028年度に50%へ"),
                                  (0, "チルド惣菜は年2%弱。今の取引の延長では取引額は増えにくい")], size=9.5)
takeaway(s, 6.2, 5.55, 4.27, 1.25, "伸びているのは当社の取引の外側。冷凍と業務用の物流に入れるかが、取引拡大の分かれ目")


# ================================================================== (5) 主要組織図
s = page("組織", "2026年4月に物流部を新設。物流の意思決定が管理本部に集約された", "会社案内・人事異動の発表・求人情報を想定")
box(s, 0.36, 1.14, 0.32, 0.18, WHITE, BLUE, 2.0)
text(s, 0.76, 1.08, 2.0, 0.3, [("提案の起点・実務窓口", {"size": 8.5, "bold": True, "color": BLUE})], anchor=MSO_ANCHOR.MIDDLE)
box(s, 2.6, 1.14, 0.32, 0.18, WHITE, INK, 1.25)
text(s, 3.0, 1.08, 2.0, 0.3, [("関係する検討先（太字）", {"size": 8.5, "bold": True})], anchor=MSO_ANCHOR.MIDDLE)

box(s, 4.67, 1.45, 1.5, 0.4, PANEL)
text(s, 4.67, 1.45, 1.5, 0.4, [("取締役会", {"size": 9.5})], align=C, anchor=MSO_ANCHOR.MIDDLE)
line(s, 5.42, 1.85, 5.42, 2.02, G3, 1.0)
box(s, 4.42, 2.02, 2.0, 0.42, WHITE, INK, 1.0)
text(s, 4.42, 2.02, 2.0, 0.42, [("代表取締役社長", {"size": 10, "bold": True})], align=C, anchor=MSO_ANCHOR.MIDDLE)
line(s, 5.42, 2.44, 5.42, 2.66, G3, 1.0)
cols = [
    ("営業本部", [("量販営業部", None), ("業務用営業部", "rel"), ("EC推進室（2025/10新設）", "rel")]),
    ("商品開発本部", [("冷凍開発部", None), ("チルド・調味料開発部", None)]),
    ("生産本部", [("埼玉工場", None), ("群馬工場", None), ("生産管理部", "rel"), ("品質保証部", None)]),
    ("管理本部", [("経営企画部", "rel"), ("物流部（2026/04新設）", "key"), ("購買部", None), ("総務人事部", None)]),
]
cw, cg = 2.42, 0.14
line(s, 0.36 + cw / 2, 2.66, 0.36 + 3 * (cw + cg) + cw / 2, 2.66, G3, 1.0)
for i, (bu, depts) in enumerate(cols):
    x = 0.36 + i * (cw + cg)
    line(s, x + cw / 2, 2.66, x + cw / 2, 2.84, G3, 1.0)
    box(s, x, 2.84, cw, 0.42, PANEL)
    text(s, x, 2.84, cw, 0.42, [(bu, {"size": 10, "bold": True})], align=C, anchor=MSO_ANCHOR.MIDDLE)
    last = 3.42 + (len(depts) - 1) * 0.56 + 0.21
    line(s, x + 0.16, 3.26, x + 0.16, last, G4, 0.75)
    for k, (dname, mark) in enumerate(depts):
        yy = 3.42 + k * 0.56
        line(s, x + 0.16, yy + 0.21, x + 0.34, yy + 0.21, G4, 0.75)
        color = BLUE if mark == "key" else (INK if mark == "rel" else G4)
        box(s, x + 0.34, yy, cw - 0.34, 0.42, WHITE, color, 2.0 if mark == "key" else (1.0 if mark == "rel" else 0.5))
        text(s, x + 0.34, yy, cw - 0.34, 0.42, [(dname, {"size": 9, "bold": mark is not None, "color": BLUE if mark == "key" else INK})],
             align=C, anchor=MSO_ANCHOR.MIDDLE)
takeaway(s, 0.36, 5.85, 10.11, 0.95,
         "提案の起点は新設の物流部。届け先の要件は業務用営業部とEC推進室、物量の計画は生産管理部、委託先の評価には経営企画部が関わる")


# ============================================================ (6) 顧客・販売チャネル
s = page("顧客・販路", "量販中心の販路から、外食・ECへ分散が進む。冷凍の届け先が増えている", "会社案内・プレスリリース・求人情報を想定")
head(s, 0.36, 1.1, 5.0, "販売チャネル別の売上構成")
d = CategoryChartData()
d.categories = ["2026予", "2023"]
channel = [("量販", (55, 63), G2, 0.62), ("CVS", (11, 12), G4, 0.6), ("外食・中食", (17, 15), BLUE_L, 0.95),
           ("EC・ふるさと納税", (6, 0), BLUE, 1.45), ("その他", (11, 10), G6, 0.7)]
for name, vals, _, _ in channel:
    d.add_series(name, vals)
ch = s.shapes.add_chart(XL_CHART_TYPE.BAR_STACKED_100, Inches(0.3), Inches(1.55), Inches(5.1), Inches(1.95), d).chart
style_chart(ch)
ch.plots[0].gap_width = 50
ch.plots[0].overlap = 100
for i, ser in enumerate(ch.plots[0].series):
    color = channel[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = color
    ser.format.line.color.rgb = WHITE
    ser.format.line.width = Pt(1)
    ser.data_labels.show_value = True
    ser.data_labels.number_format = '0"%";;;'
    ser.data_labels.number_format_is_linked = False
    set_font(ser.data_labels.font, 9.5, True, WHITE if color in (G2, BLUE) else INK)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.category_axis.format.line.fill.background()
set_font(ch.category_axis.tick_labels.font, 10, None, G1)
legend(s, 0.42, 3.55, [(c, n, w) for n, _, c, w in channel])

head(s, 0.36, 4.05, 5.0, "特徴・強み")
strengths = [("看板商品を持つ", "冷凍ギョーザ「羽根つき一番」が冷凍売上の約5割。量販の冷凍売場で定番の棚を確保"),
             ("2温度帯で作り、届ける", "チルドと冷凍を同じグループで製造。チルドは関西に即日配送の仕組みを持つ"),
             ("生産拠点の増強", "群馬第2工場（冷凍）が2026/04に稼働し、冷凍の生産能力は約1.5倍に")]
for i, (t, b) in enumerate(strengths):
    yy = 4.55 + i * 0.75
    text(s, 0.36, yy, 0.3, 0.3, [(str(i + 1), {"size": 12, "bold": True, "color": BLUE})])
    text(s, 0.7, yy, 4.66, 0.3, [(t, {"size": 10.5, "bold": True})], anchor=MSO_ANCHOR.MIDDLE)
    text(s, 0.7, yy + 0.3, 4.66, 0.42, [(b, {"size": 9, "color": G1})])

head(s, 5.65, 1.1, 4.82, "主な販売先")
rows = [("チャネル", "主な販売先", "2023→2026予"), ("量販", "関東・関西の大手スーパー。上位5社で量販売上の約6割", "63% → 55%"),
        ("CVS", "大手コンビニのPB惣菜を製造", "12% → 11%"), ("外食・中食", "外食チェーン3社と新規契約（2026/06〜）、弁当事業者", "15% → 17%"),
        ("EC", "公式EC（2025/10〜）、ふるさと納税の返礼品", "0% → 6%"), ("その他", "卸・生協", "10% → 11%")]
grid_table(s, 5.65, 1.52, [1.0, 2.67, 1.15], rows, row_h=0.56, size=9, align=[L, L, R], hot={(4, 0), (4, 2)})
takeaway(s, 5.65, 5.2, 4.82, 1.6, "量販向けの定期便だけでは、伸びる販路に届かない。外食店舗と個人宅という、温度管理が難しい届け先が増えている")


# ============================================================== (7) 商品ラインナップ
s = page("商品", "物流の接点が大きいのは冷凍食品と業務用。取引中のチルドは伸びが小さい",
         "自社サイト・商品カタログを想定。価格は店頭想定（税込）")
cats = [
    ("冷凍食品", ["frozen-gyoza", "frozen-friedrice", "frozen-udon"], [
        ("主な商品", "羽根つき一番（ギョーザ）、香ばし炒飯、讃岐風うどん"), ("価格帯", "298〜498円"), ("温度帯", "冷凍（−18℃以下）"),
        ("主な販路", "量販・CVS・EC・ふるさと納税"), ("売上と伸び", "113億円　年+18%")], "物流の接点：大", True),
    ("チルド惣菜", ["chilled-gyoza", "chilled-salad"], [
        ("主な商品", "焼くだけ餃子、ポテトサラダ、きんぴら"), ("価格帯", "198〜398円"), ("温度帯", "チルド（10℃以下）・賞味3〜5日"),
        ("主な販路", "量販の惣菜売場に毎日納品"), ("売上と伸び", "64億円　年+2%")], "当社取引中・伸び小", False),
    ("調味料", ["sauce-gyoza", "sauce-tsuyu", "sauce-dressing"], [
        ("主な商品", "餃子のたれ、そばつゆ、胡麻ドレッシング"), ("価格帯", "198〜548円"), ("温度帯", "常温"),
        ("主な販路", "量販・EC（冷凍品と同梱）"), ("売上と伸び", "52億円　横ばい")], "物流の接点：小", False),
    ("業務用", ["bulk-gyoza", "bulk-soup"], [
        ("主な商品", "業務用冷凍ギョーザ（50個入）、スープの素"), ("価格帯", "ケース単位の取引"), ("温度帯", "冷凍中心"),
        ("主な販路", "外食チェーン・弁当事業者"), ("売上と伸び", "47億円　年+15%")], "物流の接点：中・新規", True),
]
cw = 2.4
for i, (name, pics, specs, verdict, grow) in enumerate(cats):
    x = 0.36 + i * (cw + 0.17)
    text(s, x, 1.1, cw, 0.3, [(name, {"size": 11, "bold": True})], anchor=MSO_ANCHOR.BOTTOM)
    line(s, x, 1.46, x + cw, 1.46, INK, 1.0)
    box(s, x, 1.56, cw, 1.6, PANEL)
    picture_row(s, pics, x + 0.1, 3.08, cw - 0.2, 1.42)
    yy = 3.28
    for k, (label, value) in enumerate(specs):
        rh = 0.62 if k == 0 else 0.47
        hot = label == "売上と伸び" and grow
        text(s, x, yy, cw, 0.2, [(label, {"size": 8, "color": G3})])
        text(s, x, yy + 0.19, cw, rh - 0.2, [(value, {"size": 9.5, "bold": hot, "color": BLUE if hot else INK})], line=1.0)
        line(s, x, yy + rh - 0.03, x + cw, yy + rh - 0.03, G5, 0.5)
        yy += rh
    text(s, x, 6.28, cw, 0.46, [(verdict, {"size": 10.5, "bold": True, "color": BLUE if grow else G2})], anchor=MSO_ANCHOR.MIDDLE)
    line(s, x, 6.74, x + cw, 6.74, BLUE if grow else G4, 2.0 if grow else 0.75)


# ============================================================ (8) ブランド別売上推移
s = page("ブランド", "主力「羽根つき一番」は4年で約2倍。主要4ブランドがそろって伸びる",
         "決算説明資料・プレスリリースを想定。2026年度は会社予想")
head(s, 0.36, 1.1, 6.35, "主要4ブランドの売上推移", "単位：億円")
brands = [("羽根つき一番", (28, 32, 38, 46, 55), BLUE, 2.75), ("業務用ギョーザ", (15, 17, 20, 24, 29), G2, 1.75),
          ("香ばし炒飯", (18, 20, 23, 27, 31), G4, 1.75), ("讃岐風うどん", (10, 11, 13, 15, 17), G5, 1.75)]
d = CategoryChartData()
d.categories = YEARS
for name, vals, _, _ in brands:
    d.add_series(name, vals)
ch = s.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, Inches(0.3), Inches(1.6), Inches(5.3), Inches(4.9), d).chart
style_chart(ch)
for i, ser in enumerate(ch.plots[0].series):
    _, _, color, wt = brands[i]
    ser.smooth = False
    ser.format.line.color.rgb = color
    ser.format.line.width = Pt(wt)
    ser.marker.style = XL_MARKER_STYLE.CIRCLE
    ser.marker.size = 6
    ser.marker.format.fill.solid()
    ser.marker.format.fill.fore_color.rgb = color
    ser.marker.format.line.color.rgb = color
ch.value_axis.minimum_scale = 0
ch.value_axis.maximum_scale = 60
ch.value_axis.major_unit = 20
ch.value_axis.has_major_gridlines = True
ch.value_axis.major_gridlines.format.line.color.rgb = G6
ch.value_axis.format.line.fill.background()
set_font(ch.value_axis.tick_labels.font, 9, None, G3)
ch.category_axis.format.line.color.rgb = INK
set_font(ch.category_axis.tick_labels.font, 10, None, G1)
for i, (name, vals, color, _) in enumerate(brands):
    yy = {0: 2.02, 1: 3.98, 2: 3.62, 3: 4.76}[i]
    c2 = color if color not in (G4, G5) else G2
    text(s, 5.6, yy, 1.35, 0.3, [[(name + " ", {"size": 9, "bold": i == 0, "color": c2}), (str(vals[-1]), {"size": 11, "bold": True, "color": c2})]],
         anchor=MSO_ANCHOR.MIDDLE)

head(s, 7.05, 1.1, 3.42, "ブランド別の伸び")
rows = [("ブランド", "2026予", "年平均"), ("羽根つき一番", "55", "+18.4%"), ("業務用ギョーザ", "29", "+17.9%"),
        ("香ばし炒飯", "31", "+14.6%"), ("讃岐風うどん", "17", "+14.2%")]
grid_table(s, 7.05, 1.52, [1.57, 0.85, 1.0], rows, row_h=0.4, align=[L, R, R], hot={(1, 2), (2, 2)})
bullets(s, 7.05, 3.7, 3.42, 1.4, [(0, "上位2ブランドはどちらもギョーザ。家庭用と業務用の両方で伸びる"),
                                  (0, "4ブランドの合計は132億円。2022年度の約1.9倍")], size=9.5)
takeaway(s, 7.05, 5.3, 3.42, 1.5, "ギョーザの物量が増える。群馬で作り、関東・関西の量販と外食へ運ぶ流れが太くなる")


# ============================================================== (9) ブランド詳細
s = page("ブランド", "「羽根つき一番」：EC・返礼品の比率が上がり、冷凍の小口配送が増えていく", "自社サイト・商品カタログ・プレスリリースを想定")
head(s, 0.36, 1.1, 4.1, "ブランド概要")
rows = [("項目", "内容"), ("売上", "55億円（2026/3期予）年+18%"), ("商品数", "6商品（12・18・24個入り、大袋ほか）"),
        ("主な顧客", "共働き世帯を中心とする家庭用"), ("主な販路", "量販・公式EC・ふるさと納税"), ("価格帯", "298〜498円（店頭想定）"),
        ("温度帯", "冷凍（−18℃以下）"), ("生産", "群馬第1・第2工場")]
grid_table(s, 0.36, 1.52, [1.05, 3.05], rows, row_h=0.46, size=9.5, hot={(1, 1)})
head(s, 4.7, 1.1, 2.5, "商品")
box(s, 4.7, 1.6, 2.5, 3.7, PANEL)
picture_row(s, ["frozen-gyoza"], 4.85, 3.9, 2.2, 2.1)
text(s, 4.7, 4.0, 2.5, 0.3, [("家庭用 12個入り", {"size": 8.5, "color": G2})], align=C)
picture_row(s, ["bulk-gyoza"], 5.25, 5.08, 1.4, 0.95)
text(s, 4.7, 5.08, 2.5, 0.22, [("業務用（50個入）", {"size": 8, "color": G3})], align=C)

head(s, 7.45, 1.1, 3.02, "物流との接点")
pts = [("生産が群馬に集約", "群馬から関東・関西への冷凍の幹線が太くなる", False),
       ("個人宅への直送", "公式EC・返礼品で、冷凍の小口配送が新たに発生", True),
       ("12月に需要の山", "返礼品は年末に集中しやすく、出荷の波が大きい", False)]
for i, (t, b, hot) in enumerate(pts):
    yy = 1.62 + i * 1.22
    text(s, 7.45, yy, 0.3, 0.32, [(str(i + 1), {"size": 12, "bold": True, "color": BLUE})])
    text(s, 7.78, yy, 2.69, 0.32, [(t, {"size": 10.5, "bold": True, "color": BLUE if hot else INK})])
    text(s, 7.78, yy + 0.36, 2.69, 0.66, [(b, {"size": 9, "color": G1})], line=1.15)
    line(s, 7.45, yy + 1.08, 10.47, yy + 1.08, G5, 0.5)
takeaway(s, 0.36, 5.55, 10.11, 1.25, "主力ブランドの伸びは、量販への定期便より「個人宅への冷凍小口」と「年末の波」に表れる。今の委託先が得意とする領域の外側")


# =============================================================== (10) 変化のシグナル
s = page("変化", "生産増強・新しい販路・組織の新設が2年で重なった。物流の見直し時期に入っている", "プレスリリース・求人情報を想定")
head(s, 0.36, 1.1, 10.11, "直近2年の主な出来事")
events = [
    ("2024/04", "中期経営計画を公表", "冷凍の売上比率を2028年度に50%へ", "戦略", False),
    ("2025/03", "群馬第2工場を着工", "冷凍ギョーザ・冷凍麺の専用ライン", "投資", False),
    ("2025/10", "公式EC・ふるさと納税に参入", "冷凍ギョーザを個人宅へ直送", "販路", False),
    ("2026/04", "群馬第2工場が稼働", "冷凍の生産能力が約1.5倍に", "投資", False),
    ("2026/04", "物流部を新設", "物流企画職の求人で「委託先の再編」に言及", "組織", True),
    ("2026/06", "外食チェーン3社へ供給開始", "関西・中部の店舗へ業務用を納品", "販路", False),
]
colw = 10.11 / 6
axis = 2.05
line(s, 0.36, axis, 10.47, axis, INK, 1.0)
for i, (dte, t, b, tag, hot) in enumerate(events):
    x = 0.36 + i * colw
    color = BLUE if hot else INK
    box(s, x + 0.02, axis - 0.07, 0.14, 0.14, color, shape=MSO_SHAPE.OVAL)
    text(s, x, 1.55, colw - 0.1, 0.3, [(dte, {"size": 10, "bold": True, "color": color})], anchor=MSO_ANCHOR.BOTTOM)
    text(s, x, 2.25, colw - 0.15, 0.24, [(tag, {"size": 8.5, "color": G3})])
    text(s, x, 2.5, colw - 0.15, 0.7, [(t, {"size": 11, "bold": True, "color": color})], line=1.1)
    text(s, x, 3.25, colw - 0.15, 0.8, [(b, {"size": 9, "color": G1})], line=1.2)
    if hot:
        box(s, x - 0.06, 1.5, colw - 0.02, 2.65, None, BLUE, 1.5)

head(s, 0.36, 4.45, 10.11, "物流から見た意味")
meaning = [("生産・投資", "群馬の冷凍の生産が増え、関東・関西への幹線の物量が増える"),
           ("販路", "個人宅と外食店舗という、新しい届け先が生まれた"),
           ("組織", "物流の意思決定者ができ、委託先の再編を検討している")]
for i, (k, v) in enumerate(meaning):
    x = 0.36 + i * 3.42
    text(s, x, 4.95, 3.2, 0.26, [(k, {"size": 9, "bold": True, "color": G2})])
    text(s, x, 5.22, 3.2, 0.6, [(v, {"size": 10, "bold": True})], line=1.2)
takeaway(s, 0.36, 6.05, 10.11, 0.78, "生産能力1.5倍・販路の拡大・物流部の新設。委託体制を見直す条件がそろった")


# ================================================================= (11) 取引マップ
s = page("取引", "当社の取引はチルド・関西の1区画のみ。伸びる冷凍側に、委託先が固まっていない区画が3つ",
         "プレスリリース・求人情報と、依頼元の取引実績を突合して作成")
steps = ["保管・横持ち", "量販・CVS配送", "EC・個人宅配送", "外食店舗配送"]
rows4 = ["冷凍食品", "チルド惣菜", "調味料", "業務用"]
grid = [["O", "O", "N", "X"], ["O", "T", "X", "X"], ["O", "O", "N", "X"], ["O", "X", "X", "N"]]
notes = [["大手3PL", "大手3PL", "2025/10〜", ""], ["自社倉庫", "関西のみ当社", "", ""],
         ["他社", "大手3PL", "冷凍と同梱", ""], ["他社", "", "", "2026/06〜"]]
STATE = {"T": (BLUE, WHITE, "当社取引中"), "O": (PANEL, G1, "他社委託"), "N": (WHITE, BLUE, "新規・未取引"), "X": (WHITE, G4, "対象外")}
GX, CWD, CG, GY, RH, RG = 1.95, 1.62, 0.06, 1.72, 0.97, 0.07
for j, st in enumerate(steps):
    x = GX + j * (CWD + CG)
    text(s, x, 1.15, CWD, 0.4, [(st, {"size": 9.5, "bold": True})], align=C, anchor=MSO_ANCHOR.BOTTOM)
    line(s, x, 1.6, x + CWD, 1.6, INK, 1.0)
for i, name in enumerate(rows4):
    yy = GY + i * (RH + RG)
    text(s, 0.36, yy, 1.5, RH, [(name, {"size": 10.5, "bold": True})], anchor=MSO_ANCHOR.MIDDLE)
    for j in range(4):
        k = grid[i][j]
        fill, fg, label = STATE[k]
        xx = GX + j * (CWD + CG)
        box(s, xx, yy, CWD, RH, fill, BLUE if k == "N" else (G6 if k == "X" else None), 1.75 if k == "N" else 0.5, dash=k == "N")
        paras = [(label, {"size": 10, "bold": k != "X", "color": fg})]
        if notes[i][j]:
            paras.append((notes[i][j], {"size": 8.5, "color": fg, "space": 2}))
        text(s, xx, yy, CWD, RH, paras, align=C, anchor=MSO_ANCHOR.MIDDLE)
for k, key in enumerate(("T", "O", "N", "X")):
    fill, fg, label = STATE[key]
    lx = 1.95 + k * 1.5
    box(s, lx, 6.03, 0.24, 0.17, fill, BLUE if key == "N" else G5, 1.25, dash=key == "N")
    text(s, lx + 0.3, 5.98, 1.15, 0.27, [(label, {"size": 8.5, "color": G2})], anchor=MSO_ANCHOR.MIDDLE)

px = 8.85
head(s, px, 1.1, 1.62, "区画の数")
counts = [("当社取引中", "1", BLUE), ("新規・未取引", "3", BLUE), ("他社委託", "6", INK)]
for i, (lab, num, color) in enumerate(counts):
    yy = 1.62 + i * 1.0
    text(s, px, yy, 1.62, 0.24, [(lab, {"size": 9, "color": G2})])
    text(s, px, yy + 0.24, 1.62, 0.6, [[(num, {"size": 28, "bold": True, "color": color}), (" 区画", {"size": 10, "bold": True})]],
         anchor=MSO_ANCHOR.MIDDLE)
    line(s, px, yy + 0.9, px + 1.62, yy + 0.9, G5, 0.5)
text(s, px, 4.7, 1.62, 1.1, [("未取引の3区画は、どれも2025年以降に生まれた物流", {"size": 9.5, "bold": True})], line=1.2)
takeaway(s, 0.36, 6.32, 10.11, 0.58, "既存の委託先と競わずに入れる区画がある。新しく生まれた物流から取引を広げる")


# ================================================================= (12) 提案のヒント
s = page("提案", "委託先の見直し前の今が好機。新しく生まれた3つの物流から入る",
         "(1)〜(11)の分析にもとづく。初回の訪問で確認が必要な事項を含む")
head(s, 0.36, 1.1, 4.3, "調べてわかったこと")
head(s, 5.15, 1.1, 5.32, "そこから言えること（提案のヒント）")
hints = [
    ("2026/04に物流部を新設。物流企画職の求人に「委託先の再編」と記載。冷凍の保管・配送は大手3PLに集中",
     "委託先を見直す前の今が、比較の候補に入る時期。冷凍を2社体制にした場合のコストと災害時の備えを示せる"),
    ("2026/06から関西・中部の外食チェーン3社へ業務用を供給。当社は関西で量販向けチルド便を毎日運行",
     "既存のチルド便に冷凍を混載し、店舗へ一括で納品できる。冷凍専用便の大手3PLにない切り口になる"),
    ("2025/10に公式EC・ふるさと納税へ参入。返礼品は冷凍ギョーザ。発送体制は未公表",
     "12月に集中する冷凍の小口出荷を、期間を区切って請け負える。小さく実績を作り、1の比較につなげる"),
]
for i, (fact, hint) in enumerate(hints):
    yy = 1.62 + i * 1.35
    text(s, 0.36, yy, 0.35, 0.5, [(str(i + 1), {"size": 20, "bold": True, "color": BLUE})])
    text(s, 0.78, yy + 0.04, 3.88, 1.1, [(fact, {"size": 10, "color": G1})], line=1.25)
    text(s, 4.7, yy + 0.25, 0.4, 0.4, [("→", {"size": 16, "bold": True, "color": G3})], align=C)
    text(s, 5.15, yy + 0.04, 5.32, 1.1, [(hint, {"size": 11, "bold": True})], line=1.3)
    line(s, 0.36, yy + 1.22, 10.47, yy + 1.22, G5, 0.5)
head(s, 0.36, 5.68, 10.11, "初回の訪問で確認したいこと")
text(s, 0.36, 6.12, 10.11, 0.7, [("冷凍の主委託先との契約期間／物流部の検討の時期と範囲／外食店舗の納品条件（時間帯・温度帯）／年末の出荷量の見込み",
                                  {"size": 10})], line=1.3)


# ------------------------------------------------------------------ 表紙（先頭に移す）
cover = prs.slides.add_slide(next(l for l in prs.slide_layouts if l.name == "表紙"))
for ph in cover.placeholders:
    idx = ph.placeholder_format.idx
    if idx == 12:
        ph.text_frame.text = "サンプル物流株式会社　御中"
    elif idx == 11:
        ph.text_frame.text = f"{COMPANY}　企業クローズアップ"
    elif idx == 13:
        ph.text_frame.text = DATE
    for p in ph.text_frame.paragraphs:
        for r in p.runs:
            set_font(r.font)
ids = prs.slides._sldIdLst
ids.insert(0, ids[-1])

prs.save(OUT)
print("saved", OUT, len(prs.slides), "slides")
