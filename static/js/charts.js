/**
 * Plotly.js Visualizations & Linked Brushing (charts.js)
 * Implements cross-chart interactivity and Thai typography in Glassmorphism theme.
 */

const PARTY_COLORS = {
  "เพื่อไทย": "#ef4444",
  "ก้าวไกล": "#f97316",
  "ภูมิใจไทย": "#3b82f6",
  "พลังประชารัฐ": "#0ea5e9",
  "ประชาธิปัตย์": "#38bdf8",
  "รวมไทยสร้างชาติ": "#6366f1",
  "ชาติไทยพัฒนา": "#ec4899",
  "ประชาชาติ": "#16a34a",
  "ไทยสร้างไทย": "#a855f7",
  "อื่นๆ": "#94a3b8",
};

const THEME_LAYOUT = {
  font: { family: "Sarabun, sans-serif", color: "#f8fafc", size: 12 },
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  margin: { l: 40, r: 20, t: 30, b: 40 },
  xaxis: {
    gridcolor: "rgba(255, 255, 255, 0.08)",
    zerolinecolor: "rgba(255, 255, 255, 0.15)",
    tickfont: { color: "#94a3b8", size: 11 },
  },
  yaxis: {
    gridcolor: "rgba(255, 255, 255, 0.08)",
    zerolinecolor: "rgba(255, 255, 255, 0.15)",
    tickfont: { color: "#94a3b8", size: 11 },
    ticks: "outside",
    ticklen: 8,
    tickcolor: "rgba(0,0,0,0)",
  },
  hoverlabel: {
    bgcolor: "#0f172a",
    bordercolor: "#38bdf8",
    font: { family: "Sarabun, sans-serif", color: "#fff", size: 12 },
  },
};

