"""
既存顧客企業クローズアップ　サンプルレポートを、実際の資料のスライドを転用して作る。

元資料: 提案書用材料_クローズアップ系.pptx（ユーザー提供。リポジトリには入れない）
  そのスライドの体裁（位置・文字サイズ・書体・罫線・ラベル列）をそのまま使い、中身だけを架空の内容に差し替える。
  実在企業の名前・人名・数値・商品写真はすべて消す。グラフは架空の数値で作り直し、写真は packshots/ の架空商品に替える。
  ユーザーが気に入った3つの図（年表と出来事の表／取引の照合表／優先順位の図）は、元資料の配色に合わせて新たに描く。

実行: py design/existing-customers-sample/build_from_material.py <元資料のpptx>
出力: design/existing-customers-sample/existing-customers-sample.pptx
"""
import copy
import re
import sys
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
OUT = HERE / "existing-customers-sample.pptx"
SRC = Path(sys.argv[1])

CO = "サンプル化粧品株式会社"
DATE = "2026/10/22"

# 元資料の配色
D1, D2, D3, D4, D5, D6 = (RGBColor(0xDF, 0xE5, 0xEF), RGBColor(0xC3, 0xCF, 0xE1), RGBColor(0x9D, 0xB1, 0xCF),
                          RGBColor(0x6F, 0x8D, 0xB9), RGBColor(0x4C, 0x6C, 0x9C), RGBColor(0x36, 0x4D, 0x6E))
TOPIC = RGBColor(0xEA, 0xEA, 0xEA)
GRID = RGBColor(0xBF, 0xBF, 0xBF)
INK = RGBColor(0, 0, 0)
G1 = RGBColor(0x40, 0x40, 0x40)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RED = RGBColor(0xFF, 0x00, 0x00)
ORANGE = RGBColor(0xFF, 0xC0, 0x00)
L, C, R = PP_ALIGN.LEFT, PP_ALIGN.CENTER, PP_ALIGN.RIGHT
MID = MSO_ANCHOR.MIDDLE

prs = Presentation(SRC)
SL = list(prs.slides)


# ------------------------------------------------------------------ 共通
def find(shapes, sid):
    for sh in shapes:
        if sh.shape_id == sid:
            return sh
        if sh.shape_type == 6:
            r = find(sh.shapes, sid)
            if r is not None:
                return r
    return None


def walk(shapes):
    for sh in shapes:
        yield sh
        if sh.shape_type == 6:
            yield from walk(sh.shapes)


def delete(sh):
    sh._element.getparent().remove(sh._element)


def set_run_text(r, text, color=None, bold=None):
    r.text = text
    if color is not None:
        r.font.color.rgb = color
    if bold is not None:
        r.font.bold = bold


def set_paras(sh, items, ink=False):
    """items: [(level, text) | (level, text, {"color":..,"bold":..})]
    同じ階層の既存段落を雛形に複製するので、書体・大きさ・箇条書き記号は元のまま"""
    txBody = sh.text_frame._txBody
    paras = txBody.findall(qn("a:p"))
    by_level = {}
    for p in paras:
        lvl = int(p.find(qn("a:pPr")).get("lvl", "0")) if p.find(qn("a:pPr")) is not None else 0
        if p.findall(qn("a:r")) and lvl not in by_level:
            by_level[lvl] = p
    fallback = next(iter(by_level.values()), paras[0])
    for p in paras:
        txBody.remove(p)
    for it in items:
        lvl, text = it[0], it[1]
        opts = dict(it[2]) if len(it) > 2 else {}
        if ink and "color" not in opts:
            opts["color"] = INK
        tpl = by_level.get(lvl, fallback)
        np_ = copy.deepcopy(tpl)
        runs = np_.findall(qn("a:r"))
        for extra in runs[1:]:
            np_.remove(extra)
        for br in np_.findall(qn("a:br")):
            np_.remove(br)
        if lvl not in by_level:
            ppr = np_.find(qn("a:pPr"))
            if ppr is not None:
                ppr.set("lvl", str(lvl))
        r = runs[0] if runs else None
        if r is None:
            txBody.append(np_)
            continue
        if text == "":
            np_.remove(r)
        else:
            r.find(qn("a:t")).text = text
            rpr = r.find(qn("a:rPr"))
            if "color" in opts:
                if rpr is None:
                    rpr = etree.Element(qn("a:rPr"))
                    r.insert(0, rpr)
                for f in rpr.findall(qn("a:solidFill")):
                    rpr.remove(f)
                sf = etree.Element(qn("a:solidFill"))
                etree.SubElement(sf, qn("a:srgbClr")).set("val", str(opts["color"]))
                ln = rpr.find(qn("a:ln"))
                rpr.insert(list(rpr).index(ln) + 1 if ln is not None else 0, sf)
            if "bold" in opts and rpr is not None:
                rpr.set("b", "1" if opts["bold"] else "0")
        txBody.append(np_)


