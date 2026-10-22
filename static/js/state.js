/**
 * State Management & Shared Filter Bus (state.js)
 * Enables linked brushing and cross-chart filtering across all dashboard views.
 */

class DashboardState {
  constructor() {
    this.state = {
      activeTab: "overview", // 'overview' | 'province' | 'economy' | 'party' | 'quality'
      selectedRegion: "ทุกภูมิภาค",
      selectedProvince: null,
      selectedMinistry: "ทุกกระทรวง",
      selectedObjc: "ทุกประเภทงบ",
      selectedParty: "ทุกพรรค",
      excludeOutliers: true, // true: exclude BKK and Nonthaburi
      perCapitaMode: false,  // false: total values, true: per capita
      availableFilters: null,
    };

    this.listeners = [];
  }

  getState() {
    return { ...this.state };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(changedKeys = []) {
    this.listeners.forEach((callback) => callback(this.state, changedKeys));
  }

  set(key, value) {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notify([key]);
    }
  }

  setMultiple(updates) {
    const changed = [];
    for (const [key, val] of Object.entries(updates)) {
      if (this.state[key] !== val) {
        this.state[key] = val;
        changed.push(key);
      }
    }
    if (changed.length > 0) {
      this.notify(changed);
    }
  }

  selectProvince(provinceName) {
    if (this.state.selectedProvince !== provinceName) {
      this.state.selectedProvince = provinceName;
      this.notify(["selectedProvince"]);
    }
  }

  clearProvince() {
    if (this.state.selectedProvince !== null) {
      this.state.selectedProvince = null;
      this.notify(["selectedProvince"]);
    }
  }

  clearAllFilters() {
    this.state.selectedRegion = "ทุกภูมิภาค";
    this.state.selectedProvince = null;
    this.state.selectedMinistry = "ทุกกระทรวง";
    this.state.selectedObjc = "ทุกประเภทงบ";
    this.state.selectedParty = "ทุกพรรค";
    this.notify(["all"]);
  }
}

// Global shared singleton state
window.dashboardState = new DashboardState();
