/**
 * API Client (api.js)
 * Asynchronous Fetch API wrappers for FastAPI backend endpoints.
 */

const API_BASE = "";

async function fetchJSON(endpoint, params = {}) {
  const url = new URL(API_BASE + endpoint, window.location.origin);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
      url.searchParams.append(key, params[key]);
    }
  });

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Fetch Error on ${endpoint}:`, error);
    throw error;
  }
}

const api = {
  getFilters: () => fetchJSON("/api/filters"),

  getOverview: (filters = {}) =>
    fetchJSON("/api/overview", {
      region: filters.selectedRegion !== "ทุกภูมิภาค" ? filters.selectedRegion : null,
      min_name: filters.selectedMinistry !== "ทุกกระทรวง" ? filters.selectedMinistry : null,
      objc: filters.selectedObjc !== "ทุกประเภทงบ" ? filters.selectedObjc : null,
    }),

  getRanking: (filters = {}, top_n = 77) =>
    fetchJSON("/api/budget/ranking", {
      region: filters.selectedRegion !== "ทุกภูมิภาค" ? filters.selectedRegion : null,
      party: filters.selectedParty !== "ทุกพรรค" ? filters.selectedParty : null,
      top_n: top_n,
    }),

  getAgencyBreakdown: (filters = {}, province = null) =>
    fetchJSON("/api/budget/by-agency", {
      province: province,
      region: filters.selectedRegion !== "ทุกภูมิภาค" ? filters.selectedRegion : null,
      min_name: filters.selectedMinistry !== "ทุกกระทรวง" ? filters.selectedMinistry : null,
    }),

  getProvinceDetail: (provinceName) =>
    fetchJSON(`/api/province/${encodeURIComponent(provinceName)}`),

  getEconomyBudgetGpp: (excludeOutliers = true, perCapita = false) =>
    fetchJSON("/api/economy/budget-gpp", {
      exclude_outliers: excludeOutliers,
      per_capita: perCapita,
    }),

  getPartyGpp: (excludeOutliers = true, party = null) =>
    fetchJSON("/api/party/gpp", {
      exclude_outliers: excludeOutliers,
      party: party !== "ทุกพรรค" ? party : null,
    }),

  getDataQuality: () => fetchJSON("/api/data-quality"),

  // Cached GeoJSON loader
  _geoCache: null,
  getGeoJSON: async function () {
    if (this._geoCache) return this._geoCache;
    const res = await fetch("/static/data/thailand_provinces.geojson");
    if (!res.ok) throw new Error("Failed to load Thailand GeoJSON");
    this._geoCache = await res.json();
    return this._geoCache;
  },
};

window.api = api;