def set_title(sh, title, message):
    """タイトルのプレースホルダー：改行の前が章名、後がメッセージ（元の書式のまま）"""
    p = sh.text_frame._txBody.find(qn("a:p"))
    kids = list(p)
    br_idx = next((i for i, k in enumerate(kids) if k.tag == qn("a:br")), None)
    runs = [(i, k) for i, k in enumerate(kids) if k.tag == qn("a:r")]
    if br_idx is None:
        # 18pt の最初の run からがメッセージ
        msg_start = next((i for i, k in runs if k.find(qn("a:rPr")) is not None and k.find(qn("a:rPr")).get("sz") == "1800"), None)
        head = [k for i, k in runs if msg_start is None or i < msg_start]
        body = [k for i, k in runs if msg_start is not None and i >= msg_start]
        br = etree.Element(qn("a:br"))
        if body:
            body[0].addprevious(br)
            rpr = body[0].find(qn("a:rPr"))
            if rpr is not None:
                br.append(copy.deepcopy(rpr))
    else:
        head = [k for i, k in runs if i < br_idx]
        body = [k for i, k in runs if i > br_idx]
    head[0].find(qn("a:t")).text = title
    for k in head[1:]:
        p.remove(k)
    if not body and message:
        br = etree.Element(qn("a:br"))
        head[0].addnext(br)
        r = copy.deepcopy(head[0])
        rpr = r.find(qn("a:rPr"))
        if rpr is None:
            rpr = etree.Element(qn("a:rPr"))
            r.insert(0, rpr)
        rpr.set("sz", "1800")
        br.addnext(r)
        body = [r]
    if body:
        body[0].find(qn("a:t")).text = message
        for k in body[1:]:
            p.remove(k)


def text_of(sh):
    return sh.text_frame.text if sh.has_text_frame else ""


def tb(slide, x, y, w, h, paras, size=10.5, align=L, anchor=MSO_ANCHOR.TOP, margin=0.04, line=1.0):
    box_ = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box_.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(margin))
    for i, para in enumerate(paras):
        runs = para if isinstance(para, list) else [para]
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line
        for r in runs:
            t, o = (r, {}) if isinstance(r, str) else r
            run = p.add_run()
            run.text = t
            run.font.size = Pt(o.get("size", size))
            run.font.bold = o.get("bold", False)
            run.font.color.rgb = o.get("color", INK)
    return box_


def rect(slide, x, y, w, h, fill=None, line=GRID, weight=0.75, shape=MSO_SHAPE.RECTANGLE, dash=False):
    b = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
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


def seg(slide, x1, y1, x2, y2, color=G1, weight=1.0, dash=False):
    ln = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    ln.shadow.inherit = False
    ln.line.color.rgb = color
    ln.line.width = Pt(weight)
    if dash:
        ln.line.dash_style = 4
    return ln


def packs(slide, names, x, bottom, width, max_h, gap=0.06):
    """架空商品の画像を、描いたときの実寸比のまま横に並べる"""
    sizes = [Image.open(PACK / f"{n}.png").size for n in names]
    k = max_h / max(h for _, h in sizes)
    total = sum(w for w, _ in sizes) * k + gap * (len(names) - 1)
    if total > width:
        k *= (width - gap * (len(names) - 1)) / (total - gap * (len(names) - 1))
        total = width
    cx = x + (width - total) / 2
    for n, (w, h) in zip(names, sizes):
        slide.shapes.add_picture(str(PACK / f"{n}.png"), Inches(cx), Inches(bottom - h * k), Inches(w * k), Inches(h * k))
        cx += w * k + gap


def stamp(slide):
    """架空であることの表示（実物の「ボリューム」札と同じ位置・体裁）"""
    rect(slide, 9.3, 0.05, 1.38, 0.24, WHITE, INK, 0.75)
    tb(slide, 9.3, 0.05, 1.38, 0.24, [("架空企業のサンプル", {"size": 9})], align=C, anchor=MID, margin=0)


def page_no(slide, n):
    for sh in slide.placeholders:
        if "番号" in sh.name:
            sh.text_frame.text = f"- {n} -"


def native_chart(slide, x, y, w, h, kind, cats, series, colors, label_fmt=None, total=None, label_color_dark=(D4, D5, D6)):
    d = CategoryChartData()
    d.categories = cats
    for name, vals in series:
        d.add_series(name, vals)
    if total:
        d.add_series("合計", [0] * len(cats))
    ch = slide.shapes.add_chart(kind, Inches(x), Inches(y), Inches(w), Inches(h), d).chart
    ch.has_title = False
    ch.has_legend = False
    ch.font.size = Pt(10)
    plot = ch.plots[0]
    plot.gap_width = 60
    plot.overlap = 100
    for i, ser in enumerate(plot.series):
        if total and i == len(series):
            ser.format.fill.background()
            ser.format.line.fill.background()
            for j, t in enumerate(total):
                dl = ser.points[j].data_label
                dl.has_text_frame = True
                dl.text_frame.text = t
                dl.position = XL_LABEL_POSITION.INSIDE_BASE
                rr = dl.text_frame.paragraphs[0].runs[0]
                rr.font.size = Pt(10.5)
                rr.font.bold = False
            continue
        ser.format.fill.solid()
        ser.format.fill.fore_color.rgb = colors[i]
        ser.format.line.color.rgb = RGBColor(0x59, 0x59, 0x59)
        ser.format.line.width = Pt(0.5)
        ser.data_labels.show_value = True
        if label_fmt:
            ser.data_labels.number_format = label_fmt
            ser.data_labels.number_format_is_linked = False
        ser.data_labels.position = XL_LABEL_POSITION.CENTER
        ser.data_labels.font.size = Pt(9.5)
        ser.data_labels.font.color.rgb = WHITE if colors[i] in label_color_dark else INK
    ch.value_axis.visible = False
    ch.value_axis.has_major_gridlines = False
    ch.category_axis.tick_labels.font.size = Pt(10.5)
    ch.category_axis.format.line.color.rgb = RGBColor(0x59, 0x59, 0x59)
    return ch


def legend(slide, x, y, entries, step=0.23, size=10.5):
    for i, (col, name) in enumerate(entries):
        rect(slide, x, y + i * step + 0.03, 0.2, 0.15, col, RGBColor(0x59, 0x59, 0x59), 0.5)
        tb(slide, x + 0.27, y + i * step - 0.02, 1.6, 0.24, [(name, {"size": size})], anchor=MID, margin=0)


