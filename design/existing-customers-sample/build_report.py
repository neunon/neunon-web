"""
既存顧客企業クローズアップ　分析レポートのサンプル（表紙＋8ページ）を生成する。

実際の納品物（顧客企業クローズアップ ver1〜8、提案書用材料_クローズアップ系）と同じ作り方にする:
  公式テンプレート（ver3）／タイトル「社名（n）　章名」＋メッセージ1〜2行／中央の節見出しと罫線／
  灰色のラベル列＋■と–の箇条書き／赤字は提案につながる事実／橙字は技術検討先／商品画像／注・出所。

設定（すべて架空）:
  分析対象  サンプル化粧品株式会社 … 大阪の中堅化粧品・日用品メーカー（非上場）
  依頼元    サンプル容器株式会社   … プラスチック容器メーカー（ボトル・ポンプ・ジャー・エアレス・パウチ）
  ブランド  ミナモ（敏感肌スキンケア）／クラシカ（高価格スキンケア）／ハレノヒ（UV）／ルフレ（ヘアケア）
数値は各ページで整合させている（事業別の合計＝売上、ブランド別の合計＝売上、伸び率＝数値から計算）。

実行: py design/existing-customers-sample/build_report.py
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
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

COMPANY = "サンプル化粧品株式会社"
CLIENT = "サンプル容器株式会社"
DATE = "2026/10/22"

INK = RGBColor(0x00, 0x00, 0x00)
G1 = RGBColor(0x40, 0x40, 0x40)
G2 = RGBColor(0x59, 0x59, 0x59)
G3 = RGBColor(0x7F, 0x7F, 0x7F)
G5 = RGBColor(0xBF, 0xBF, 0xBF)
LABEL = RGBColor(0xE7, 0xE6, 0xE6)
PANEL = RGBColor(0xF2, 0xF2, 0xF2)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RED = RGBColor(0xE0, 0x00, 0x00)
ORANGE = RGBColor(0xED, 0x7D, 0x31)
# 実物のグラフと同じ、淡い青灰の階調
C1 = RGBColor(0xDE, 0xE6, 0xF0)
C2 = RGBColor(0xB9, 0xC9, 0xDE)
C3 = RGBColor(0x8F, 0xA8, 0xC8)
C4 = RGBColor(0x5B, 0x76, 0x9C)
C5 = RGBColor(0x33, 0x45, 0x63)

prs = Presentation(TEMPLATE)
LAYOUT = next(l for l in prs.slide_layouts if l.name == "タイトル")
L, C, R = PP_ALIGN.LEFT, PP_ALIGN.CENTER, PP_ALIGN.RIGHT
TOP, MID = MSO_ANCHOR.TOP, MSO_ANCHOR.MIDDLE


# ------------------------------------------------------------------ 部品
def style_run(run, size=10, bold=False, color=INK):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color


def set_bullet(p, level):
    ppr = p._p.get_or_add_pPr()
    ppr.set("marL", str(Inches(0.17 if level == 0 else 0.34)))
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


def text(s, x, y, w, h, paras, size=10, align=L, anchor=TOP, line=1.0, margin=0.03):
    """paras: [str | (str, opts) | [(str, opts), ...]]  opts: size/bold/color/level/space"""
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
            style_run(run, o.get("size", size), o.get("bold", False), o.get("color", INK))
        if level is not None:
            set_bullet(p, level)
        else:
            no_bullet(p)
        if space is not None:
            p.space_before = Pt(space)
        elif level is not None:
            p.space_before = Pt(3 if level == 0 else 0.5)
    return tb


def bl(s, x, y, w, h, items, size=9.5, line=1.0):
    """items: (level, text[, color[, bold]])"""
    paras = []
    for it in items:
        level, t = it[0], it[1]
        color = it[2] if len(it) > 2 else INK
        bold = it[3] if len(it) > 3 else False
        paras.append((t, {"level": level, "color": color, "bold": bold, "size": size if level == 0 else size - 0.5}))
    return text(s, x, y, w, h, paras, size=size, line=line)


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


def line(s, x1, y1, x2, y2, color=G3, weight=0.75, dash=False):
    ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def head(s, x, y, w, t):
    """節見出し：中央寄せの太字＋灰の罫線（実物と同じ）"""
    text(s, x, y, w, 0.3, [(t, {"size": 12, "bold": False})], align=C, anchor=MSO_ANCHOR.BOTTOM)
    line(s, x, y + 0.33, x + w, y + 0.33, G3, 1.0)


def lab(s, x, y, w, h, t, size=10):
    """灰色のラベル列"""
    box(s, x, y, w, h, LABEL, G5, 0.5)
    text(s, x, y, w, h, [(t, {"size": size})], align=C, anchor=MID, line=1.0)


def pic(s, name, x, bottom, h=None, w=None):
    im = Image.open(PACK / f"{name}.png")
    ratio = im.width / im.height
    if h is None:
        h = w / ratio
    if w is None:
        w = h * ratio
    s.shapes.add_picture(str(PACK / f"{name}.png"), Inches(x), Inches(bottom - h), Inches(w), Inches(h))
    return w


def pics_row(s, names, x, bottom, width, max_h, gap=0.08):
    """商品画像を横に並べる。画素の高さは描画時の実寸比なので、その比を保って縮める"""
    sizes = [Image.open(PACK / f"{n}.png").size for n in names]
    tallest = max(h for _, h in sizes)
    k = max_h / tallest
    total = sum(w for w, _ in sizes) * k + gap * (len(names) - 1)
    if total > width:
        k *= (width - gap * (len(names) - 1)) / (total - gap * (len(names) - 1))
        total = width
    cx = x + (width - total) / 2
    for n, (w, h) in zip(names, sizes):
        pic(s, n, cx, bottom, h=h * k, w=w * k)
        cx += w * k + gap


def callout(s, x, y, w, h, t, size=8.5):
    box(s, x, y, w, h, PANEL, G3, 0.75, shape=MSO_SHAPE.RECTANGLE)
    text(s, x, y, w, h, [(t, {"size": size})], align=L, anchor=MID, margin=0.05)


def grid(s, x, y, widths, rows, row_h, size=9, head_fill=LABEL, aligns=None, colors=None, heights=None):
    """表。rows[0] は見出し。colors: {(i, j): RGB}"""
    colors = colors or {}
    yy = y
    for i, row in enumerate(rows):
        rh = heights[i] if heights else row_h
        cx = x
        for j, val in enumerate(row):
            w = widths[j]
            if i == 0:
                box(s, cx, yy, w, rh, head_fill, G5, 0.5)
            else:
                box(s, cx, yy, w, rh, WHITE, G5, 0.5)
            a = aligns[j] if aligns else L
            col = colors.get((i, j), INK)
            text(s, cx, yy, w, rh, [(val, {"size": size, "bold": i == 0 or col == RED, "color": col})],
                 align=C if i == 0 else a, anchor=MID, margin=0.06, line=1.0)
            cx += w
        yy += rh
    return yy


def style_chart(ch, size=9):
    ch.has_title = False
    ch.has_legend = False
    ch.font.size = Pt(size)


def legend_v(s, x, y, entries, size=9, step=0.24):
    for i, (color, name) in enumerate(entries):
        box(s, x, y + i * step + 0.05, 0.2, 0.14, color, G3, 0.5)
        text(s, x + 0.26, y + i * step, 1.4, 0.24, [(name, {"size": size})], anchor=MID, margin=0)


PAGE_NO = [0]


def page(title, message, source, note=None):
    PAGE_NO[0] += 1
    n = PAGE_NO[0]
    s = prs.slides.add_slide(LAYOUT)
    for ph in list(s.placeholders):
        if ph.placeholder_format.idx == 1:
            ph._element.getparent().remove(ph._element)
    s.shapes.title.text = f"{COMPANY}（{n}）　{title}"
    for r in s.shapes.title.text_frame.paragraphs[0].runs:
        style_run(r, 20, False, INK)
    text(s, 0.36, 0.97, 10.11, 0.5, [(message, {"size": 14, "bold": True})], align=C, anchor=MID, line=1.0)
    # 架空であることの表示（実物の「ボリューム」札の位置）
    box(s, 9.12, 0.03, 1.36, 0.24, WHITE, G1, 0.75)
    text(s, 9.12, 0.03, 1.36, 0.24, [("架空企業のサンプル", {"size": 8.5})], align=C, anchor=MID, margin=0)
    text(s, 1.7, 7.27, 1.0, 0.27, [(DATE, {"size": 9})], anchor=MID)
    text(s, 9.6, 7.29, 0.85, 0.24, [(f"- {n} -", {"size": 9})], align=R)
    foot = [("出所：", {"size": 8, "color": G1}), (source, {"size": 8, "color": G1})]
    if note:
        foot += [("　　注：", {"size": 8, "color": G1}), (note, {"size": 8, "color": G1})]
    text(s, 0.36, 6.98, 10.1, 0.27, [foot], anchor=MID)
    return s


SRC_FICTION = "（いずれも想定）。社名・ブランド名・商品名・数値はすべて架空"

# ============================================================ (1) 会社概要
s = page("会社概要",
         "敏感肌スキンケアとUVが成長をけん引し、3年で売上は約2割増\n中期経営計画でプラスチック削減と海外生産を柱に据える",
         "会社案内、決算公告、中期経営計画「2028」、プレスリリース" + SRC_FICTION,
         "*1. 2026/3期は会社予想")
head(s, 0.36, 1.5, 4.95, "基本情報・業績")
lab(s, 0.36, 1.95, 0.72, 2.62, "売上/\n利益")
d = CategoryChartData()
d.categories = ["2023/3", "2024/3", "2025/3", "2026/3予*1"]
seg = [("その他（受託）", (38, 36, 34, 33), C5), ("UV・ボディ", (41, 48, 55, 63), C4), ("ヘアケア", (92, 95, 101, 112), C2),
       ("スキンケア", (168, 176, 189, 204), C1)]
for name, vals, _ in seg:
    d.add_series(name, vals)
d.add_series("合計", (0, 0, 0, 0))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(1.1), Inches(2.05), Inches(3.05), Inches(2.25), d).chart
style_chart(ch, 8)
ch.plots[0].gap_width = 55
ch.plots[0].overlap = 100
for i, ser in enumerate(ch.plots[0].series):
    if i == 4:
        ser.format.fill.background()
        ser.format.line.fill.background()
        for j, tot in enumerate((339, 355, 379, 412)):
            dl = ser.points[j].data_label
            dl.has_text_frame = True
            dl.text_frame.text = str(tot)
            dl.position = XL_LABEL_POSITION.INSIDE_BASE
            style_run(dl.text_frame.paragraphs[0].runs[0], 9, True, INK)
        continue
    fill = seg[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = G3
    ser.format.line.width = Pt(0.5)
    ser.data_labels.show_value = True
    ser.data_labels.position = XL_LABEL_POSITION.CENTER
    ser.data_labels.font.size = Pt(8)
    ser.data_labels.font.color.rgb = WHITE if fill in (C4, C5) else INK
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.maximum_scale = 460
ch.category_axis.tick_labels.font.size = Pt(8)
text(s, 1.12, 1.97, 1.0, 0.2, [("単位：億円", {"size": 8})], margin=0)
legend_v(s, 4.2, 2.1, [(C1, "スキンケア"), (C2, "ヘアケア"), (C4, "UV・ボディ"), (C5, "その他（受託）")], size=8, step=0.22)
text(s, 1.12, 4.28, 3.1, 0.28, [[("営業利益　", {"size": 8.5, "bold": True}), ("20 → 22 → 25 → 29億円（利益率 5.9% → 7.0%）", {"size": 8.5})]], anchor=MID, margin=0)
lab(s, 0.36, 4.62, 0.72, 0.36, "従業員数")
text(s, 1.15, 4.62, 4.1, 0.36, [("単体：760名、連結：1,180名（2026/3）", {"size": 9.5})], anchor=MID)
lab(s, 0.36, 5.03, 0.72, 1.88, "事業概要\n経営動向")
bl(s, 1.12, 5.02, 4.2, 1.9, [
    (0, "化粧品・医薬部外品の企画・研究開発から製造・販売まで一貫（大阪本社、滋賀・茨城に工場）"),
    (1, "スキンケアが売上の約5割。敏感肌の「ミナモ」が最大ブランド"),
    (0, "中計「2028」（2024/5公表）：売上500億円、海外比率10%、容器のプラスチック使用量を2030年に30%削減", RED),
    (0, "2025/10にタイ子会社を設立し、2026/10に現地生産を開始予定"),
], size=9)

head(s, 5.55, 1.5, 4.92, "グループ組織図")
box(s, 6.75, 1.98, 2.5, 0.42, WHITE, G1, 1.0)
text(s, 6.75, 1.98, 2.5, 0.42, [(COMPANY, {"size": 10.5, "bold": True})], align=C, anchor=MID)
text(s, 6.75, 2.42, 2.5, 0.22, [("非上場（創業家が過半を保有）", {"size": 8})], align=C, margin=0)
line(s, 8.0, 2.64, 8.0, 2.82)
line(s, 6.4, 2.82, 9.6, 2.82)
kids = [("サンプルファクトリー㈱", "製造（滋賀工場・茨城工場）", "100%"), ("サンプル化粧品販売㈱", "百貨店・専門店向け販売", "100%"),
        ("SAMPLE COSMETICS\n(THAILAND) Co., Ltd.", "2025/10設立、2026/10生産開始予定", "70%")]
for i, (nm, role, pct) in enumerate(kids):
    x = 5.6 + i * 1.62
    line(s, x + 0.78, 2.82, x + 0.78, 3.1)
    text(s, x + 0.82, 2.84, 0.6, 0.22, [(pct, {"size": 8})], margin=0)
    box(s, x, 3.1, 1.56, 0.92, WHITE, G1, 0.75)
    text(s, x, 3.1, 1.56, 0.92, [(nm, {"size": 8.5, "bold": True, "color": RED if i == 2 else INK}), (role, {"size": 7.5, "space": 2})],
         align=C, anchor=MID, margin=0.04)
rel = [("㈱サンプルロジ\n出荷・保管", "……非連結子会社、2019年設立"), ("関連会社 ㈱Y\nOEM受託の製造", "……持分法適用、出資比率30%"),
       ("サンプル化粧品（上海）\n輸入販売", "……連結子会社、2026/3期に縮小方針")]
for i, (nm, note) in enumerate(rel):
    y = 4.35 + i * 0.66
    box(s, 5.6, y, 1.85, 0.54, WHITE, G1, 0.75)
    text(s, 5.6, y, 1.85, 0.54, [(nm, {"size": 8})], align=C, anchor=MID, margin=0.03)
    text(s, 7.52, y, 2.95, 0.54, [(note, {"size": 8})], anchor=MID, margin=0)
text(s, 5.55, 6.38, 4.92, 0.5, [("容器・資材の調達は本社の購買部が一括して担う（求人情報より推定）。タイ子会社の調達方針は未公表", {"size": 8.5, "color": RED})],
     anchor=MID)


# ============================================================ (2) 主要組織図
s = page("主要組織図",
         "2026/4にパッケージ開発部を新設し、容器の企画・仕様決定を商品開発から切り出した",
         "公式サイト、組織改正・人事異動の発表、求人情報" + SRC_FICTION,
         "2026/10時点の公開情報を提案活動の観点で整理した参考図（正式な組織図ではない）")
text(s, 0.36, 1.48, 3.2, 0.24, [("赤太字：実際の提案の起点・実務窓口", {"size": 9, "bold": True, "color": RED})], margin=0)
text(s, 0.36, 1.7, 3.2, 0.24, [("橙太字：技術検討先", {"size": 9, "bold": True, "color": ORANGE})], margin=0)
box(s, 4.17, 1.5, 2.5, 0.34, WHITE, G1, 0.75)
text(s, 4.17, 1.5, 2.5, 0.34, [("取締役会", {"size": 10})], align=C, anchor=MID)
line(s, 5.42, 1.84, 5.42, 1.94)
box(s, 3.92, 1.94, 3.0, 0.5, WHITE, G1, 0.75)
text(s, 3.92, 1.94, 3.0, 0.5, [("代表取締役社長", {"size": 9.5}), ("（中村 正之 氏）", {"size": 8.5})], align=C, anchor=MID)
line(s, 5.42, 2.44, 5.42, 2.6)
cols = [
    ("ブランド・企画", [("ブランド戦略部", "（森 智子 部長）", None), ("スキンケア企画部", "（西田 亮 部長）", "rel"), ("ヘアケア・ボディ企画部", "（小池 恵 部長）", None)]),
    ("研究・開発", [("処方開発研究所", "（藤井 俊介 所長）", "tech"), ("パッケージ開発部\n2026/4新設", "（岡本 直樹 部長）", "key"), ("品質保証部", "（井上 健 部長）", None)]),
    ("調達・品質・生産", [("購買部", "（高橋 裕子 部長）", "key"), ("生産技術部", "（サンプルファクトリー）", "tech"), ("滋賀工場・茨城工場", "", None)]),
    ("販売・顧客接点", [("ドラッグストア営業部", "", None), ("EC事業部", "（木村 彩 部長）", "rel"), ("海外事業部", "（タイ子会社を管轄）", "rel")]),
    ("経営・全社基盤", [("経営企画部", "", None), ("サステナビリティ推進室", "（2025/4新設）", "rel"), ("人事総務部", "", None)]),
]
cw, gap = 1.94, 0.1
line(s, 0.36 + cw / 2, 2.6, 0.36 + 4 * (cw + gap) + cw / 2, 2.6)
for i, (grp, depts) in enumerate(cols):
    x = 0.36 + i * (cw + gap)
    line(s, x + cw / 2, 2.6, x + cw / 2, 2.72)
    box(s, x, 2.72, cw, 3.42, None, G1, 0.75)
    text(s, x, 2.76, cw, 0.3, [(grp, {"size": 10.5})], align=C, anchor=MID)
    for k, (nm, who, mark) in enumerate(depts):
        y = 3.12 + k * 0.98
        color = RED if mark == "key" else (ORANGE if mark == "tech" else INK)
        box(s, x + 0.12, y, cw - 0.24, 0.78, WHITE, color if mark in ("key", "tech") else G3, 1.5 if mark in ("key", "tech") else 0.5)
        text(s, x + 0.12, y, cw - 0.24, 0.78, [(nm, {"size": 9, "bold": mark in ("key", "tech"), "color": color}),
                                              (who, {"size": 7.5, "color": G1, "space": 1})], align=C, anchor=MID, margin=0.03)
notes2 = [("パッケージ開発部", "容器の見た目・使いやすさ・環境対応の仕様を決める。ミナモのリニューアルで容器選定の起点", RED),
          ("購買部", "サプライヤー選定・調達条件・相見積もりの実務窓口。タイ子会社の調達方針も所管（推定）", RED),
          ("処方開発研究所・生産技術部", "処方と容器の適合（保存性・吐出量）、充填ラインとの適合・量産性の検討先", ORANGE)]
for i, (k, v, col) in enumerate(notes2):
    x = 0.36 + i * 3.4
    box(s, x, 6.22, 3.27, 0.66, PANEL, G5, 0.5)
    text(s, x, 6.22, 3.27, 0.66, [(k, {"size": 8.5, "bold": True, "color": col}), (v, {"size": 8, "space": 1})], anchor=MID, margin=0.06)


# ============================================================ (3) ブランド・チャネル
s = page("ブランド別売上・販売チャネル",
         "「ミナモ」「ハレノヒ」が増収をけん引。EC比率が9%から16%へ上がり、小容量・詰替の需要が増える",
         "決算説明資料、ブランド別の公表値、業界紙" + SRC_FICTION,
         "*1. その他ブランド・受託を含む。ブランド別は公表値と業界紙の推計からの推計値")
head(s, 0.36, 1.5, 4.0, "ブランド別売上推移")
d = CategoryChartData()
d.categories = ["2023/3", "2024/3", "2025/3", "2026/3予"]
brands = [("その他*1", (112, 109, 111, 119), C1), ("ルフレ", (64, 66, 71, 78), C2), ("ハレノヒ", (33, 40, 46, 52), C3),
          ("クラシカ", (42, 45, 48, 51), C4), ("ミナモ", (88, 95, 103, 112), C5)]
for name, vals, _ in brands:
    d.add_series(name, vals)
d.add_series("合計", (0, 0, 0, 0))
ch = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, Inches(0.3), Inches(2.02), Inches(3.05), Inches(4.85), d).chart
style_chart(ch, 8)
ch.plots[0].gap_width = 45
ch.plots[0].overlap = 100
for i, ser in enumerate(ch.plots[0].series):
    if i == 5:
        ser.format.fill.background()
        ser.format.line.fill.background()
        for j, tot in enumerate((339, 355, 379, 412)):
            dl = ser.points[j].data_label
            dl.has_text_frame = True
            dl.text_frame.text = str(tot)
            dl.position = XL_LABEL_POSITION.INSIDE_BASE
            style_run(dl.text_frame.paragraphs[0].runs[0], 9, True, INK)
        continue
    fill = brands[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = G3
    ser.format.line.width = Pt(0.5)
    ser.data_labels.show_value = True
    ser.data_labels.position = XL_LABEL_POSITION.CENTER
    ser.data_labels.font.size = Pt(8)
    ser.data_labels.font.color.rgb = WHITE if fill in (C4, C5) else INK
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.value_axis.maximum_scale = 450
ch.category_axis.tick_labels.font.size = Pt(8)
text(s, 0.36, 1.95, 1.0, 0.2, [("単位：億円", {"size": 8})], margin=0)
legend_v(s, 3.38, 2.4, [(C5, "ミナモ"), (C4, "クラシカ"), (C3, "ハレノヒ"), (C2, "ルフレ"), (C1, "その他*1")], size=8.5)

head(s, 4.55, 1.5, 5.92, "チャネル別売上構成比（2023/3 → 2026/3予）")
d = CategoryChartData()
d.categories = ["2026/3予", "2023/3"]
chs = [("ドラッグストア", (52, 58), C2), ("量販・バラエティ", (13, 14), C1), ("EC（自社・モール）", (16, 9), C5),
       ("百貨店・専門店", (10, 11), C3), ("海外", (5, 3), C4), ("その他", (4, 5), PANEL)]
for name, vals, _ in chs:
    d.add_series(name, vals)
ch = s.shapes.add_chart(XL_CHART_TYPE.BAR_STACKED_100, Inches(4.5), Inches(1.95), Inches(6.0), Inches(1.65), d).chart
style_chart(ch, 8)
ch.plots[0].gap_width = 40
ch.plots[0].overlap = 100
for i, ser in enumerate(ch.plots[0].series):
    fill = chs[i][2]
    ser.format.fill.solid()
    ser.format.fill.fore_color.rgb = fill
    ser.format.line.color.rgb = G3
    ser.format.line.width = Pt(0.5)
    ser.data_labels.show_value = True
    ser.data_labels.number_format = '0"%"'
    ser.data_labels.number_format_is_linked = False
    ser.data_labels.font.size = Pt(8.5)
    ser.data_labels.font.color.rgb = WHITE if fill in (C4, C5) else INK
ch.value_axis.visible = False
ch.value_axis.has_major_gridlines = False
ch.category_axis.tick_labels.font.size = Pt(8.5)
lx = 4.62
for color, name in [(C2, "ドラッグストア"), (C1, "量販・バラエティ"), (C5, "EC"), (C3, "百貨店・専門店"), (C4, "海外"), (PANEL, "その他")]:
    box(s, lx, 3.66, 0.18, 0.13, color, G3, 0.5)
    text(s, lx + 0.22, 3.6, 1.1, 0.24, [(name, {"size": 8})], anchor=MID, margin=0)
    lx += 0.32 + len(name) * 0.12

head(s, 4.55, 3.95, 5.92, "ブランド別事業動向")
bl(s, 4.55, 4.36, 5.92, 1.55, [
    (0, "ミナモ：年+8.4%の最大ブランド。2026/3に処方・容器を全面リニューアル予定", RED, True),
    (1, "ドラッグストアの敏感肌棚で定番化。EC限定の大容量・お試しサイズも展開"),
    (0, "ハレノヒ：年+16.4%で最も伸びる。2026/6にスティック・スプレーを追加し剤型を拡大"),
    (0, "ルフレ：詰替品の構成比が上昇（推定35% → 48%）し、本体ボトルの出荷は横ばい", RED, True),
    (1, "中計のプラスチック削減目標の中心ブランド。付け替え式本体の検討を公表"),
    (0, "クラシカ：百貨店・ECで堅調（年+6.7%）。ガラス容器中心"),
    (0, "EC比率の上昇で、小容量・お試し・詰替の品目数が増加"),
], size=9)
grid(s, 4.55, 5.92, [2.6, 1.1, 1.1, 1.12], [("容器に関わる指標", "2023/3", "2026/3予", "変化"),
                                            ("ルフレの詰替品の構成比（推定）", "35%", "48%", "+13pt"),
                                            ("ECの取扱品目数", "128", "205", "約1.6倍"),
                                            ("海外売上比率", "3%", "5%", "+2pt")], 0.24, size=8.4, aligns=[L, R, R, R],
     colors={(1, 3): RED, (2, 3): RED})


# ============================================================ (4) 商品ラインナップ
s = page("商品ラインナップ",
         "スキンケアはボトル・エアレス・ジャー、UVはチューブ・スプレー、ヘアケアはポンプ・詰替と\n剤型ごとに容器接点が広い",
         "公式サイト、公式EC、商品カタログ" + SRC_FICTION + "。価格は税込の想定")
cats = [
    ("ミナモ（敏感肌スキンケア）", [
        (0, "化粧水・乳液・美容液・クリームの4ステップ、計14品目"),
        (0, "1,320〜3,300円"),
        (0, "化粧水は200mL PETボトル、乳液はポンプ、美容液はエアレス、クリームはジャー"),
        (1, "2026/3のリニューアルで、美容液・乳液をエアレス化する方針（求人より）", RED),
    ], ["minamo-lotion", "minamo-milk", "minamo-serum", "minamo-cream"]),
    ("クラシカ（高価格スキンケア）", [
        (0, "化粧水・美容液・クリームの3品目。百貨店とECのみ"),
        (0, "6,600〜16,500円"),
        (0, "すりガラスのボトル・ジャーに金のキャップ"),
        (1, "ガラスが中心で、当社の樹脂容器とは接点が小さい"),
    ], ["classica-lotion", "classica-cream"]),
    ("ハレノヒ（UV）", [
        (0, "ジェル・ミルク・スプレー、2026/6にスティックを追加"),
        (0, "990〜1,980円"),
        (0, "ジェルはラミネートチューブ、スプレーはエアゾール缶"),
        (1, "スティックは新規の剤型で、容器の調達先は未定（推定）", RED),
    ], ["harenohi-tube", "harenohi-spray", "harenohi-stick"]),
    ("ルフレ（ヘアケア）・ボディ", [
        (0, "シャンプー・トリートメント・ヘアオイル・泡ハンドソープ"),
        (0, "本体1,540円、詰替1,100円（900mL）"),
        (0, "480mLポンプボトルと、900mLの詰替スタンドパウチ"),
        (1, "詰替の比率上昇で、本体は長く使える設計（付け替え式）が論点に", RED),
    ], ["refre-shampoo", "refre-treatment", "refre-refill", "body-foam"]),
]
extra = [("ドラッグストア・EC", "112億円　年+8.4%", "容器接点：大", True),
         ("百貨店・EC", "51億円　年+6.7%", "容器接点：小", False),
         ("ドラッグストア・量販", "52億円　年+16.4%", "容器接点：中", True),
         ("ドラッグストア・EC", "78億円　年+6.8%", "容器接点：大", True)]
cw = 2.45
for i, (nm, items, packs) in enumerate(cats):
    x = 0.36 + i * (cw + 0.105)
    text(s, x, 1.52, cw, 0.3, [(nm, {"size": 10.5})], align=C, anchor=MID)
    line(s, x, 1.86, x + cw, 1.86, G3, 1.0)
    rows = [("主な商品", items[0][1]), ("価格帯", items[1][1]), ("主な販路", extra[i][0]), ("容器形態", items[2][1])]
    bl(s, x, 1.93, cw, 2.15, [(0, f"{k}：{v}") for k, v in rows] + [items[3]], size=8.5)
    box(s, x, 3.52, cw, 2.9, PANEL)
    pics_row(s, packs, x + 0.1, 6.28, cw - 0.2, 2.55, gap=0.05)
    sales, touch, hot = extra[i][1], extra[i][2], extra[i][3]
    text(s, x, 6.46, cw * 0.55, 0.42, [("売上（2026/3予）", {"size": 7.5, "color": G1}), (sales, {"size": 9, "bold": True})], anchor=MID, margin=0.02)
    box(s, x + cw * 0.56, 6.5, cw * 0.44, 0.34, C5 if hot else LABEL, G5, 0.5)
    text(s, x + cw * 0.56, 6.5, cw * 0.44, 0.34, [(touch, {"size": 8.5, "bold": True, "color": WHITE if hot else INK})], align=C, anchor=MID, margin=0)


# ============================================================ (5) 直近の事業動向
s = page("直近の事業動向",
         "2024年以降、中計・工場増設・組織新設・海外生産が続き、容器の仕様と調達先を見直す局面にある",
         "各社発表のプレスリリース・求人情報・業界紙" + SRC_FICTION,
         "赤字は容器の需要・仕様・調達先に影響する出来事")
rows = [("時期", "区分", "出来事", "内容", "容器への影響", "出所（確認日）")]
ev = [
    ("2024/5", "戦略", "中期経営計画「2028」を公表", "売上500億円、海外比率10%、2030年に容器のプラスチック使用量30%削減", "詰替・薄肉化・再生材の採用が進む", "中計資料（2026/10/15）"),
    ("2024/11", "商品", "ルフレの詰替を全品目に拡大", "シャンプー・トリートメント・ボディの詰替を発売", "本体ボトルの出荷が減り、パウチが増える", "プレスリリース（同上）"),
    ("2025/3", "投資", "滋賀工場にUV・チューブの充填ラインを増設", "投資額18億円。チューブ充填能力は約1.4倍", "チューブの調達量が増える", "業界紙（2026/10/16）"),
    ("2025/10", "海外", "タイ子会社を設立（出資70%）", "2026/10に現地生産を開始し、ASEANへ供給", "現地調達の容器が必要になる", "プレスリリース（2026/10/15）"),
    ("2026/3予", "商品", "ミナモを全面リニューアル", "処方を刷新。美容液・乳液の容器をエアレス化（求人より）", "エアレス容器の新規採用", "求人情報（2026/10/18）"),
    ("2026/4", "組織", "パッケージ開発部を新設", "容器の企画・仕様決定を商品開発から独立", "容器選定の窓口が明確になる", "人事異動の発表（2026/10/15）"),
    ("2026/6", "商品", "ハレノヒにスティック・スプレーを追加", "UVの剤型を拡大", "新しい剤型の容器が必要", "プレスリリース（2026/10/15）"),
]
red_rows = {1, 2, 4, 5, 6}
ty = 1.62
line(s, 0.6, ty + 0.32, 10.25, ty + 0.32, G1, 1.25)
span = {"2024/1": 0.0, "2027/1": 1.0}
def tx(ym):
    y, m = ym.replace("予", "").split("/")
    v = (int(y) - 2024) * 12 + int(m) - 1
    return 0.6 + (10.25 - 0.6) * v / 36
for yr in (2024, 2025, 2026):
    xx = tx(f"{yr}/1")
    line(s, xx, ty + 0.22, xx, ty + 0.42, G1, 1.0)
    text(s, xx + 0.04, ty + 0.36, 0.6, 0.22, [(f"{yr}年", {"size": 8, "color": G1})], margin=0)
for k, (ym, _, nm, *_r) in enumerate(ev):
    xx = tx(ym)
    hot = (k + 1) in red_rows
    box(s, xx - 0.06, ty + 0.26, 0.12, 0.12, RED if hot else G3, shape=MSO_SHAPE.OVAL)
    text(s, xx - 0.55, ty - 0.06 if k % 2 == 0 else ty + 0.56, 1.1, 0.28, [(ym, {"size": 7.5, "bold": True, "color": RED if hot else G1})],
         align=C, anchor=MID, margin=0)
rows += ev
colors = {(i + 1, 4): RED for i in range(len(ev)) if (i + 1) in red_rows}
colors.update({(i + 1, 2): RED for i in range(len(ev)) if (i + 1) in red_rows})
grid(s, 0.36, 2.55, [0.72, 0.55, 2.3, 2.75, 2.1, 1.69], rows, 0.0, size=8.6,
     aligns=[C, C, L, L, L, L], colors=colors, heights=[0.3] + [0.56] * len(ev))


# ============================================================ (6) 既存取引との照合
s = page("既存取引との照合",
         "当社の取引は「ミナモ化粧水」「ルフレ本体」の2品のみ。リニューアル・新剤型・海外生産で\n新たな容器需要が3領域で生まれる",
         "依頼元の取引実績（架空設定）、公式サイト、求人情報" + SRC_FICTION,
         "他社は公開情報からの推定。取引額は依頼元からの共有を想定した架空の値")
cols6 = ["ボトル", "ポンプ", "エアレス", "ジャー", "チューブ", "詰替パウチ", "新剤型"]
br6 = ["ミナモ", "クラシカ", "ハレノヒ", "ルフレ", "ボディ・その他", "タイ生産品"]
STATE = {"T": ("当社取引中", C5, WHITE), "O": ("他社（推定）", C1, INK), "N": ("新規発生", WHITE, RED), "U": ("要確認", WHITE, G1), "-": ("−", WHITE, G3)}
g6 = [["T", "O", "N", "O", "-", "U", "-"],
      ["O", "O", "O", "O", "-", "-", "-"],
      ["-", "-", "-", "-", "O", "-", "N"],
      ["T", "O", "-", "-", "-", "O", "-"],
      ["O", "O", "-", "-", "O", "O", "-"],
      ["N", "N", "U", "U", "N", "U", "-"]]
n6 = [["化粧水200mL\n年約1.9億円", "乳液", "美容液・乳液\n2026/3〜", "クリーム", "", "詰替は\n未確認", ""],
      ["ガラス", "", "", "ガラス", "", "", ""],
      ["", "", "", "", "ラミネート", "", "スティック\n2026/6〜"],
      ["480mL本体\n年約1.3億円", "ポンプ部品", "", "", "", "900mL", ""],
      ["", "泡ポンプ", "", "", "", "", ""],
      ["2026/10〜", "同左", "品目未公表", "品目未公表", "同左", "", ""]]
gx, gy, lw, cwid, rh = 0.36, 1.62, 1.35, 0.98, 0.66
box(s, gx, gy, lw, 0.4, LABEL, G5, 0.5)
for j, c in enumerate(cols6):
    x = gx + lw + j * cwid
    box(s, x, gy, cwid, 0.4, LABEL, G5, 0.5)
    text(s, x, gy, cwid, 0.4, [(c, {"size": 9})], align=C, anchor=MID)
for i, b in enumerate(br6):
    y = gy + 0.4 + i * rh
    box(s, gx, y, lw, rh, LABEL, G5, 0.5)
    text(s, gx, y, lw, rh, [(b, {"size": 9.5})], align=C, anchor=MID)
    for j in range(7):
        k = g6[i][j]
        nm, fill, fg = STATE[k]
        x = gx + lw + j * cwid
        box(s, x, y, cwid, rh, fill, RED if k == "N" else G5, 1.5 if k == "N" else 0.5, dash=k == "N")
        paras = [(nm, {"size": 8.5, "bold": k in ("T", "N"), "color": fg})]
        if n6[i][j]:
            paras.append((n6[i][j], {"size": 7.5, "color": fg, "space": 1}))
        text(s, x, y, cwid, rh, paras, align=C, anchor=MID, margin=0.02)
leg_y = gy + 0.4 + 6 * rh + 0.08
lx = gx
for k in ("T", "O", "N", "U"):
    nm, fill, fg = STATE[k]
    box(s, lx, leg_y + 0.05, 0.26, 0.15, fill, RED if k == "N" else G3, 1.0, dash=k == "N")
    text(s, lx + 0.32, leg_y, 1.2, 0.26, [(nm, {"size": 8})], anchor=MID, margin=0)
    lx += 1.3

rx = 8.55
head(s, rx, 1.5, 1.92, "区分の根拠")
bl(s, rx, 1.92, 1.92, 1.6, [(0, "当社取引中：依頼元から共有された取引実績（架空設定）"), (0, "他社：容器の形状・刻印・業界紙からの推定"),
                            (0, "新規発生：直近の動向から需要の発生が見込まれる区画")], size=8)
head(s, rx, 3.62, 1.92, "未確認事項")
bl(s, rx, 4.04, 1.92, 2.85, [(0, "ミナモ詰替の有無と採用時期", RED), (0, "エアレス容器の仕様決定の時期と、評価中のサプライヤー"),
                             (0, "ルフレのポンプ部品の調達先"), (0, "タイ生産の品目と、容器を現地調達するか日本から供給するか", RED)], size=8)


# ============================================================ (7) 追加提案仮説
s = page("追加提案仮説",
         "優先は「ミナモのエアレス化」と「ルフレ本体の再設計」。どちらも既存取引の延長で入れる",
         "(1)〜(6)の分析" + SRC_FICTION,
         "確度・規模は公開情報と取引実績からの見立て。提案前に右列の事項を確認する")
hdr = ["仮説", "対象", "顧客の変化（根拠）", "想定されるニーズ", "当社商材との適合性", "提案候補", "提案前の確認事項"]
widths = [1.3, 0.85, 1.85, 1.5, 1.6, 1.6, 1.41]
hyp_pics = [["minamo-serum", "minamo-milk"], ["refre-shampoo", "refre-refill"], ["minamo-lotion", "refre-shampoo"]]
hyp = [
    ("1　ミナモの\nエアレス容器\n確度：高　規模：大",
     "2026/3にミナモを全面リニューアル。求人に「エアレス容器の開発経験者」を記載。パッケージ開発部を2026/4に新設",
     "防腐剤を減らした処方の酸化防止、最後まで使い切れること、化粧水ボトルとのデザインの統一",
     "化粧水200mLボトルを取引中で、ブランドの意匠を理解している。30・50mLのエアレスを量産中",
     "エアレス美容液・乳液容器（30/50mL）を、化粧水ボトルとそろえた意匠で提案",
     "仕様決定の時期／評価中のサプライヤー／充填ラインの条件"),
    ("2　ルフレ本体の\n再設計\n確度：中　規模：中",
     "詰替の構成比が35%→48%に上昇。中計で2030年に容器のプラスチック30%削減。付け替え式本体の検討を公表",
     "本体を長く使える設計、薄肉化、再生材の使用、詰替パウチからの付け替えやすさ",
     "480mL本体を取引中。再生PET30%のボトルと、付け替え用キャップの実績あり",
     "再生材30%・薄肉の本体ボトル＋付け替えキャップのセット",
     "再生材の目標比率／コストの許容幅／発売時期"),
    ("3　タイ生産品の\n容器供給\n確度：中　規模：中",
     "2025/10にタイ子会社を設立し、2026/10に現地生産を開始。ASEANへの供給拠点",
     "立ち上げ期の品質安定と、日本と同じ仕様の容器の安定調達",
     "タイの協力工場で日本仕様のボトルを生産できる（架空設定）",
     "日本仕様のボトル・ポンプを現地で供給。立ち上げ期は日本から輸出",
     "生産品目／調達方針（現地か日本か）／立ち上げの日程"),
]
rows7 = [hdr] + [[h[0], ""] + list(h[1:]) for h in hyp]
yy = 1.55
for i, row in enumerate(rows7):
    rh = 0.36 if i == 0 else 1.48
    cx = 0.36
    for j, val in enumerate(row):
        w = widths[j]
        if i == 0:
            box(s, cx, yy, w, rh, LABEL, G5, 0.5)
            text(s, cx, yy, w, rh, [(val, {"size": 9})], align=C, anchor=MID)
        elif j == 0:
            box(s, cx, yy, w, rh, LABEL, G5, 0.5)
            parts = val.split("\n")
            text(s, cx, yy, w, rh, [(parts[0], {"size": 9.5, "bold": True}), (parts[1], {"size": 9.5, "bold": True}),
                                    (parts[2], {"size": 8, "color": RED if i < 3 else G1, "space": 4})], align=C, anchor=MID)
        elif j == 1:
            box(s, cx, yy, w, rh, WHITE, G5, 0.5)
            pics_row(s, hyp_pics[i - 1], cx + 0.06, yy + rh - 0.12, w - 0.12, rh - 0.3, gap=0.03)
        else:
            box(s, cx, yy, w, rh, WHITE, G5, 0.5)
            text(s, cx, yy, w, rh, [(val, {"size": 8.5, "bold": j == 5, "color": RED if j == 5 and i < 3 else INK})], anchor=MID, margin=0.06, line=1.0)
        cx += w
    yy += rh
text(s, 0.36, 6.43, 10.11, 0.5, [[("見送り：", {"size": 8.6, "bold": True}), ("ハレノヒのスティック容器は需要が見込めるが、当社にスティックの量産実績がないため今回は対象外。協力会社と組む場合は再検討", {"size": 8.6})]],
     anchor=MID)


# ============================================================ (8) 営業アクション案
s = page("営業アクション案",
         "11月中にパッケージ開発部へ初回訪問し、ミナモのリニューアル日程と容器仕様の決定時期を確認する",
         "(1)〜(7)の分析" + SRC_FICTION,
         "担当者名は公開情報で確認できた範囲。面談の可否・時期は依頼元の営業担当が判断する")
head(s, 0.36, 1.5, 3.35, "提案テーマの優先順位")
mx, my, mw, mh = 0.75, 2.0, 2.85, 2.85
box(s, mx, my, mw, mh, WHITE, G3, 0.75)
line(s, mx + mw / 2, my, mx + mw / 2, my + mh, G5, 0.75, dash=True)
line(s, mx, my + mh / 2, mx + mw, my + mh / 2, G5, 0.75, dash=True)
text(s, mx, my + mh + 0.04, mw, 0.24, [("確度 →（高い）", {"size": 8})], align=R, margin=0)
text(s, 0.3, my, 0.42, mh, [("規模\n↑\n大", {"size": 8})], align=C, anchor=MID, margin=0)
for (cxp, cyp, r, lab_t, hot) in [(0.8, 0.2, 0.24, "1", True), (0.6, 0.42, 0.19, "2", True), (0.36, 0.56, 0.19, "3", False), (0.2, 0.8, 0.15, "見送り", False)]:
    bx = mx + mw * cxp - r
    by = my + mh * cyp - r
    box(s, bx, by, r * 2, r * 2, C5 if hot else C2, G1, 0.75, shape=MSO_SHAPE.OVAL)
    text(s, bx - 0.2, by, r * 2 + 0.4, r * 2, [(lab_t, {"size": 9 if lab_t == "見送り" else 11, "bold": True, "color": WHITE if hot else INK})],
         align=C, anchor=MID, margin=0)
bl(s, 0.36, 5.25, 3.35, 1.65, [(0, "1 ミナモのエアレス容器：確度・規模とも最大"), (0, "2 ルフレ本体の再設計：既存取引の延長"),
                               (0, "3 タイ生産品：立ち上げ時期に合わせる"), (0, "見送り：ハレノヒのスティック")], size=8.6)

head(s, 3.95, 1.5, 6.52, "アクションプラン")
hdr = ["テーマ", "対象部門・担当", "商談で確認する質問", "提案する商品", "次のアクション"]
w8 = [1.0, 1.35, 1.92, 1.15, 1.1]
acts = [
    ("1 ミナモ\nエアレス", "パッケージ開発部\n岡本部長\n（技術：処方開発研究所）", "リニューアルの発売日と容器仕様の決定時期は／評価中のサプライヤーは／求める保存性能は", "エアレス30/50mL\n化粧水ボトルと意匠統一", "11月：初回訪問\n12月：試作品の提示"),
    ("2 ルフレ\n本体", "購買部 高橋部長\nサステナビリティ推進室", "再生材の目標比率と時期は／付け替え式の検討状況は／コストの許容幅は", "再生PET30%本体\n付け替えキャップ", "12月：再生材ボトルのサンプル提出"),
    ("3 タイ生産", "海外事業部\n購買部", "現地生産の品目と数量は／容器は現地調達か日本からの供給か", "日本仕様ボトル・ポンプの現地供給", "1月：現地調達の方針を確認"),
]
rows8 = [hdr] + [list(a) for a in acts]
grid(s, 3.95, 1.95, w8, rows8, 0.0, size=8.4, aligns=[C, L, L, L, L], colors={(1, 4): RED, (1, 0): RED},
     heights=[0.34, 1.22, 1.05, 0.95])
text(s, 3.95, 5.6, 6.52, 1.3, [("初回訪問で持ち込むもの", {"size": 9.5, "bold": True}),
                               ("・既存の化粧水ボトルと意匠をそろえたエアレス容器のサンプル（30mL・50mL）", {"size": 8.8, "space": 3}),
                               ("・再生PET30%ボトルの採用事例（他ブランド、守秘範囲で）", {"size": 8.8}),
                               ("・中計のプラスチック削減目標に対する、容器別の削減効果の試算", {"size": 8.8})], line=1.05)


# ------------------------------------------------------------------ 表紙（先頭に移す）
cover = prs.slides.add_slide(next(l for l in prs.slide_layouts if l.name == "表紙"))
for ph in cover.placeholders:
    idx = ph.placeholder_format.idx
    if idx == 12:
        ph.text_frame.text = f"{CLIENT}　御中"
    elif idx == 11:
        ph.text_frame.text = f"{COMPANY}　企業クローズアップ"
    elif idx == 13:
        ph.text_frame.text = f"{DATE}　（架空企業による分析サンプル）"
ids = prs.slides._sldIdLst
ids.insert(0, ids[-1])

prs.save(OUT)
print("saved", OUT, len(prs.slides), "slides")
