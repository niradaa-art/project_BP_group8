/**
 * Application Lifecycle & UI Controller (app.js)
 * Manages tab views, shared filter bindings, and linked interactions.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const state = window.dashboardState;
  const api = window.api;
  const charts = window.chartHelper;

  // 1. Initialize Filters in Sidebar
  try {
    const filterOptions = await api.getFilters();
    state.set("availableFilters", filterOptions);
    populateDropdown("filter-region", filterOptions.regions, state.getState().selectedRegion);
    populateDropdown("filter-ministry", filterOptions.ministries, state.getState().selectedMinistry);
    populateDropdown("filter-objc", filterOptions.objcs, state.getState().selectedObjc);
    populateDropdown("province-selector", filterOptions.provinces, state.getState().selectedProvince || "กรุงเทพมหานคร");
  } catch (e) {
    console.error("Failed to load filter options:", e);
  }

  // 2. Navigation Tab Switching
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  function switchTab(tabName) {
    state.set("activeTab", tabName);
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    document.querySelectorAll(".dashboard-view").forEach((view) => view.classList.remove("active"));
    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) activeView.classList.add("active");

    renderCurrentView();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }

  // 3. Bind Global Sidebar Controls
  document.getElementById("filter-region")?.addEventListener("change", (e) => {
    state.set("selectedRegion", e.target.value);
  });
  document.getElementById("filter-ministry")?.addEventListener("change", (e) => {
    state.set("selectedMinistry", e.target.value);
  });
  document.getElementById("filter-objc")?.addEventListener("change", (e) => {
    state.set("selectedObjc", e.target.value);
  });
  document.getElementById("btn-clear-all")?.addEventListener("click", () => {
    state.clearAllFilters();
    // Reset dropdown elements
    document.getElementById("filter-region").value = "ทุกภูมิภาค";
    document.getElementById("filter-ministry").value = "ทุกกระทรวง";
    document.getElementById("filter-objc").value = "ทุกประเภทงบ";
  });

  // 4. Subscribe to State Changes for Responsive Rendering
  state.subscribe((curState, changedKeys) => {
    updateActiveFilterChips(curState);

    // If province was changed, update province selector if on province tab
    if (changedKeys.includes("selectedProvince")) {
      const pSel = document.getElementById("province-selector");
      if (pSel && curState.selectedProvince) {
        pSel.value = curState.selectedProvince;
      }
    }

    renderCurrentView();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  });

  // 5. Update Active Filter Chips
  function updateActiveFilterChips(curState) {
    const container = document.getElementById("active-filters");
    if (!container) return;
    container.innerHTML = "";

    if (curState.selectedProvince) {
      addChip(container, `จังหวัด: ${curState.selectedProvince}`, () => state.clearProvince());
    }
    if (curState.selectedRegion && curState.selectedRegion !== "ทุกภูมิภาค") {
      addChip(container, `ภูมิภาค: ${curState.selectedRegion}`, () => {
        state.set("selectedRegion", "ทุกภูมิภาค");
        document.getElementById("filter-region").value = "ทุกภูมิภาค";
      });
    }
    if (curState.selectedMinistry && curState.selectedMinistry !== "ทุกกระทรวง") {
      addChip(container, `กระทรวง: ${curState.selectedMinistry}`, () => {
        state.set("selectedMinistry", "ทุกกระทรวง");
        document.getElementById("filter-ministry").value = "ทุกกระทรวง";
      });
    }
    if (curState.selectedObjc && curState.selectedObjc !== "ทุกประเภทงบ") {
      addChip(container, `ประเภทงบ: ${curState.selectedObjc}`, () => {
        state.set("selectedObjc", "ทุกประเภทงบ");
        document.getElementById("filter-objc").value = "ทุกประเภทงบ";
      });
    }
    if (curState.selectedParty && curState.selectedParty !== "ทุกพรรค") {
      addChip(container, `พรรค: ${curState.selectedParty}`, () => state.set("selectedParty", "ทุกพรรค"));
    }
  }

  function addChip(container, text, onRemove) {
    const chip = document.createElement("div");
    chip.className = "filter-chip";
    chip.innerHTML = `<span>${text}</span><span class="filter-chip-remove">✕</span>`;
    chip.querySelector(".filter-chip-remove").addEventListener("click", onRemove);
    container.appendChild(chip);
  }

  // 6. Router / View Dispatcher
  async function renderCurrentView() {
    const curState = state.getState();
    const tab = curState.activeTab;

    if (tab === "overview") {
      await renderOverviewView(curState);
    } else if (tab === "province") {
      await renderProvinceView(curState);
    } else if (tab === "economy") {
      await renderEconomyView(curState);
    } else if (tab === "party") {
      await renderPartyView(curState);
    }
  }

  // ---------------------------------------------------------------------------
  // View 1: ภาพรวมงบประมาณ (Overview)
  // ---------------------------------------------------------------------------
  async function renderOverviewView(curState) {
    try {
      const data = await api.getOverview(curState);

      // KPI Cards
      document.getElementById("kpi-total-budget").textContent = data.kpis.total_budget_million.toLocaleString();
      document.getElementById("kpi-central-budget").textContent = data.kpis.central_budget_million.toLocaleString();
      document.getElementById("kpi-central-share").textContent = `สัดส่วน ${data.kpis.central_share_pct}% ของงบรวม`;
      document.getElementById("kpi-prov-budget").textContent = data.kpis.prov_budget_million.toLocaleString();
      document.getElementById("kpi-prov-share").textContent = `สัดส่วน ${data.kpis.prov_share_pct}% (77 จังหวัด)`;
      document.getElementById("kpi-top-province").textContent = data.kpis.top_province;
      document.getElementById("kpi-top-val").textContent = `${data.kpis.top_province_million.toLocaleString()} ล้านบาท`;

      // Province selection banner
      const banner = document.getElementById("overview-selection-banner");
      if (curState.selectedProvince) {
        banner.style.display = "flex";
        document.getElementById("selected-prov-name-banner").textContent = curState.selectedProvince;
        document.getElementById("btn-clear-prov-banner").onclick = () => state.clearProvince();
        const bannerDrilldown = document.getElementById("btn-banner-drilldown");
        if (bannerDrilldown) {
          bannerDrilldown.onclick = () => switchTab("province");
        }
        const bannerEcon = document.getElementById("btn-banner-econ");
        if (bannerEcon) {
          bannerEcon.onclick = () => switchTab("economy");
        }
        const bannerParty = document.getElementById("btn-banner-party");
        if (bannerParty) {
          bannerParty.onclick = () => switchTab("party");
        }
      } else {
        banner.style.display = "none";
      }

      // Ranking charts (Horizontal bars) with linked click event and selection highlight!
      charts.renderHorizontalBar(
        "chart-top-provinces",
        data.top_10,
        "budget_million",
        "province",
        "ล้านบาท",
        (clickedProvince) => {
          if (curState.selectedProvince === clickedProvince) {
            state.clearProvince();
          } else {
            state.selectProvince(clickedProvince);
          }
        },
        curState.selectedProvince
      );

      charts.renderHorizontalBar(
        "chart-bottom-provinces",
        data.bottom_10,
        "budget_million",
        "province",
        "ล้านบาท",
        (clickedProvince) => {
          if (curState.selectedProvince === clickedProvince) {
            state.clearProvince();
          } else {
            state.selectProvince(clickedProvince);
          }
        },
        curState.selectedProvince
      );

      // Donut for Spending Objects with click event!
      charts.renderDonut(
        "chart-objc-donut",
        data.breakdown_objc,
        "name",
        "budget_million",
        (clickedObjc) => {
          state.set("selectedObjc", clickedObjc);
          document.getElementById("filter-objc").value = clickedObjc;
        }
      );

      // Ministries Top 10 Horizontal Bar
      charts.renderHorizontalBar(
        "chart-top-ministries",
        data.breakdown_ministry,
        "budget_million",
        "name",
        "ล้านบาท",
        (clickedMin) => {
          state.set("selectedMinistry", clickedMin);
          document.getElementById("filter-ministry").value = clickedMin;
        }
      );

      // Overview detail tables
      renderSimpleTable("table-objc-overview", data.breakdown_objc, [
        { key: "name", label: "ประเภทงบรายจ่าย" },
        { key: "budget_million", label: "งบประมาณ (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "share_pct", label: "สัดส่วน (%)", format: (v) => `${v}%` },
        { key: "project_count", label: "จำนวนรายการ", format: (v) => v.toLocaleString() },
      ]);

      // Render Thailand Geographic Map!
      await renderThailandMapSection(curState);
    } catch (e) {
      console.error("Error in renderOverviewView:", e);
    }
  }

  // ---------------------------------------------------------------------------
  // Thailand Geographic Map Helper
  // ---------------------------------------------------------------------------
  let currentMapProvince = null;

  async function renderThailandMapSection(curState) {
    try {
      const geojson = await api.getGeoJSON();
      const rankingData = await api.getRanking(curState, 77);
      const metricSelect = document.getElementById("map-metric-select");
      const metricKey = metricSelect ? metricSelect.value : "budget_million";

      const units = {
        budget_million: "ล้านบาท",
        budget_per_capita_thb: "บาท/คน",
        gpp_million: "ล้านบาท",
        gpp_per_capita_thb: "บาท/คน",
      };
      const unit = units[metricKey] || "ล้านบาท";

      charts.renderThailandMap(
        "chart-thailand-map",
        geojson,
        rankingData.ranking,
        metricKey,
        unit,
        (selectedProvince) => {
          if (curState.selectedProvince === selectedProvince) {
            state.clearProvince();
          } else {
            state.selectProvince(selectedProvince);
          }
        },
        curState.selectedProvince
      );

      // Default or selected info card
      const displayProvince = curState.selectedProvince || (rankingData.ranking[0] ? rankingData.ranking[0].province : null);
      if (displayProvince) {
        updateMapSideInfo(displayProvince, rankingData.ranking, Boolean(curState.selectedProvince));
      }
    } catch (err) {
      console.error("Failed to render Thailand Map:", err);
    }
  }

  function updateMapSideInfo(provinceName, provincesList, isHighlighted = false) {
    const p = provincesList.find((item) => item.province === provinceName);
    if (!p) return;
    currentMapProvince = provinceName;

    const cardEl = document.getElementById("map-province-info");
    if (cardEl) {
      if (isHighlighted) {
        cardEl.style.borderColor = "#f59e0b";
        cardEl.style.boxShadow = "0 0 24px rgba(245, 158, 11, 0.28)";
      } else {
        cardEl.style.borderColor = "var(--border-card)";
        cardEl.style.boxShadow = "none";
      }
    }

    const titleEl = document.getElementById("map-info-title");
    if (titleEl) {
      titleEl.innerHTML = isHighlighted
        ? `📍 ${p.province} <span class="card-badge" style="background:rgba(245,158,11,0.2);color:#f59e0b;border:1px solid rgba(245,158,11,0.5);margin-left:6px;font-weight:600;">ไฮไลต์</span>`
        : p.province;
    }

    const subEl = document.getElementById("map-info-sub");
    if (subEl) {
      subEl.textContent = `อันดับที่ ${p.budget_rank || "-"} ของประเทศ (จาก 77 จังหวัด)`;
    }

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val ?? "-";
    };

    setText("map-info-region", p.region || "-");
    setText("map-info-budget", `${p.budget_million ? p.budget_million.toLocaleString() : "-"} ล้านบาท`);
    setText("map-info-capita", `${p.budget_per_capita_thb ? p.budget_per_capita_thb.toLocaleString() : "-"} บาท/คน`);
    setText("map-info-gpp", `${p.gpp_million ? p.gpp_million.toLocaleString() : "-"} ล้านบาท`);
    setText(
      "map-info-gpp-capita",
      `${p.gpp_per_capita_thb ? p.gpp_per_capita_thb.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "-"} บาท/คน`
    );
    setText("map-info-party", p.party_name || "-");
  }

  // Bind Map Metric Selector and Drilldown Button
  document.getElementById("map-metric-select")?.addEventListener("change", () => {
    renderThailandMapSection(state.getState());
  });

  document.getElementById("btn-map-drilldown")?.addEventListener("click", () => {
    if (currentMapProvince) {
      state.selectProvince(currentMapProvince);
      switchTab("province");
    }
  });

  // ---------------------------------------------------------------------------
  // View 2: วิเคราะห์รายจังหวัด (Province Deep Dive)
  // ---------------------------------------------------------------------------
  async function renderProvinceView(curState) {
    const provName = curState.selectedProvince || "กรุงเทพมหานคร";
    const selector = document.getElementById("province-selector");
    if (selector && selector.value !== provName) {
      selector.value = provName;
    }

    try {
      const data = await api.getProvinceDetail(provName);

      // Safe KPI text updates
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val ?? "-";
      };

      setText("pkpi-name", data.province_name);
      setText("pkpi-budget", data.budget_million.toLocaleString());
      setText("pkpi-budget-rank", `อันดับที่ ${data.budget_rank} จาก 77 จังหวัด`);
      setText("pkpi-capita", data.budget_per_capita_thb.toLocaleString());
      setText("pkpi-capita-rank", `อันดับที่ ${data.budget_per_capita_rank} ของประเทศ`);
      setText("pkpi-gpp", data.gpp_million.toLocaleString());
      setText("pkpi-gpp-rank", `อันดับที่ ${data.gpp_rank} ของประเทศ`);
      setText("pkpi-gpp-capita", data.gpp_per_capita_thb.toLocaleString());
      setText("pkpi-gpp-capita-rank", `อันดับที่ ${data.gpp_per_capita_rank} ของประเทศ`);
      setText("pkpi-party", data.party_name);
      setText("pkpi-region", `ภูมิภาค: ${data.region}`);

      // Province Donut structure (FY2566)
      charts.renderDonut("chart-prov-objc", data.breakdown_objc, "name", "budget_million");

      // Top Ministries allocating budget in this province (FY2566)
      charts.renderHorizontalBar(
        "chart-prov-ministry",
        data.top_ministries,
        "budget_million",
        "name",
        "ล้านบาท"
      );

      // Peer comparison bar chart with regional mean and national median benchmarks
      const regMean = data.benchmarks.region_mean_budget;
      const natMedian = data.benchmarks.national_median_budget;
      charts.renderPeerComparison("chart-prov-peers", data.peer_provinces, regMean, natMedian);

      // Top agencies
      charts.renderHorizontalBar(
        "chart-prov-agencies",
        data.top_agencies,
        "budget_million",
        "name",
        "ล้านบาท"
      );

      // Line items table
      renderSimpleTable("table-prov-items", data.line_items.slice(0, 30), [
        { key: "output_name", label: "ผลผลิต / โครงการ" },
        { key: "agc_name", label: "หน่วยงาน" },
        { key: "min_name", label: "กระทรวง" },
        { key: "objc", label: "ประเภทงบ" },
        { key: "budget_million", label: "งบประมาณ (ล้านบาท)", format: (v) => v.toLocaleString() },
      ]);

      // Trigger resize for proper Plotly geometry
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    } catch (e) {
      console.error("Error in renderProvinceView:", e);
    }
  }

  // Bind Province Selector Change
  document.getElementById("province-selector")?.addEventListener("change", (e) => {
    state.selectProvince(e.target.value);
  });

  // ---------------------------------------------------------------------------
  // View 3: งบประมาณและเศรษฐกิจจังหวัด (Budget × GPP)
  // ---------------------------------------------------------------------------
  async function renderEconomyView(curState) {
    let excludeOutliers = document.getElementById("toggle-outliers-econ")?.checked ?? curState.excludeOutliers;
    const perCapita = document.getElementById("toggle-percapita-econ")?.checked ?? curState.perCapitaMode;
    const logScale = document.getElementById("toggle-logscale-econ")?.checked ?? false;

    // If Bangkok or Nonthaburi is selected, make sure excludeOutliers doesn't filter it out
    if (curState.selectedProvince && (curState.selectedProvince.includes("กรุงเทพ") || curState.selectedProvince.includes("นนทบุรี"))) {
      excludeOutliers = false;
      const toggle = document.getElementById("toggle-outliers-econ");
      if (toggle) toggle.checked = false;
    }

    try {
      const data = await api.getEconomyBudgetGpp(excludeOutliers, perCapita);

      // Handle province filter banner in Economy view
      const banner = document.getElementById("econ-selection-banner");
      const cleanSelected = curState.selectedProvince ? curState.selectedProvince.replace("จังหวัด", "").trim() : null;
      const matchedPoint = cleanSelected
        ? data.provinces.find((p) => p.province.replace("จังหวัด", "").trim() === cleanSelected)
        : null;

      if (banner) {
        if (curState.selectedProvince && matchedPoint) {
          banner.style.display = "flex";
          document.getElementById("econ-selected-prov-name").textContent = matchedPoint.province;
          document.getElementById("btn-clear-econ-prov").onclick = () => {
            state.clearProvince();
          };
        } else {
          banner.style.display = "none";
        }
      }

      // Update Correlation Stat Cards
      if (matchedPoint) {
        document.getElementById("econ-stat-count").textContent = `1 จังหวัด (${matchedPoint.province})`;
      } else {
        document.getElementById("econ-stat-count").textContent = `${data.n_provinces} จังหวัด`;
      }
      document.getElementById("econ-stat-pearson").textContent = data.pearson_r.toFixed(3);
      document.getElementById("econ-stat-spearman").textContent = data.spearman_r.toFixed(3);
      const pText = data.pearson_pval < 0.001 ? "< 0.001" : data.pearson_pval.toFixed(4);
      document.getElementById("econ-stat-pval").textContent = pText;

      // Render interactive scatter plot with quadrant benchmark lines!
      charts.renderScatterQuadrant(
        "chart-econ-scatter",
        data,
        (selectedProv) => {
          state.selectProvince(selectedProv);
          switchTab("province");
        },
        logScale,
        curState.selectedProvince
      );

      // Render quadrant table summary (shows selected province or all)
      const tableRows = matchedPoint ? [matchedPoint] : data.provinces;
      renderSimpleTable("table-econ-quadrants", tableRows, [
        { key: "province", label: "จังหวัด" },
        { key: "region", label: "ภูมิภาค" },
        { key: "quadrant", label: "กลุ่ม Quadrant" },
        { key: "budget_million", label: "งบประมาณ (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "gpp_million", label: "GPP (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "budget_pct_gpp", label: "สัดส่วนงบ/GPP (%)", format: (v) => `${v}%` },
        { key: "party", label: "พรรคที่ชนะ" },
      ]);
    } catch (e) {
      console.error("Error in renderEconomyView:", e);
    }
  }

  // Bind Economy View Controls
  document.getElementById("toggle-outliers-econ")?.addEventListener("change", (e) => {
    state.set("excludeOutliers", e.target.checked);
  });
  document.getElementById("toggle-percapita-econ")?.addEventListener("change", (e) => {
    state.set("perCapitaMode", e.target.checked);
  });
  document.getElementById("toggle-logscale-econ")?.addEventListener("change", () => {
    renderEconomyView(state.getState());
  });

  // ---------------------------------------------------------------------------
  // View 4: พรรคการเมืองและเศรษฐกิจจังหวัด (Party × GPP)
  // ---------------------------------------------------------------------------
  async function renderPartyView(curState) {
    let excludeOutliers = document.getElementById("toggle-outliers-party")?.checked ?? curState.excludeOutliers;
    const selectedParty = curState.selectedParty;

    // If Bangkok or Nonthaburi is selected, make sure excludeOutliers doesn't filter it out
    if (curState.selectedProvince && (curState.selectedProvince.includes("กรุงเทพ") || curState.selectedProvince.includes("นนทบุรี"))) {
      excludeOutliers = false;
      const toggle = document.getElementById("toggle-outliers-party");
      if (toggle) toggle.checked = false;
    }

    try {
      const data = await api.getPartyGpp(excludeOutliers, selectedParty);

      // Handle province filter banner in Party view
      const banner = document.getElementById("party-selection-banner");
      const cleanSelected = curState.selectedProvince ? curState.selectedProvince.replace("จังหวัด", "").trim() : null;
      const matchedPoint = cleanSelected
        ? data.provinces.find((p) => p.province.replace("จังหวัด", "").trim() === cleanSelected)
        : null;

      if (banner) {
        if (curState.selectedProvince && matchedPoint) {
          banner.style.display = "flex";
          document.getElementById("party-selected-prov-name").textContent = matchedPoint.province;
          document.getElementById("btn-clear-party-prov").onclick = () => {
            state.clearProvince();
          };
        } else {
          banner.style.display = "none";
        }
      }

      // Party Summary Table
      renderSimpleTable("table-party-summary", data.parties, [
        { key: "party_name", label: "พรรคการเมือง" },
        { key: "province_count", label: "จำนวนจังหวัด" },
        { key: "total_budget_million", label: "งบประมาณรวม (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "budget_share_pct", label: "สัดส่วน (%)", format: (v) => `${v}%` },
        { key: "median_budget_million", label: "มัธยฐานงบ (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "median_gpp_million", label: "มัธยฐาน GPP (ล้านบาท)", format: (v) => v.toLocaleString() },
        { key: "mean_budget_pct_gpp", label: "สัดส่วนงบต่อ GPP เฉลี่ย (%)", format: (v) => `${v}%` },
      ]);

      // Box Plot for GPP distribution with party click event!
      charts.renderPartyBoxPlot("chart-party-box", data.provinces, "gpp_million", (clickedParty) => {
        state.set("selectedParty", clickedParty);
      });

      // Bubble scatter plot (filtered if selectedProvince is set)
      charts.renderPartyBubbleScatter(
        "chart-party-bubble",
        data.provinces,
        (selectedProv) => {
          state.selectProvince(selectedProv);
          switchTab("province");
        },
        curState.selectedProvince
      );
    } catch (e) {
      console.error("Error in renderPartyView:", e);
    }
  }

  document.getElementById("toggle-outliers-party")?.addEventListener("change", (e) => {
    state.set("excludeOutliers", e.target.checked);
  });

  // ---------------------------------------------------------------------------
  // Helper Functions
  // ---------------------------------------------------------------------------
  function populateDropdown(elemId, options, defaultValue) {
    const el = document.getElementById(elemId);
    if (!el || !options) return;
    el.innerHTML = "";
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === defaultValue) option.selected = true;
      el.appendChild(option);
    });
  }

  function renderSimpleTable(tableId, rows, columns) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let html = "<thead><tr>";
    columns.forEach((c) => {
      html += `<th>${c.label}</th>`;
    });
    html += "</tr></thead><tbody>";

    if (!rows || rows.length === 0) {
      html += `<tr><td colspan="${columns.length}" style="text-align:center;color:#94a3b8;padding:16px;">ไม่พบข้อมูลตามตัวกรองที่เลือก</td></tr>`;
    } else {
      rows.forEach((r) => {
        html += "<tr>";
        columns.forEach((c) => {
          const rawVal = r[c.key];
          const displayVal = c.format ? c.format(rawVal) : rawVal ?? "-";
          html += `<td>${displayVal}</td>`;
        });
        html += "</tr>";
      });
    }

    html += "</tbody>";
    table.innerHTML = html;
  }

  // Initial Render
  renderCurrentView();
});