def heading(slide, ref_group, x, y, w, text):
    """元資料の節見出し（中央の文字＋罫線のグループ）を複製して置く"""
    el = copy.deepcopy(ref_group._element)
    slide.shapes._spTree.append(el)
    g = slide.shapes[-1]
    g.left, g.top, g.width = Inches(x), Inches(y), Inches(w)
    for sh in g.shapes:
        if sh.has_text_frame and sh.text_frame.text.strip():
            set_paras(sh, [(0, text)])
    return g


# ================================================================== 表紙（元資料の1枚目）
cover = SL[0]
for ph in cover.placeholders:
    nm = ph.name
    if nm.endswith("1"):
        ph.text_frame.text = f"{CO}　企業クローズアップ"
    elif nm.endswith("2"):
        ph.text_frame.text = "サンプル容器株式会社　御中"
    elif nm.endswith("3"):
        ph.text_frame.text = f"{DATE}　（架空企業による分析サンプル）"


# ================================================================== (1) 会社概要 ← 元 BBB（1）
s = SL[17]
set_title(find(s.shapes, 7172), f"{CO}（1）　会社概要", "主力のスキンケアが成長をけん引。容器のプラスチック削減と海外生産を中計の柱に据える")
set_paras(find(s.shapes, 4), [
    (0, "化粧品・医薬部外品の企画・研究開発から製造・販売までを一貫して展開"),
    (1, "スキンケアが売上の約5割"),
    (0, "中期経営計画で、2030年に容器のプラスチック使用量30%削減を掲げる", {"color": RED}),
    (1, "2025/10に海外子会社を設立し、現地生産を開始予定"),
])
for sid in (15, 7492, 7495, 7489, 53, 55, 7392, 7485, 7476, 7318, 7501, 7503, 7505, 7507, 6):
    sh = find(s.shapes, sid)
    if sh is not None:
        delete(sh)
tb(s, 1.16, 1.9, 1.2, 0.2, [("単位：億円", {"size": 9})], margin=0)
native_chart(s, 1.0, 2.05, 3.85, 3.0, XL_CHART_TYPE.COLUMN_STACKED, ["2023/3", "2024/3", "2025/3", "2026/3予"],
             [("その他", (38, 36, 34, 33)), ("UV・ボディ", (41, 48, 55, 63)), ("ヘアケア", (92, 95, 101, 112)), ("スキンケア", (168, 176, 189, 204))],
             [D5, D3, D2, D1], total=["339", "355", "379", "412"])
leg_ids = [7213, 7214, 7215, 7216, 7217, 7475, 7218]
name_ids = [45, 46, 47, 48, 49, 7473, 50]
for sid in leg_ids + name_ids:
    sh = find(s.shapes, sid)
    if sh is not None:
        delete(sh)
legend(s, 4.85, 2.05, [(D1, "スキンケア"), (D2, "ヘアケア"), (D3, "UV・ボディ"), (D5, "その他")])
set_paras(find(s.shapes, 7463), [(0, "単体：○○○名（2026/3）")])
for sid, t in ((14, "サンプルホールディングス株式会社"), (23, CO)):
    set_paras(find(s.shapes, sid), [(0, t)])
set_paras(find(s.shapes, 30), [(0, "㈱ブランドA社"), (0, "ブランドA運営")])
set_paras(find(s.shapes, 7422), [(0, "㈱サンプルファクトリー*1"), (0, "製造機能")])
set_paras(find(s.shapes, 7424), [(0, "SAMPLE ASIA")])
set_paras(find(s.shapes, 7426), [(0, "SAMPLE INTERNATIONAL")])
set_paras(find(s.shapes, 7430), [(0, "関連会社㈱X"), (0, "化粧品のODM")])
set_paras(find(s.shapes, 7432), [(0, "㈱サンプルロジ"), (0, "包装、出荷等")])
set_paras(find(s.shapes, 7434), [(0, "SAMPLE (海外) Trading Limited")])
for sid, t in ((7449, "100%"), (7451, "100%"), (7453, "100%"), (7455, "100%"), (7457, "70%")):
    set_paras(find(s.shapes, sid), [(0, t)])
set_paras(find(s.shapes, 7175), [(0, "出所：会社案内、決算公告（想定）")])
set_paras(find(s.shapes, 12), [(0, "注：*1. 本体の受注の延長と考えられるため省略。社名・数値はすべて架空")])
stamp(s)


# ================================================================== (2) 主要組織図 ← 元 ファンケル（2）
s = SL[19]
set_title(find(s.shapes, 7172), f"{CO}（2）　主要組織図", "")
names = re.compile(r"（[^（）()]*?(本部長|部長|所長|ダイレクター|室長|代表|氏)\s*[)）]?")
brand_map = [("㈱ファンケル美健", "㈱サンプル製造"), ("ファンケル", "サンプル化粧品"), ("アテニア", "ブランドB"), ("ブランシック", "ブランドC"), ("FANCL", "SAMPLE"),
             ("ウェルエイジング", "ブランドD"), ("ダイエット/ビューティ", "ブランドE"), ("放送設備", "包装設備"), ("充塡", "充填")]
for sh in walk(s.shapes):
    if not sh.has_text_frame:
        continue
    for p in sh.text_frame.paragraphs:
        full = "".join(r.text for r in p.runs)
        if not full:
            continue
        new = names.sub(lambda m: f"（○○ ○○ {m.group(1)}）", full)
        for a, b in brand_map:
            new = new.replace(a, b)
        if new != full:
            p.runs[0].text = new
            for r in p.runs[1:]:
                r.text = ""
set_paras(find(s.shapes, 7222), [(0, "注：公開情報を基に、2026/10時点で確認できた主要組織を提案活動の観点から整理した参考図（架空）。正式な組織図・全籍関係を示すものではない")])
stamp(s)


