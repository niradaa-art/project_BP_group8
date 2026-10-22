"""
Module: clean_data.py
Description: Cleans, standardizes, and unifies Provincial Budget, GDP, and Partylist datasets.
Enforces 100% budget reconciliation and zero Cartesian inflation.
"""

from typing import Dict, Tuple
import pandas as pd
import numpy as np


# Official 6-region classification by NESDC (สภาพัฒน์) covering all 77 provinces
REGIONS_6_MAP: Dict[str, str] = {
    # ภาคกลาง (22 จังหวัด/เขตปกครอง)
    "กรุงเทพมหานคร": "ภาคกลาง",
    "จังหวัดนนทบุรี": "ภาคกลาง",
    "จังหวัดปทุมธานี": "ภาคกลาง",
    "จังหวัดสมุทรปราการ": "ภาคกลาง",
    "จังหวัดสมุทรสาคร": "ภาคกลาง",
    "จังหวัดสมุทรสงคราม": "ภาคกลาง",
    "จังหวัดนครปฐม": "ภาคกลาง",
    "จังหวัดพระนครศรีอยุธยา": "ภาคกลาง",
    "จังหวัดสระบุรี": "ภาคกลาง",
    "จังหวัดลพบุรี": "ภาคกลาง",
    "จังหวัดสุพรรณบุรี": "ภาคกลาง",
    "จังหวัดอ่างทอง": "ภาคกลาง",
    "จังหวัดสิงห์บุรี": "ภาคกลาง",
    "จังหวัดชัยนาท": "ภาคกลาง",
    "จังหวัดอุทัยธานี": "ภาคกลาง",
    "จังหวัดกำแพงเพชร": "ภาคกลาง",
    "จังหวัดพิจิตร": "ภาคกลาง",
    "จังหวัดนครสวรรค์": "ภาคกลาง",
    "จังหวัดพิษณุโลก": "ภาคกลาง",
    "จังหวัดเพชรบูรณ์": "ภาคกลาง",
    "จังหวัดสุโขทัย": "ภาคกลาง",
    "จังหวัดนครนายก": "ภาคกลาง",

    # ภาคเหนือ (9 จังหวัด)
    "จังหวัดเชียงใหม่": "ภาคเหนือ",
    "จังหวัดเชียงราย": "ภาคเหนือ",
    "จังหวัดลำปาง": "ภาคเหนือ",
    "จังหวัดลำพูน": "ภาคเหนือ",
    "จังหวัดแม่ฮ่องสอน": "ภาคเหนือ",
    "จังหวัดน่าน": "ภาคเหนือ",
    "จังหวัดพะเยา": "ภาคเหนือ",
    "จังหวัดแพร่": "ภาคเหนือ",
    "จังหวัดอุตรดิตถ์": "ภาคเหนือ",

    # ภาคตะวันออกเฉียงเหนือ (20 จังหวัด)
    "จังหวัดนครราชสีมา": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดขอนแก่น": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดอุบลราชธานี": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดอุดรธานี": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดร้อยเอ็ด": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดบุรีรัมย์": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดสุรินทร์": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดศรีสะเกษ": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดมหาสารคาม": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดชัยภูมิ": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดสกลนคร": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดกาฬสินธุ์": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดหนองคาย": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดเลย": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดยโสธร": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดนครพนม": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดมุกดาหาร": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดบึงกาฬ": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดหนองบัวลำภู": "ภาคตะวันออกเฉียงเหนือ",
    "จังหวัดอำนาจเจริญ": "ภาคตะวันออกเฉียงเหนือ",

    # ภาคตะวันออก (7 จังหวัด)
    "จังหวัดชลบุรี": "ภาคตะวันออก",
    "จังหวัดระยอง": "ภาคตะวันออก",
    "จังหวัดฉะเชิงเทรา": "ภาคตะวันออก",
    "จังหวัดจันทบุรี": "ภาคตะวันออก",
    "จังหวัดตราด": "ภาคตะวันออก",
    "จังหวัดปราจีนบุรี": "ภาคตะวันออก",
    "จังหวัดสระแก้ว": "ภาคตะวันออก",

    # ภาคตะวันตก (5 จังหวัด)
    "จังหวัดกาญจนบุรี": "ภาคตะวันตก",
    "จังหวัดราชบุรี": "ภาคตะวันตก",
    "จังหวัดเพชรบุรี": "ภาคตะวันตก",
    "จังหวัดประจวบคีรีขันธ์": "ภาคตะวันตก",
    "จังหวัดตาก": "ภาคตะวันตก",

    # ภาคใต้ (14 จังหวัด)
    "จังหวัดสงขลา": "ภาคใต้",
    "จังหวัดสุราษฎร์ธานี": "ภาคใต้",
    "จังหวัดนครศรีธรรมราช": "ภาคใต้",
    "จังหวัดภูเก็ต": "ภาคใต้",
    "จังหวัดกระบี่": "ภาคใต้",
    "จังหวัดพังงา": "ภาคใต้",
    "จังหวัดตรัง": "ภาคใต้",
    "จังหวัดพัทลุง": "ภาคใต้",
    "จังหวัดชุมพร": "ภาคใต้",
    "จังหวัดระนอง": "ภาคใต้",
    "จังหวัดสตูล": "ภาคใต้",
    "จังหวัดปัตตานี": "ภาคใต้",
    "จังหวัดยะลา": "ภาคใต้",
    "จังหวัดนราธิวาส": "ภาคใต้",
}


