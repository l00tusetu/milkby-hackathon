from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Language = Literal["ru", "be", "en", "zh"]
FilterKey = Literal["fat", "lactoseFree", "highProtein", "exportReady"]
NewsCategoryId = Literal["company", "export", "products", "awards"]
InquiryChannel = Literal["export", "wholesale", "general"]


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class LocalizedText(CamelModel):
    ru: str = ""
    be: str = ""
    en: str = ""
    zh: str = ""


class PackageVariantSchema(CamelModel):
    id: str
    weight: str
    weight_grams: int
    shelf_life: LocalizedText
    storage: LocalizedText
    packaging_type: LocalizedText
    units_per_box: int = 1
    gtin: str = ""


class ProductSeoSchema(CamelModel):
    title: LocalizedText
    description: LocalizedText
    h1: LocalizedText


class ProductSchema(CamelModel):
    id: str
    slug: str
    category: str
    subcategory: str = "default"
    name: LocalizedText
    description: LocalizedText
    image: str
    fat_content: float | None = None
    protein_content: float | None = None
    lactose_free: bool = False
    export_ready: bool = True
    featured: bool = False
    visible: bool = True
    packages: list[PackageVariantSchema] = Field(default_factory=list)
    characteristics: dict[str, LocalizedText] = Field(default_factory=dict)
    use_cases: list[str] = Field(default_factory=list)
    related_ids: list[str] = Field(default_factory=list)
    seo: ProductSeoSchema


class CategorySubcategorySchema(CamelModel):
    id: str
    name: LocalizedText


class CharacteristicFieldSchema(CamelModel):
    key: str
    label: LocalizedText


class CategorySeoSchema(CamelModel):
    title: LocalizedText
    description: LocalizedText


class CategorySchema(CamelModel):
    id: str
    slug: str
    name: LocalizedText
    description: LocalizedText
    subcategories: list[CategorySubcategorySchema] = Field(default_factory=list)
    filter_keys: list[FilterKey] = Field(default_factory=list)
    characteristic_schema: list[CharacteristicFieldSchema] = Field(default_factory=list)
    seo: CategorySeoSchema


class NewsArticleSchema(CamelModel):
    id: str
    slug: str
    date: str
    year: int
    category_id: NewsCategoryId
    title: LocalizedText
    excerpt: LocalizedText
    content: LocalizedText
    image: str
    published: bool = True
    related_ids: list[str] = Field(default_factory=list)
    seo: CategorySeoSchema


class RedirectRuleSchema(CamelModel):
    id: int | None = None
    source: str = Field(alias="from")
    target: str = Field(alias="to")
    code: Literal[301] = 301
    note: str = ""


class B2BInquiryCreate(CamelModel):
    company: str = Field(min_length=1, max_length=255)
    contact_name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255)
    phone: str = ""
    country: str = ""
    product_id: str | None = None
    package_id: str | None = None
    volume: str = ""
    message: str = ""
    channel: InquiryChannel = "wholesale"
    language: Language = "ru"


class B2BInquiryResponse(B2BInquiryCreate):
    id: str
    status: str = "new"
    created_at: datetime


class ProductListResponse(CamelModel):
    items: list[ProductSchema]
    total: int
    page: int
    page_size: int
    total_pages: int


class NewsListResponse(CamelModel):
    items: list[NewsArticleSchema]
    total: int
    page: int
    page_size: int
    total_pages: int


class SmartCriterionSchema(CamelModel):
    id: str
    label: str


class SmartMatchResultSchema(CamelModel):
    product: ProductSchema
    score: float
    reasons: list[str]
    recommended_package: PackageVariantSchema | None = None


class AutocompleteSuggestionSchema(CamelModel):
    id: str
    slug: str
    name: LocalizedText
    category: str
    category_name: LocalizedText
    image: str
    fat_content: float | None = None
    recommended_package: PackageVariantSchema | None = None


class AutocompleteResponse(CamelModel):
    query: str
    corrected_query: str | None = None
    criteria: list[SmartCriterionSchema] = Field(default_factory=list)
    suggestions: list[AutocompleteSuggestionSchema] = Field(default_factory=list)
    total_matches: int = 0