# ================================================================== (3) 販売チャネル ← 元 ファンケル（3）
s = SL[20]
set_title(find(s.shapes, 7172), f"{CO}（3）　販売チャネル", "ドラッグストア中心から、ECと海外へ販路が広がり、小容量・詰替の品目が増える")
for sh in list(walk(s.shapes)):
    if sh.shape_id in (7286, 12, 17, 18, 19, 20) or (sh.has_text_frame and re.fullmatch(r"[\d.]+%(\*1)?", text_of(sh).strip() or "x")):
        delete(sh)
for sid in (7174, 7176, 7177, 7178, 7179, 21, 22, 24, 25, 26):
    sh = find(s.shapes, sid)
    if sh is not None:
        delete(sh)
native_chart(s, 0.05, 1.95, 4.7, 4.95, XL_CHART_TYPE.COLUMN_STACKED_100, ["2022/3", "2023/3", "2024/3", "2025/3", "2026/3予"],
             [("海外", (3, 3, 4, 4, 5)), ("百貨店・専門店", (12, 11, 11, 10, 10)), ("EC", (7, 9, 11, 13, 16)),
              ("量販・バラエティ", (15, 14, 14, 13, 13)), ("ドラッグストア", (63, 63, 60, 60, 56))],
             [D5, D4, D3, D2, D1], label_fmt='0"%"')
legend(s, 4.78, 2.0, [(D1, "ドラッグストア"), (D2, "量販・バラエティ"), (D3, "EC"), (D4, "百貨店・専門店"), (D5, "海外")], step=0.25)
set_paras(find(s.shapes, 7237), [
    (0, "ドラッグストアが売上の過半を占める主力チャネル"),
    (1, "敏感肌向けの棚で定番化し、安定した販売基盤を持つ（サンプル文章）"),
    (1, ""),
    (0, "EC比率が7%から16%へ上昇", {"color": RED}),
    (1, "EC限定の小容量・お試し・詰替の品目が増え、容器の種類が増加", {"color": RED}),
    (1, ""),
    (0, "海外は現地生産の開始に合わせて拡大する方針"),
    (1, "海外向けの容器を現地で調達するかは未公表"),
])
set_paras(find(s.shapes, 7175), [(0, "出所：決算説明資料（想定）。数値はすべて架空　　注：2026/3期は会社予想")])
set_paras(find(s.shapes, 7285), [(0, "")])
set_paras(find(s.shapes, 7), [(0, "チャネル別売上構成比推移（2026/3予まで）")])
stamp(s)


# ================================================================== (4) 商品ラインナップ ← 元 EEE（2）
s = SL[23]
set_title(find(s.shapes, 7172), f"{CO}（4）　商品ラインナップ", "スキンケアとヘアケアは容器接点が大きい一方、UVはチューブ・スプレーが中心")
heads = {7: "スキンケア（ブランドA）", 29: "ヘアケア（ブランドC）", 11: "UV（ブランドD）", 17: "高価格帯（ブランドB）"}
for sid, t in heads.items():
    set_paras(find(s.shapes, sid), [(0, t)])
set_paras(find(s.shapes, 4), [
    (0, "化粧水・乳液・美容液・クリームまで4ステップで展開"),
    (0, "主力ブランドはブランドA"),
    (1, "○,○○○円～○,○○○円前後"),
    (1, "2026/3にブランドAを全面リニューアル", {"color": RED}),
    (0, "ボトル・ポンプ・エアレス・ジャーと容器形態が多い"),
])
set_paras(find(s.shapes, 6), [
    (0, "シャンプー・トリートメントを中心に展開"),
    (0, "ブランドはブランドCなど"),
    (1, "本体○,○○○円、詰替○,○○○円前後"),
    (0, "詰替の比率が上昇し、本体ボトルは長く使える設計が論点に", {"color": RED}),
])
set_paras(find(s.shapes, 13), [
    (0, "ジェル・ミルク・スプレー・スティックを展開"),
    (0, "ブランドはブランドDなど"),
    (1, "○○○円～○,○○○円前後"),
    (0, "チューブとエアゾール缶が中心で、樹脂ボトルの接点は限定的"),
])
set_paras(find(s.shapes, 53), [
    (0, "百貨店・EC向けの高価格帯スキンケア"),
    (0, "ガラス容器が中心で、樹脂容器との接点は小さい"),
])
cols = {0: (0.14, 2.74, ["minamo-lotion", "minamo-milk", "minamo-serum", "minamo-cream"]),
        1: (2.79, 5.39, ["refre-shampoo", "refre-treatment", "refre-refill"]),
        2: (5.44, 8.04, ["harenohi-tube", "harenohi-spray", "harenohi-stick"]),
        3: (8.09, 10.69, ["classica-lotion", "classica-cream"])}
for sid in (12, 18, 20, 22, 24, 31, 33, 37, 40, 44, 48, 52):
    delete(find(s.shapes, sid))
for x0, x1, names_ in cols.values():
    packs(s, names_, x0 + 0.05, 7.22, x1 - x0 - 0.1, 1.85)
stamp(s)


# ================================================================== (5) ブランド詳細 ← 元 ロート（4-3）
s = SL[25]
set_title(find(s.shapes, 7172), f"{CO}（5）　「ブランドA」", "主力ブランド。リニューアルを機に、エアレス化と意匠の統一で提案余地がある")
for sid, t in ((4, "112億円（2026/3予）"), (51, "14商品"), (55, "敏感肌に悩む20〜40代（サンプル）"), (58, "ドラッグストア、公式EC"), (61, "1,320〜3,300円程度")):
    set_paras(find(s.shapes, sid), [(0, t)])
