from datetime import datetime
from pathlib import Path
from fpdf import FPDF

from app.config import settings
from app.schemas import CategorySchema, Language, ProductSchema

DEJAVU_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJAVU_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WQY_TTF = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttf"


def _loc(obj, lang: Language) -> str:
    return getattr(obj, lang, "") or obj.ru or obj.en or obj.be or obj.zh or ""


def _safe_ascii(text: str) -> str:
    return text.encode("latin-1", "replace").decode("latin-1")


def generate_product_spec_pdf(
    product: ProductSchema,
    category: CategorySchema | None,
    language: Language,
) -> bytes:
    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    use_cjk = language == "zh" and Path(WQY_TTF).exists()
    use_dejavu = Path(DEJAVU_REGULAR).exists() and Path(DEJAVU_BOLD).exists()

    if use_cjk:
        pdf.add_font("AppFont", style="", fname=WQY_TTF)
        pdf.add_font("AppFont", style="B", fname=WQY_TTF)
        font_family = "AppFont"
        sanitize = lambda s: s
    elif use_dejavu:
        pdf.add_font("AppFont", style="", fname=DEJAVU_REGULAR)
        pdf.add_font("AppFont", style="B", fname=DEJAVU_BOLD)
        font_family = "AppFont"
        sanitize = lambda s: s
    else:
        font_family = "Helvetica"
        sanitize = _safe_ascii

    labels = {
        "ru": {
            "header": "ОАО «МОЛОЧНЫЙ МИР» (milk.by) — B2B / ЭКСПОРТНАЯ СПЕЦИФИКАЦИЯ",
            "sub": "230005, Республика Беларусь, г. Гродно, ул. Гаспадарчая, 28 | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Категория",
            "fat": "Массовая доля жира",
            "prot": "Белок на 100 г",
            "lactose": "Лактоза",
            "lactose_free": "Без лактозы (< 0,01%)",
            "lactose_nat": "Природная молочная",
            "export": "Экспортный статус",
            "export_yes": "Сертифицирован для экспорта (B2B)",
            "export_no": "Внутренний / региональный рынок",
            "desc": "Описание продукта",
            "specs": "Технические характеристики",
            "packs": "Матрица фасовок и логистики короба",
            "col_w": "Масса/объём",
            "col_pkg": "Упаковка",
            "col_shelf": "Срок годности",
            "col_stor": "Хранение",
            "col_box": "Шт/кор",
            "col_gtin": "GTIN",
            "contacts": "Отдел экспорта: export@milk.by · +375 (152) 44-55-12 | Оптовые продажи: sales@milk.by · +375 (152) 44-55-01",
        },
        "be": {
            "header": "ААТ «МАЛОЧНЫ МІР» (milk.by) — B2B / ЭКСПАРТНАЯ СПЕЦЫФІКАЦЫЯ",
            "sub": "230005, Рэспубліка Беларусь, г. Гродна, вул. Гаспадарчая, 28 | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Катэгорыя",
            "fat": "Масавая доля тлушчу",
            "prot": "Бялок на 100 г",
            "lactose": "Лактоза",
            "lactose_free": "Без лактозы (< 0,01%)",
            "lactose_nat": "Прыродная малочная",
            "export": "Экспартны статус",
            "export_yes": "Сертыфікаваны для экспарту (B2B)",
            "export_no": "Унутраны / рэгіянальны рынак",
            "desc": "Апісанне прадукту",
            "specs": "Тэхнічныя характарыстыкі",
            "packs": "Матрыца фасовак і лагістыкі каробкі",
            "col_w": "Маса/аб’ём",
            "col_pkg": "Упакоўка",
            "col_shelf": "Тэрмін",
            "col_stor": "Захоўванне",
            "col_box": "Шт/кар",
            "col_gtin": "GTIN",
            "contacts": "Аддзел экспарту: export@milk.by · +375 (152) 44-55-12 | Аптовыя продажы: sales@milk.by · +375 (152) 44-55-01",
        },
        "en": {
            "header": 'OJSC "MOLOCHNY MIR" (milk.by) — B2B / EXPORT PRODUCT SPECIFICATION',
            "sub": "28 Gaspadarchaya St, Grodno 230005, Republic of Belarus | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Category",
            "fat": "Fat Content",
            "prot": "Protein / 100g",
            "lactose": "Lactose",
            "lactose_free": "Lactose-Free (< 0.01%)",
            "lactose_nat": "Natural dairy lactose",
            "export": "Export Readiness",
            "export_yes": "Export Certified (B2B)",
            "export_no": "Domestic / Regional",
            "desc": "Product Overview",
            "specs": "Technical Specifications",
            "packs": "Packaging Variants & Box Logistics",
            "col_w": "Weight/Vol",
            "col_pkg": "Packaging Type",
            "col_shelf": "Shelf Life",
            "col_stor": "Storage",
            "col_box": "Pcs/Box",
            "col_gtin": "GTIN",
            "contacts": "Export Dept: export@milk.by · +375 (152) 44-55-12 | Wholesale Sales: sales@milk.by · +375 (152) 44-55-01",
        },
        "zh": {
            "header": "MOLOCHNY MIR 股份公司 (milk.by) — B2B / 国际出口产品技术规格书",
            "sub": "白俄罗斯格罗德诺市 Gaspadarchaya 街28号 (230005) | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "产品分类",
            "fat": "乳脂含量",
            "prot": "蛋白质 / 100克",
            "lactose": "乳糖含量",
            "lactose_free": "无乳糖 (< 0.01%)",
            "lactose_nat": "含天然乳糖",
            "export": "出口资质",
            "export_yes": "具备国际出口认证 (B2B)",
            "export_no": "国内及区域供应",
            "desc": "产品概述",
            "specs": "产品技术参数",
            "packs": "包装规格与装箱物流矩阵",
            "col_w": "规格",
            "col_pkg": "包装形式",
            "col_shelf": "保质期",
            "col_stor": "储存温度",
            "col_box": "件/箱",
            "col_gtin": "GTIN 条码",
            "contacts": "出口部门: export@milk.by · +375 (152) 44-55-12 | 批发部: sales@milk.by · +375 (152) 44-55-01",
        },
    }[language]

    # Top brand banner
    pdf.set_fill_color(0, 87, 184)
    pdf.rect(0, 0, 210, 26, style="F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font(font_family, "B", 11)
    pdf.set_xy(14, 7)
    pdf.cell(182, 6, sanitize(labels["header"]), new_x="LMARGIN", new_y="NEXT")
    pdf.set_font(font_family, "", 8)
    pdf.set_x(14)
    pdf.cell(182, 5, sanitize(labels["sub"]), new_x="LMARGIN", new_y="NEXT")

    pdf.set_text_color(15, 23, 42)
    pdf.set_xy(14, 34)
    pdf.set_font(font_family, "B", 16)
    pdf.multi_cell(182, 8, sanitize(_loc(product.name, language)))

    cat_name = _loc(category.name, language) if category else product.category
    canonical_url = f"{settings.public_base_url.rstrip('/')}/{language}/product/{product.slug}"
    pdf.set_font(font_family, "", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.set_x(14)
    pdf.cell(182, 5, sanitize(f"{labels['cat']}: {cat_name}  |  SKU: {product.id}  |  {canonical_url}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    # Key summary grid
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    summary_rows = [
        (labels["fat"], f"{product.fat_content}%" if product.fat_content is not None else "—"),
        (labels["prot"], f"{product.protein_content} g / 100g" if product.protein_content is not None else "—"),
        (labels["lactose"], labels["lactose_free"] if product.lactose_free else labels["lactose_nat"]),
        (labels["export"], labels["export_yes"] if product.export_ready else labels["export_no"]),
    ]
    for k, v in summary_rows:
        pdf.set_font(font_family, "B", 9)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(58, 7, sanitize(k), border=1, fill=True)
        pdf.set_font(font_family, "", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(124, 7, sanitize(v), border=1, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(4)

    # Description
    pdf.set_font(font_family, "B", 11)
    pdf.set_text_color(0, 87, 184)
    pdf.cell(182, 6, sanitize(labels["desc"]), new_x="LMARGIN", new_y="NEXT")
    pdf.set_font(font_family, "", 9.5)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(182, 5.2, sanitize(_loc(product.description, language)))
    pdf.ln(4)

    # Technical Characteristics
    if product.characteristics:
        pdf.set_font(font_family, "B", 11)
        pdf.set_text_color(0, 87, 184)
        pdf.cell(182, 6, sanitize(labels["specs"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

        schema_map = {f.key: _loc(f.label, language) for f in (category.characteristic_schema if category else [])}
        for key, val in product.characteristics.items():
            lbl = schema_map.get(key, key)
            pdf.set_font(font_family, "B", 9)
            pdf.set_text_color(71, 85, 105)
            pdf.cell(58, 6.5, sanitize(lbl), border=1, fill=True)
            pdf.set_font(font_family, "", 9)
            pdf.set_text_color(15, 23, 42)
            pdf.cell(124, 6.5, sanitize(_loc(val, language)), border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

    # Packaging Variants & Box Logistics
    if product.packages:
        pdf.set_font(font_family, "B", 11)
        pdf.set_text_color(0, 87, 184)
        pdf.cell(182, 6, sanitize(labels["packs"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

        widths = [24, 56, 32, 26, 16, 28]
        headers = [labels["col_w"], labels["col_pkg"], labels["col_shelf"], labels["col_stor"], labels["col_box"], labels["col_gtin"]]
        pdf.set_fill_color(0, 87, 184)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font(font_family, "B", 8)
        for w, h in zip(widths, headers):
            pdf.cell(w, 7, sanitize(h), border=1, fill=True)
        pdf.ln()

        pdf.set_text_color(15, 23, 42)
        pdf.set_font(font_family, "", 8)
        for idx, pkg in enumerate(product.packages):
            fill = idx % 2 == 1
            pdf.set_fill_color(248, 250, 252)
            row = [
                pkg.weight,
                _loc(pkg.packaging_type, language)[:32],
                _loc(pkg.shelf_life, language)[:22],
                _loc(pkg.storage, language)[:16],
                str(pkg.units_per_box),
                pkg.gtin or "—",
            ]
            for w, cell_val in zip(widths, row):
                pdf.cell(w, 6.5, sanitize(cell_val), border=1, fill=fill)
            pdf.ln()

    # Footer
    pdf.ln(8)
    pdf.set_draw_color(203, 213, 225)
    pdf.line(14, pdf.get_y(), 196, pdf.get_y())
    pdf.ln(3)
    pdf.set_font(font_family, "", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.multi_cell(182, 4.5, sanitize(f"{labels['contacts']}\nGenerated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"))

    return bytes(pdf.output())