def standardize_province_name(name: str) -> str:
    """Standardizes province name with 'จังหวัด' prefix except Bangkok, Central, or Sum."""
    if pd.isna(name):
        return ""
    name_str = str(name).strip()
    if name_str in ("กรุงเทพมหานคร", "ส่วนกลาง", "รวม"):
        return name_str
    if not name_str.startswith("จังหวัด"):
        return f"จังหวัด{name_str}"
    return name_str


def clean_party_data(df_party: pd.DataFrame) -> pd.DataFrame:
    """Cleans partylist data: strips whitespaces and standardizes names."""
    df = df_party.copy()
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].astype(str).str.strip()

    df["changwad_area_name"] = df["changwad_area_name"].apply(standardize_province_name)
    return df


def clean_budget_data(df_budget: pd.DataFrame, drop_duplicates: bool = False) -> pd.DataFrame:
    """
    Cleans budget dataset:
    - Retains legitimate identical budget lines by default (as noted in FY2566 Budget Act)
    - Standardizes text fields and province names
    - Converts budget to numeric and generates million THB column
    - Identifies central vs provincial records
    - Adds region
    """
    df = df_budget.copy()

    if drop_duplicates:
        df = df.drop_duplicates().reset_index(drop=True)

    text_cols = ["changwad_area_name", "min_name", "agc_name", "plan_name", "output_name", "objc"]
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    df["changwad_area_name"] = df["changwad_area_name"].apply(standardize_province_name)
    df["budget"] = pd.to_numeric(df["budget"], errors="coerce").fillna(0.0)
    df["budget_million"] = df["budget"] / 1_000_000.0

    df["is_central"] = df["changwad_area_name"] == "ส่วนกลาง"
    df["region"] = df["changwad_area_name"].map(REGIONS_6_MAP).fillna("ส่วนกลาง")

    return df


