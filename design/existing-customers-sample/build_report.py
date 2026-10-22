"""
既存顧客企業クローズアップ　サンプルレポート（表紙＋9ページ）を生成する。

テンプレート: Neunon Consulting の公式スライドテンプレート（ver3。サンプルの頁を除いたもの）。
ページの種類と並びは実際の納品物（顧客企業クローズアップ、提案書用材料_クローズアップ系）にならう。
本文はすべてダミー（「この文章はサンプルです。」）。社名・ブランド・カテゴリ・商品も「A・B・C」のサンプル表記。

レイアウトの決まり（全ページ共通）
  余白        左右 0.36in（テンプレートの罫線と同じ）。本文の領域は y 1.62〜6.82in
  段組        2段・3段・4段・5段の格子。段の間は 0.2〜0.45in で揃える
  文字        BIZ UDPゴシック。タイトル20pt／メッセージ14pt太字／節見出し11.5pt太字／本文10pt／注8pt
  色          構造は灰（テンプレートの階調）。データは青灰の1系統。赤は「提案につながる事実」だけ。
              橙は組織図の「技術検討先」だけ
  形          影・角丸・タグの飾りは使わない。罫線と灰のラベル、商品画像は全ページ同じ縮尺・同じ基準線

実行: py design/existing-customers-sample/build_report.py
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
import copy
from pathlib import Path

from lxml import etree
from PIL import Image
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

HERE = Path(__file__).parent
PACK = HERE / "packshots"
TEMPLATE = HERE / "neunon-template.pptx"
OUT = HERE / "existing-customers-sample.pptx"

CO = "サンプル株式会社"
DATE = "2026/10/22"
FONT = "BIZ UDPゴシック"
S = "この文章はサンプルです。"


def dummy(n=1):
    return S * n


# ------------------------------------------------------------------ 色
INK = RGBColor(0x1A, 0x1A, 0x1A)
G2 = RGBColor(0x4A, 0x4A, 0x4A)
G3 = RGBColor(0x73, 0x73, 0x73)
G4 = RGBColor(0xA6, 0xA6, 0xA6)
G5 = RGBColor(0xD0, 0xD0, 0xD0)
LABEL = RGBColor(0xEE, 0xEE, 0xEE)
PANEL = RGBColor(0xF5, 0xF5, 0xF5)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
N1 = RGBColor(0xE1, 0xE7, 0xF0)
N2 = RGBColor(0xC3, 0xD0, 0xE3)
N3 = RGBColor(0x9A, 0xAF, 0xCD)
N4 = RGBColor(0x6B, 0x88, 0xB4)
N5 = RGBColor(0x46, 0x62, 0x8F)
N6 = RGBColor(0x2C, 0x3F, 0x5E)
RED = RGBColor(0xC8, 0x16, 0x1D)
ORANGE = RGBColor(0xE0, 0x7B, 0x00)

L, C, R = PP_ALIGN.LEFT, PP_ALIGN.CENTER, PP_ALIGN.RIGHT
TOP, MID, BOT = MSO_ANCHOR.TOP, MSO_ANCHOR.MIDDLE, MSO_ANCHOR.BOTTOM

X0, X1 = 0.36, 10.47
W = X1 - X0
CT, CB = 1.62, 6.82

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


def bullet(p, level, color=G2):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", str(Inches(0.17 if level == 0 else 0.36)))
    ppr.set("indent", str(-Inches(0.17)))
    for tag in ("a:buClr", "a:buSzPct", "a:buFont", "a:buChar", "a:buNone"):
        for el in ppr.findall(qn(tag)):
            ppr.remove(el)
    clr = etree.SubElement(ppr, qn("a:buClr"))
    etree.SubElement(clr, qn("a:srgbClr")).set("val", str(color))
    etree.SubElement(ppr, qn("a:buSzPct")).set("val", "95000" if level == 0 else "100000")
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


def text(s, x, y, w, h, paras, size=10, align=L, anchor=TOP, line=1.15, margin=0.0):
    """paras: [str | (str, opts) | [(str, opts), ...]]
    opts: size / bold / color / level（箇条書き 0・1）/ space（段落前の pt）"""
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
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
        level = space = None
        for r in runs:
            t, o = (r, {}) if isinstance(r, str) else r
            level = o.get("level", level)
            space = o.get("space", space)
            run = p.add_run()
            run.text = t
            set_font(run.font, o.get("size", size), o.get("bold", False), o.get("color", INK))
        if level is not None:
            bullet(p, level)
        else:
            no_bullet(p)
        if space is not None:
            p.space_before = Pt(space)
        elif level is not None and i > 0:
            p.space_before = Pt(5 if level == 0 else 1.5)
    return tb


def bl(s, x, y, w, h, items, size=10, anchor=TOP):
    """items: (level, text[, color])"""
    paras = []
    for it in items:
        lvl, t = it[0], it[1]
        col = it[2] if len(it) > 2 else INK
        paras.append((t, {"level": lvl, "color": col, "bold": col == RED and lvl == 0, "size": size if lvl == 0 else size - 0.5}))
    return text(s, x, y, w, h, paras, size=size, anchor=anchor)


# ------------------------------------------------------------------ 図形
def box(s, x, y, w, h, fill=None, line=None, weight=0.75, shape=MSO_SHAPE.RECTANGLE, dash=False):
    b = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    b.shadow.inherit = False
    if fill is None:
        b.fill.background()
    else:
        b.fill.solid()
        b.fill.fore_color.rgb = fill
    if line is None:
        b.line.fill.background()
    else:
        b.line.color.rgb = line
        b.line.width = Pt(weight)
        if dash:
            b.line.dash_style = 4
    b.text_frame.text = ""
    return b


def line(s, x1, y1, x2, y2, color=G2, weight=0.75, dash=False):
    ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def head(s, x, y, w, t):
    """節見出し：中央寄せの太字＋濃い灰の罫線（実際の納品物と同じ型）"""
    text(s, x, y, w, 0.3, [(t, {"size": 11.5, "bold": True})], align=C, anchor=BOT, line=1.0)
    line(s, x, y + 0.34, x + w, y + 0.34, G2, 0.75)


def label(s, x, y, w, h, t, size=10, bold=False):
    box(s, x, y, w, h, LABEL)
    text(s, x, y, w, h, [(t, {"size": size, "bold": bold})], align=C, anchor=MID, line=1.05, margin=0.04)


def legend_row(s, x, y, entries, size=9, gap=0.28):
    """凡例を横に並べる。entries: (色, 名前)"""
    cx = x
    for col, nm in entries:
        box(s, cx, y + 0.05, 0.16, 0.13, col, G3 if col in (N1, LABEL, WHITE) else None, 0.5)
        tw = 0.11 * len(nm) + 0.05
        text(s, cx + 0.22, y, tw, 0.24, [(nm, {"size": size, "color": G2})], anchor=MID, line=1.0)
        cx += 0.22 + tw + gap


PX = {}


def px(name):
    if name not in PX:
        PX[name] = Image.open(PACK / f"{name}.png").size
    return PX[name]


def products(s, names, x, w, base, k, gap=0.07):
    """商品画像を横一列に。k は in/px の共通縮尺（ページ内で全部同じ）"""
    total = sum(px(n)[0] for n in names) * k + gap * (len(names) - 1)
    cx = x + (w - total) / 2
    for n in names:
        pw, ph = px(n)
        s.shapes.add_picture(str(PACK / f"{n}.png"), Inches(cx), Inches(base - ph * k), Inches(pw * k), Inches(ph * k))
        cx += pw * k + gap


def fit_scale(groups, widths, max_h, gap=0.07):
    """全グループが幅に収まり、最も背の高い商品が max_h になる共通の縮尺"""
    tallest = max(px(n)[1] for g in groups for n in g)
    k = max_h / tallest
    for g, w in zip(groups, widths):
        need = sum(px(n)[0] for n in g)
        k = min(k, (w - gap * (len(g) - 1)) / need)
    return k


def style_chart(ch, size=9):
    ch.has_title = False
    ch.has_legend = False
    set_font(ch.font, size, None, G2)


def stacked(s, x, y, w, h, cats, series, colors, totals=None, pct=False, gap=55):
    d = CategoryChartData()
    d.categories = cats
    for nm, vals in series:
        d.add_series(nm, vals)
    if totals:
        d.add_series("合計", [0] * len(cats))
    kind = XL_CHART_TYPE.COLUMN_STACKED_100 if pct else XL_CHART_TYPE.COLUMN_STACKED
    ch = s.shapes.add_chart(kind, Inches(x), Inches(y), Inches(w), Inches(h), d).chart
    style_chart(ch)
    plot = ch.plots[0]
    plot.gap_width = gap
    plot.overlap = 100
    for i, ser in enumerate(plot.series):
        if totals and i == len(series):
            ser.format.fill.background()
            ser.format.line.fill.background()
            for j, t in enumerate(totals):
                dl = ser.points[j].data_label
                dl.has_text_frame = True
                dl.text_frame.text = t
                dl.position = XL_LABEL_POSITION.INSIDE_BASE
                set_font(dl.text_frame.paragraphs[0].runs[0].font, 10, True, INK)
            continue
        col = colors[i]
        ser.format.fill.solid()
        ser.format.fill.fore_color.rgb = col
        ser.format.line.color.rgb = WHITE
        ser.format.line.width = Pt(0.75)
        ser.data_labels.show_value = True
        if pct:
            ser.data_labels.number_format = '0"%"'
            ser.data_labels.number_format_is_linked = False
        ser.data_labels.position = XL_LABEL_POSITION.CENTER
        set_font(ser.data_labels.font, 9, False, WHITE if col in (N4, N5, N6) else INK)
    ch.value_axis.visible = False
    ch.value_axis.has_major_gridlines = False
    if not pct and totals:
        ch.value_axis.maximum_scale = max(sum(v[j] for _, v in series) for j in range(len(cats))) * 1.12
        ch.value_axis.minimum_scale = 0
    ch.category_axis.format.line.color.rgb = G2
    ch.category_axis.format.line.width = Pt(0.75)
    set_font(ch.category_axis.tick_labels.font, 9.5, None, G2)
    return ch


# ------------------------------------------------------------------ ページの枠
PAGE = [0]


def page(title, message, source="この文章はサンプルです。"):
    PAGE[0] += 1
    n = PAGE[0]
    s = prs.slides.add_slide(LAYOUT)
    for ph in list(s.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    tf = s.shapes.title.text_frame
    tf.text = f"{CO}（{n}）　{title}"
    set_font(tf.paragraphs[0].runs[0].font, 20, False, INK)
    # テンプレートの日付・頁番号のプレースホルダーをそのまま使う
    for ph in LAYOUT.placeholders:
        t = ph.placeholder_format.type
        if t is not None and int(t) in (13, 16):
            el = copy.deepcopy(ph._element)
            s.shapes._spTree.append(el)
            sh = s.shapes[-1]
            if int(t) == 16:
                sh.text_frame.text = DATE
                sh.text_frame.word_wrap = False
                sh.width = Inches(1.3)
                set_font(sh.text_frame.paragraphs[0].runs[0].font, 9, None, INK)
    text(s, X0, 0.99, W, 0.5, [(message, {"size": 14, "bold": True})], align=C, anchor=MID, line=1.05)
    # サンプルであることの表示（実際の納品物の「ボリューム」札と同じ位置）
    box(s, 9.42, 0.05, 1.05, 0.22, WHITE, G2, 0.75)
    text(s, 9.42, 0.05, 1.05, 0.22, [("サンプル", {"size": 8.5, "color": G2})], align=C, anchor=MID, line=1.0)
    text(s, X0, 6.93, W, 0.24, [[("出所：", {"size": 8, "color": G3}), (source, {"size": 8, "color": G3})]], anchor=MID, line=1.0)
    return s


# ================================================================== 表紙
cover = prs.slides.add_slide(next(l for l in prs.slide_layouts if l.name == "表紙"))
for ph in cover.placeholders:
    idx = ph.placeholder_format.idx
    if idx == 12:
        ph.text_frame.text = "〇〇株式会社　御中"
    elif idx == 11:
        ph.text_frame.text = f"{CO}　企業クローズアップ"
    elif idx == 13:
        ph.text_frame.text = f"{DATE}　（サンプル）"
    for p in ph.text_frame.paragraphs:
        for r in p.runs:
            set_font(r.font)


# ================================================================== (1) 会社概要
s = page("会社概要", dummy(3))
LW = 4.83                     # 2段：各 4.83in、段間 0.45in
RX = X0 + LW + 0.45
head(s, X0, CT, LW, "基本情報・業績")
label(s, X0, 2.08, 0.82, 2.52, "売上・\n利益")
legend_row(s, 1.32, 2.08, [(N1, "カテゴリA"), (N2, "カテゴリB"), (N4, "カテゴリC"), (N6, "カテゴリD")], gap=0.16)
text(s, 1.32, 2.33, 1.2, 0.2, [("単位：億円", {"size": 8, "color": G3})], line=1.0)
stacked(s, 1.22, 2.42, X0 + LW - 1.22, 2.22, ["2023/3", "2024/3", "2025/3", "2026/3予"],
        [("カテゴリD", (38, 36, 34, 33)), ("カテゴリC", (41, 48, 55, 63)), ("カテゴリB", (92, 95, 101, 112)), ("カテゴリA", (168, 176, 189, 204))],
        [N6, N4, N2, N1], totals=["339", "355", "379", "412"])
label(s, X0, 4.72, 0.82, 0.4, "従業員数")
text(s, 1.32, 4.72, LW - 0.96, 0.4, [("単体：○○○名、連結：○,○○○名（2026/3）", {"size": 10})], anchor=MID)
label(s, X0, 5.24, 0.82, CB - 5.24, "事業概要\n経営動向")
bl(s, 1.32, 5.24, LW - 0.96, CB - 5.24, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2), RED), (1, dummy(1)), (0, dummy(2))], anchor=MID)

head(s, RX, CT, LW, "グループ組織図")
cx = RX + LW / 2
box(s, cx - 1.45, 2.08, 2.9, 0.42, WHITE, G2, 0.75)
text(s, cx - 1.45, 2.08, 2.9, 0.42, [("サンプルホールディングス株式会社", {"size": 10})], align=C, anchor=MID)
line(s, cx, 2.5, cx, 2.8, G2)
text(s, cx + 0.08, 2.52, 0.6, 0.26, [("100%", {"size": 8.5, "color": G2})], anchor=MID, line=1.0)
box(s, cx - 1.45, 2.8, 2.9, 0.46, WHITE, INK, 1.5)
text(s, cx - 1.45, 2.8, 2.9, 0.46, [(CO, {"size": 11, "bold": True})], align=C, anchor=MID)
kw, kg = 1.47, (LW - 3 * 1.47) / 2
line(s, cx, 3.26, cx, 3.46, G2)
line(s, RX + kw / 2, 3.46, RX + LW - kw / 2, 3.46, G2)
for i, (nm, role, pct) in enumerate([("子会社A", "機能A", "100%"), ("子会社B", "機能B", "100%"), ("子会社C", "機能C", "70%")]):
    x = RX + i * (kw + kg)
    line(s, x + kw / 2, 3.46, x + kw / 2, 3.66, G2)
    text(s, x + kw / 2 + 0.06, 3.44, 0.6, 0.22, [(pct, {"size": 8.5, "color": G2})], anchor=MID, line=1.0)
    box(s, x, 3.66, kw, 0.62, WHITE, G2, 0.75)
    text(s, x, 3.66, kw, 0.62, [(nm, {"size": 10, "bold": True, "color": RED if i == 2 else INK}), (role, {"size": 8.5, "color": G3, "space": 1})],
         align=C, anchor=MID, line=1.05)
for i, nm in enumerate(["関連会社A", "関連会社B", "関連会社C"]):
    y = 4.56 + i * 0.6
    box(s, RX, y, 1.6, 0.46, LABEL)
    text(s, RX, y, 1.6, 0.46, [(nm, {"size": 9.5})], align=C, anchor=MID)
    text(s, RX + 1.75, y, LW - 1.75, 0.46, [("……" + dummy(1), {"size": 9.5, "color": G2})], anchor=MID)
line(s, RX, 6.42, RX + LW, 6.42, G5, 0.5)
text(s, RX, 6.48, LW, 0.34, [(dummy(2), {"size": 9.5, "color": RED})], anchor=MID)


# ================================================================== (2) 主要組織図
s = page("主要組織図", dummy(3), "この文章はサンプルです。　注：公開情報から提案活動の観点で整理した参考図")
box(s, X0, CT + 0.06, 0.16, 0.13, RED)
text(s, X0 + 0.24, CT, 2.4, 0.24, [("提案の起点・実務窓口", {"size": 9, "bold": True, "color": RED})], anchor=MID, line=1.0)
box(s, X0, CT + 0.32, 0.16, 0.13, ORANGE)
text(s, X0 + 0.24, CT + 0.26, 2.4, 0.24, [("技術検討先", {"size": 9, "bold": True, "color": ORANGE})], anchor=MID, line=1.0)
mx = X0 + W / 2
box(s, mx - 1.1, CT, 2.2, 0.36, WHITE, G2, 0.75)
text(s, mx - 1.1, CT, 2.2, 0.36, [("取締役会", {"size": 10})], align=C, anchor=MID)
line(s, mx, CT + 0.36, mx, CT + 0.48, G2)
box(s, mx - 1.45, CT + 0.48, 2.9, 0.42, WHITE, G2, 0.75)
text(s, mx - 1.45, CT + 0.48, 2.9, 0.42, [[("代表取締役社長", {"size": 10}), ("（○○ ○○ 氏）", {"size": 9, "color": G3})]], align=C, anchor=MID)
cols = [("ブランド・企画", [None, "rel", None]), ("研究・開発", ["tech", "key", None]), ("調達・品質・生産", ["key", "tech", None]),
        ("販売・顧客接点", [None, "rel", None]), ("経営・全社基盤", [None, None, None])]
cw = (W - 4 * 0.14) / 5
bus = CT + 1.1
line(s, mx, CT + 0.9, mx, bus, G2)
line(s, X0 + cw / 2, bus, X1 - cw / 2, bus, G2)
fy, fh = bus + 0.14, 3.3
for i, (grp, marks) in enumerate(cols):
    x = X0 + i * (cw + 0.14)
    line(s, x + cw / 2, bus, x + cw / 2, fy, G2)
    box(s, x, fy, cw, fh, None, G2, 0.75)
    box(s, x, fy, cw, 0.42, LABEL)
    text(s, x, fy, cw, 0.42, [(grp, {"size": 10, "bold": True})], align=C, anchor=MID)
    for k, mark in enumerate(marks):
        y = fy + 0.6 + k * 0.9
        col = RED if mark == "key" else ORANGE if mark == "tech" else None
        box(s, x + 0.13, y, cw - 0.26, 0.72, WHITE, col or G4, 1.75 if col else 0.5)
        nm = f"部門{'ABCDE'[i]}-{k + 1}"
        text(s, x + 0.13, y, cw - 0.26, 0.72, [(nm, {"size": 10, "bold": col is not None or mark == "rel", "color": col or INK}),
                                              ("（○○ ○○ 部長）", {"size": 8.5, "color": G3, "space": 1})], align=C, anchor=MID, line=1.05)
nb = fy + fh + 0.14
nw = (W - 2 * 0.2) / 3
for i, (head_t, col) in enumerate([("部門B-2・部門C-1：提案の起点", RED), ("部門B-1・部門C-2：技術検討先", ORANGE), ("部門A-2・部門D-2：関係部署", INK)]):
    x = X0 + i * (nw + 0.2)
    box(s, x, nb, nw, CB - nb, PANEL)
    text(s, x + 0.12, nb, nw - 0.24, CB - nb, [(head_t, {"size": 9, "bold": True, "color": col}), (dummy(1), {"size": 9, "color": G2, "space": 1})],
         anchor=MID, line=1.1)


# ================================================================== (3) 販売チャネル
s = page("販売チャネル", dummy(3))
LW3 = 5.9
head(s, X0, CT, LW3, "チャネル別売上構成比の推移")
legend_row(s, X0, 2.06, [(N1, "チャネルA"), (N2, "チャネルB"), (N3, "チャネルC"), (N5, "チャネルD"), (N6, "チャネルE")], gap=0.14)
stacked(s, X0 - 0.06, 2.34, LW3 + 0.12, CB - 2.34, ["2022/3", "2023/3", "2024/3", "2025/3", "2026/3予"],
        [("チャネルE", (3, 3, 4, 4, 5)), ("チャネルD", (12, 11, 11, 10, 10)), ("チャネルC", (7, 9, 11, 13, 16)),
         ("チャネルB", (15, 14, 14, 13, 13)), ("チャネルA", (63, 63, 60, 60, 56))], [N6, N5, N3, N2, N1], pct=True, gap=45)
RX3 = X0 + LW3 + 0.3
RW3 = X1 - RX3
head(s, RX3, CT, RW3, "販売チャネルの特徴・戦略")
blocks = [("チャネルA", "63% → 56%", INK), ("チャネルC", "7% → 16%", RED), ("チャネルE", "3% → 5%", INK)]
bh = (CB - 2.08) / 3
for i, (nm, chg, col) in enumerate(blocks):
    by = 2.08 + i * bh
    text(s, RX3, by, RW3 * 0.4, 0.34, [(nm, {"size": 10.5, "bold": True, "color": col})], anchor=MID, line=1.0)
    text(s, RX3 + RW3 * 0.3, by, RW3 * 0.7, 0.34, [[("構成比 2022→2026予　", {"size": 8, "color": G3}), (chg, {"size": 10.5, "bold": True, "color": col})]],
         align=R, anchor=MID, line=1.0)
    line(s, RX3, by + 0.38, X1, by + 0.38, G5, 0.5)
    bl(s, RX3, by + 0.46, RW3, bh - 0.56, [(0, dummy(2), col), (1, dummy(1)), (0, dummy(1))], size=9.5)


# ================================================================== (4) 商品ラインナップ
s = page("商品ラインナップ", dummy(3), "この文章はサンプルです。　注：価格は税込")
cw4 = (W - 3 * 0.2) / 4
groups = [["minamo-lotion", "minamo-milk", "minamo-serum", "minamo-cream"], ["classica-lotion", "classica-cream"],
          ["refre-shampoo", "refre-treatment", "refre-refill"], ["harenohi-tube", "harenohi-spray", "harenohi-stick"]]
k = fit_scale(groups, [cw4 - 0.24] * 4, 1.95)
meta = [("カテゴリA", "ブランドA", "○○億円", "接点：大", N6), ("カテゴリB", "ブランドB", "○○億円", "接点：小", N1),
        ("カテゴリC", "ブランドC", "○○億円", "接点：大", N6), ("カテゴリD", "ブランドD", "○○億円", "接点：中", N4)]
for i, (cat, brand, sales, touch, tcol) in enumerate(meta):
    x = X0 + i * (cw4 + 0.2)
    head(s, x, CT, cw4, f"{cat}（{brand}）")
    bl(s, x, 2.06, cw4, 1.74, [(0, f"主な商品：商品{brand[-1]}-1〜{brand[-1]}-4"), (0, "価格帯：○,○○○〜○,○○○円"),
                                (0, "主な販路：チャネルA・B"), (0, "容器形態：形態A・B・C"),
                                (0, dummy(1)), (1, dummy(1), RED if i in (0, 2) else INK)], size=9.5)
    box(s, x, 3.92, cw4, 2.36, PANEL)
    products(s, groups[i], x + 0.12, cw4 - 0.24, 6.1, k)
    text(s, x, 6.38, cw4 * 0.56, 0.44, [("売上（2026/3予）", {"size": 8, "color": G3}), (sales, {"size": 11, "bold": True, "space": 0})], anchor=MID, line=1.0)
    box(s, x + cw4 * 0.56, 6.44, cw4 * 0.44, 0.34, tcol)
    text(s, x + cw4 * 0.56, 6.44, cw4 * 0.44, 0.34, [(touch, {"size": 9.5, "bold": True, "color": WHITE if tcol in (N4, N6) else INK})],
         align=C, anchor=MID, line=1.0)


# ================================================================== (5) ブランド詳細
s = page("「ブランドA」", dummy(3))
LW5 = 5.0
head(s, X0, CT, LW5, "ブランド概要・戦略")
rows5 = [("売上", "○○億円（2026/3予）"), ("商品数", "○○商品"), ("主な顧客", dummy(1)), ("チャネル", "チャネルA、チャネルC"), ("価格帯", "○,○○○〜○,○○○円")]
for i, (k5, v5) in enumerate(rows5):
    y = 2.08 + i * 0.42
    label(s, X0, y, 1.05, 0.34, k5, size=9.5)
    text(s, X0 + 1.2, y, LW5 - 1.2, 0.34, [(v5, {"size": 10})], anchor=MID)
for i, (k5, items) in enumerate([("ブランド戦略", [(0, dummy(2)), (0, dummy(1), RED)]), ("容器戦略", [(0, dummy(2)), (0, dummy(1))]),
                                  ("顧客の声", [(0, dummy(2)), (0, dummy(1))])]):
    y = 4.26 + i * 0.88
    label(s, X0, y, 1.05, 0.8, k5, size=9.5)
    bl(s, X0 + 1.2, y + 0.02, LW5 - 1.2, 0.8, items, size=9.5, anchor=MID)
RX5 = X0 + LW5 + 0.35
RW5 = X1 - RX5
head(s, RX5, CT, RW5, "商品画像・提案・連携余地")
box(s, RX5, 2.08, RW5, 2.5, PANEL)
k5s = fit_scale([groups[0]], [RW5 - 0.6], 2.05)
products(s, groups[0], RX5 + 0.3, RW5 - 0.6, 4.38, k5s, gap=0.14)
text(s, RX5, 4.62, RW5, 0.26, [(dummy(1), {"size": 8.5, "color": G3})], align=C, anchor=MID, line=1.0)
text(s, RX5, 4.96, RW5, 0.3, [("提案・連携余地", {"size": 10.5, "bold": True})], anchor=MID, line=1.0)
line(s, RX5, 5.3, X1, 5.3, G5, 0.5)
bl(s, RX5, 5.4, RW5, CB - 5.4, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2), RED), (1, dummy(1)), (0, dummy(2))], size=9.5)


# ================================================================== (6) 直近の事業動向
s = page("直近の事業動向", dummy(3), "この文章はサンプルです。　注：赤字は提案に関わる出来事")
ev = [("2024/5", "戦略", "出来事A", True, "中期経営計画"), ("2024/11", "商品", "出来事B", True, "プレスリリース"), ("2025/3", "投資", "出来事C", False, "業界紙"),
      ("2025/10", "海外", "出来事D", True, "プレスリリース"), ("2026/3予", "商品", "出来事E", True, "求人情報"), ("2026/4", "組織", "出来事F", True, "人事発表"),
      ("2026/6", "商品", "出来事G", False, "プレスリリース")]
ax = CT + 0.42


def tx(ym):
    y, m = ym.replace("予", "").split("/")
    return X0 + 0.15 + (W - 0.3) * ((int(y) - 2024) * 12 + int(m) - 1) / 36


line(s, X0, ax, X1, ax, G2, 1.0)
for yr in (2024, 2025, 2026):
    xx = tx(f"{yr}/1")
    line(s, xx, ax - 0.09, xx, ax + 0.09, G2, 1.0)
    text(s, xx + 0.05, ax + 0.04, 0.6, 0.2, [(f"{yr}", {"size": 8, "color": G3})], line=1.0)
for i, (ym, _, nm, hot, _) in enumerate(ev):
    xx = tx(ym)
    box(s, xx - 0.065, ax - 0.065, 0.13, 0.13, RED if hot else N4, WHITE, 1.0, shape=MSO_SHAPE.OVAL)
    up = i % 2 == 0
    text(s, xx - 0.4, ax - 0.36 if up else ax + 0.14, 0.8, 0.22, [(ym, {"size": 8.5, "bold": True, "color": RED if hot else G2})],
         align=C, anchor=MID, line=1.0)
widths = [0.85, 0.65, 1.55, 3.05, 2.71, 1.3]
heads6 = ["時期", "区分", "出来事", "内容", "提案への影響", "出所"]
ty = 2.6
x = X0
for j, h in enumerate(heads6):
    box(s, x, ty, widths[j], 0.32, LABEL)
    text(s, x, ty, widths[j], 0.32, [(h, {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
    x += widths[j]
rh = (CB - ty - 0.32) / len(ev)
y = ty + 0.32
for ym, kind, nm, hot, src in ev:
    x = X0
    vals = [ym, kind, nm, dummy(1), dummy(1), src]
    for j, v in enumerate(vals):
        red = hot and j in (2, 4)
        text(s, x + (0.08 if j >= 2 else 0), y, widths[j] - (0.12 if j >= 2 else 0), rh, [(v, {"size": 9.5, "bold": red, "color": RED if red else INK})],
             align=C if j < 2 else L, anchor=MID, line=1.05)
        x += widths[j]
    line(s, X0, y + rh, X1, y + rh, G5 if (ym, kind) != ev[-1][:2] else G2, 0.5 if (ym, kind) != ev[-1][:2] else 0.75)
    y += rh


# ================================================================== (7) 既存取引との照合
s = page("既存取引との照合", dummy(3), "この文章はサンプルです。　注：他社は公開情報からの推定")
cols7 = [f"カテゴリ{c}" for c in "ABCDEFG"]
rows7 = ["ブランドA", "ブランドB", "ブランドC", "ブランドD", "ブランドE", "その他・新規"]
ST = {"T": ("当社取引中", N5, WHITE), "O": ("他社（推定）", N1, INK), "N": ("新規発生", WHITE, RED), "U": ("要確認", WHITE, G2), "-": ("−", WHITE, G4)}
g7 = [["T", "O", "N", "O", "-", "U", "-"], ["O", "O", "O", "O", "-", "-", "-"], ["T", "O", "-", "-", "-", "O", "-"],
      ["-", "-", "-", "-", "O", "-", "N"], ["O", "O", "-", "-", "O", "O", "-"], ["N", "N", "U", "U", "N", "U", "-"]]
n7 = [["商品A-1", "", "2026/3〜", "", "", "", ""], ["", "", "", "", "", "", ""], ["商品C-1", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "2026/6〜"], ["", "", "", "", "", "", ""], ["2026/10〜", "2026/10〜", "", "", "2026/10〜", "", ""]]
lw7, cw7, hh7 = 1.25, 0.98, 0.38
rh7 = 0.7
gx = X0
box(s, gx, CT, lw7, hh7, LABEL)
for j, c_ in enumerate(cols7):
    xx = gx + lw7 + j * cw7
    box(s, xx, CT, cw7, hh7, LABEL, WHITE, 1.0)
    text(s, xx, CT, cw7, hh7, [(c_, {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
for i, b in enumerate(rows7):
    yy = CT + hh7 + i * rh7
    box(s, gx, yy, lw7, rh7, LABEL, WHITE, 1.0)
    text(s, gx, yy, lw7, rh7, [(b, {"size": 10, "bold": True})], align=C, anchor=MID, line=1.0)
    for j in range(7):
        st = g7[i][j]
        nm, fill, fg = ST[st]
        xx = gx + lw7 + j * cw7
        box(s, xx, yy, cw7, rh7, fill, G5 if st not in ("N",) else None, 0.5)
        if st == "N":
            box(s, xx + 0.04, yy + 0.04, cw7 - 0.08, rh7 - 0.08, None, RED, 1.5, dash=True)
        paras = [(nm, {"size": 9, "bold": st in ("T", "N"), "color": fg})]
        if n7[i][j]:
            paras.append((n7[i][j], {"size": 8, "color": fg, "space": 1}))
        text(s, xx, yy, cw7, rh7, paras, align=C, anchor=MID, line=1.0)
gb = CT + hh7 + 6 * rh7
ly = gb + 0.16
lx = gx
for st in ("T", "O", "N", "U"):
    nm, fill, fg = ST[st]
    box(s, lx, ly + 0.05, 0.26, 0.15, fill, RED if st == "N" else G4, 1.0, dash=st == "N")
    text(s, lx + 0.33, ly, 1.1, 0.25, [(nm, {"size": 9, "color": G2})], anchor=MID, line=1.0)
    lx += 1.45
RX7 = gx + lw7 + 7 * cw7 + 0.3
RW7 = X1 - RX7
head(s, RX7, CT, RW7, "区画の数")
counts = [("当社取引中", "2", N5), ("新規発生", "5", RED), ("要確認", "5", G2)]
for i, (lab_, num, col) in enumerate(counts):
    y = 2.08 + i * 0.66
    text(s, RX7, y, RW7 * 0.55, 0.56, [(lab_, {"size": 9, "color": G2})], anchor=MID, line=1.0)
    text(s, RX7 + RW7 * 0.5, y, RW7 * 0.5, 0.56, [[(num, {"size": 22, "bold": True, "color": col}), (" 区画", {"size": 9, "color": G2})]],
         align=R, anchor=MID, line=1.0)
    line(s, RX7, y + 0.6, X1, y + 0.6, G5, 0.5)
head(s, RX7, 4.2, RW7, "未確認事項")
bl(s, RX7, 4.66, RW7, CB - 4.66, [(0, dummy(1), RED), (0, dummy(1)), (0, dummy(1)), (0, dummy(1), RED)], size=9.5)


# ================================================================== (8) 提案・連携余地
s = page("提案・連携余地", dummy(3))
themes = [("テーマA", ["minamo-serum", "minamo-milk"]), ("テーマB", ["refre-shampoo", "refre-refill"]), ("テーマC", ["harenohi-tube", "harenohi-stick"])]
c8 = [(X0, 2.2, "提案テーマ"), (X0 + 2.4, 3.55, "根拠となる事実"), (X0 + 6.15, 2.5, "提案の切り口"), (X1 - 1.31, 1.31, "対象商品")]
for x, w, h in c8:
    head(s, x, CT, w, h)
top8 = CT + 0.46
rh8 = (CB - top8) / 3
k8 = fit_scale([t_[1] for t_ in themes], [1.1] * 3, rh8 - 0.36)
for i, (nm, pics) in enumerate(themes):
    y = top8 + i * rh8
    box(s, X0, y + 0.08, 2.2, rh8 - 0.16, LABEL)
    text(s, X0 + 0.12, y + 0.08, 1.96, rh8 - 0.16, [(nm, {"size": 12, "bold": True}), (dummy(1), {"size": 9, "color": G2, "space": 4})], align=C, anchor=MID, line=1.15)
    bl(s, X0 + 2.4, y + 0.08, 3.55, rh8 - 0.16, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2))], size=9.5, anchor=MID)
    bl(s, X0 + 6.15, y + 0.08, 2.5, rh8 - 0.16, [(0, dummy(1), RED), (0, dummy(1), RED), (1, dummy(1))], size=9.5, anchor=MID)
    box(s, X1 - 1.31, y + 0.08, 1.31, rh8 - 0.16, PANEL)
    products(s, pics, X1 - 1.31 + 0.1, 1.11, y + rh8 - 0.2, k8, gap=0.05)
    if i < 2:
        line(s, X0, y + rh8, X1, y + rh8, G4, 0.75, dash=True)


# ================================================================== (9) 優先順位と営業アクション
s = page("優先順位と営業アクション", dummy(3), "この文章はサンプルです。　注：確度・規模は公開情報と取引実績からの見立て")
LW9 = 3.95
head(s, X0, CT, LW9, "提案テーマの優先順位")
mx9, my9, ms = X0 + 0.55, 2.12, 3.25
box(s, mx9, my9, ms, ms, WHITE, G2, 0.75)
box(s, mx9 + ms / 2, my9, ms / 2, ms / 2, PANEL)
line(s, mx9 + ms / 2, my9, mx9 + ms / 2, my9 + ms, G4, 0.75, dash=True)
line(s, mx9, my9 + ms / 2, mx9 + ms, my9 + ms / 2, G4, 0.75, dash=True)
text(s, mx9 + ms / 2, my9 + 0.06, ms / 2 - 0.08, 0.24, [("優先して着手", {"size": 8, "color": G3})], align=R, line=1.0)
text(s, mx9, my9 + ms + 0.04, ms, 0.24, [("確度　→　高", {"size": 8.5, "color": G2})], align=R, line=1.0)
text(s, X0, my9, 0.5, ms, [("規模", {"size": 8.5, "color": G2}), ("↑", {"size": 8.5, "color": G2}), ("大", {"size": 8.5, "color": G2})], align=C, anchor=TOP, line=1.0)
for cxp, cyp, rr, lab_, fill, fg in [(0.78, 0.22, 0.3, "A", N6, WHITE), (0.6, 0.4, 0.24, "B", N5, WHITE), (0.34, 0.6, 0.22, "C", N3, WHITE), (0.18, 0.82, 0.18, "D", N1, INK)]:
    bx, by_ = mx9 + ms * cxp - rr, my9 + ms * cyp - rr
    box(s, bx, by_, rr * 2, rr * 2, fill, WHITE, 1.0, shape=MSO_SHAPE.OVAL)
    text(s, bx, by_, rr * 2, rr * 2, [(lab_, {"size": 12, "bold": True, "color": fg})], align=C, anchor=MID, line=1.0)
legend9 = [("A", "テーマA", N6), ("B", "テーマB", N5), ("C", "テーマC", N3), ("D", "テーマD（見送り）", N1)]
for i, (a, nm, col) in enumerate(legend9):
    y = 5.78 + i * 0.26
    box(s, X0 + 0.55, y + 0.04, 0.17, 0.17, col, None, shape=MSO_SHAPE.OVAL)
    text(s, X0 + 0.8, y, 2.8, 0.25, [(nm, {"size": 9, "color": G2})], anchor=MID, line=1.0)
RX9 = X0 + LW9 + 0.35
RW9 = X1 - RX9
head(s, RX9, CT, RW9, "アクションプラン")
w9 = [0.95, 1.3, 2.31, 1.25]
hdr9 = ["テーマ", "対象部門", "商談で確認すること", "次のアクション"]
y = 2.08
x = RX9
for j, h in enumerate(hdr9):
    box(s, x, y, w9[j], 0.32, LABEL, WHITE, 1.0)
    text(s, x, y, w9[j], 0.32, [(h, {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
    x += w9[j]
y += 0.32
acts = [("テーマA", "部門B-2", dummy(2), "○月：初回訪問"), ("テーマB", "部門C-1", dummy(2), "○月：サンプル提出"), ("テーマC", "部門D-2", dummy(2), "○月：方針の確認")]
for i, a in enumerate(acts):
    x = RX9
    for j, v in enumerate(a):
        hot = i == 0 and j in (0, 3)
        text(s, x + 0.08, y, w9[j] - 0.14, 1.0, [(v, {"size": 9.5, "bold": hot or j == 0, "color": RED if hot else INK})],
             align=L, anchor=MID, line=1.1)
        x += w9[j]
    line(s, RX9, y + 1.0, X1, y + 1.0, G5 if i < 2 else G2, 0.5 if i < 2 else 0.75)
    y += 1.0
text(s, RX9, 5.58, RW9, 0.3, [("初回訪問で持ち込むもの", {"size": 10.5, "bold": True})], anchor=MID, line=1.0)
line(s, RX9, 5.92, X1, 5.92, G5, 0.5)
bl(s, RX9, 5.98, RW9, CB - 5.98, [(0, dummy(2)), (0, dummy(2)), (0, dummy(1))], size=9.5, anchor=MID)


prs.save(OUT)
print("saved", OUT, len(prs.slides), "slides")
