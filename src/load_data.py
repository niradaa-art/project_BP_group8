"""
Module: load_data.py
Description: Data loader for Provincial Budget, GDP, and Partylist datasets.
Supports multiple paths, pipe separator detection, and encoding fallbacks.
"""

from pathlib import Path
from typing import Dict, Optional, Tuple
import pandas as pd


def get_data_dir() -> Path:
    """Finds and returns the valid data directory path."""
    current_dir = Path(__file__).resolve().parent
    workspace_dir = current_dir.parent

    candidates = [
        workspace_dir / "data",
        workspace_dir,
        current_dir / "data",
    ]

    for candidate in candidates:
        if candidate.exists() and candidate.is_dir():
            if list(candidate.glob("*.csv")):
                return candidate

    return workspace_dir / "data"


def resolve_data_paths() -> Dict[str, Path]:
    """Locates the three required CSV datasets."""
    data_dir = get_data_dir()
    paths: Dict[str, Path] = {}

    # 1. Budget file
    budget_candidates = [
        data_dir / "provincial_budget.csv",
        data_dir / "provincial_budget(1).csv",
        data_dir / "provincial_budget (1).csv",
    ]
    for b_path in budget_candidates:
        if b_path.exists():
            paths["budget"] = b_path
            break
    if "budget" not in paths:
        matching = list(data_dir.glob("*budget*.csv"))
        if matching:
            paths["budget"] = matching[0]

    # 2. GDP file
    gdp_path = data_dir / "gdp.csv"
    if gdp_path.exists():
        paths["gdp"] = gdp_path
    else:
        matching = list(data_dir.glob("*gdp*.csv"))
        if matching:
            paths["gdp"] = matching[0]

    # 3. Partylist file
    party_path = data_dir / "partylist.csv"
    if party_path.exists():
        paths["party"] = party_path
    else:
        matching = list(data_dir.glob("*party*.csv"))
        if matching:
            paths["party"] = matching[0]

    return paths


def read_csv_safe(path: Path, sep: Optional[str] = None) -> pd.DataFrame:
    """Reads a CSV file with automatic separator fallback and UTF-8 encoding."""
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    encodings = ["utf-8", "utf-8-sig", "cp874", "tis-620"]
    last_error = None

    for enc in encodings:
        try:
            if sep is not None:
                return pd.read_csv(path, sep=sep, encoding=enc, low_memory=False)

            with open(path, "r", encoding=enc, errors="ignore") as f:
                first_line = f.readline()
                detected_sep = "|" if "|" in first_line else ","

            return pd.read_csv(path, sep=detected_sep, encoding=enc, low_memory=False)
        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(f"Failed to read CSV at {path}: {last_error}")


def load_raw_datasets() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Loads all 3 raw DataFrames (df_budget, df_gdp, df_party)."""
    paths = resolve_data_paths()
    if "budget" not in paths:
        raise FileNotFoundError("Could not find provincial_budget.csv in data directory.")
    if "gdp" not in paths:
        raise FileNotFoundError("Could not find gdp.csv in data directory.")
    if "party" not in paths:
        raise FileNotFoundError("Could not find partylist.csv in data directory.")

    df_budget = read_csv_safe(paths["budget"], sep="|")
    df_gdp = read_csv_safe(paths["gdp"], sep=",")
    df_party = read_csv_safe(paths["party"], sep=",")

    return df_budget, df_gdp, df_party