class SmartSelectRequest(CamelModel):
    query: str = Field(min_length=1, max_length=500)
    language: Language = "ru"
    limit: int = Field(default=6, ge=1, le=20)


class SmartSelectResponse(CamelModel):
    query: str
    corrected_query: str | None = None
    mode: Literal["llm+db", "nlp+db"] = "nlp+db"
    criteria: list[SmartCriterionSchema] = Field(default_factory=list)
    results: list[SmartMatchResultSchema] = Field(default_factory=list)


class TranslationUpdateRequest(CamelModel):
    key: str
    language: Language
    value: str


class BulkImportResult(CamelModel):
    created: int
    updated: int
    skipped: int
    errors: list[str] = Field(default_factory=list)


class SeoAuditResponse(CamelModel):
    total_products: int
    unique_titles_by_lang: dict[str, int]
    duplicate_titles_by_lang: dict[str, list[str]]
    total_news: int
    total_redirects: int
    sitemap_url_count: int


class BootstrapResponse(CamelModel):
    categories: list[CategorySchema]
    products: list[ProductSchema]
    news: list[NewsArticleSchema]
    redirects: list[RedirectRuleSchema]
    translations: dict[str, LocalizedText]


def orm_product_to_schema(p: Any) -> ProductSchema:
    return ProductSchema(
        id=p.id,
        slug=p.slug,
        category=p.category_id,
        subcategory=p.subcategory_id,
        name=LocalizedText(**p.name),
        description=LocalizedText(**p.description),
        image=p.image,
        fat_content=p.fat_content,
        protein_content=p.protein_content,
        lactose_free=p.lactose_free,
        export_ready=p.export_ready,
        featured=p.featured,
        visible=p.visible,
        packages=[
            PackageVariantSchema(
                id=v.id,
                weight=v.weight,
                weight_grams=v.weight_grams,
                shelf_life=LocalizedText(**v.shelf_life),
                storage=LocalizedText(**v.storage),
                packaging_type=LocalizedText(**v.packaging_type),
                units_per_box=v.units_per_box,
                gtin=v.gtin,
            )
            for v in sorted(p.variants, key=lambda x: x.sort_order)
        ],
        characteristics={k: LocalizedText(**v) for k, v in (p.characteristics or {}).items()},
        use_cases=list(p.use_cases or []),
        related_ids=list(p.related_ids or []),
        seo=ProductSeoSchema(
            title=LocalizedText(**p.seo["title"]),
            description=LocalizedText(**p.seo["description"]),
            h1=LocalizedText(**p.seo.get("h1", p.name)),
        ),
    )


def orm_category_to_schema(c: Any) -> CategorySchema:
    return CategorySchema(
        id=c.id,
        slug=c.slug,
        name=LocalizedText(**c.name),
        description=LocalizedText(**c.description),
        subcategories=[CategorySubcategorySchema(**s) for s in (c.subcategories or [])],
        filter_keys=list(c.filter_keys or []),
        characteristic_schema=[CharacteristicFieldSchema(**f) for f in (c.characteristic_schema or [])],
        seo=CategorySeoSchema(
            title=LocalizedText(**c.seo["title"]),
            description=LocalizedText(**c.seo["description"]),
        ),
    )


def orm_news_to_schema(n: Any) -> NewsArticleSchema:
    return NewsArticleSchema(
        id=n.id,
        slug=n.slug,
        date=n.published_date.isoformat(),
        year=n.year,
        category_id=n.category_id,
        title=LocalizedText(**n.title),
        excerpt=LocalizedText(**n.excerpt),
        content=LocalizedText(**n.content),
        image=n.image,
        published=n.published,
        related_ids=list(n.related_ids or []),
        seo=CategorySeoSchema(
            title=LocalizedText(**n.seo["title"]),
            description=LocalizedText(**n.seo["description"]),
        ),
    )


def orm_redirect_to_schema(r: Any) -> RedirectRuleSchema:
    return RedirectRuleSchema.model_validate(
        {
            "id": r.id,
            "from": r.source_path,
            "to": r.target_path,
            "code": 301,
            "note": r.note,
        }
    )
