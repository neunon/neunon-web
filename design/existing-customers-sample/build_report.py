"""
既存顧客企業クローズアップ　サンプルレポート（表紙＋9ページ）を生成する。

テンプレート: Neunon Consulting の公式スライドテンプレート（ver3。サンプルの頁を除いたもの）。
ページの種類と並びは実際の納品物（顧客企業クローズアップ、提案書用材料_クローズアップ系）にならう。
本文はすべてダミー（「この文章はサンプルです。」）。社名・ブランド・商品も「A・B・C」のサンプル表記。
  事業A〜D（売上の区分）／ブランドA〜E／カテゴリA〜G（容器の種類）／チャネルA〜E／部門A-1〜E-3／出来事A〜G／テーマA〜D
  ページ間で記号と数字を揃える（例：商品ラインナップの「容器」＝既存取引との照合の行、組織図の赤＝アクションの対象部門）

レイアウトの決まり（全ページ共通）
  余白        左右 0.36in（テンプレートの罫線と同じ）。本文の領域は y 1.62〜6.82in。各段の下端は 6.82in に揃える
  段組        2段・3段・4段・5段の格子。段の間は 0.2〜0.45in で揃える
  文字        BIZ UDPゴシック。タイトル20pt／メッセージ14pt太字／節見出し11.5pt太字（中央＋罫線、段の中の小見出しも同じ型）／本文10pt／注8pt
  色          構造は灰（テンプレートの階調）。データは青灰の1系統。赤は「提案につながる事実」だけ。
              橙は組織図の「技術検討先」だけ。提案テーマは A〜D の丸印（同じ色）で全ページをつなぐ
  形          影・角丸・タグの飾りは使わない。罫線と灰のラベル、商品画像は全ページ同じ縮尺・同じ基準線
  グラフ      プロット領域を数値で固定し、棒の位置に合わせて注記・表の行を置く

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

CO = "サンプル化粧品株式会社"
CLIENT = "サンプル容器株式会社"
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
THEME = {"A": N6, "B": N5, "C": N4, "D": N1}   # 提案テーマの丸印（(8)(9) で共通）

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
    """items: (level, text[, color[, bold]])。赤の第1階層は太字"""
    paras = []
    for it in items:
        lvl, t = it[0], it[1]
        col = it[2] if len(it) > 2 else INK
        bold = it[3] if len(it) > 3 else (col == RED and lvl == 0)
        paras.append((t, {"level": lvl, "color": col, "bold": bold, "size": size if lvl == 0 else size - 0.5}))
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
    """節見出し：中央寄せの太字＋濃い灰の罫線（実際の納品物と同じ型）。罫線は y+0.34"""
    text(s, x, y, w, 0.3, [(t, {"size": 11.5, "bold": True})], align=C, anchor=BOT, line=1.0)
    line(s, x, y + 0.34, x + w, y + 0.34, G2, 0.75)


def label(s, x, y, w, h, t, size=10, bold=False):
    box(s, x, y, w, h, LABEL)
    text(s, x, y, w, h, [(t, {"size": size, "bold": bold})], align=C, anchor=MID, line=1.05, margin=0.04)


def badge(s, cx, cy, d, t, fill, fg=WHITE, size=None):
    """丸印（テーマ・出来事の記号）"""
    box(s, cx - d / 2, cy - d / 2, d, d, fill, None, shape=MSO_SHAPE.OVAL)
    text(s, cx - d / 2 - 0.05, cy - d / 2, d + 0.1, d, [(t, {"size": size or round(d * 34, 1), "bold": True, "color": fg})],
         align=C, anchor=MID, line=1.0)


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


# ------------------------------------------------------------------ グラフ
def plot_area(ch, frame, inner):
    """プロット領域（軸の内側）を frame 内の絶対位置で固定する。棒の位置を計算で出せるようにするため"""
    fx, fy, fw, fh = frame
    ix, iy, iw, ih = inner
    pa = ch._chartSpace.chart.plotArea
    lay = pa.find(qn("c:layout"))
    if lay is None:
        lay = etree.Element(qn("c:layout"))
        pa.insert(0, lay)
    for el in list(lay):
        lay.remove(el)
    ml = etree.SubElement(lay, qn("c:manualLayout"))
    for tag, val in (("c:layoutTarget", "inner"), ("c:xMode", "edge"), ("c:yMode", "edge"),
                     ("c:x", (ix - fx) / fw), ("c:y", (iy - fy) / fh), ("c:w", iw / fw), ("c:h", ih / fh)):
        etree.SubElement(ml, qn(tag)).set("val", val if isinstance(val, str) else f"{val:.5f}")


def bar_x(inner, n, i):
    """i 本目の棒の中心 x"""
    ix, _, iw, _ = inner
    return ix + (i + 0.5) * iw / n


def stacked(s, frame, inner, cats, series, colors, totals=None, pct=False, gap=55, ymax=None):
    d = CategoryChartData()
    d.categories = cats
    for nm, vals in series:
        d.add_series(nm, vals)
    if totals:
        d.add_series("合計", [0] * len(cats))
    kind = XL_CHART_TYPE.COLUMN_STACKED_100 if pct else XL_CHART_TYPE.COLUMN_STACKED
    fx, fy, fw, fh = frame
    ch = s.shapes.add_chart(kind, Inches(fx), Inches(fy), Inches(fw), Inches(fh), d).chart
    ch.has_title = False
    ch.has_legend = False
    set_font(ch.font, 9, None, G2)
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
                set_font(dl.text_frame.paragraphs[0].runs[0].font, 10.5, True, INK)
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
    if not pct:
        ch.value_axis.minimum_scale = 0
        ch.value_axis.maximum_scale = ymax
    ch.category_axis.format.line.color.rgb = G2
    ch.category_axis.format.line.width = Pt(0.75)
    set_font(ch.category_axis.tick_labels.font, 9.5, None, G2)
    plot_area(ch, frame, inner)
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


# ================================================================== 表紙（テンプレートの書体のまま）
cover = prs.slides.add_slide(next(l for l in prs.slide_layouts if l.name == "表紙"))
for ph in cover.placeholders:
    idx = ph.placeholder_format.idx
    if idx == 12:
        ph.text_frame.text = f"{CLIENT}　御中"
    elif idx == 11:
        ph.text_frame.text = f"{CO}　企業クローズアップ"
    elif idx == 13:
        ph.text_frame.text = f"{DATE}　（架空企業による分析サンプル）"


# ================================================================== (1) 会社概要
s = page("会社概要", dummy(3))
LW = 4.83                     # 2段：各 4.83in、段間 0.45in
RX = X0 + LW + 0.45
VX = 1.32                     # ラベル列（0.82in）の右の本文の開始位置
head(s, X0, CT, LW, "基本情報・業績")
label(s, X0, 2.08, 0.82, 2.62, "売上高")
legend_row(s, VX, 2.08, [(N1, "事業A"), (N2, "事業B"), (N4, "事業C"), (N6, "事業D")], gap=0.2)
text(s, X0 + LW - 1.0, 2.08, 1.0, 0.24, [("単位：億円", {"size": 8, "color": G3})], align=R, anchor=MID, line=1.0)
fr1 = (VX, 2.36, X0 + LW - VX, 2.34)
in1 = (VX, 2.6, X0 + LW - VX, 1.8)
stacked(s, fr1, in1, ["2023/3", "2024/3", "2025/3", "2026/3予"],
        [("事業D", (52, 55, 57, 60)), ("事業C", (64, 70, 78, 86)), ("事業B", (92, 95, 101, 112)), ("事業A", (131, 135, 143, 154))],
        [N6, N4, N2, N1], totals=["339", "355", "379", "412"], ymax=412 * 1.1)
label(s, X0, 4.78, 0.82, 0.4, "営業利益")
for i, (v, r) in enumerate([("18", "5.3%"), ("21", "5.9%"), ("24", "6.3%"), ("29", "7.0%")]):
    cx = bar_x(in1, 4, i)
    text(s, cx - 0.45, 4.78, 0.9, 0.4, [[(v, {"size": 10, "bold": True}), (f"（{r}）", {"size": 8, "color": G3})]], align=C, anchor=MID, line=1.0)
label(s, X0, 5.26, 0.82, 0.4, "従業員数")
text(s, VX, 5.26, LW - 0.96, 0.4, [("単体：○○○名、連結：○,○○○名（2026/3）", {"size": 10})], anchor=MID)
label(s, X0, 5.74, 0.82, CB - 5.74, "事業概要\n経営動向")
bl(s, VX, 5.74, LW - 0.96, CB - 5.74, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2), RED), (0, dummy(2))], size=9.5, anchor=MID)

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
head(s, RX, 4.44, LW, "主な関連会社")
for i, (nm, pct) in enumerate([("関連会社A", "○○%"), ("関連会社B", "○○%"), ("関連会社C", "○○%")]):
    y = 4.86 + i * 0.38
    text(s, RX + 0.06, y, 1.2, 0.38, [(nm, {"size": 9.5, "bold": True})], anchor=MID, line=1.0)
    text(s, RX + 1.3, y, 2.5, 0.38, [(dummy(1), {"size": 9.5, "color": G2})], anchor=MID, line=1.0)
    text(s, X1 - 1.0, y, 0.94, 0.38, [[("出資 ", {"size": 8, "color": G3}), (pct, {"size": 9.5})]], align=R, anchor=MID, line=1.0)
    line(s, RX, y + 0.38, X1, y + 0.38, G5, 0.5)
box(s, RX, 6.16, LW, CB - 6.16, PANEL)
text(s, RX + 0.14, 6.16, LW - 0.28, CB - 6.16, [("提案の着眼点", {"size": 9, "bold": True}), (dummy(2), {"size": 9.5, "color": RED, "space": 2})],
     anchor=MID, line=1.05)


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
    text(s, x + 0.14, nb, nw - 0.28, CB - nb, [(head_t, {"size": 9, "bold": True, "color": col}), (dummy(1), {"size": 9, "color": G2, "space": 1})],
         anchor=MID, line=1.1)


# ================================================================== (3) 販売チャネル
s = page("販売チャネル", dummy(3))
LW3 = 5.9
head(s, X0, CT, LW3, "チャネル別売上構成比の推移")
legend_row(s, X0, 2.06, [(N1, "チャネルA"), (N2, "チャネルB"), (N3, "チャネルC"), (N5, "チャネルD"), (N6, "チャネルE")], gap=0.14)
fr3 = (X0, 2.34, LW3, CB - 2.34)
in3 = (X0 + 0.04, 2.42, LW3 - 0.8, 4.08)
mix = [("チャネルE", (4, 4, 5, 5, 6)), ("チャネルD", (11, 10, 10, 9, 9)), ("チャネルC", (7, 9, 11, 13, 16)),
       ("チャネルB", (15, 14, 14, 13, 13)), ("チャネルA", (63, 63, 60, 60, 56))]
stacked(s, fr3, in3, ["2022/3", "2023/3", "2024/3", "2025/3", "2026/3予"], mix, [N6, N5, N3, N2, N1], pct=True, gap=45)
# 伸びているチャネルC（最後の棒）に括弧で差を添える
ix3, iy3, iw3, ih3 = in3
bw3 = iw3 / 5 / 1.45
edge = bar_x(in3, 5, 4) + bw3 / 2
lo, hi = 0.15, 0.31                       # 2026/3予のチャネルCは 15%〜31% の位置
ylo, yhi = iy3 + ih3 * (1 - lo), iy3 + ih3 * (1 - hi)
bx3 = edge + 0.08
line(s, bx3, yhi + 0.02, bx3, ylo - 0.02, RED, 1.0)
line(s, bx3 - 0.05, yhi + 0.02, bx3, yhi + 0.02, RED, 1.0)
line(s, bx3 - 0.05, ylo - 0.02, bx3, ylo - 0.02, RED, 1.0)
text(s, bx3 + 0.08, (yhi + ylo) / 2 - 0.25, X0 + LW3 - bx3 - 0.08, 0.5,
     [("チャネルC", {"size": 8, "color": RED}), ("＋9pt", {"size": 11, "bold": True, "color": RED})], anchor=MID, line=1.05)
RX3 = X0 + LW3 + 0.3
RW3 = X1 - RX3
head(s, RX3, CT, RW3, "販売チャネルの特徴・戦略")
blocks = [("チャネルA", "63% → 56%", INK), ("チャネルC", "7% → 16%", RED), ("チャネルE", "4% → 6%", INK)]
bh = (CB - 2.08) / 3
for i, (nm, chg, col) in enumerate(blocks):
    by = 2.08 + i * bh
    text(s, RX3, by, RW3 * 0.4, 0.34, [(nm, {"size": 10.5, "bold": True, "color": col})], anchor=MID, line=1.0)
    text(s, RX3 + RW3 * 0.3, by, RW3 * 0.7, 0.34, [[("構成比 2022→2026予　", {"size": 8, "color": G3}), (chg, {"size": 10.5, "bold": True, "color": col})]],
         align=R, anchor=MID, line=1.0)
    line(s, RX3, by + 0.38, X1, by + 0.38, G5, 0.5)
    bl(s, RX3, by + 0.48, RW3, bh - 0.58, [(0, dummy(2), col), (1, dummy(1)), (0, dummy(2)), (1, dummy(1))], size=9.5)


# ================================================================== (4) 商品ラインナップ
s = page("商品ラインナップ", dummy(3), "この文章はサンプルです。　注：価格は税込。容器のカテゴリは (7) の列と同じ")
cw4 = (W - 3 * 0.2) / 4
groups = [["minamo-lotion", "minamo-milk", "minamo-cream"], ["classica-lotion", "classica-serum", "classica-cream"],
          ["refre-shampoo", "refre-treatment", "refre-refill"], ["harenohi-tube", "harenohi-spray", "harenohi-stick"]]
k = fit_scale(groups, [cw4 - 0.24] * 4, 2.2)
base4 = 3.56 + (2.72 + k * max(px(n)[1] for g in groups for n in g)) / 2 - 0.02   # 面（3.56〜6.28）の上下中央
# ブランド, 事業, 商品数, 販路, 容器（(7) の当社・他社の区画と一致）, 容器接点（0〜3）
meta = [("A", "事業A", 4, "チャネルA・C", "カテゴリA・B・D", 3, "大"), ("B", "事業A", 3, "チャネルB・D", "カテゴリA〜D", 1, "小"),
        ("C", "事業B", 3, "チャネルA・B", "カテゴリA・B・F", 3, "大"), ("D", "事業C", 3, "チャネルA・E", "カテゴリE", 2, "中")]
for i, (b, biz, n_, chs, cats, touch, tl) in enumerate(meta):
    x = X0 + i * (cw4 + 0.2)
    head(s, x, CT, cw4, f"ブランド{b}（{biz}）")
    bl(s, x, 2.06, cw4, 1.74, [(0, f"主な商品：商品{b}-1〜{b}-{n_}"), (0, "価格帯：○,○○○〜○,○○○円"),
                                (0, f"主な販路：{chs}"), (0, f"容器：{cats}"),
                                (0, dummy(1)), (1, dummy(1), RED if touch == 3 else INK)], size=9.5)
    box(s, x, 3.56, cw4, 2.72, PANEL)
    products(s, groups[i], x + 0.12, cw4 - 0.24, base4, k)
    text(s, x, 6.38, cw4 * 0.6, 0.44, [("売上（2026/3予）", {"size": 8, "color": G3}), (f"○○億円", {"size": 11, "bold": True, "space": 0})],
         anchor=MID, line=1.0)
    text(s, x + cw4 * 0.4, 6.38, cw4 * 0.6, 0.2, [("容器の接点", {"size": 8, "color": G3})], align=R, anchor=MID, line=1.0)
    text(s, X0 + i * (cw4 + 0.2) + cw4 - 0.26, 6.58, 0.26, 0.24, [(tl, {"size": 11, "bold": True})], align=R, anchor=MID, line=1.0)
    for d_ in range(3):
        dx = x + cw4 - 0.36 - (2 - d_) * 0.19
        box(s, dx - 0.07, 6.7 - 0.07, 0.14, 0.14, N6 if d_ < touch else WHITE, None if d_ < touch else G4, 0.75, shape=MSO_SHAPE.OVAL)


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
head(s, RX5, CT, RW5, "商品画像")
box(s, RX5, 2.08, RW5, 2.56, PANEL)
line_a = ["minamo-lotion", "minamo-milk", "minamo-serum", "minamo-cream"]
k5s = fit_scale([line_a], [RW5 - 0.6], 2.12)
products(s, line_a, RX5 + 0.3, RW5 - 0.6, 4.44, k5s, gap=0.14)
text(s, RX5, 4.68, RW5, 0.24, [(dummy(1), {"size": 8.5, "color": G3})], align=C, anchor=MID, line=1.0)
head(s, RX5, 5.0, RW5, "提案・連携余地")
bl(s, RX5, 5.44, RW5, CB - 5.44, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2), RED), (1, dummy(1)), (0, dummy(2)), (1, dummy(1))], size=9.5)


# ================================================================== (6) 直近の事業動向
s = page("直近の事業動向", dummy(3), "この文章はサンプルです。　注：赤は提案に関わる出来事")
ev = [("2024/5", "戦略", "A", True, "中期経営計画"), ("2024/11", "商品", "B", False, "プレスリリース"), ("2025/3", "投資", "C", False, "業界紙"),
      ("2025/10", "海外", "D", True, "プレスリリース"), ("2026/3予", "商品", "E", True, "求人情報"), ("2026/4", "組織", "F", False, "人事発表"),
      ("2026/6", "商品", "G", True, "プレスリリース")]


def tx(ym):
    y, m = ym.replace("予", "").split("/")
    return X0 + W * ((int(y) - 2024) * 12 + int(m) - 0.5) / 36


ax = 2.24
for kk, yr in enumerate((2024, 2025, 2026)):
    box(s, X0 + kk * W / 3, CT, W / 3, 0.26, LABEL, WHITE, 1.0)
    text(s, X0 + kk * W / 3, CT, W / 3, 0.26, [(f"{yr}年", {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
    if kk:
        line(s, X0 + kk * W / 3, CT + 0.26, X0 + kk * W / 3, 2.58, G5, 0.5)
line(s, X0, ax, X1, ax, G2, 1.0)
for q in range(1, 12):
    if q % 4:
        xq = X0 + W * q / 12
        line(s, xq, ax - 0.04, xq, ax + 0.04, G4, 0.5)
for i, (ym, _, e, hot, _) in enumerate(ev):
    xx = tx(ym)
    badge(s, xx, ax, 0.22, e, RED if hot else N4, size=8)
    up = i % 2 == 0
    text(s, xx - 0.45, ax - 0.36 if up else ax + 0.15, 0.9, 0.21, [(ym, {"size": 8.5, "bold": True, "color": RED if hot else G2})],
         align=C, anchor=MID, line=1.0)
widths = [0.85, 0.65, 1.55, 3.05, 2.71, 1.3]
heads6 = ["時期", "区分", "出来事", "内容", "提案への影響", "出所"]
ty = 2.72
x = X0
for j, h in enumerate(heads6):
    box(s, x, ty, widths[j], 0.32, LABEL, WHITE, 1.0)
    text(s, x, ty, widths[j], 0.32, [(h, {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
    x += widths[j]
rh = (CB - ty - 0.32) / len(ev)
y = ty + 0.32
for n_, (ym, kind, e, hot, src) in enumerate(ev):
    x = X0
    vals = [ym, kind, f"出来事{e}", dummy(2), S + "\n" + S, src]
    for j, v in enumerate(vals):
        red = hot and j in (2, 4)
        if j == 2:
            badge(s, x + 0.2, y + rh / 2, 0.22, e, RED if hot else N4, size=8)
            text(s, x + 0.4, y, widths[j] - 0.44, rh, [(v, {"size": 9.5, "bold": red, "color": RED if red else INK})], anchor=MID, line=1.0)
        else:
            text(s, x + (0.1 if j >= 2 else 0), y, widths[j] - (0.2 if j >= 2 else 0), rh,
                 [(ln_, {"size": 9.5 if j < 3 or j == 5 else 9, "bold": red, "color": RED if red else INK}) for ln_ in v.split("\n")],
                 align=C if j < 2 else L, anchor=MID, line=1.08)
        x += widths[j]
    last = n_ == len(ev) - 1
    line(s, X0, y + rh, X1, y + rh, G2 if last else G5, 0.75 if last else 0.5)
    y += rh


# ================================================================== (7) 既存取引との照合
s = page("既存取引との照合", dummy(3), "この文章はサンプルです。　注：他社は公開情報からの推定。カテゴリは容器の種類")
cols7 = [f"カテゴリ{c}" for c in "ABCDEFG"]
rows7 = ["ブランドA", "ブランドB", "ブランドC", "ブランドD", "ブランドE", "その他・新規"]
ST = {"T": ("当社取引中", N5, WHITE), "O": ("他社（推定）", N1, INK), "N": ("新規発生", WHITE, RED), "U": ("要確認", WHITE, G2), "-": ("−", WHITE, G4)}
g7 = [["T", "O", "N", "O", "-", "U", "-"], ["O", "O", "O", "O", "-", "-", "-"], ["T", "O", "-", "-", "-", "O", "-"],
      ["-", "-", "-", "-", "O", "-", "N"], ["O", "O", "-", "-", "O", "O", "-"], ["N", "N", "U", "U", "N", "U", "-"]]
n7 = [["商品A-1", "", "2026/3〜", "", "", "", ""], ["", "", "", "", "", "", ""], ["商品C-1", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "2026/6〜"], ["", "", "", "", "", "", ""], ["2026/10〜", "2026/10〜", "", "", "2026/10〜", "", ""]]
lw7, cw7, hh7 = 1.25, 0.98, 0.38
rh7 = 0.74
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
ly = gb + 0.13
lx = gx
for st in ("T", "O", "N", "U"):
    nm, fill, fg = ST[st]
    box(s, lx, ly + 0.05, 0.26, 0.15, fill, RED if st == "N" else G4, 1.0, dash=st == "N")
    text(s, lx + 0.33, ly, 1.1, 0.25, [(nm, {"size": 9, "color": G2})], anchor=MID, line=1.0)
    lx += 1.45
RX7 = gx + lw7 + 7 * cw7 + 0.3
RW7 = X1 - RX7
head(s, RX7, CT, RW7, "区画の数")
cnt = {k_: sum(r.count(k_) for r in g7) for k_ in "TONU"}
counts = [("当社取引中", cnt["T"], N5), ("他社（推定）", cnt["O"], G2), ("新規発生", cnt["N"], RED), ("要確認", cnt["U"], G2)]
for i, (lab_, num, col) in enumerate(counts):
    y = 2.06 + i * 0.66
    text(s, RX7, y, RW7 * 0.6, 0.54, [(lab_, {"size": 9, "color": G2})], anchor=MID, line=1.0)
    text(s, RX7 + RW7 * 0.4, y, RW7 * 0.6, 0.54, [[(str(num), {"size": 20, "bold": True, "color": col}), (" 区画", {"size": 8.5, "color": G2})]],
         align=R, anchor=MID, line=1.0)
    line(s, RX7, y + 0.6, X1, y + 0.6, G5, 0.5)
head(s, RX7, 4.86, RW7, "未確認事項")
bl(s, RX7, 5.3, RW7, CB - 5.3, [(0, dummy(1), RED), (0, dummy(1)), (0, dummy(1)), (0, dummy(1)), (0, dummy(1))], size=9.5)


# ================================================================== (8) 提案・連携余地
s = page("提案・連携余地", dummy(3))
themes = [("A", ["minamo-serum", "minamo-milk"]), ("B", ["refre-shampoo", "refre-refill"]), ("C", ["harenohi-tube", "harenohi-stick"])]
c8 = [(X0, 2.2, "提案テーマ"), (X0 + 2.4, 3.55, "根拠となる事実"), (X0 + 6.15, 2.45, "提案の切り口"), (X1 - 1.31, 1.31, "対象商品")]
for x, w, h in c8:
    head(s, x, CT, w, h)
top8 = CT + 0.46
rh8 = (CB - top8) / 3
k8 = fit_scale([t_[1] for t_ in themes], [1.1] * 3, rh8 - 0.36)
for i, (a, pics) in enumerate(themes):
    y = top8 + i * rh8
    box(s, X0, y + 0.08, 2.2, rh8 - 0.16, LABEL)
    badge(s, X0 + 0.37, y + rh8 / 2, 0.42, a, THEME[a], size=13)
    text(s, X0 + 0.7, y + 0.08, 1.46, rh8 - 0.16, [(f"テーマ{a}", {"size": 12, "bold": True}), (dummy(1), {"size": 8.5, "color": G2, "space": 3})],
         anchor=MID, line=1.12)
    bl(s, X0 + 2.4, y + 0.08, 3.55, rh8 - 0.16, [(0, dummy(2)), (1, dummy(1)), (0, dummy(2), RED)], size=9.5, anchor=MID)
    bl(s, X0 + 6.15, y + 0.08, 2.45, rh8 - 0.16, [(0, dummy(1), INK, True), (0, dummy(1)), (1, dummy(1))], size=9.5, anchor=MID)
    box(s, X1 - 1.31, y + 0.08, 1.31, rh8 - 0.16, PANEL)
    products(s, pics, X1 - 1.31 + 0.1, 1.11, y + rh8 - 0.2, k8, gap=0.05)
    if i < 2:
        line(s, X0, y + rh8, X1, y + rh8, G4, 0.75, dash=True)


# ================================================================== (9) 優先順位と営業アクション
s = page("優先順位と営業アクション", dummy(3), "この文章はサンプルです。　注：確度・規模は公開情報と取引実績からの見立て")
LW9 = 3.95
head(s, X0, CT, LW9, "提案テーマの優先順位")
mx9, my9 = X0 + 0.4, 2.1
mw9, mh9 = X0 + LW9 - mx9, 4.0
box(s, mx9, my9, mw9, mh9, WHITE, G2, 0.75)
box(s, mx9 + mw9 / 2, my9, mw9 / 2, mh9 / 2, PANEL)
line(s, mx9 + mw9 / 2, my9, mx9 + mw9 / 2, my9 + mh9, G4, 0.75, dash=True)
line(s, mx9, my9 + mh9 / 2, mx9 + mw9, my9 + mh9 / 2, G4, 0.75, dash=True)
text(s, mx9 + mw9 / 2, my9 + 0.06, mw9 / 2 - 0.08, 0.24, [("優先して着手", {"size": 8.5, "bold": True, "color": G2})], align=R, line=1.0)
# 縦軸：規模、横軸：確度
text(s, X0, my9, 0.3, 0.24, [("大", {"size": 8.5, "color": G2})], align=C, anchor=MID, line=1.0)
text(s, X0, my9 + mh9 / 2 - 0.3, 0.3, 0.6, [("規", {"size": 9, "bold": True, "color": G2}), ("模", {"size": 9, "bold": True, "color": G2})],
     align=C, anchor=MID, line=1.0)
text(s, X0, my9 + mh9 - 0.24, 0.3, 0.24, [("小", {"size": 8.5, "color": G2})], align=C, anchor=MID, line=1.0)
text(s, mx9, my9 + mh9 + 0.04, 0.4, 0.22, [("低", {"size": 8.5, "color": G2})], anchor=MID, line=1.0)
text(s, mx9, my9 + mh9 + 0.04, mw9, 0.22, [("確度", {"size": 9, "bold": True, "color": G2})], align=C, anchor=MID, line=1.0)
text(s, mx9 + mw9 - 0.4, my9 + mh9 + 0.04, 0.4, 0.22, [("高", {"size": 8.5, "color": G2})], align=R, anchor=MID, line=1.0)
text(s, X0, CB - 0.26, LW9, 0.26, [("円の大きさは想定される取引の規模", {"size": 8, "color": G3})], align=R, anchor=MID, line=1.0)
for a, cxp, cyp, rr in [("A", 0.8, 0.17, 0.34), ("B", 0.62, 0.36, 0.27), ("C", 0.34, 0.58, 0.23), ("D", 0.2, 0.82, 0.17)]:
    bx, by_ = mx9 + mw9 * cxp, my9 + mh9 * cyp
    badge(s, bx, by_, rr * 2, a, THEME[a], WHITE if a != "D" else INK, size=12)
    text(s, bx - 0.8, by_ + rr + 0.03, 1.6, 0.2, [(f"テーマ{a}" + ("（見送り）" if a == "D" else ""), {"size": 8.5, "color": G2})],
         align=C, anchor=MID, line=1.0)
RX9 = X0 + LW9 + 0.35
RW9 = X1 - RX9
head(s, RX9, CT, RW9, "アクションプラン")
w9 = [1.1, 1.2, 2.26, 1.25]
hdr9 = ["テーマ", "対象部門", "商談で確認すること", "次のアクション"]
y = 2.08
x = RX9
for j, h in enumerate(hdr9):
    box(s, x, y, w9[j], 0.32, LABEL, WHITE, 1.0)
    text(s, x, y, w9[j], 0.32, [(h, {"size": 9.5, "bold": True})], align=C, anchor=MID, line=1.0)
    x += w9[j]
y += 0.32
acts = [("A", "部門B-2", S + "\n" + S, "○月：初回訪問"), ("B", "部門C-1", S + "\n" + S, "○月：サンプル提出"), ("C", "部門D-2", S + "\n" + S, "○月：方針の確認")]
for i, (a, dept, q, nxt) in enumerate(acts):
    if i == 0:
        box(s, RX9, y, RW9, 1.0, PANEL)
    badge(s, RX9 + 0.22, y + 0.5, 0.3, a, THEME[a], size=10)
    text(s, RX9 + 0.44, y, w9[0] - 0.48, 1.0, [(f"テーマ{a}", {"size": 9.5, "bold": True})], anchor=MID, line=1.0)
    x = RX9 + w9[0]
    for j, v in enumerate((dept, q, nxt), start=1):
        text(s, x + 0.08, y, w9[j] - 0.14, 1.0, [(ln_, {"size": 9.5, "bold": j == 3}) for ln_ in v.split("\n")], anchor=MID, line=1.1)
        x += w9[j]
    line(s, RX9, y + 1.0, X1, y + 1.0, G5 if i < 2 else G2, 0.5 if i < 2 else 0.75)
    y += 1.0
head(s, RX9, 5.52, RW9, "初回訪問で持ち込むもの")
bl(s, RX9, 5.96, RW9, CB - 5.96, [(0, dummy(2)), (0, dummy(2)), (0, dummy(1))], size=9.5, anchor=MID)


prs.save(OUT)
print("saved", OUT, len(prs.slides), "slides")
