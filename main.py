"""
FastAPI Application for Provincial Budget Intelligence Dashboard
Serves analytical APIs and modern Glassmorphism Frontend.
"""

from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.load_data import load_raw_datasets
from src.clean_data import (
    clean_budget_data,
    clean_gdp_data,
    clean_party_data,
    build_province_master_dataset,
    REGIONS_6_MAP,
)
from src.metrics import (
    calculate_national_kpis,
    calculate_breakdowns,
    get_province_detail_kpis,
    calculate_correlation_analysis,
    calculate_party_summary,
    get_data_quality_audit,
)


app = FastAPI(
    title="Provincial Budget Intelligence API",
    description="ระบบวิเคราะห์งบประมาณรายจังหวัด ผลิตภัณฑ์มวลรวม (GPP) และเศรษฐกิจการเมืองไทย พ.ศ. 2566",
    version="2.0.0",
)

# Enable CORS for local testing and cross-origin fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load and prepare master datasets in memory at startup (Strictly Year 2566 only)
try:
    df_raw_budget, df_raw_gdp, df_raw_party = load_raw_datasets()
    b_clean = clean_budget_data(df_raw_budget)
    g_summary = clean_gdp_data(df_raw_gdp)
    p_clean = clean_party_data(df_raw_party)
    master_df = build_province_master_dataset(b_clean, g_summary, p_clean)
except Exception as e:
    raise RuntimeError(f"Failed to initialize database: {e}")


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/api/filters")
def get_filters():
    """Returns available filtering options for dropdowns."""
    provinces = sorted(master_df["changwad_area_name"].tolist())
    regions = sorted(list(set(REGIONS_6_MAP.values())))
    ministries = sorted([m for m in b_clean["min_name"].unique() if m])
    objcs = sorted([o for o in b_clean["objc"].unique() if o])
    parties = sorted([p for p in p_clean["party_name"].unique() if p])

    return {
        "provinces": provinces,
        "regions": ["ทุกภูมิภาค"] + regions,
        "ministries": ["ทุกกระทรวง"] + ministries,
        "objcs": ["ทุกประเภทงบ"] + objcs,
        "parties": ["ทุกพรรค"] + parties,
        "years": [2566],
    }


@app.get("/api/overview")
def get_overview(
    region: Optional[str] = Query(None, description="กรองตามภูมิภาค"),
    min_name: Optional[str] = Query(None, description="กรองตามกระทรวง"),
    objc: Optional[str] = Query(None, description="กรองตามประเภทงบ"),
):
    """Returns top-level national KPIs, breakdowns, and top/bottom rankings."""
    kpis = calculate_national_kpis(b_clean, region=region, min_name=min_name, objc=objc)

    # Filtered province master
    f_master = master_df.copy()
    if region and region != "ทุกภูมิภาค":
        f_master = f_master[f_master["region"] == region]

    # Top 10 & Bottom 10 provinces
    top_10 = (
        f_master.sort_values("budget_million", ascending=False)
        .head(10)[["changwad_area_name", "region", "budget_million", "party_name"]]
        .rename(columns={"changwad_area_name": "province"})
        .to_dict(orient="records")
    )
    bottom_10 = (
        f_master.sort_values("budget_million", ascending=True)
        .head(10)[["changwad_area_name", "region", "budget_million", "party_name"]]
        .rename(columns={"changwad_area_name": "province"})
        .to_dict(orient="records")
    )

    # Breakdowns
    breakdown_min = calculate_breakdowns(b_clean, "min_name", top_n=10, region=region, objc=objc)
    breakdown_objc = calculate_breakdowns(b_clean, "objc", top_n=0, region=region, min_name=min_name)
    breakdown_region = calculate_breakdowns(b_clean[~b_clean["is_central"]], "region", top_n=0, min_name=min_name, objc=objc)

    return {
        "kpis": kpis,
        "top_10": top_10,
        "bottom_10": bottom_10,
        "breakdown_ministry": breakdown_min,
        "breakdown_objc": breakdown_objc,
        "breakdown_region": breakdown_region,
    }


@app.get("/api/budget/ranking")
def get_budget_ranking(
    region: Optional[str] = Query(None),
    objc: Optional[str] = Query(None),
    min_name: Optional[str] = Query(None),
    party: Optional[str] = Query(None),
    top_n: int = Query(77, ge=5, le=77),
):
    """Returns province ranking data according to filters."""
    f_master = master_df.copy()
    if region and region != "ทุกภูมิภาค":
        f_master = f_master[f_master["region"] == region]
    if party and party != "ทุกพรรค":
        f_master = f_master[f_master["party_name"] == party]

    ranking = (
        f_master.sort_values("budget_million", ascending=False)
        .head(top_n)[
            [
                "changwad_area_name", "region", "budget_million", "budget_rank",
                "budget_per_capita_thb", "gpp_million", "gpp_per_capita_thb", "party_name"
            ]
        ]
        .rename(columns={"changwad_area_name": "province"})
        .to_dict(orient="records")
    )
    return {"count": len(ranking), "ranking": ranking}


@app.get("/api/budget/by-agency")
def get_budget_by_agency(
    province: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    min_name: Optional[str] = Query(None),
    top_n: int = Query(10, ge=3, le=50),
):
    """Returns spending by agency/department with filters."""
    agencies = calculate_breakdowns(
        b_clean,
        group_col="agc_name",
        top_n=top_n,
        province=province,
        region=region,
        min_name=min_name,
    )
    return {"agencies": agencies}


@app.get("/api/province/{province_name}")
def get_province_detail(province_name: str):
    """Returns comprehensive details for a single province (Year 2566 only)."""
    try:
        detail = get_province_detail_kpis(province_name, master_df, b_clean)
        return detail
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/economy/budget-gpp")
def get_economy_budget_gpp(
    exclude_outliers: bool = Query(True, description="ไม่รวม กทม. และ นนทบุรี"),
    per_capita: bool = Query(False, description="แสดงผลในรูปต่อหัวประชากร"),
):
    """Returns scatter points, Pearson/Spearman correlations, and quadrant classifications."""
    x_col = "budget_per_capita_thb" if per_capita else "budget_million"
    y_col = "gpp_per_capita_thb" if per_capita else "gpp_million"

    analysis = calculate_correlation_analysis(
        master_df,
        exclude_outliers=exclude_outliers,
        x_col=x_col,
        y_col=y_col,
    )
    return analysis


@app.get("/api/party/gpp")
def get_party_gpp(
    exclude_outliers: bool = Query(True, description="ไม่รวม กทม. และ นนทบุรี"),
    party: Optional[str] = Query(None, description="กรองเฉพาะพรรค"),
):
    """Returns distributions, box plot data, and party summary metrics."""
    data = calculate_party_summary(
        master_df,
        exclude_outliers=exclude_outliers,
        selected_party=party,
    )
    return data


@app.get("/api/data-quality")
def get_data_quality():
    """Returns 10-point data quality report and budget reconciliation status."""
    audit = get_data_quality_audit(b_clean, master_df)
    return audit


# =============================================================================
# Frontend Static Files Serving
# =============================================================================

STATIC_DIR = Path(__file__).resolve().parent / "static"

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    @app.get("/")
    def serve_frontend():
        """Serves main Single-Page Application (SPA)."""
        index_file = STATIC_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"message": "Frontend index.html is being prepared."}