set_paras(find(s.shapes, 7168), [(0, "敏感肌向けの低刺激スキンケア（サンプル文章）"), (0, "2026/3に処方・容器を全面リニューアル予定", {"color": RED}), (0, "ドラッグストアの定番からECへ展開を拡大")])
set_paras(find(s.shapes, 7170), [(0, "化粧水はPETボトル、美容液はエアレスを検討"), (0, "ライン全体で意匠をそろえる方針（推定）"), (0, "→機能性と統一感を重視")])
set_paras(find(s.shapes, 7173), [(0, "最後まで使い切りたい（サンプル）"), (0, "詰替があると助かる"), (0, "→使い切り性と詰替対応が改善テーマ")])
set_paras(find(s.shapes, 7188), [(0, "ライン全体で統一感のある意匠。容器形態はボトル・ポンプ・エアレス・ジャー")])
set_paras(find(s.shapes, 7190), [
    (0, "化粧水ボトルは当社が供給しており、ブランドの意匠を理解している"),
    (1, "リニューアルの容器選定で、既存取引を起点に提案できる"),
    (0, "美容液・乳液のエアレス化に、化粧水ボトルと意匠をそろえた容器を提案", {"color": RED}),
    (1, "詰替対応も含め、ライン全体での採用を狙う"),
])
for sid in (6, 11, 16, 18, 22, 24):
    delete(find(s.shapes, sid))
packs(s, ["minamo-lotion", "minamo-milk", "minamo-serum", "minamo-cream"], 6.75, 3.38, 3.85, 1.4)
stamp(s)


# ================================================================== (8) 提案・連携余地 ← 元 EEE（3）
s = SL[32]
set_title(find(s.shapes, 2), f"{CO}（8）　提案・連携余地", "リニューアル・詰替拡大・海外生産に、既存取引を起点とした提案余地がある")
set_paras(find(s.shapes, 6), [(0, "ブランドAのリニューアルに合わせたエアレス容器")])
set_paras(find(s.shapes, 7), ink=True, items=[
    (0, "2026/3のリニューアルで、美容液・乳液の容器をエアレス化する方針"),
    (1, "化粧水ボトルを供給中で、ブランドの意匠を理解している"),
    (1, "化粧水ボトルと意匠をそろえたエアレス容器を提案（サンプル文章）", {"color": RED}),
])
set_paras(find(s.shapes, 13), [(0, "詰替拡大に合わせた本体ボトルの再設計")])
set_paras(find(s.shapes, 14), ink=True, items=[
    (0, "詰替の構成比が上昇し、中計でプラスチック使用量の削減を掲げる"),
    (1, "本体を長く使える設計、薄肉化、再生材の使用がテーマになる"),
    (1, "再生材ボトルと付け替えキャップのセットを提案（サンプル文章）", {"color": RED}),
])
set_paras(find(s.shapes, 9), [(0, "海外生産の立ち上げに合わせた容器供給")])
set_paras(find(s.shapes, 10), ink=True, items=[
    (0, "海外子会社で2026/10に現地生産を開始予定"),
    (1, "容器を現地で調達するか、日本から供給するかは未公表"),
    (1, "立ち上げ期の日本仕様の容器供給から入る（サンプル文章）"),
])
stamp(s)


# ================================================================== 追加の3枚（気に入られた図を元資料の体裁で）
ref_head = find(SL[23].shapes, 8)      # 節見出しのグループ
ref_title_slide = SL[32]               # 「タイトルのみ」


def new_slide(title, message):
    sl = prs.slides.add_slide(ref_title_slide.slide_layout)
    for ph in list(sl.placeholders):
        if "番号" not in ph.name:
            delete(ph)
    t = copy.deepcopy(find(ref_title_slide.shapes, 2)._element)
    sl.shapes._spTree.append(t)
    set_title(sl.shapes[-1], title, message)
    if not any("番号" in ph.name for ph in sl.placeholders):
        sl.shapes._spTree.append(copy.deepcopy(find(ref_title_slide.shapes, 3)._element))
    stamp(sl)
    return sl


# (6) 直近の事業動向：年表＋出来事の表
s6 = new_slide(f"{CO}（6）　直近の事業動向", "2024年以降、中計・組織新設・海外生産が続き、容器の仕様と調達先を見直す局面にある")
ev = [("2024/5", "戦略", "中期経営計画を公表", "2030年に容器のプラスチック30%削減", "詰替・薄肉化・再生材の採用が進む", True),
      ("2024/11", "商品", "ブランドCの詰替を全品目に拡大", "シャンプー・トリートメントの詰替を発売", "本体ボトルが減り、パウチが増える", True),
      ("2025/3", "投資", "工場にチューブの充填ラインを増設", "投資額○○億円（サンプル）", "チューブの調達量が増える", False),
      ("2025/10", "海外", "海外子会社を設立", "2026/10に現地生産を開始", "現地調達の容器が必要になる", True),
      ("2026/3予", "商品", "ブランドAを全面リニューアル", "美容液・乳液の容器をエアレス化（求人より）", "エアレス容器の新規採用", True),
      ("2026/4", "組織", "パッケージ開発部を新設", "容器の企画・仕様決定を独立", "容器選定の窓口が明確になる", True),
      ("2026/6", "商品", "ブランドDに新剤型を追加", "スティック・スプレーを追加", "新しい剤型の容器が必要", False)]
ty = 1.55
seg(s6, 0.45, ty + 0.4, 10.35, ty + 0.4, G1, 1.25)


def tx(ym):
    y, m = ym.replace("予", "").split("/")
    return 0.45 + 9.9 * ((int(y) - 2024) * 12 + int(m) - 1) / 36