const chartHelper = {
  // 1. Horizontal bar chart with click-to-filter & active selection highlight
  renderHorizontalBar: (containerId, items, xKey, yKey, unit = "ล้านบาท", onSelect = null, selectedLabel = null) => {
    const el = document.getElementById(containerId);
    if (!el || !items || items.length === 0) return;

    // Sort ascending for bottom-to-top rendering
    const sorted = [...items].reverse();
    const xVals = sorted.map((d) => d[xKey]);
    const yVals = sorted.map((d) => d[yKey]);

    const hasSelection = Boolean(selectedLabel && yVals.includes(selectedLabel));
    const barColors = yVals.map((y) => (y === selectedLabel ? "#f59e0b" : "rgba(6, 182, 212, 0.4)"));
    const barLineColors = yVals.map((y) => (y === selectedLabel ? "#ffffff" : "rgba(6, 182, 212, 0.3)"));
    const barLineWidths = yVals.map((y) => (y === selectedLabel ? 2.5 : 1));

    const trace = {
      type: "bar",
      orientation: "h",
      x: xVals,
      y: yVals,
      marker: hasSelection
        ? {
            color: barColors,
            line: { color: barLineColors, width: barLineWidths },
          }
        : {
            color: xVals,
            colorscale: [
              [0, "#38bdf8"],
              [0.5, "#06b6d4"],
              [1, "#0d9488"],
            ],
            line: { color: "rgba(6, 182, 212, 0.8)", width: 1 },
          },
      hovertemplate: `<b>%{y}</b><br>${unit}: %{x:,.2f}<extra></extra>`,
    };

    const layout = {
      ...THEME_LAYOUT,
      margin: { l: 135, r: 25, t: 20, b: 35 },
      xaxis: { ...THEME_LAYOUT.xaxis, title: unit },
      yaxis: {
        ...THEME_LAYOUT.yaxis,
        automargin: true,
        ticks: "outside",
        ticklen: 12,
        tickcolor: "rgba(0,0,0,0)",
        ticksuffix: "   ",
      },
    };

    Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });

    if (onSelect) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const clickedLabel = data.points[0].y;
          onSelect(clickedLabel);
        }
      });
    }
  },

  // 2. Donut chart for budget structure
  renderDonut: (containerId, items, labelKey, valKey, onSelect = null) => {
    const el = document.getElementById(containerId);
    if (!el || !items || items.length === 0) return;

    const labels = items.map((d) => d[labelKey]);
    const values = items.map((d) => d[valKey]);

    const trace = {
      type: "pie",
      hole: 0.52,
      labels: labels,
      values: values,
      textinfo: "label+percent",
      textposition: "inside",
      marker: {
        colors: ["#06b6d4", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
        line: { color: "#080d1a", width: 2 },
      },
      hovertemplate: "<b>%{label}</b><br>งบประมาณ: %{value:,.2f} ล้านบาท (%{percent})<extra></extra>",
    };

    const layout = {
      ...THEME_LAYOUT,
      showlegend: false,
      margin: { l: 10, r: 10, t: 10, b: 10 },
    };

    Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });

    if (onSelect) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const clickedLabel = data.points[0].label;
          onSelect(clickedLabel);
        }
      });
    }
  },

  // Helper to enable interactive hover dimming on scatter/bubble charts
  enableScatterHoverDimming: (el) => {
    if (!el) return;
    el.classList.remove("scatter-hover-active");

    const clearHover = () => {
      el.classList.remove("scatter-hover-active");
      const hovered = el.querySelectorAll(".point.point-hovered");
      hovered.forEach((p) => p.classList.remove("point-hovered"));
    };

    if (el.removeAllListeners) {
      el.removeAllListeners("plotly_hover");
      el.removeAllListeners("plotly_unhover");
    }

    el.on("plotly_hover", (data) => {
      if (!data || !data.points || !data.points.length) return;
      const pt = data.points[0];
      const curveNumber = pt.curveNumber;
      const pointNumber = pt.pointNumber;

      const traceEls = el.querySelectorAll(".scatterlayer .trace");
      let targetPoint = null;

      if (traceEls && traceEls[curveNumber]) {
        const pointEls = traceEls[curveNumber].querySelectorAll("path.point");
        if (pointEls && pointEls[pointNumber]) {
          targetPoint = pointEls[pointNumber];
        }
      }

      // Fallback matching by text/name if trace DOM ordering differs
      if (!targetPoint && pt.text) {
        const allPoints = el.querySelectorAll(".scatterlayer path.point");
        for (let i = 0; i < allPoints.length; i++) {
          const d = allPoints[i].__data__;
          if (d && (d.tx === pt.text || d.text === pt.text)) {
            targetPoint = allPoints[i];
            break;
          }
        }
      }

      if (!targetPoint) return;

      const prevHovered = el.querySelectorAll(".point.point-hovered");
      prevHovered.forEach((p) => {
        if (p !== targetPoint) p.classList.remove("point-hovered");
      });

      targetPoint.classList.add("point-hovered");
      el.classList.add("scatter-hover-active");
    });

    el.on("plotly_unhover", () => {
      clearHover();
    });

    if (el._scatterMouseLeaveHandler) {
      el.removeEventListener("mouseleave", el._scatterMouseLeaveHandler);
    }
    el._scatterMouseLeaveHandler = clearHover;
    el.addEventListener("mouseleave", el._scatterMouseLeaveHandler);
  },

  // 3. Scatter plot with quadrants & click-to-select province (supports linked single province view)
  renderScatterQuadrant: (containerId, analysisData, onPointClick = null, logScale = false, selectedProvince = null) => {
    const el = document.getElementById(containerId);
    if (!el || !analysisData || !analysisData.provinces) return;

    const allPoints = analysisData.provinces;
    const xMed = analysisData.x_median;
    const yMed = analysisData.y_median;

    // Filter to single province if selectedProvince is provided
    let points = allPoints;
    let singleSelectedPoint = null;
    if (selectedProvince) {
      const cleanSelected = selectedProvince.replace("จังหวัด", "").trim();
      const match = allPoints.find((p) => p.province.replace("จังหวัด", "").trim() === cleanSelected);
      if (match) {
        points = [match];
        singleSelectedPoint = match;
      }
    }

    // Calculate global domain so coordinate frame & median benchmarks remain stable
    const allXVals = allPoints.map((p) => p.x_val).filter((v) => v > 0);
    const allYVals = allPoints.map((p) => p.y_val).filter((v) => v > 0);
    const xMin = Math.min(...allXVals, xMed);
    const xMax = Math.max(...allXVals, xMed);
    const yMin = Math.min(...allYVals, yMed);
    const yMax = Math.max(...allYVals, yMed);

    // Group by region for color legend
    const regions = [...new Set(points.map((p) => p.region))];
    const regionColors = {
      "ภาคกลาง": "#06b6d4",
      "ภาคเหนือ": "#3b82f6",
      "ภาคตะวันออกเฉียงเหนือ": "#f59e0b",
      "ภาคตะวันออก": "#10b981",
      "ภาคตะวันตก": "#8b5cf6",
      "ภาคใต้": "#ec4899",
    };

    const traces = regions.map((reg) => {
      const regPoints = points.filter((p) => p.region === reg);
      return {
        type: "scatter",
        mode: "markers",
        name: reg,
        x: regPoints.map((p) => p.x_val),
        y: regPoints.map((p) => p.y_val),
        text: regPoints.map((p) => p.province),
        customdata: regPoints.map((p) => [p.party, p.budget_million, p.gpp_million, p.quadrant, p.pop_person]),
        marker: {
          size: regPoints.map((p) =>
            singleSelectedPoint
              ? Math.max(16, Math.min(32, Math.sqrt(p.pop_person) / 60))
              : Math.max(9, Math.min(28, Math.sqrt(p.pop_person) / 75))
          ),
          color: regionColors[reg] || "#94a3b8",
          opacity: 0.92,
          line: { color: "#fff", width: singleSelectedPoint ? 2.5 : 1.2 },
        },
        hovertemplate:
          "<b>%{text}</b> (%{data.name})<br>" +
          "X: %{x:,.2f}<br>Y: %{y:,.2f}<br>" +
          "ประชากร: %{customdata[4]:,d} คน (ขนาดจุด)<br>" +
          "พรรคการเมือง: %{customdata[0]}<br>" +
          "กลุ่ม: %{customdata[3]}<extra></extra>",
      };
    });

    const annotations = [
      {
        x: xMed,
        y: 1,
        xref: "x",
        yref: "paper",
        text: `มัธยฐาน X: ${xMed.toLocaleString()}`,
        showarrow: false,
        font: { color: "#06b6d4", size: 10 },
        align: "left",
      },
      {
        x: 1,
        y: yMed,
        xref: "paper",
        yref: "y",
        text: `มัธยฐาน Y: ${yMed.toLocaleString()}`,
        showarrow: false,
        font: { color: "#06b6d4", size: 10 },
        align: "right",
      },
      // 4 Quadrants Analytical Labels
      {
        x: 0.98,
        y: 0.96,
        xref: "paper",
        yref: "paper",
        text: "<b>Q1: ศักยภาพสูง - งบประมาณสูง</b><br>Core Economic Hubs",
        showarrow: false,
        font: { color: "rgba(6, 182, 212, 0.7)", size: 10 },
        align: "right",
      },
      {
        x: 0.02,
        y: 0.96,
        xref: "paper",
        yref: "paper",
        text: "<b>Q2: ศักยภาพสูง - งบประมาณต่ำ</b><br>High Economic Efficiency",
        showarrow: false,
        font: { color: "rgba(16, 185, 129, 0.7)", size: 10 },
        align: "left",
      },
      {
        x: 0.02,
        y: 0.04,
        xref: "paper",
        yref: "paper",
        text: "<b>Q3: ศักยภาพพื้นฐาน - งบประมาณต่ำ</b><br>Emerging / Developing",
        showarrow: false,
        font: { color: "rgba(148, 163, 184, 0.7)", size: 10 },
        align: "left",
      },
      {
        x: 0.98,
        y: 0.04,
        xref: "paper",
        yref: "paper",
        text: "<b>Q4: ศักยภาพพื้นฐาน - งบประมาณสูง</b><br>Targeted Support Area",
        showarrow: false,
        font: { color: "rgba(245, 158, 11, 0.7)", size: 10 },
        align: "right",
      },
    ];

    if (singleSelectedPoint) {
      annotations.push({
        x: singleSelectedPoint.x_val,
        y: singleSelectedPoint.y_val,
        text: `📍 <b>${singleSelectedPoint.province}</b><br><span style="font-size:11px;">${singleSelectedPoint.quadrant}</span>`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1.5,
        arrowcolor: "#06b6d4",
        ax: 0,
        ay: -45,
        bgcolor: "rgba(15, 23, 42, 0.92)",
        bordercolor: "#06b6d4",
        borderwidth: 1.5,
        borderpad: 6,
        font: { color: "#f8fafc", size: 12 },
      });
    }

    const layout = {
      ...THEME_LAYOUT,
      margin: { l: 65, r: 25, t: 25, b: 55 },
      xaxis: {
        ...THEME_LAYOUT.xaxis,
        title: analysisData.x_var === "budget_per_capita_thb" ? "งบประมาณต่อหัว (บาท/คน)" : "งบประมาณรายจังหวัด (ล้านบาท)",
        type: logScale ? "log" : "linear",
        range: singleSelectedPoint
          ? (logScale ? [Math.log10(xMin * 0.7), Math.log10(xMax * 1.25)] : [0, xMax * 1.08])
          : undefined,
      },
      yaxis: {
        ...THEME_LAYOUT.yaxis,
        title: analysisData.y_var === "gpp_per_capita_thb" ? "GPP ต่อหัว (บาท/คน)" : "ผลิตภัณฑ์มวลรวมจังหวัด GPP (ล้านบาท)",
        type: logScale ? "log" : "linear",
        range: singleSelectedPoint
          ? (logScale ? [Math.log10(yMin * 0.7), Math.log10(yMax * 1.25)] : [0, yMax * 1.08])
          : undefined,
      },
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1.02,
        xanchor: "right",
        x: 1,
        font: { color: "#94a3b8", size: 11 },
      },
      shapes: [
        {
          type: "line",
          x0: xMed,
          x1: xMed,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "rgba(255, 255, 255, 0.35)", width: 1.5, dash: "dash" },
        },
        {
          type: "line",
          x0: 0,
          x1: 1,
          xref: "paper",
          y0: yMed,
          y1: yMed,
          line: { color: "rgba(255, 255, 255, 0.35)", width: 1.5, dash: "dash" },
        },
      ],
      annotations: annotations,
    };

        const plotPromise = Plotly.newPlot(containerId, traces, layout, { responsive: true, displayModeBar: false });
    if (plotPromise && typeof plotPromise.then === "function") {
      plotPromise.then(() => chartHelper.enableScatterHoverDimming(el));
    } else {
      chartHelper.enableScatterHoverDimming(el);
    }

    if (onPointClick) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const selectedProv = data.points[0].text;
          onPointClick(selectedProv);
        }
      });
    }
  },

  // 4. Ministry Allocation in Province (Year 2566 only)
  renderProvincialMinistries: (containerId, ministryItems, unit = "ล้านบาท") => {
    chartHelper.renderHorizontalBar(containerId, ministryItems, "budget_million", "name", unit);
  },

  // 5. Peer comparison bar chart with Dual Benchmarks (Regional Mean & National Median)
  renderPeerComparison: (containerId, peerItems, regionBenchmark, nationalBenchmark = null) => {
    const el = document.getElementById(containerId);
    if (!el || !peerItems || peerItems.length === 0) return;

    const xProvs = peerItems.map((d) => d.province);
    const yBudgets = peerItems.map((d) => d.budget_million);
    const colors = peerItems.map((d) => (d.is_selected ? "#06b6d4" : "#334155"));

    const trace = {
      type: "bar",
      x: xProvs,
      y: yBudgets,
      marker: {
        color: colors,
        line: { color: "#06b6d4", width: peerItems.map((d) => (d.is_selected ? 2.5 : 0.8)) },
      },
      hovertemplate: "<b>%{x}</b><br>งบประมาณ: %{y:,.2f} ล้านบาท<extra></extra>",
    };

    const shapes = [];
    const annotations = [];

    // 1. Regional Mean Benchmark Line
    if (regionBenchmark) {
      shapes.push({
        type: "line",
        x0: 0,
        x1: 1,
        xref: "paper",
        y0: regionBenchmark,
        y1: regionBenchmark,
        line: { color: "#f59e0b", width: 1.8, dash: "dot" },
      });
      annotations.push({
        x: 1,
        y: regionBenchmark,
        xref: "paper",
        yref: "y",
        text: `ค่าเฉลี่ยภาค: ${regionBenchmark.toLocaleString()} ลบ.`,
        showarrow: false,
        font: { color: "#f59e0b", size: 10 },
        xanchor: "right",
        yanchor: "bottom",
      });
    }

    // 2. National Median Benchmark Line (Statistically robust against BKK outlier)
    if (nationalBenchmark) {
      shapes.push({
        type: "line",
        x0: 0,
        x1: 1,
        xref: "paper",
        y0: nationalBenchmark,
        y1: nationalBenchmark,
        line: { color: "#10b981", width: 1.5, dash: "dash" },
      });
      annotations.push({
        x: 0,
        y: nationalBenchmark,
        xref: "paper",
        yref: "y",
        text: `มัธยฐานประเทศ: ${nationalBenchmark.toLocaleString()} ลบ.`,
        showarrow: false,
        font: { color: "#10b981", size: 10 },
        xanchor: "left",
        yanchor: "bottom",
      });
    }

    const layout = {
      ...THEME_LAYOUT,
      margin: { l: 60, r: 20, t: 25, b: 50 },
      yaxis: { ...THEME_LAYOUT.yaxis, title: "งบประมาณ (ล้านบาท)" },
      shapes: shapes,
      annotations: annotations,
    };

    Plotly.newPlot(containerId, [trace], layout, { responsive: true, displayModeBar: false });
  },

  // 6. Party GPP Box Plot (Adapted strictly to Sample Size N and Outliers)
  renderPartyBoxPlot: (containerId, points, yMetric = "gpp_million", onSelectParty = null) => {
    const el = document.getElementById(containerId);
    if (!el || !points || points.length === 0) return;

    // Count sample size N per party
    const partyCounts = {};
    points.forEach((p) => {
      partyCounts[p.party_name] = (partyCounts[p.party_name] || 0) + 1;
    });

    // Sort parties descending by sample size N (major parties first)
    const sortedParties = Object.keys(partyCounts).sort((a, b) => partyCounts[b] - partyCounts[a]);
    const yTitle = yMetric === "gpp_million" ? "GPP (ล้านบาท)" : "งบประมาณ (ล้านบาท)";

    const traces = sortedParties.map((pty) => {
      const ptyPoints = points.filter((p) => p.party_name === pty);
      const countN = ptyPoints.length;
      const displayName = `${pty} (N=${countN})`;

      return {
        type: "box",
        name: displayName,
        y: ptyPoints.map((p) => p[yMetric]),
        customdata: ptyPoints.map((p) => [p.province, p.region, p.budget_million, p.gpp_million]),
        boxpoints: "all",
        jitter: 0.35,
        pointpos: countN <= 2 ? 0 : -1.8,
        marker: {
          color: PARTY_COLORS[pty] || "#94a3b8",
          size: countN <= 2 ? 8 : 5,
          opacity: 0.9,
          line: { color: "#ffffff", width: countN <= 2 ? 1.5 : 0.5 },
        },
        line: { color: PARTY_COLORS[pty] || "#94a3b8", width: 1.5 },
        hovertemplate:
          `<b>%{customdata[0]}</b> (%{customdata[1]})<br>` +
          `พรรค: ${pty}<br>` +
          `${yTitle}: %{y:,.2f} ล้านบาท<extra></extra>`,
      };
    });

    const layout = {
      ...THEME_LAYOUT,
      showlegend: false,
      margin: { l: 65, r: 20, t: 25, b: 65 },
      xaxis: { ...THEME_LAYOUT.xaxis, tickangle: -25 },
      yaxis: { ...THEME_LAYOUT.yaxis, title: yTitle },
      annotations: [
        {
          x: 0.5,
          y: 1.08,
          xref: "paper",
          yref: "paper",
          text: "ℹ️ พรรคที่มี N ≤ 4 แสดงจุดข้อมูลรายจังหวัดโดยตรง เพื่อป้องกันการแปลผล Quartiles ที่คลาดเคลื่อน",
          showarrow: false,
          font: { color: "rgba(148, 163, 184, 0.8)", size: 10 },
          align: "center",
        },
      ],
    };

    Plotly.newPlot(containerId, traces, layout, { responsive: true, displayModeBar: false });

    if (onSelectParty) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const fullLabel = data.points[0].data.name;
          const cleanParty = fullLabel.replace(/\s*\(N=\d+\)$/, "");
          onSelectParty(cleanParty);
        }
      });
    }
  },

  // 7. Party Bubble Scatter (supports linked single province view)
  renderPartyBubbleScatter: (containerId, allPoints, onSelect = null, selectedProvince = null) => {
    const el = document.getElementById(containerId);
    if (!el || !allPoints || allPoints.length === 0) return;

    // Filter to single province if selectedProvince is provided
    let points = allPoints;
    let singleSelectedPoint = null;
    if (selectedProvince) {
      const cleanSelected = selectedProvince.replace("จังหวัด", "").trim();
      const match = allPoints.find((p) => p.province.replace("จังหวัด", "").trim() === cleanSelected);
      if (match) {
        points = [match];
        singleSelectedPoint = match;
      }
    }

    // Calculate global domain so coordinate frame remains stable
    const allXVals = allPoints.map((p) => p.budget_million).filter((v) => v > 0);
    const allYVals = allPoints.map((p) => p.gpp_million).filter((v) => v > 0);
    const xMax = Math.max(...allXVals);
    const yMax = Math.max(...allYVals);

    const parties = [...new Set(points.map((p) => p.party_name))];

    const traces = parties.map((pty) => {
      const ptyPoints = points.filter((p) => p.party_name === pty);
      return {
        type: "scatter",
        mode: "markers",
        name: pty,
        x: ptyPoints.map((p) => p.budget_million),
        y: ptyPoints.map((p) => p.gpp_million),
        text: ptyPoints.map((p) => p.province),
        customdata: ptyPoints.map((p) => [p.pop_person]),
        marker: {
          size: ptyPoints.map((p) =>
            singleSelectedPoint
              ? Math.max(16, Math.min(32, Math.sqrt(p.pop_person) / 60))
              : Math.max(8, Math.min(26, Math.sqrt(p.pop_person) / 75))
          ),
          color: PARTY_COLORS[pty] || "#94a3b8",
          opacity: 0.9,
          line: { color: "#fff", width: singleSelectedPoint ? 2.5 : 1 },
        },
        hovertemplate:
          "<b>%{text}</b><br>พรรค: " +
          pty +
          "<br>ประชากร: %{customdata[0]:,d} คน (ขนาดจุด)<br>งบประมาณ: %{x:,.2f} ล้านบาท<br>GPP: %{y:,.2f} ล้านบาท<extra></extra>",
      };
    });

    const annotations = [];
    if (singleSelectedPoint) {
      annotations.push({
        x: singleSelectedPoint.budget_million,
        y: singleSelectedPoint.gpp_million,
        text: `📍 <b>${singleSelectedPoint.province}</b><br><span style="font-size:11px;">พรรค: ${singleSelectedPoint.party_name}</span>`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 1.5,
        arrowcolor: PARTY_COLORS[singleSelectedPoint.party_name] || "#06b6d4",
        ax: 0,
        ay: -45,
        bgcolor: "rgba(15, 23, 42, 0.92)",
        bordercolor: PARTY_COLORS[singleSelectedPoint.party_name] || "#06b6d4",
        borderwidth: 1.5,
        borderpad: 6,
        font: { color: "#f8fafc", size: 12 },
      });
    }

    const layout = {
      ...THEME_LAYOUT,
      margin: { l: 60, r: 20, t: 20, b: 50 },
      xaxis: {
        ...THEME_LAYOUT.xaxis,
        title: "งบประมาณรายจังหวัด (ล้านบาท)",
        range: singleSelectedPoint ? [0, xMax * 1.08] : undefined,
      },
      yaxis: {
        ...THEME_LAYOUT.yaxis,
        title: "ผลิตภัณฑ์มวลรวมจังหวัด GPP (ล้านบาท)",
        range: singleSelectedPoint ? [0, yMax * 1.08] : undefined,
      },
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1.02,
        xanchor: "right",
        x: 1,
        font: { color: "#94a3b8", size: 10 },
      },
      annotations: annotations,
    };

        const plotPromise = Plotly.newPlot(containerId, traces, layout, { responsive: true, displayModeBar: false });
    if (plotPromise && typeof plotPromise.then === "function") {
      plotPromise.then(() => chartHelper.enableScatterHoverDimming(el));
    } else {
      chartHelper.enableScatterHoverDimming(el);
    }

    if (onSelect) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const prov = data.points[0].text;
          onSelect(prov);
        }
      });
    }
  },

  // 8. Thailand Geographic Choropleth Map with linked click event (Adapted to Data Distribution)
  renderThailandMap: (
    containerId,
    geojson,
    provinceData,
    metricKey = "budget_million",
    unit = "ล้านบาท",
    onSelect = null,
    selectedProvince = null
  ) => {
    const el = document.getElementById(containerId);
    if (!el || !geojson || !provinceData || provinceData.length === 0) return;

    const locations = provinceData.map((d) => d.province);
    const customData = provinceData.map((d) => [
      d.region || "-",
      d.budget_million || 0,
      d.gpp_million || 0,
      d.party_name || "-",
      d.budget_per_capita_thb || 0,
      d.gpp_per_capita_thb || 0,
      d[metricKey] || 0,
    ]);

    // Data-driven color scaling:
    // When metric is heavily skewed (budget_million, gpp_million, budget_per_capita_thb),
    // linear scaling crushes 75 provinces into the lowest 1-3% color band.
    // Using log10-based visual scaling reveals spatial patterns across all 77 provinces.
    let zVals;
    let colorbarConfig;

    if (metricKey === "budget_million") {
      zVals = provinceData.map((d) => Math.log10(Math.max(1, d.budget_million || 0)));
      colorbarConfig = {
        title: { text: "งบประมาณ", font: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 11 } },
        tickvals: [3.301, 3.699, 4.0, 4.477, 5.0, 6.0, 6.243],
        ticktext: ["2 พันล.", "5 พันล.", "1 หมื่นล.", "3 หมื่นล.", "1 แสนล.", "1 ล้านล้าน", "1.7 ล้านล้าน"],
        tickfont: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 10 },
        thickness: 12,
        len: 0.75,
        bgcolor: "rgba(0,0,0,0)",
        outlinecolor: "rgba(255,255,255,0.1)",
      };
    } else if (metricKey === "gpp_million") {
      zVals = provinceData.map((d) => Math.log10(Math.max(1, d.gpp_million || 0)));
      colorbarConfig = {
        title: { text: "GPP", font: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 11 } },
        tickvals: [4.301, 4.699, 5.0, 5.477, 6.0, 6.788],
        ticktext: ["2 หมื่นล.", "5 หมื่นล.", "1 แสนล.", "3 แสนล.", "1 ล้านล้าน", "6.1 ล้านล้าน"],
        tickfont: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 10 },
        thickness: 12,
        len: 0.75,
        bgcolor: "rgba(0,0,0,0)",
        outlinecolor: "rgba(255,255,255,0.1)",
      };
    } else if (metricKey === "budget_per_capita_thb") {
      zVals = provinceData.map((d) => Math.log10(Math.max(1, d.budget_per_capita_thb || 0)));
      colorbarConfig = {
        title: { text: "งบ/หัว (บาท)", font: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 11 } },
        tickvals: [3.477, 3.778, 4.0, 4.176, 4.477, 5.0, 5.284],
        ticktext: ["3 พัน", "6 พัน", "1 หมื่น", "1.5 หมื่น", "3 หมื่น", "1 แสน", "1.9 แสน"],
        tickfont: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 10 },
        thickness: 12,
        len: 0.75,
        bgcolor: "rgba(0,0,0,0)",
        outlinecolor: "rgba(255,255,255,0.1)",
      };
    } else {
      // gpp_per_capita_thb has a balanced distribution (64k to 942k)
      zVals = provinceData.map((d) => d.gpp_per_capita_thb || 0);
      colorbarConfig = {
        title: { text: "GPP/หัว (บาท)", font: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 11 } },
        tickvals: [100000, 200000, 400000, 600000, 900000],
        ticktext: ["1 แสน", "2 แสน", "4 แสน", "6 แสน", "9 แสน"],
        tickfont: { family: "Sarabun, sans-serif", color: "#94a3b8", size: 10 },
        thickness: 12,
        len: 0.75,
        bgcolor: "rgba(0,0,0,0)",
        outlinecolor: "rgba(255,255,255,0.1)",
      };
    }

    const metricLabels = {
      budget_million: "งบประมาณ",
      budget_per_capita_thb: "งบประมาณต่อหัว",
      gpp_million: "GPP",
      gpp_per_capita_thb: "GPP ต่อหัว",
    };
    const curMetricLabel = metricLabels[metricKey] || "ค่าตัวชี้วัด";

    const baseTrace = {
      type: "choropleth",
      geojson: geojson,
      locations: locations,
      z: zVals,
      featureidkey: "id",
      customdata: customData,
      colorscale: [
        [0.0, "#0b1329"],
        [0.2, "#1e293b"],
        [0.45, "#0d9488"],
        [0.75, "#06b6d4"],
        [1.0, "#38bdf8"],
      ],
      marker: {
        line: { color: "rgba(255, 255, 255, 0.25)", width: 0.8 },
      },
      colorbar: colorbarConfig,
      hovertemplate:
        "<b>%{location}</b> (%{customdata[0]})<br>" +
        curMetricLabel + ": <b>%{customdata[6]:,.2f}</b> " + unit + "<br>" +
        "งบประมาณ: %{customdata[1]:,.2f} ล้านบาท<br>" +
        "งบต่อหัว: %{customdata[4]:,.2f} บาท/คน<br>" +
        "GPP: %{customdata[2]:,.2f} ล้านบาท<br>" +
        "GPP ต่อหัว: %{customdata[5]:,.2f} บาท/คน<br>" +
        "พรรคที่ชนะ: %{customdata[3]}<extra></extra>",
    };

    const traces = [baseTrace];

    // Highlighting overlay trace for selected province
    if (selectedProvince) {
      const selectedItem = provinceData.find((d) => d.province === selectedProvince);
      if (selectedItem) {
        const highlightTrace = {
          type: "choropleth",
          geojson: geojson,
          locations: [selectedProvince],
          z: [1],
          featureidkey: "id",
          colorscale: [
            [0, "#f59e0b"],
            [1, "#f59e0b"],
          ],
          showscale: false,
          marker: {
            line: { color: "#ffffff", width: 3.2 },
          },
          hovertemplate: `<b>📍 %{location} [ไฮไลต์ที่เลือก]</b><extra></extra>`,
        };
        traces.push(highlightTrace);
      }
    }

    const layout = {
      ...THEME_LAYOUT,
      margin: { l: 0, r: 0, t: 10, b: 0 },
      geo: {
        fitbounds: "locations",
        visible: false,
        bgcolor: "rgba(0,0,0,0)",
        showcountries: false,
        showcoastlines: false,
        showland: false,
      },
    };

    Plotly.newPlot(containerId, traces, layout, { responsive: true, displayModeBar: false });

    if (onSelect) {
      el.removeAllListeners && el.removeAllListeners("plotly_click");
      el.on("plotly_click", (data) => {
        if (data && data.points && data.points[0]) {
          const selectedProv = data.points[0].location;
          if (selectedProv) {
            onSelect(selectedProv);
          }
        }
      });
    }
  },
};

window.chartHelper = chartHelper;
