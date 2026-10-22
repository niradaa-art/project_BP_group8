"""
Tests for FastAPI Endpoints using TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_api_filters():
    response = client.get("/api/filters")
    assert response.status_code == 200
    data = response.json()
    assert "provinces" in data
    assert len(data["provinces"]) == 77
    assert "regions" in data
    assert "ministries" in data
    assert "objcs" in data
    assert "parties" in data


def test_api_overview():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert data["kpis"]["total_budget_million"] > 3_000_000
    assert len(data["top_10"]) == 10
    assert len(data["bottom_10"]) == 10
    assert len(data["breakdown_objc"]) >= 5


def test_api_overview_with_region_filter():
    response = client.get("/api/overview?region=ภาคเหนือ")
    assert response.status_code == 200
    data = response.json()
    assert data["kpis"]["province_count"] == 9  # 9 provinces in North


def test_api_budget_ranking():
    response = client.get("/api/budget/ranking?top_n=15")
    assert response.status_code == 200
    data = response.json()
    assert len(data["ranking"]) == 15
    assert data["ranking"][0]["budget_rank"] == 1


def test_api_agency_breakdown():
    response = client.get("/api/budget/by-agency?top_n=5")
    assert response.status_code == 200
    data = response.json()
    assert "agencies" in data
    assert len(data["agencies"]) <= 6


def test_api_province_detail_success():
    response = client.get("/api/province/จังหวัดเชียงใหม่")
    assert response.status_code == 200
    data = response.json()
    assert data["province_name"] == "จังหวัดเชียงใหม่"
    assert data["region"] == "ภาคเหนือ"
    assert data["budget_million"] > 0
    assert "peer_provinces" in data
    assert "top_ministries" in data
    assert len(data["top_ministries"]) > 0


def test_api_province_detail_not_found():
    response = client.get("/api/province/จังหวัดไม่มีจริง")
    assert response.status_code == 404


def test_api_economy_budget_gpp():
    response = client.get("/api/economy/budget-gpp?exclude_outliers=true&per_capita=false")
    assert response.status_code == 200
    data = response.json()
    assert "pearson_r" in data
    assert "spearman_r" in data
    assert data["n_provinces"] == 75  # 77 minus 2 outliers
    assert len(data["provinces"]) == 75


def test_api_party_gpp():
    response = client.get("/api/party/gpp?exclude_outliers=true")
    assert response.status_code == 200
    data = response.json()
    assert "parties" in data
    assert "provinces" in data
    assert len(data["parties"]) >= 8


def test_api_data_quality():
    response = client.get("/api/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert "reconciliation_diff" in data
    assert data["reconciliation_diff"] < 1.0
    assert len(data["checklist"]) == 10


def test_frontend_serving():
    response = client.get("/")
    assert response.status_code == 200
    assert "ระบบวิเคราะห์งบประมาณรายจังหวัด" in response.text