for yr in (2024, 2025, 2026):
    xx = tx(f"{yr}/1")
    seg(s6, xx, ty + 0.28, xx, ty + 0.52, G1, 1.0)
    tb(s6, xx + 0.04, ty + 0.44, 0.7, 0.22, [(f"{yr}年", {"size": 9, "color": G1})], margin=0)
for k, e in enumerate(ev):
    xx = tx(e[0])
    rect(s6, xx - 0.07, ty + 0.33, 0.14, 0.14, RED if e[5] else D4, None, shape=MSO_SHAPE.OVAL)
    tb(s6, xx - 0.55, ty if k % 2 == 0 else ty + 0.6, 1.1, 0.24, [(e[0], {"size": 9, "bold": True, "color": RED if e[5] else G1})], align=C, anchor=MID, margin=0)
widths = [0.8, 0.6, 2.4, 2.75, 2.35, 1.4]
heads6 = ["時期", "区分", "出来事", "内容", "容器への影響", "出所"]
srcs = ["中計資料", "プレスリリース", "業界紙", "プレスリリース", "求人情報", "人事発表", "プレスリリース"]
y = 2.5
x = 0.3
for j, h in enumerate(heads6):
    rect(s6, x, y, widths[j], 0.32, TOPIC, GRID, 0.5)
    tb(s6, x, y, widths[j], 0.32, [(h, {"size": 10, "bold": True})], align=C, anchor=MID)
    x += widths[j]
y += 0.32
for k, e in enumerate(ev):
    x = 0.3
    vals = [e[0], e[1], e[2], e[3], e[4], srcs[k] + "（想定）"]
    for j, v in enumerate(vals):
        rect(s6, x, y, widths[j], 0.53, WHITE, GRID, 0.5)
        hot = e[5] and j in (2, 4)
        tb(s6, x, y, widths[j], 0.53, [(v, {"size": 10, "bold": hot, "color": RED if hot else INK})], align=C if j < 2 else L, anchor=MID, margin=0.06)
        x += widths[j]
    y += 0.53
tb(s6, 0.36, 7.05, 10.0, 0.2, [("出所：プレスリリース・求人情報・業界紙（いずれも想定）。内容はすべて架空　　注：赤字は容器の需要・仕様・調達先に影響する出来事", {"size": 9})], margin=0)

# (7) 既存取引との照合
s7 = new_slide(f"{CO}（7）　既存取引との照合", "当社の取引は2品のみ。リニューアル・新剤型・海外生産で、新たな容器需要が生まれる")
cols7 = ["ボトル", "ポンプ", "エアレス", "ジャー", "チューブ", "詰替パウチ", "新剤型"]
rows7 = ["ブランドA", "ブランドB", "ブランドD（UV）", "ブランドC", "ボディ・その他", "海外生産品"]
ST = {"T": ("当社取引中", D5, WHITE), "O": ("他社（推定）", D1, INK), "N": ("新規発生", WHITE, RED), "U": ("要確認", WHITE, G1), "-": ("−", WHITE, G1)}
g7 = [["T", "O", "N", "O", "-", "U", "-"], ["O", "O", "O", "O", "-", "-", "-"], ["-", "-", "-", "-", "O", "-", "N"],
      ["T", "O", "-", "-", "-", "O", "-"], ["O", "O", "-", "-", "O", "O", "-"], ["N", "N", "U", "U", "N", "U", "-"]]
n7 = [["化粧水", "乳液", "美容液・乳液\n2026/3〜", "クリーム", "", "", ""], ["ガラス", "", "", "ガラス", "", "", ""],
      ["", "", "", "", "ラミネート", "", "スティック\n2026/6〜"], ["本体ボトル", "ポンプ部品", "", "", "", "", ""],
      ["", "泡ポンプ", "", "", "", "", ""], ["2026/10〜", "同左", "品目未公表", "品目未公表", "同左", "", ""]]
gx, gy, lw, cw, rh = 0.3, 1.55, 1.45, 1.03, 0.68
rect(s7, gx, gy, lw, 0.38, TOPIC, GRID, 0.5)
for j, c_ in enumerate(cols7):
    xx = gx + lw + j * cw
    rect(s7, xx, gy, cw, 0.38, TOPIC, GRID, 0.5)
    tb(s7, xx, gy, cw, 0.38, [(c_, {"size": 10.5, "bold": True})], align=C, anchor=MID)
for i, b in enumerate(rows7):
    yy = gy + 0.38 + i * rh
    rect(s7, gx, yy, lw, rh, TOPIC, GRID, 0.5)
    tb(s7, gx, yy, lw, rh, [(b, {"size": 10.5})], align=C, anchor=MID)
    for j in range(7):
        k = g7[i][j]
        nm, fill, fg = ST[k]
        xx = gx + lw + j * cw
        rect(s7, xx, yy, cw, rh, fill, RED if k == "N" else GRID, 1.75 if k == "N" else 0.5, dash=k == "N")
        paras = [(nm, {"size": 9.5, "bold": k in ("T", "N"), "color": fg})]
        if n7[i][j]:
            paras.append((n7[i][j], {"size": 8.5, "color": fg}))
        tb(s7, xx, yy, cw, rh, paras, align=C, anchor=MID, margin=0.02)
ly = gy + 0.38 + 6 * rh + 0.1
for k_i, k in enumerate(("T", "O", "N", "U")):
    nm, fill, fg = ST[k]
    rect(s7, gx + k_i * 1.5, ly + 0.04, 0.28, 0.16, fill, RED if k == "N" else GRID, 1.0, dash=k == "N")
    tb(s7, gx + k_i * 1.5 + 0.34, ly, 1.1, 0.24, [(nm, {"size": 9.5})], anchor=MID, margin=0)
