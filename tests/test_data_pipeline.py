"""
Unit tests for Data Pipeline, Cleaning, Reconciliation, and Formulas.
"""

import pytest
import pandas as pd
import numpy as np

from src.load_data import load_raw_datasets, resolve_data_paths
from src.clean_data import (
    clean_budget_data,
    clean_gdp_data,
    clean_party_data,
    build_province_master_dataset,
    standardize_province_name,
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


@pytest.fixture(scope="module")
def prepared_data():
    df_budget, df_gdp, df_party = load_raw_datasets()
    b_clean = clean_budget_data(df_budget)
    g_summary = clean_gdp_data(df_gdp)
    p_clean = clean_party_data(df_party)
    master = build_province_master_dataset(b_clean, g_summary, p_clean)
    return b_clean, g_summary, p_clean, master


def test_paths_resolution():
    paths = resolve_data_paths()
    assert "budget" in paths
    assert "gdp" in paths
    assert "party" in paths
    for p in paths.values():
        assert p.exists()


def test_province_standardization():
    assert standardize_province_name("กรุงเทพมหานคร") == "กรุงเทพมหานคร"
    assert standardize_province_name("เชียงใหม่") == "จังหวัดเชียงใหม่"
    assert standardize_province_name("จังหวัดเชียงใหม่") == "จังหวัดเชียงใหม่"
    assert standardize_province_name("ส่วนกลาง") == "ส่วนกลาง"


def test_budget_reconciliation(prepared_data):
    b_clean, _, _, master = prepared_data
    total_budget = b_clean["budget"].sum()
    assert total_budget == 3183658607900

    central_budget = b_clean[b_clean["is_central"]]["budget"].sum()
    assert central_budget == 590470000000

    prov_budget = b_clean[~b_clean["is_central"]]["budget"].sum()
    assert prov_budget == 2593188607900
    assert abs(master["budget"].sum() - prov_budget) < 1.0


def test_master_dataset_coverage(prepared_data):
    _, _, _, master = prepared_data
    assert len(master) == 77
    assert master["changwad_area_name"].nunique() == 77
    assert master["budget_million"].isnull().sum() == 0
    assert master["gpp_million"].isnull().sum() == 0


def test_party_cleaning(prepared_data):
    _, _, p_clean, _ = prepared_data
    assert len(p_clean) == 77
    for name in p_clean["party_name"]:
        assert name == name.strip()


def test_metrics_calculations(prepared_data):
    b_clean, _, _, master = prepared_data
    kpis = calculate_national_kpis(b_clean)
    assert kpis["total_budget_million"] > 3_000_000
    assert kpis["province_count"] == 77

    detail = get_province_detail_kpis("จังหวัดเชียงใหม่", master, b_clean)
    assert detail["province_name"] == "จังหวัดเชียงใหม่"
    assert detail["budget_rank"] >= 1
    assert len(detail["peer_provinces"]) > 0
    assert "top_ministries" in detail

    corr = calculate_correlation_analysis(master, exclude_outliers=True)
    assert -1.0 <= corr["pearson_r"] <= 1.0
    assert -1.0 <= corr["spearman_r"] <= 1.0

    party_stat = calculate_party_summary(master, exclude_outliers=True)
    assert len(party_stat["parties"]) >= 8


def test_strictly_year_2566_data(prepared_data):
    """Enforces that all analyzed datasets strictly use Year 2566 only."""
    b_clean, g_summary, _, master = prepared_data
    # Budget is strictly FY 2566
    if "fy" in b_clean.columns:
        assert (b_clean["fy"].astype(str) == "66").all()
    # GDP is strictly Year 2566
    assert len(g_summary) == 77
    # Master contains all 77 provinces strictly for 2566
    assert len(master) == 77
    assert "gpp_growth_pct" not in master.columns  # No prior years used!


def test_data_quality_audit(prepared_data):
    b_clean, _, _, master = prepared_data
    audit = get_data_quality_audit(b_clean, master)
    assert audit["reconciliation_diff"] < 1.0
    assert len(audit["checklist"]) == 10
    assert len(audit["boundaries"]) == 10
