"""
既存顧客企業クローズアップ　サンプルレポート（表紙＋11ページ）を生成する。

土台は Neunon Consulting の公式スライドテンプレート（ver3。サンプルの頁を除いたもの）の
マスター（フッター・ロゴ・表紙）。本文は LP で見せることを前提に、コンサルティングの
報告書らしい見せ方（上部の章トラッカー、結論を書いたタイトル、示唆の箱、紺の階調のグラフ）で組む。

実際の納品物（ボリューム大・小）の構成にならい、プランごとのページを揃えた:
  Light     … (1) サマリー
  Standard  … (4) 事業別の売上構成 (6) 顧客・販売チャネル (7) 商品ラインナップ (10) 変化のシグナル (11) 取引マップ
  Advanced  … 上記に加えて (2) 会社概要・グループ (3) 業績推移 (5) 主要組織図 (8) ブランド別売上推移 (9) ブランド詳細
提案仮説のページは作らない（LP の仮説の例はユーザーが書くため）。

設定:
  分析対象   サンプル食品株式会社 … 関東の中堅食品メーカー（説明用のサンプル）
  依頼元     サンプル物流株式会社 … 低温物流（冷凍・冷蔵の保管と配送）
数値・出来事・組織はすべて説明用に作ったもので、実在企業の情報ではない。

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

INK = RGBColor(0x1A, 0x1D, 0x21)
G2 = RGBColor(0x44, 0x49, 0x50)
G3 = RGBColor(0x6B, 0x70, 0x78)
G4 = RGBColor(0x9A, 0xA0, 0xA6)
G5 = RGBColor(0xC9, 0xCE, 0xD4)
G6 = RGBColor(0xE3, 0xE6, 0xEA)
PANEL = RGBColor(0xF3, 0xF5, 0xF7)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
N9 = RGBColor(0x0B, 0x35, 0x58)
N7 = RGBColor(0x12, 0x5B, 0x84)
N5 = RGBColor(0x4F, 0x88, 0xA6)
N3 = RGBColor(0xA9, 0xC8, 0xDB)
N1 = RGBColor(0xDB, 0xE8, 0xF0)
WASH = RGBColor(0xED, 0xF4, 0xF8)
ACC = RGBColor(0xD9, 0x43, 0x3A)
ACCW = RGBColor(0xFC, 0xEC, 0xEA)

SECTIONS = ["サマリー", "会社概要", "業績", "組織", "顧客・販路", "商品", "ブランド", "変化", "取引"]
SAMPLE = "説明用に作成したサンプル（実在企業の情報ではない）"

prs = Presentation(TEMPLATE)
LAYOUT = next(l for l in prs.slide_layouts if l.name == "タイトル")


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
    ppr.set("marL", str(Inches(0.16 if level == 0 else 0.34)))
    ppr.set("indent", str(-Inches(0.16)))
    for tag in ("a:buFont", "a:buChar", "a:buNone", "a:buClr"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    clr = etree.SubElement(ppr, qn("a:buClr"))
    etree.SubElement(clr, qn("a:srgbClr")).set("val", "125B84")
    f = etree.SubElement(ppr, qn("a:buFont"))
    c = etree.SubElement(ppr, qn("a:buChar"))
    f.set("typeface", "Arial")
    c.set("char", "■" if level == 0 else "–")


def no_bullet(p):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", "0")
    ppr.set("indent", "0")
    for tag in ("a:buFont", "a:buChar", "a:buAutoNum"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    if ppr.find(qn("a:buNone")) is None:
        etree.SubElement(ppr, qn("a:buNone"))


def text(slide, x, y, w, h, paras, size=10, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line=1.05, margin=0.03):
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


def bullets(slide, x, y, w, h, items, size=10, line=1.05):
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
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = 0.08
    s.text_frame.text = ""
    return s


def line(slide, x1, y1, x2, y2, color=G5, weight=1.0, dash=False):
    ln = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def head(slide, x, y, w, t, note=None):
    """節見出し：紺の短い縦棒＋太字＋淡い青の罫線"""
    box(slide, x, y + 0.05, 0.06, 0.22, N7)
    text(slide, x + 0.13, y, w - 0.13, 0.32, [(t, {"size": 11, "bold": True, "color": N9})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    if note:
        text(slide, x, y, w, 0.32, [(note, {"size": 8, "color": G3})], align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    line(slide, x, y + 0.36, x + w, y + 0.36, N3, 1.0)


def takeaway(slide, x, y, w, h, body, label="示唆"):
    """紺の箱に、そのページで言いたいことを1〜2文で"""
    box(slide, x, y, w, h, N9)
    box(slide, x + 0.16, y + 0.16, 0.5, 0.24, ACC)
    text(slide, x + 0.16, y + 0.16, 0.5, 0.24, [(label, {"size": 8.5, "bold": True, "color": WHITE})],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(slide, x + 0.8, y + 0.08, w - 0.96, h - 0.16, [(body, {"size": 10.5, "bold": True, "color": WHITE})],
         anchor=MSO_ANCHOR.MIDDLE, line=1.15, margin=0)


def kpi(slide, x, y, w, h, label, value, unit, sub, accent=False):
    box(slide, x, y, w, h, WHITE, G6, 0.75)
    box(slide, x, y, 0.06, h, ACC if accent else N7)
    text(slide, x + 0.18, y + 0.07, w - 0.25, 0.22, [(label, {"size": 8.5, "bold": True, "color": G3})], margin=0)
    text(slide, x + 0.18, y + 0.29, w * 0.55, 0.5, [[(value, {"size": 22, "bold": True, "color": ACC if accent else N9}),
                                                   (" " + unit, {"size": 10, "bold": True, "color": N9})]],
         anchor=MSO_ANCHOR.MIDDLE, margin=0)
    if sub:
        text(slide, x + w * 0.55, y + 0.29, w * 0.45 - 0.12, 0.5, [(sub, {"size": 8, "color": G3})],
             align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE, margin=0)


def table(slide, x, y, widths, rows, row_h=0.32, size=9, align=None, hot=None, head_fill=N9, zebra=True, first_bold=True):
    """rows[0] は見出し。hot: {(i, j): color}"""
    hot = hot or {}
    tbl = slide.shapes.add_table(len(rows), len(widths), Inches(x), Inches(y), Inches(sum(widths)),
                                 Inches(row_h * len(rows))).table
    for j, w in enumerate(widths):
        tbl.columns[j].width = Inches(w)
    for i, row in enumerate(rows):
        tbl.rows[i].height = Inches(row_h)
        for j, val in enumerate(row):
            c = tbl.cell(i, j)
            c.margin_left = c.margin_right = Inches(0.07)
            c.margin_top = c.margin_bottom = Inches(0.02)
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.fill.solid()
            c.fill.fore_color.rgb = head_fill if i == 0 else (PANEL if zebra and i % 2 == 0 else WHITE)
            tf = c.text_frame
            tf.word_wrap = True
            tf.text = val
            p = tf.paragraphs[0]
            p.alignment = (align[j] if align else PP_ALIGN.LEFT)
            color = WHITE if i == 0 else hot.get((i, j), INK)
            bold = i == 0 or (first_bold and j == 0) or (i, j) in hot
            style_run(p.runs[0], size if i else size - 0.5, bold, color)
    return tbl


def style_chart(ch, size=9):
    ch.has_title = False
    ch.has_legend = False
    ch.font.size = Pt(size)
    set_font(ch.font, size, None, G2)


def legend(slide, x, y, entries, size=8.5):
    lx = x
    for color, label, w in entries:
        box(slide, lx, y + 0.06, 0.14, 0.14, color)
        text(slide, lx + 0.19, y, w - 0.19, 0.26, [(label, {"size": size, "color": G2})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
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
    """本文ページの枠：章トラッカー・結論のタイトル・出所・日付・頁番号"""
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
    p.alignment = PP_ALIGN.LEFT
    p.line_spacing = 1.0
    style_run(p.runs[0], 17, True, INK)

    text(s, 0.38, 0.06, 4.2, 0.22, [[(f"{COMPANY}　企業クローズアップ", {"size": 8, "bold": True, "color": N7})]],
         anchor=MSO_ANCHOR.MIDDLE, margin=0)
    cw, cg = 0.6, 0.03
    x0 = 10.47 - len(SECTIONS) * (cw + cg) + cg
    for i, name in enumerate(SECTIONS):
        on = name == section
        cx = x0 + i * (cw + cg)
        box(s, cx, 0.07, cw, 0.2, N9 if on else PANEL)
        text(s, cx, 0.07, cw, 0.2, [(name, {"size": 7, "bold": on, "color": WHITE if on else G4})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)

    text(s, 1.7, 7.27, 1.0, 0.27, [(DATE, {"size": 9})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 9.6, 7.29, 0.85, 0.24, [(f"- {n} -", {"size": 9})], align=PP_ALIGN.RIGHT, margin=0)
    text(s, 0.36, 6.98, 9.8, 0.26, [[("出所：", {"size": 7.5, "color": G3}), (source + "。" + SAMPLE, {"size": 7.5, "color": G3})]], margin=0)
    return s


# ======================================================================= (1) サマリー
s = page("サマリー", "冷凍と業務用が成長をけん引。物流の接点は冷凍・EC・外食の3方面で広がる",
         "決算公告・会社案内・プレスリリース・求人情報を想定")

box(s, 0.36, 1.15, 3.0, 4.25, PANEL)
text(s, 0.54, 1.27, 2.7, 0.3, [("企業プロフィール", {"size": 11, "bold": True, "color": N9})], margin=0)
profile = [("本社", "埼玉県さいたま市"), ("設立", "1968年"), ("従業員", "640名（単体）"), ("売上高", "276億円（2026/3期予）"),
           ("主な事業", "冷凍食品・チルド惣菜・調味料・業務用"), ("生産拠点", "埼玉工場、群馬第1・第2工場")]
for i, (k, v) in enumerate(profile):
    yy = 1.72 + i * 0.6
    text(s, 0.54, yy, 2.7, 0.22, [(k, {"size": 8, "bold": True, "color": G3})], margin=0)
    text(s, 0.54, yy + 0.2, 2.7, 0.34, [(v, {"size": 10, "bold": True})], margin=0)
    if i < len(profile) - 1:
        line(s, 0.54, yy + 0.56, 3.18, yy + 0.56, G5, 0.5)

finds = [
    ("01", "業績", [("売上高 ", {"size": 10, "bold": True, "color": N9}), ("276", {"size": 26, "bold": True, "color": N9}), (" 億円", {"size": 11, "bold": True, "color": N9})],
     "3年で売上は約3割増。増収64億円の7割が冷凍食品", False),
    ("02", "顧客・販路", [("量販の比率 63% → ", {"size": 10, "bold": True, "color": N9}), ("55", {"size": 26, "bold": True, "color": N9}), (" %", {"size": 11, "bold": True, "color": N9})],
     "外食・中食とEC・ふるさと納税が伸び、届け先が分散している", False),
    ("03", "商品", [("主力ブランドの売上 ", {"size": 10, "bold": True, "color": N9}), ("約2", {"size": 26, "bold": True, "color": N9}), (" 倍", {"size": 11, "bold": True, "color": N9})],
     "冷凍ギョーザ「羽根つき一番」は4年で55億円に", False),
    ("04", "変化", [("2026年4月 ", {"size": 10, "bold": True, "color": ACC}), ("物流部を新設", {"size": 20, "bold": True, "color": ACC})],
     "物流企画職の求人に「委託先の再編」と記載", True),
]
for i, (no, cat, stat, body, hot) in enumerate(finds):
    x = 3.56 + (i % 2) * 3.53
    y = 1.15 + (i // 2) * 2.17
    box(s, x, y, 3.38, 2.05, WHITE, ACC if hot else G5, 1.25 if hot else 0.75)
    text(s, x + 0.2, y + 0.14, 3.0, 0.26, [[(no + "  ", {"size": 9, "bold": True, "color": ACC if hot else N7}),
                                           (cat, {"size": 9.5, "bold": True, "color": ACC if hot else N7})]], margin=0)
    text(s, x + 0.2, y + 0.48, 3.0, 0.62, [stat], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    line(s, x + 0.2, y + 1.2, x + 3.18, y + 1.2, G6, 0.75)
    text(s, x + 0.2, y + 1.3, 3.0, 0.66, [(body, {"size": 9.5})], line=1.15, margin=0)

box(s, 0.36, 5.55, 10.11, 1.3, N9)
text(s, 0.56, 5.6, 2.4, 1.2, [("当社（低温物流）\nとの接点", {"size": 12, "bold": True, "color": WHITE})], anchor=MSO_ANCHOR.MIDDLE, line=1.15, margin=0)
touch = [("冷凍の幹線輸送", "群馬の2工場から関東・関西へ"), ("冷凍の小口配送", "公式EC・ふるさと納税の返礼品"), ("外食店舗への配送", "関西・中部の外食チェーン3社")]
for i, (t, b) in enumerate(touch):
    x = 3.05 + i * 2.5
    box(s, x, 5.73, 2.38, 0.94, N7)
    text(s, x + 0.14, 5.78, 2.15, 0.84, [(t, {"size": 11, "bold": True, "color": WHITE}), (b, {"size": 8.5, "color": N1, "space": 3})],
         anchor=MSO_ANCHOR.MIDDLE, margin=0)


# ================================================================ (2) 会社概要・グループ
s = page("会社概要", "群馬に冷凍の生産を集約。製造子会社2社と販売子会社1社のグループで事業を運営",
         "会社案内・登記情報・プレスリリースを想定")
head(s, 0.36, 1.15, 4.3, "基本情報")
basic = [("項目", "内容"), ("商号", COMPANY), ("設立", "1968年4月"), ("本社", "埼玉県さいたま市"), ("資本金", "4.8億円"),
         ("従業員数", "640名（単体）／1,120名（連結）"), ("売上高", "276億円（2026/3期予・単体）"),
         ("事業内容", "冷凍食品・チルド惣菜・調味料の製造販売、業務用食品の販売"), ("上場", "非上場")]
table(s, 0.36, 1.62, [1.15, 3.15], basic, row_h=0.42, size=9)
takeaway(s, 0.36, 5.68, 4.3, 1.12, "保管・配送はすべて外部に委託しており、自社の物流拠点を持たない")

head(s, 4.95, 1.15, 5.52, "グループ構成")
box(s, 6.27, 1.65, 2.9, 0.62, N9)
text(s, 6.27, 1.65, 2.9, 0.62, [(COMPANY, {"size": 10.5, "bold": True, "color": WHITE}),
                                ("本社・商品開発・量販営業", {"size": 8, "color": N1, "space": 1})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
line(s, 7.72, 2.27, 7.72, 2.5, N5, 1.25)
line(s, 5.87, 2.5, 9.57, 2.5, N5, 1.25)
children = [("群馬サンプル食品（株）", "冷凍食品の製造", "群馬第1・第2工場"), ("サンプルデリカ（株）", "チルド惣菜の製造", "埼玉工場"),
            ("サンプル食品販売（株）", "業務用の営業・販売", "関東・関西")]
for i, (name, role, site) in enumerate(children):
    x = 5.0 + i * 1.86
    line(s, x + 0.87, 2.5, x + 0.87, 2.68, N5, 1.25)
    box(s, x, 2.68, 1.74, 0.42, N7)
    text(s, x, 2.68, 1.74, 0.42, [(name, {"size": 8.5, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    box(s, x, 3.1, 1.74, 0.82, WASH)
    text(s, x + 0.08, 3.1, 1.58, 0.82, [(role, {"size": 9, "bold": True}), (site, {"size": 8, "color": G3, "space": 2})],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
head(s, 4.95, 4.25, 5.52, "主な拠点")
sites = [("本社", "埼玉県さいたま市", False), ("埼玉工場", "チルド惣菜・調味料", False), ("群馬第1工場", "冷凍食品", False),
         ("群馬第2工場", "冷凍ギョーザ・冷凍麺（2026/04稼働）", True), ("関西営業所", "大阪府大阪市", False)]
for i, (k, v, hot) in enumerate(sites):
    yy = 4.74 + i * 0.4
    box(s, 4.98, yy + 0.1, 0.13, 0.13, ACC if hot else N7, shape=MSO_SHAPE.OVAL)
    text(s, 5.22, yy, 1.4, 0.34, [(k, {"size": 9.5, "bold": True, "color": ACC if hot else INK})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 6.62, yy, 3.85, 0.34, [(v, {"size": 9.5, "color": ACC if hot else INK, "bold": hot})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    if i < len(sites) - 1:
        line(s, 5.22, yy + 0.37, 10.47, yy + 0.37, G6, 0.5)


# =================================================================== (3) 業績推移
s = page("業績", "5期連続の増収。営業利益率は4.3%から5.3%へ改善した",
         "決算公告を想定。2026年度は会社予想")
head(s, 0.36, 1.15, 6.4, "売上高と営業利益率の推移", "単位：億円")
years = ["2022", "2023", "2024", "2025", "2026予"]
d = CategoryChartData()
d.categories = years
d.add_series("売上高", (198, 212, 228, 251, 276))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(0.3), Inches(1.6), Inches(6.5), Inches(3.0), d).chart
style_chart(ch)
ch.plots[0].gap_width = 60
ser = ch.plots[0].series[0]
ser.format.fill.solid()
ser.format.fill.fore_color.rgb = N7
ser.points[4].format.fill.solid()
ser.points[4].format.fill.fore_color.rgb = N3
ser.data_labels.show_value = True
ser.data_labels.position = XL_LABEL_POSITION.OUTSIDE_END
set_font(ser.data_labels.font, 11, True, N9)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.minimum_scale = 0
ch.value_axis.maximum_scale = 320
ch.category_axis.format.line.color.rgb = G4
set_font(ch.category_axis.tick_labels.font, 10, True, G2)

text(s, 0.36, 4.68, 2.0, 0.26, [("営業利益率", {"size": 9, "bold": True, "color": G3})], margin=0)
d = CategoryChartData()
d.categories = years
d.add_series("営業利益率", (4.3, 4.6, 4.8, 5.0, 5.3))
ch = s.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, Inches(0.3), Inches(4.85), Inches(6.5), Inches(1.45), d).chart
style_chart(ch)
ser = ch.plots[0].series[0]
ser.smooth = False
ser.format.line.color.rgb = ACC
ser.format.line.width = Pt(2.25)
ser.marker.style = XL_MARKER_STYLE.CIRCLE
ser.marker.size = 7
ser.marker.format.fill.solid()
ser.marker.format.fill.fore_color.rgb = WHITE
ser.marker.format.line.color.rgb = ACC
ser.data_labels.show_value = True
ser.data_labels.number_format = '0.0"%"'
ser.data_labels.number_format_is_linked = False
ser.data_labels.position = XL_LABEL_POSITION.ABOVE
set_font(ser.data_labels.font, 9.5, True, ACC)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.minimum_scale = 3.6
ch.value_axis.maximum_scale = 5.8
ch.category_axis.visible = False

kpis = [("売上高（2026/3期予）", "276", "億円", "前期比 +10%"), ("営業利益（同）", "14.6", "億円", "営業利益率 5.3%"),
        ("年平均の伸び", "+8.7", "%", "2022 → 2026予"), ("冷凍食品の売上比率", "41", "%", "2022年度は30%")]
for i, (a, b, c, e) in enumerate(kpis):
    kpi(s, 7.05, 1.2 + i * 0.95, 3.42, 0.86, a, b, c, e, accent=i == 3)
takeaway(s, 7.05, 5.08, 3.42, 1.72, "増収の主因は冷凍食品。群馬第2工場の稼働で、2027年度以降も冷凍の物量は増え続ける見込み")


# ============================================================ (4) 事業別の売上構成
s = page("業績", "増収64億円の7割が冷凍食品。当社が取引するチルド惣菜は横ばい",
         "決算公告・会社案内を想定")
head(s, 0.36, 1.15, 5.55, "事業別の売上推移", "単位：億円")
legend(s, 0.4, 1.6, [(N9, "冷凍食品", 1.1), (N7, "業務用", 0.95), (N3, "チルド惣菜", 1.2), (G5, "調味料", 0.9)])
d = CategoryChartData()
d.categories = ["2023", "2024", "2025", "2026予"]
seg = [("調味料", (52, 53, 52, 52), G5), ("チルド惣菜", (61, 62, 63, 64), N3), ("業務用", (31, 34, 40, 47), N7),
       ("冷凍食品", (68, 79, 96, 113), N9)]
for name, vals, _ in seg:
    d.add_series(name, vals)
d.add_series("合計", (0, 0, 0, 0))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(0.3), Inches(1.9), Inches(5.65), Inches(4.0), d).chart
style_chart(ch)
plot = ch.plots[0]
plot.gap_width = 65
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
            style_run(dl.text_frame.paragraphs[0].runs[0], 11, True, N9)
        continue
    fill = seg[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = WHITE
    ser.format.line.width = Pt(1)
    ser.data_labels.show_value = True
    ser.data_labels.position = XL_LABEL_POSITION.CENTER
    set_font(ser.data_labels.font, 9, True, WHITE if fill in (N9, N7) else INK)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.maximum_scale = 300
ch.value_axis.minimum_scale = 0
ch.category_axis.format.line.color.rgb = G4
set_font(ch.category_axis.tick_labels.font, 10, True, G2)

head(s, 6.2, 1.15, 4.27, "事業別の伸び")
rows = [("事業", "2023", "2026予", "年平均", "構成比"), ("冷凍食品", "68", "113", "+18.4%", "41%"), ("業務用", "31", "47", "+14.9%", "17%"),
        ("チルド惣菜", "61", "64", "+1.6%", "23%"), ("調味料", "52", "52", "±0.0%", "19%"), ("合計", "212", "276", "+9.2%", "100%")]
R = PP_ALIGN.RIGHT
table(s, 6.2, 1.62, [1.17, 0.7, 0.75, 0.85, 0.8], rows, row_h=0.36, size=9.5, align=[PP_ALIGN.LEFT, R, R, R, R],
      hot={(1, 3): ACC, (2, 3): ACC, (3, 0): N7})
text(s, 6.2, 3.85, 4.27, 0.26, [("※ チルド惣菜は当社の取引先事業", {"size": 8, "color": G3})], margin=0)
bullets(s, 6.2, 4.15, 4.27, 1.3, [(0, "冷凍は年18%、業務用は年15%で伸びる"), (0, "中計で冷凍比率を2028年度に50%へ"),
                                  (0, "チルド惣菜は年2%弱。今の取引の延長では取引額は増えにくい", ACC, True)], size=9.5)
takeaway(s, 6.2, 5.58, 4.27, 1.22, "伸びているのは当社の取引の外側。冷凍と業務用の物流に入れるかが、取引拡大の分かれ目")


# ================================================================== (5) 主要組織図
s = page("組織", "2026年4月に物流部を新設。物流の意思決定が管理本部に集約された",
         "会社案内・人事異動の発表・求人情報を想定")
box(s, 0.36, 1.13, 0.34, 0.2, WHITE, ACC, 1.5)
text(s, 0.76, 1.08, 3.5, 0.3, [("提案の起点・実務窓口", {"size": 8.5, "bold": True, "color": ACC})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
box(s, 2.55, 1.13, 0.34, 0.2, WHITE, N7, 1.25)
text(s, 2.95, 1.08, 3.5, 0.3, [("関係する検討先", {"size": 8.5, "bold": True, "color": N7})], anchor=MSO_ANCHOR.MIDDLE, margin=0)

box(s, 4.67, 1.45, 1.5, 0.4, G6)
text(s, 4.67, 1.45, 1.5, 0.4, [("取締役会", {"size": 9.5, "bold": True})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
line(s, 5.42, 1.85, 5.42, 2.02, G4, 1.25)
box(s, 4.42, 2.02, 2.0, 0.42, N9)
text(s, 4.42, 2.02, 2.0, 0.42, [("代表取締役社長", {"size": 10, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
line(s, 5.42, 2.44, 5.42, 2.66, G4, 1.25)
cols = [
    ("営業本部", [("量販営業部", None), ("業務用営業部", "rel"), ("EC推進室（2025/10新設）", "rel")]),
    ("商品開発本部", [("冷凍開発部", None), ("チルド・調味料開発部", None)]),
    ("生産本部", [("埼玉工場", None), ("群馬工場", None), ("生産管理部", "rel"), ("品質保証部", None)]),
    ("管理本部", [("経営企画部", "rel"), ("物流部（2026/04新設）", "key"), ("購買部", None), ("総務人事部", None)]),
]
cw, cg = 2.42, 0.14
line(s, 0.36 + cw / 2, 2.66, 0.36 + 3 * (cw + cg) + cw / 2, 2.66, G4, 1.25)
for i, (bu, depts) in enumerate(cols):
    x = 0.36 + i * (cw + cg)
    line(s, x + cw / 2, 2.66, x + cw / 2, 2.84, G4, 1.25)
    box(s, x, 2.84, cw, 0.42, N7)
    text(s, x, 2.84, cw, 0.42, [(bu, {"size": 10, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    last = 3.42 + (len(depts) - 1) * 0.56 + 0.21
    line(s, x + 0.16, 3.26, x + 0.16, last, G5, 1.0)
    for k, (dname, mark) in enumerate(depts):
        yy = 3.42 + k * 0.56
        line(s, x + 0.16, yy + 0.21, x + 0.34, yy + 0.21, G5, 1.0)
        color = ACC if mark == "key" else (N7 if mark == "rel" else G5)
        fill = ACCW if mark == "key" else WHITE
        box(s, x + 0.34, yy, cw - 0.34, 0.42, fill, color, 1.75 if mark == "key" else (1.25 if mark == "rel" else 0.75))
        text(s, x + 0.34, yy, cw - 0.34, 0.42, [(dname, {"size": 9, "bold": mark is not None,
                                                         "color": ACC if mark == "key" else INK})],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
takeaway(s, 0.36, 5.82, 10.11, 0.98,
         "提案の起点は新設の物流部。届け先の要件は業務用営業部とEC推進室、物量の計画は生産管理部、委託先の評価には経営企画部が関わる")


# ============================================================ (6) 顧客・販売チャネル
s = page("顧客・販路", "量販中心の販路から、外食・ECへ分散が進む。冷凍の届け先が増えている",
         "会社案内・プレスリリース・求人情報を想定")
head(s, 0.36, 1.15, 5.0, "販売チャネル別の売上構成")
d = CategoryChartData()
d.categories = ["2026予", "2023"]
channel = [("量販", (55, 63), N9, 0.62), ("CVS", (11, 12), N7, 0.6), ("外食・中食", (17, 15), N5, 0.95),
           ("EC・ふるさと納税", (6, 0), ACC, 1.45), ("その他", (11, 10), G5, 0.7)]
for name, vals, _, _ in channel:
    d.add_series(name, vals)
ch = s.shapes.add_chart(XL_CHART_TYPE.BAR_STACKED_100, Inches(0.3), Inches(1.6), Inches(5.1), Inches(1.95), d).chart
style_chart(ch)
ch.plots[0].gap_width = 45
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
    set_font(ser.data_labels.font, 9.5, True, INK if color == G5 else WHITE)
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.category_axis.format.line.fill.background()
set_font(ch.category_axis.tick_labels.font, 10, True, G2)
legend(s, 0.42, 3.58, [(c, n, w) for n, _, c, w in channel])

head(s, 0.36, 4.1, 5.0, "特徴・強み")
strengths = [("看板商品を持つ", "冷凍ギョーザ「羽根つき一番」が冷凍売上の約5割。量販の冷凍売場で定番の棚を確保"),
             ("2温度帯で作り、届ける", "チルドと冷凍を同じグループで製造。チルドは関西に即日配送の仕組みを持つ"),
             ("生産拠点の増強", "群馬第2工場（冷凍）が2026/04に稼働し、冷凍の生産能力は約1.5倍に")]
for i, (t, b) in enumerate(strengths):
    yy = 4.58 + i * 0.75
    box(s, 0.36, yy + 0.04, 0.3, 0.3, N7, shape=MSO_SHAPE.OVAL)
    text(s, 0.36, yy + 0.04, 0.3, 0.3, [(str(i + 1), {"size": 9.5, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 0.8, yy, 4.56, 0.3, [(t, {"size": 10.5, "bold": True, "color": N9})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, 0.8, yy + 0.3, 4.56, 0.42, [(b, {"size": 9})], margin=0)

head(s, 5.65, 1.15, 4.82, "主な販売先")
rows = [("チャネル", "主な販売先", "2023→2026予"), ("量販", "関東・関西の大手スーパー。上位5社で量販売上の約6割", "63% → 55%"),
        ("CVS", "大手コンビニのPB惣菜を製造", "12% → 11%"), ("外食・中食", "外食チェーン3社と新規契約（2026/06〜）、弁当事業者", "15% → 17%"),
        ("EC", "公式EC（2025/10〜）、ふるさと納税の返礼品", "0% → 6%"), ("その他", "卸・生協", "10% → 11%")]
table(s, 5.65, 1.62, [1.0, 2.67, 1.15], rows, row_h=0.56, size=9, align=[PP_ALIGN.LEFT, PP_ALIGN.LEFT, PP_ALIGN.RIGHT],
      hot={(4, 0): ACC, (4, 2): ACC, (3, 2): N7})
takeaway(s, 5.65, 5.2, 4.82, 1.6, "量販向けの定期便だけでは、伸びる販路に届かない。外食店舗と個人宅という、温度管理が難しい届け先が増えている")


# ============================================================== (7) 商品ラインナップ
s = page("商品", "物流の接点が大きいのは冷凍食品と業務用。取引中のチルドは伸びが小さい",
         "自社サイト・商品カタログを想定。価格は店頭想定（税込）")
cats = [
    ("冷凍食品", ["frozen-gyoza", "frozen-friedrice", "frozen-udon"], [
        ("主な商品", "羽根つき一番（ギョーザ）、香ばし炒飯、讃岐風うどん"), ("価格帯", "298〜498円"), ("温度帯", "冷凍（−18℃以下）"),
        ("主な販路", "量販・CVS・EC・ふるさと納税"), ("売上と伸び", "113億円　年+18%")], ("物流の接点：大", N9, WHITE), True),
    ("チルド惣菜", ["chilled-gyoza", "chilled-salad"], [
        ("主な商品", "焼くだけ餃子、ポテトサラダ、きんぴら"), ("価格帯", "198〜398円"), ("温度帯", "チルド（10℃以下）・賞味3〜5日"),
        ("主な販路", "量販の惣菜売場に毎日納品"), ("売上と伸び", "64億円　年+2%")], ("当社取引中・伸び小", N3, INK), False),
    ("調味料", ["sauce-gyoza", "sauce-tsuyu", "sauce-dressing"], [
        ("主な商品", "餃子のたれ、そばつゆ、胡麻ドレッシング"), ("価格帯", "198〜548円"), ("温度帯", "常温"),
        ("主な販路", "量販・EC（冷凍品と同梱）"), ("売上と伸び", "52億円　横ばい")], ("物流の接点：小", G6, G2), False),
    ("業務用", ["bulk-gyoza", "bulk-soup"], [
        ("主な商品", "業務用冷凍ギョーザ（50個入）、スープの素"), ("価格帯", "ケース単位の取引"), ("温度帯", "冷凍中心"),
        ("主な販路", "外食チェーン・弁当事業者"), ("売上と伸び", "47億円　年+15%")], ("物流の接点：中・新規", N7, WHITE), True),
]
cw = 2.4
for i, (name, pics, specs, (verdict, vfill, vcolor), grow) in enumerate(cats):
    x = 0.36 + i * (cw + 0.17)
    box(s, x, 1.15, cw, 0.38, N9)
    text(s, x, 1.15, cw, 0.38, [(name, {"size": 11, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    box(s, x, 1.53, cw, 1.7, WASH)
    picture_row(s, pics, x + 0.1, 3.13, cw - 0.2, 1.48)
    yy = 3.33
    for k, (label, value) in enumerate(specs):
        rh = 0.62 if k == 0 else 0.47
        hot = label == "売上と伸び" and grow
        text(s, x, yy, cw, 0.2, [(label, {"size": 8, "bold": True, "color": G3})], margin=0)
        text(s, x, yy + 0.19, cw, rh - 0.2, [(value, {"size": 9.5, "bold": hot, "color": ACC if hot else INK})], margin=0, line=1.0)
        line(s, x, yy + rh - 0.03, x + cw, yy + rh - 0.03, G6, 0.75)
        yy += rh
    box(s, x, 6.3, cw, 0.48, vfill)
    text(s, x, 6.3, cw, 0.48, [(verdict, {"size": 10.5, "bold": True, "color": vcolor})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================ (8) ブランド別売上推移
s = page("ブランド", "主力「羽根つき一番」は4年で約2倍。主要4ブランドがそろって伸びる",
         "決算説明資料・プレスリリースを想定。2026年度は会社予想")
head(s, 0.36, 1.15, 6.35, "主要4ブランドの売上推移", "単位：億円")
brands = [("羽根つき一番", (28, 32, 38, 46, 55), N9), ("業務用ギョーザ", (15, 17, 20, 24, 29), N7),
          ("香ばし炒飯", (18, 20, 23, 27, 31), N5), ("讃岐風うどん", (10, 11, 13, 15, 17), N3)]
d = CategoryChartData()
d.categories = years
for name, vals, _ in brands:
    d.add_series(name, vals)
ch = s.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, Inches(0.3), Inches(1.65), Inches(5.3), Inches(4.85), d).chart
style_chart(ch)
for i, ser in enumerate(ch.plots[0].series):
    color = brands[i][2]
    ser.smooth = False
    ser.format.line.color.rgb = color
    ser.format.line.width = Pt(2.75 if i == 0 else 2)
    ser.marker.style = XL_MARKER_STYLE.CIRCLE
    ser.marker.size = 7
    ser.marker.format.fill.solid()
    ser.marker.format.fill.fore_color.rgb = color
    ser.marker.format.line.color.rgb = WHITE
ch.value_axis.minimum_scale = 0
ch.value_axis.maximum_scale = 60
ch.value_axis.major_unit = 20
ch.value_axis.has_major_gridlines = True
ch.value_axis.major_gridlines.format.line.color.rgb = G6
ch.value_axis.format.line.fill.background()
set_font(ch.value_axis.tick_labels.font, 9, None, G4)
ch.category_axis.format.line.color.rgb = G4
set_font(ch.category_axis.tick_labels.font, 10, True, G2)
for i, (name, vals, color) in enumerate(brands):
    yy = {0: 2.02, 1: 3.98, 2: 3.62, 3: 4.76}[i]
    c2 = color if color != N3 else N5
    text(s, 5.6, yy, 1.3, 0.3, [[(name + " ", {"size": 9, "bold": True, "color": c2}), (str(vals[-1]), {"size": 11, "bold": True, "color": c2})]],
         anchor=MSO_ANCHOR.MIDDLE, margin=0)

head(s, 7.0, 1.15, 3.47, "ブランド別の伸び")
rows = [("ブランド", "2026予", "年平均"), ("羽根つき一番", "55", "+18.4%"), ("業務用ギョーザ", "29", "+17.9%"),
        ("香ばし炒飯", "31", "+14.6%"), ("讃岐風うどん", "17", "+14.2%")]
table(s, 7.0, 1.62, [1.57, 0.85, 1.05], rows, row_h=0.4, size=9.5, align=[PP_ALIGN.LEFT, R, R], hot={(1, 2): ACC, (2, 2): ACC})
bullets(s, 7.0, 3.78, 3.47, 1.4, [(0, "上位2ブランドはどちらもギョーザ。家庭用と業務用の両方で伸びる"),
                                  (0, "4ブランドの合計は132億円。2022年度の約1.9倍")], size=9.5)
takeaway(s, 7.0, 5.35, 3.47, 1.45, "ギョーザの物量が増える。群馬で作り、関東・関西の量販と外食へ運ぶ流れが太くなる")


# ============================================================== (9) ブランド詳細
s = page("ブランド", "「羽根つき一番」：EC・返礼品の比率が上がり、冷凍の小口配送が増えていく",
         "自社サイト・商品カタログ・プレスリリースを想定")
head(s, 0.36, 1.15, 4.1, "ブランド概要")
rows = [("項目", "内容"), ("売上", "55億円（2026/3期予）年+18%"), ("商品数", "6商品（12・18・24個入り、大袋ほか）"),
        ("主な顧客", "共働き世帯を中心とする家庭用"), ("主な販路", "量販・公式EC・ふるさと納税"), ("価格帯", "298〜498円（店頭想定）"),
        ("温度帯", "冷凍（−18℃以下）"), ("生産", "群馬第1・第2工場")]
table(s, 0.36, 1.62, [1.05, 3.05], rows, row_h=0.46, size=9, hot={(1, 1): ACC})
head(s, 4.7, 1.15, 2.5, "商品")
box(s, 4.7, 1.62, 2.5, 3.68, WASH)
picture_row(s, ["frozen-gyoza"], 4.85, 3.9, 2.2, 2.1)
text(s, 4.7, 4.0, 2.5, 0.3, [("家庭用 12個入り", {"size": 8.5, "bold": True, "color": G2})], align=PP_ALIGN.CENTER, margin=0)
picture_row(s, ["bulk-gyoza"], 5.25, 5.08, 1.4, 0.95)
text(s, 4.7, 5.08, 2.5, 0.22, [("業務用（50個入）", {"size": 8, "color": G3})], align=PP_ALIGN.CENTER, margin=0)

head(s, 7.45, 1.15, 3.02, "物流との接点")
pts = [("生産が群馬に集約", "群馬から関東・関西への冷凍の幹線が太くなる"),
       ("個人宅への直送", "公式EC・返礼品で、冷凍の小口配送が新たに発生"),
       ("12月に需要の山", "返礼品は年末に集中しやすく、出荷の波が大きい")]
for i, (t, b) in enumerate(pts):
    yy = 1.68 + i * 1.2
    box(s, 7.45, yy, 3.02, 1.08, WHITE, G5, 0.75)
    box(s, 7.45, yy, 0.06, 1.08, ACC if i == 1 else N7)
    text(s, 7.62, yy + 0.1, 2.8, 0.3, [(t, {"size": 10.5, "bold": True, "color": ACC if i == 1 else N9})], margin=0)
    text(s, 7.62, yy + 0.44, 2.8, 0.6, [(b, {"size": 9})], line=1.1, margin=0)
takeaway(s, 0.36, 5.55, 10.11, 1.25, "主力ブランドの伸びは、量販への定期便より「個人宅への冷凍小口」と「年末の波」に表れる。今の委託先が得意とする領域の外側")


# =============================================================== (10) 変化のシグナル
s = page("変化", "生産増強・新しい販路・組織の新設が2年で重なった。物流の見直し時期に入っている",
         "プレスリリース・求人情報を想定")
events = [
    ("2024/04", "中期経営計画を公表", "冷凍の売上比率を2028年度に50%へ", "戦略", False),
    ("2025/03", "群馬第2工場を着工", "冷凍ギョーザ・冷凍麺の専用ライン", "投資", False),
    ("2025/10", "公式EC・ふるさと納税に参入", "冷凍ギョーザを個人宅へ直送", "販路", False),
    ("2026/04", "群馬第2工場が稼働", "冷凍の生産能力が約1.5倍に", "投資", False),
    ("2026/04", "物流部を新設", "物流企画職の求人で「委託先の再編」に言及", "組織", True),
    ("2026/06", "外食チェーン3社へ供給開始", "関西・中部の店舗へ業務用を納品", "販路", False),
]
axis = 3.62
line(s, 0.5, axis, 10.33, axis, N5, 2.0)
for i, (dte, t, b, tag, hot) in enumerate(events):
    cx = 1.35 + i * 1.62
    up = i % 2 == 0
    cy = 1.55 if up else 3.95
    color = ACC if hot else N7
    box(s, cx - 0.09, axis - 0.09, 0.18, 0.18, color, WHITE, 1.5, shape=MSO_SHAPE.OVAL)
    line(s, cx, axis - 0.09 if up else axis + 0.09, cx, cy + 1.75 if up else cy, color, 1.0)
    x = max(0.36, min(cx - 1.25, 10.47 - 2.5))
    box(s, x, cy, 2.5, 1.75, ACCW if hot else WHITE, color, 1.5 if hot else 0.75)
    box(s, x + 0.16, cy + 0.16, 0.56, 0.22, color)
    text(s, x + 0.16, cy + 0.16, 0.56, 0.22, [(tag, {"size": 8, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, x + 0.8, cy + 0.14, 1.6, 0.26, [(dte, {"size": 9.5, "bold": True, "color": color})], anchor=MSO_ANCHOR.MIDDLE, margin=0)
    text(s, x + 0.16, cy + 0.5, 2.2, 0.62, [(t, {"size": 11, "bold": True, "color": ACC if hot else INK})], line=1.05, margin=0)
    text(s, x + 0.16, cy + 1.02, 2.2, 0.66, [(b, {"size": 9, "color": G2})], line=1.1, margin=0)
takeaway(s, 0.36, 6.3, 10.11, 0.6, "生産能力1.5倍・販路の拡大・物流部の新設。委託体制を見直す条件がそろった", label="示唆")


# ================================================================= (11) 取引マップ
s = page("取引", "当社の取引はチルド・関西の1区画のみ。伸びる冷凍側に、委託先が固まっていない区画が3つ",
         "プレスリリース・求人情報と、依頼元の取引実績を突合して作成")
steps = ["保管・横持ち", "量販・CVS配送", "EC・個人宅配送", "外食店舗配送"]
rows4 = ["冷凍食品", "チルド惣菜", "調味料", "業務用"]
grid = [["O", "O", "N", "X"], ["O", "T", "X", "X"], ["O", "O", "N", "X"], ["O", "X", "X", "N"]]
notes = [["大手3PL", "大手3PL", "2025/10〜", ""], ["自社倉庫", "関西のみ当社", "", ""],
         ["他社", "大手3PL", "冷凍と同梱", ""], ["他社", "", "", "2026/06〜"]]
STATE = {"T": (N9, WHITE, "当社取引中"), "O": (N1, N9, "他社委託"), "N": (WHITE, ACC, "新規・未取引"), "X": (PANEL, G4, "対象外")}
GX, CWD, CG, GY, RH, RG = 1.95, 1.62, 0.06, 1.85, 0.95, 0.07
for j, st in enumerate(steps):
    box(s, GX + j * (CWD + CG), 1.25, CWD, 0.5, N7)
    text(s, GX + j * (CWD + CG), 1.25, CWD, 0.5, [(st, {"size": 9.5, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
for i, name in enumerate(rows4):
    yy = GY + i * (RH + RG)
    box(s, 0.36, yy, 1.52, RH, PANEL)
    text(s, 0.36, yy, 1.52, RH, [(name, {"size": 10.5, "bold": True, "color": N9})], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    for j in range(4):
        k = grid[i][j]
        fill, fg, label = STATE[k]
        xx = GX + j * (CWD + CG)
        box(s, xx, yy, CWD, RH, fill, ACC if k == "N" else (N9 if k == "T" else G6), 2.0 if k == "N" else 0.5, dash=k == "N")
        paras = [(label, {"size": 10, "bold": True, "color": fg})]
        if notes[i][j]:
            paras.append((notes[i][j], {"size": 8.5, "color": fg, "space": 2}))
        text(s, xx, yy, CWD, RH, paras, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
for k, key in enumerate(("T", "O", "N", "X")):
    fill, fg, label = STATE[key]
    lx = 1.95 + k * 1.5
    box(s, lx, 6.03, 0.24, 0.17, fill, ACC if key == "N" else G5, 1.25, dash=key == "N")
    text(s, lx + 0.3, 5.98, 1.15, 0.27, [(label, {"size": 8.5, "color": G2})], anchor=MSO_ANCHOR.MIDDLE, margin=0)

px = 8.78
box(s, px, 1.25, 1.69, 4.67, N9)
counts = [("当社取引中", "1", WHITE), ("新規・未取引", "3", RGBColor(0xFF, 0x9C, 0x93)), ("他社委託", "6", N3)]
for i, (lab, num, color) in enumerate(counts):
    yy = 1.45 + i * 1.08
    text(s, px + 0.16, yy, 1.4, 0.26, [(lab, {"size": 9, "bold": True, "color": N1})], margin=0)
    text(s, px + 0.16, yy + 0.24, 1.4, 0.6, [[(num, {"size": 30, "bold": True, "color": color}), (" 区画", {"size": 10, "bold": True, "color": color})]],
         anchor=MSO_ANCHOR.MIDDLE, margin=0)
line(s, px + 0.16, 4.7, px + 1.53, 4.7, N5, 0.75)
text(s, px + 0.16, 4.78, 1.4, 1.05, [("未取引の3区画は、どれも2025年以降に生まれた物流", {"size": 9, "bold": True, "color": WHITE})], line=1.15, margin=0)
takeaway(s, 0.36, 6.32, 10.11, 0.58, "既存の委託先と競わずに入れる区画がある。新しく生まれた物流から取引を広げる")


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