heading(s7, ref_head, 9.0, 1.45, 1.7, "未確認事項")
tb(s7, 9.0, 1.9, 1.72, 3.6, [("・ブランドAの詰替の有無", {"size": 9.5, "color": RED}), ("・エアレス容器の仕様決定の時期", {"size": 9.5}),
                              ("・ポンプ部品の調達先", {"size": 9.5}), ("・海外生産の品目と、容器の調達方針", {"size": 9.5, "color": RED})], line=1.15)
tb(s7, 0.36, 7.05, 10.0, 0.2, [("出所：依頼元の取引実績（架空設定）、公式サイト・求人情報（想定）　　注：他社は公開情報からの推定", {"size": 9})], margin=0)

# (9) 提案テーマの優先順位と次の打ち手
s9 = new_slide(f"{CO}（9）　優先順位と営業アクション", "優先はブランドAのエアレス容器。11月中にパッケージ開発部へ初回訪問する")
heading(s9, ref_head, 0.3, 1.45, 3.7, "提案テーマの優先順位")
mx, my, mw, mh = 0.75, 1.95, 3.15, 3.15
rect(s9, mx, my, mw, mh, WHITE, RGBColor(0x7F, 0x7F, 0x7F), 0.75)
seg(s9, mx + mw / 2, my, mx + mw / 2, my + mh, GRID, 0.75, dash=True)
seg(s9, mx, my + mh / 2, mx + mw, my + mh / 2, GRID, 0.75, dash=True)
tb(s9, mx, my + mh + 0.04, mw, 0.24, [("確度　→（高い）", {"size": 9.5})], align=R, margin=0)
tb(s9, 0.25, my, 0.45, mh, [("規模", {"size": 9.5}), ("↑", {"size": 9.5}), ("大", {"size": 9.5})], align=C, anchor=MID, margin=0)
for cxp, cyp, rr, lab, fill, fg in [(0.8, 0.2, 0.27, "1", D5, WHITE), (0.6, 0.42, 0.21, "2", D4, WHITE),
                                     (0.36, 0.57, 0.21, "3", D2, INK), (0.2, 0.8, 0.2, "見送り", D1, INK)]:
    bx, by = mx + mw * cxp - rr, my + mh * cyp - rr
    rect(s9, bx, by, rr * 2, rr * 2, fill, RGBColor(0x59, 0x59, 0x59), 0.75, shape=MSO_SHAPE.OVAL)
    tb(s9, bx - 0.15, by, rr * 2 + 0.3, rr * 2, [(lab, {"size": 9 if lab == "見送り" else 12, "bold": True, "color": fg})], align=C, anchor=MID, margin=0)
tb(s9, 0.3, 5.45, 3.7, 1.4, [("1　ブランドAのエアレス容器", {"size": 10}), ("2　ブランドCの本体ボトル再設計", {"size": 10}),
                             ("3　海外生産品の容器供給", {"size": 10}), ("見送り：ブランドDのスティック容器", {"size": 10})], line=1.2)
heading(s9, ref_head, 4.25, 1.45, 6.45, "アクションプラン")
hdr9 = ["テーマ", "対象部門", "商談で確認すること", "次のアクション"]
w9 = [1.15, 1.45, 2.55, 1.3]
acts = [("1 エアレス", "パッケージ開発部", "リニューアルの日程と、容器仕様の決定時期／評価中のサプライヤー", "11月：初回訪問"),
        ("2 本体再設計", "購買部", "再生材の目標比率と時期／付け替え式の検討状況", "12月：サンプル提出"),
        ("3 海外生産", "海外事業部・購買部", "現地生産の品目／容器の調達方針", "1月：方針を確認")]
y = 1.95
x = 4.25
for j, h in enumerate(hdr9):
    rect(s9, x, y, w9[j], 0.34, TOPIC, GRID, 0.5)
    tb(s9, x, y, w9[j], 0.34, [(h, {"size": 10, "bold": True})], align=C, anchor=MID)
    x += w9[j]
y += 0.34
for i, a in enumerate(acts):
    x = 4.25
    for j, v in enumerate(a):
        rect(s9, x, y, w9[j], 0.95, WHITE, GRID, 0.5)
        hot = i == 0 and j in (0, 3)
        tb(s9, x, y, w9[j], 0.95, [(v, {"size": 10, "bold": hot, "color": RED if hot else INK})], align=L, anchor=MID, margin=0.06)
        x += w9[j]
    y += 0.95
tb(s9, 4.25, 5.25, 6.45, 1.5, [("初回訪問で持ち込むもの（サンプル）", {"size": 10.5, "bold": True}),
                              ("・既存の化粧水ボトルと意匠をそろえたエアレス容器の試作品", {"size": 10}),
                              ("・再生材ボトルの採用事例", {"size": 10}), ("・中計のプラスチック削減目標に対する、容器別の削減効果の試算", {"size": 10})], line=1.2)
tb(s9, 0.36, 7.05, 10.0, 0.2, [("出所：(1)〜(8)の分析（架空）　　注：確度・規模は公開情報と取引実績からの見立て", {"size": 9})], margin=0)


# ================================================================== 並べ替えと不要なスライドの削除
order = [SL[0], SL[17], SL[19], SL[20], SL[23], SL[25], s6, s7, SL[32], s9]
keep_ids = {id(x._element) for x in order}
sldIdLst = prs.slides._sldIdLst
id_by_slide = {}
for sid in list(sldIdLst):
    sl = prs.part.related_part(sid.get(qn("r:id"))).slide
    id_by_slide[id(sl._element)] = sid