def clean_gdp_data(df_gdp: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans GDP dataset strictly for Year 2566 only:
    - Eliminates all historical years (2538-2565) to strictly enforce Year 2566 data boundary.
    - Extracts Year 2566 indicators: GPP (Million THB), Population, and GPP per capita (THB/person).
    - Returns df_gdp_2566 for 77 provinces.
    """
    df = df_gdp.copy()
    for col in ["NA_STAT", "NI", "AREA", "CWT", "UNIT_MUL", "UNIT", "FREQ"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    df["Value"] = pd.to_numeric(df["Value"], errors="coerce").fillna(0.0)
    df["TIME_PERIOD"] = pd.to_numeric(df["TIME_PERIOD"], errors="coerce").astype(int)

    # Strictly filter for Year 2566 only
    g_2566 = df[df["TIME_PERIOD"] == 2566].copy()
    g_2566["changwad_area_name"] = g_2566["CWT"].apply(standardize_province_name)

    # GPP 2566 (Million THB)
    gpp_2566 = g_2566[g_2566["NI"] == "ผลิตภัณฑ์มวลรวมจังหวัด (GPP)"][
        ["changwad_area_name", "Value"]
    ].rename(columns={"Value": "gpp_million"})

    # Population 2566 (Thousand Persons -> Persons)
    pop_2566 = g_2566[g_2566["NI"] == "ประชากรทั้งหมด"][
        ["changwad_area_name", "Value"]
    ].rename(columns={"Value": "pop_thousand"})
    pop_2566["pop_person"] = pop_2566["pop_thousand"] * 1000.0

    # GPP per capita 2566 (THB/person)
    cap_2566 = g_2566[g_2566["NI"] == "ผลิตภัณฑ์จังหวัด (GPP) ต่อหัว"][
        ["changwad_area_name", "Value"]
    ].rename(columns={"Value": "gpp_per_capita_thb"})

    gdp_summary = (
        gpp_2566.merge(pop_2566, on="changwad_area_name", how="left")
        .merge(cap_2566, on="changwad_area_name", how="left")
    )

    gdp_summary = gdp_summary[gdp_summary["changwad_area_name"] != "รวม"].copy()

    return gdp_summary


def build_province_master_dataset(
    df_budget_clean: pd.DataFrame,
    df_gdp_summary: pd.DataFrame,
    df_party_clean: pd.DataFrame,
) -> pd.DataFrame:
    """
    Creates an aggregated province-level dataset for all 77 provinces.
    Guarantees 1:1 join without budget inflation.
    """
    prov_budget = (
        df_budget_clean[~df_budget_clean["is_central"]]
        .groupby("changwad_area_name", as_index=False)
        .agg(
            budget=("budget", "sum"),
            budget_million=("budget_million", "sum"),
            project_count=("budget", "count"),
        )
    )

    total_national_budget = df_budget_clean["budget"].sum()
    total_prov_budget = prov_budget["budget"].sum()

    master = prov_budget.merge(df_gdp_summary, on="changwad_area_name", how="inner")
    master = master.merge(df_party_clean, on="changwad_area_name", how="inner")

    master["region"] = master["changwad_area_name"].map(REGIONS_6_MAP).fillna("อื่นๆ")

    master["budget_per_capita_thb"] = np.where(
        master["pop_person"] > 0,
        master["budget"] / master["pop_person"],
        0.0,
    )
    master["budget_pct_gpp"] = np.where(
        master["gpp_million"] > 0,
        (master["budget_million"] / master["gpp_million"]) * 100.0,
        0.0,
    )
    master["budget_share_national_pct"] = (master["budget"] / total_national_budget) * 100.0
    master["budget_share_prov_pct"] = (master["budget"] / total_prov_budget) * 100.0

    master["budget_rank"] = master["budget"].rank(ascending=False, method="min").astype(int)
    master["gpp_rank"] = master["gpp_million"].rank(ascending=False, method="min").astype(int)
    master["budget_per_capita_rank"] = master["budget_per_capita_thb"].rank(ascending=False, method="min").astype(int)
    master["gpp_per_capita_rank"] = master["gpp_per_capita_thb"].rank(ascending=False, method="min").astype(int)

    assert len(master) == 77, f"Expected 77 provinces, got {len(master)}"
    reconciled_diff = abs(master["budget"].sum() - total_prov_budget)
    assert reconciled_diff < 1.0, f"Budget reconciliation failed: diff={reconciled_diff}"

    return master