for sid in list(sldIdLst):
    rid = sid.get(qn("r:id"))
    sl = prs.part.related_part(rid).slide
    if id(sl._element) not in keep_ids:
        sldIdLst.remove(sid)
        prs.part.drop_rel(rid)
for sid in list(sldIdLst):
    sldIdLst.remove(sid)
for sl in order:
    sldIdLst.append(id_by_slide[id(sl._element)])
for n, sl in enumerate(order[1:], 1):
    page_no(sl, n)

# 左下の印刷日時（レイアウト・マスターの日時フィールド）を消す。使っているレイアウトとそのマスターだけ
holders = []
for sl in order:
    holders += [sl.slide_layout, sl.slide_layout.slide_master]
for h in {id(x): x for x in holders}.values():
    for sh in list(h.shapes):
        if 'type="datetime' in etree.tostring(sh._element).decode():
            sh._element.getparent().remove(sh._element)

# ------------------------------------------------------------------ 元資料の痕跡を消す
# 見えない所に元資料の情報が残らないようにする（think-cell のデータ、タグ、ノート、使っていないマスター等）
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
for sl in order:
    for gf in list(sl.shapes._spTree.iter(qn("p:graphicFrame"))):
        ole = gf.find(".//" + qn("p:oleObj"))
        if ole is not None:
            rid = ole.get(f"{{{R_NS}}}id")
            gf.getparent().remove(gf)
            if rid:
                sl.part.drop_rel(rid)
    for cdl in list(sl._element.iter(qn("p:custDataLst"))):
        for tag in cdl.findall(qn("p:tags")):
            sl.part.drop_rel(tag.get(f"{{{R_NS}}}id"))
        cdl.getparent().remove(cdl)
    for rel in list(sl.part.rels.values()):
        if rel.reltype.endswith("/notesSlide"):
            sl.part.drop_rel(rel.rId)

def prune_rels(part, element, keep_types=("/slideLayout", "/slideMaster", "/theme")):
    """図形を消しても参照先（写真・グラフ・データ）は残るので、どこからも使われていない参照を外す"""
    used = set()
    for el in element.iter():
        for k, v in el.attrib.items():
            if k.startswith(f"{{{R_NS}}}"):
                used.add(v)
    for rel in list(part.rels.values()):
        if rel.rId not in used and not rel.reltype.endswith(keep_types):
            part.drop_rel(rel.rId)


for sl in order:
    prune_rels(sl.part, sl._element)
    # レイアウトとマスターに残る think-cell のデータも外す
    for holder in (sl.slide_layout, sl.slide_layout.slide_master):
        for gf in list(holder._element.iter(qn("p:graphicFrame"))):
            if gf.find(".//" + qn("p:oleObj")) is not None:
                gf.getparent().remove(gf)
        for cdl in list(holder._element.iter(qn("p:custDataLst"))):
            cdl.getparent().remove(cdl)
        prune_rels(holder.part, holder._element, keep_types=("/slideLayout", "/slideMaster", "/theme"))

used_layouts = {id(sl.slide_layout._element) for sl in order}
pres_el = prs.part._element
master_lst = pres_el.find(qn("p:sldMasterIdLst"))
for mid in list(master_lst):
    m_part = prs.part.related_part(mid.get(f"{{{R_NS}}}id"))
    master = m_part.slide_master
    lay_lst = master._element.find(qn("p:sldLayoutIdLst"))
    keep_any = False
    for lid in list(lay_lst):
        lay = m_part.related_part(lid.get(f"{{{R_NS}}}id")).slide_layout
        if id(lay._element) in used_layouts:
            keep_any = True
        else:
            lay_lst.remove(lid)
            m_part.drop_rel(lid.get(f"{{{R_NS}}}id"))
    if not keep_any:
        master_lst.remove(mid)
        prs.part.drop_rel(mid.get(f"{{{R_NS}}}id"))

prs.save(OUT)

# パッケージ単位：改訂履歴・SharePoint のメタデータ・サムネイル・文書のプロパティを消す
import zipfile
drop_prefix = ("ppt/changesInfos/", "ppt/revisionInfo.xml", "customXml/", "docProps/thumbnail", "docProps/custom.xml")
src = zipfile.ZipFile(OUT)
items = {n: src.read(n) for n in src.namelist()}
src.close()
for n in list(items):
    if n.startswith(drop_prefix):
        del items[n]


def strip_rels(xml_bytes):
    root = etree.fromstring(xml_bytes)
    for rel in list(root):
        target = rel.get("Target", "")
        if any(k in target for k in ("changesInfo", "revisionInfo", "customXml", "thumbnail", "custom.xml")):
            root.remove(rel)
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


for n in ("_rels/.rels", "ppt/_rels/presentation.xml.rels"):
    items[n] = strip_rels(items[n])
ct = etree.fromstring(items["[Content_Types].xml"])
for ov in list(ct):
    pn = ov.get("PartName", "")
    if pn and pn.lstrip("/").startswith(drop_prefix):
        ct.remove(ov)
items["[Content_Types].xml"] = etree.tostring(ct, xml_declaration=True, encoding="UTF-8", standalone=True)
items["docProps/app.xml"] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                             '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">'
                             '<Application>Microsoft Office PowerPoint</Application><Company>Neunon Consulting</Company></Properties>').encode()
items["docProps/core.xml"] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                              '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
                              'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
                              'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
                              f'<dc:title>{CO}　企業クローズアップ（架空企業による分析サンプル）</dc:title>'
                              '<dc:creator>Neunon Consulting</dc:creator></cp:coreProperties>').encode()
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zout:
    order_first = ["[Content_Types].xml"]
    for n in order_first + [k for k in items if k not in order_first]:
        zout.writestr(n, items[n])
print("saved", OUT, len(prs.slides), "slides,", len(items), "parts")
