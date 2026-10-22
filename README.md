# Provincial Budget Intelligence Dashboard (Thailand FY 2566)
### ระบบวิเคราะห์งบประมาณรายจังหวัด ผลิตภัณฑ์มวลรวม (GPP) และเศรษฐกิจการเมืองไทยเชิงพื้นที่
**พัฒนาตามข้อกำหนด HANDOFF ADDENDUM: เทคโนโลยี FastAPI + Modern Glassmorphism Frontend + Plotly.js (ไม่ใช้ Streamlit)**

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35+-3F4F75.svg)](https://plotly.com/javascript/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passed-success.svg)]()

---

## 📌 ข้อมูลโครงงานเดิมและแหล่งอ้างอิง
- **ชุดข้อมูลต้นฉบับ**: [Google Drive Folder](https://drive.google.com/drive/folders/1m6hp8l6iMB1u-a1yNK4laewgrUTy_Bnl?usp=drive_link)
- **สไลด์นำเสนอ**: [Canva Presentation](https://canva.link/ulpsfg5b8synm67)
- **สมาชิกกลุ่ม 8 (MONEY_knock_everyting)**:
  - ณิรดา อนุนิวัฒน์ — Data Engineering & Preparation
  - ธนพล — Data Analysis & Questions Formulation
  - อาทิติญา — Visualization Development & Presentation
  - สุพิชชา — Visualization Design & Layout Architecture

---

## 📖 สถาปัตยกรรมและเทคโนโลยีที่ใช้ (Tech Stack)
ระบบได้รับการพัฒนาใหม่ทั้งหมดตามข้อกำหนด **HANDOFF ADDENDUM** โดยไม่ใช้ Streamlit เพื่อให้สามารถควบคุมการออกแบบ UI ได้อย่างละเอียดแบบพิกเซลต่อพิกเซล และรองรับการเชื่อมโยงปฏิสัมพันธ์ข้ามกราฟ (Cross-Chart Linked Brushing):

- **Backend**: **Python 3.12 + FastAPI + Uvicorn**
  - สถาปัตยกรรม RESTful API แบบอะซิงโครนัส (Async/Await)
  - ประมวลผลและคำนวณสถิติด้วย **Pandas**, **NumPy**, และ **SciPy**
  - กรองและใช้ข้อมูลปีงบประมาณ **พ.ศ. 2566** อย่างเคร่งครัด 100%
- **Frontend**: **Modern Vanilla HTML5, CSS3 และ JavaScript (ES6+)**
  - ไม่พึ่งพาเฟรมเวิร์กขนาดใหญ่ โหลดเร็วและลื่นไหล
  - ดีไซน์ระบบ **Glassmorphism บนพื้นหลังสีกรมท่าเข้ม (Deep Navy & Indigo Glow)**
  - การ์ดโปร่งแสง (Translucent Cards) พร้อมเส้นขอบเรืองแสงสี Cyan (`#06b6d4`) และ Amber (`#f59e0b`)
  - ฟอนต์ภาษาไทย **Sarabun** รองรับทุกขนาดหน้าจอ (Desktop, Tablet, Mobile)
- **Interactive Visualizations**: **Plotly.js**
  - กราฟทุกกราฟตอบสนองต่อการคลิก (Click Events), ไฮไลต์เชื่อมโยง (Linked Brushing) และมี Tooltip ภาษาไทยสมบูรณ์
- **State Management**: **Shared Filter State Bus (`static/js/state.js`)**
  - จัดการสถานะตัวกรองส่วนกลาง และอัปเดตกราฟที่เกี่ยวข้องพร้อมกันโดยไม่กะพริบหน้าจอ

---

## 🗺️ เมนูและโครงสร้างการวิเคราะห์ 4 หน้าหลัก (Thai Navigation Views)

### 1. 📊 ภาพรวมงบประมาณ (Budget Overview)
- การ์ดสรุป KPI ระดับชาติ: งบประมาณรวมแผ่นดิน 3.18 ล้านล้านบาท, งบส่วนกลาง 5.90 แสนล้านบาท (18.55%), งบระดับจังหวัด 2.59 ล้านล้านบาท (81.45%)
- **แผนที่ภูมิศาสตร์ประเทศไทย (Thailand Geographic Choropleth Map)**:
  - แสดงการกระจายตัวของงบประมาณ, งบต่อหัว, GPP และ GPP ต่อหัว
  - **ระบบไฮไลต์เมื่อคลิก (Interactive Linked Highlighting)**: คลิกจังหวัดใดบนแผนที่เพื่อไฮไลต์ด้วยสีส้มทอง (`#f59e0b`) ขอบขาวหนา และคลิกซ้ำเพื่อยกเลิกไฮไลต์
- **กล่องสรุปข้อมูลข้างแผนที่ (Side Info Card)**: แสดงข้อมูล 2566 ครบถ้วน (งบประมาณ, งบต่อหัว, GPP, GPP ต่อหัว, พรรคที่ชนะ) พร้อมปุ่มด่วนเจาะลึก
- **กราฟแท่งจัดอันดับ (Top 10 & Bottom 10)**: เชื่อมโยงสีไฮไลต์กับแผนที่โดยตรง
- **กราฟโดนัทประเภทงบประมาณ & กราฟแท่ง 10 อันดับกระทรวง**
- **แถบแจ้งเตือนจังหวัดที่ไฮไลต์ (Selection Banner)**: พร้อมปุ่มไปหน้าเจาะลึกและปุ่มยกเลิกไฮไลต์

### 2. 🔎 วิเคราะห์รายจังหวัด (Provincial Deep Dive)
- กล่องค้นหาและเลือกจังหวัดแบบ Dropdown (77 จังหวัด)
- การ์ด 5 ตัวชี้วัดสำคัญของจังหวัด: งบที่ได้รับ, งบต่อหัว (บาท/คน), ผลิตภัณฑ์มวลรวม (GPP), GPP ต่อหัว, และพรรคการเมืองที่ชนะ
- กราฟโดนัทแสดงสัดส่วนประเภทงบรายจ่ายของจังหวัดนี้ (ปี 2566)
- กราฟแท่งสัดส่วนงบประมาณจำแนกตามกระทรวงในจังหวัดนี้ (ปี 2566)
- กราฟเปรียบเทียบในกลุ่มจังหวัดใกล้เคียง (Peer Comparison) พร้อมเส้นค่าเฉลี่ยของภูมิภาคและมัธยฐานประเทศ
- กราฟหน่วยงานที่ได้รับงบสูงสุดในจังหวัด และตารางสืบค้นรายการโครงการงบประมาณ

### 3. 📈 งบประมาณและเศรษฐกิจจังหวัด (Budget × GPP)
- แผนภาพการกระจายตัว (Interactive Scatter Plot) พร้อมเส้นอ้างอิงค่ามัธยฐานแบ่ง 4 Quadrant:
  - **Q1 (Core Hub)**: ศักยภาพสูง - งบประมาณสูง
  - **Q2 (High Efficiency)**: ศักยภาพสูง - งบประมาณต่ำ
  - **Q3 (Emerging Area)**: ศักยภาพพื้นฐาน - งบประมาณต่ำ
  - **Q4 (Special Support)**: ศักยภาพพื้นฐาน - งบประมาณสูง
- **ขนาดของจุด (Bubble Size)**: แปรผันตรงตามจำนวนประชากรของจังหวัด ($\sqrt{\text{Population}}$)
- สวิตช์ควบคุม:
  - `⚡ ไม่รวม กรุงเทพฯ และ นนทบุรี`: คัดกรองค่าผิดปกติจากที่ตั้งกระทรวงส่วนกลาง
  - `👤 ต่อหัวประชากร`: สลับระหว่างยอดรวมกับตัวเลขต่อหัวประชากร
  - `📐 Logarithmic Scale`: ปรับสเกลกราฟให้กระจายตัวชัดเจน
- ตัวชี้วัดสหสัมพันธ์: Pearson correlation ($r$), Spearman correlation ($r$), และ $p$-value
- ตารางสรุปการจัดกลุ่ม Quadrant รายจังหวัดอย่างละเอียด

### 4. 🗳️ พรรคการเมืองและเศรษฐกิจจังหวัด (Party × GPP)
- **กล่องข้อความเตือนทางวิชาการ (Methodological Notice)**:
  - ระบุชัดเจนว่า **Correlation $\neq$ Causation** เนื่องจาก พ.ร.บ. งบประมาณ 2566 จัดทำขึ้นล่วงหน้าในปี 2565 ก่อนการเลือกตั้งทั่วไปในเดือน พ.ค. 2566
- ตารางสรุปสถิติเชิงพรรณนาตามพรรคการเมือง: จำนวนจังหวัดที่ชนะ, งบประมาณรวม, ค่ามัธยฐานงบประมาณ, ค่ามัธยฐาน GPP, และอัตราการเติบโตทางเศรษฐกิจ
- Box Plot การกระจายตัวของ GPP และงบประมาณจำแนกตามพรรคการเมือง **(คลิกเพื่อกรองพรรค)**
- Bubble Scatter Plot จำแนกสีตามพรรคการเมือง โดยขนาดจุดเท่ากับขนาดประชากร

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)
```text
project_BP_group8/
├── main.py                     # FastAPI Backend Application (API Endpoints & Static Mounting)
├── run.py                      # One-click Server Runner (รองรับ Localhost & LAN IP)
├── share_online.bat            # สคริปต์เปิด Cloudflare Tunnel สำหรับแชร์ลิงก์ด่วน
├── Dockerfile                  # คอนฟิก Docker สำหรับ Deploy บนคลาวด์ทุกแพลตฟอร์ม
├── Procfile                    # คอนฟิก PaaS Deployment (Render / Heroku / Railway)
├── render.yaml                 # Blueprint อัตโนมัติสำหรับการ Deploy บน Render.com
├── .python-version             # ระบุเวอร์ชัน Python 3.12.7 สำหรับ Render
├── requirements.txt            # รายการไลบรารี Python (fastapi, uvicorn, pandas, ...)
├── data/                       # โฟลเดอร์ชุดข้อมูลจริงปี 2566
│   ├── provincial_budget.csv   # ข้อมูลงบประมาณ พ.ศ. 2566 (Delimiter: |)
│   ├── gdp.csv                 # ข้อมูล GPP, ประชากร, GPP ต่อหัว (เฉพาะปี 2566)
│   └── partylist.csv           # ข้อมูลพรรคการเมืองรายจังหวัด
├── src/                        # Data Pipeline & Business Logic
│   ├── __init__.py
│   ├── load_data.py            # การโหลดไฟล์ CSV และตรวจจับ Delimiter
│   ├── clean_data.py           # การทำมาตรฐานชื่อจังหวัด และ 6 ภูมิภาคตามสภาพัฒน์
│   └── metrics.py              # คำนวณ KPIs, สหสัมพันธ์, Quadrant, Party Summary
├── static/                     # Modern Glassmorphism Single-Page Application (SPA)
│   ├── index.html              # หน้าจอ HTML ภาษาไทยสมบูรณ์
│   ├── css/
│   │   └── style.css           # ธีม Deep Navy, Glassmorphism, Responsive Grid
│   ├── data/
│   │   └── thailand_provinces.geojson # ข้อมูลภูมิสารสนเทศ 77 จังหวัด
│   └── js/
│       ├── state.js            # Shared Filter State Bus (Cross-Filtering)
│       ├── api.js              # Fetch API wrappers
│       ├── charts.js           # Plotly.js chart renderers with linked highlighting
│       └── app.js              # UI controller, routing, and DOM bindings
├── tests/                      # ชุดทดสอบอัตโนมัติ 19 รายการ (Automated Test Suite)
│   ├── __init__.py
│   ├── test_data_pipeline.py   # ทดสอบ Data Cleaning, Reconciliation, Formulas
│   └── test_api.py             # ทดสอบ FastAPI Endpoints (TestClient)
├── .gitignore                  # Git Ignore configuration
└── README.md                   # คู่มือระบบฉบับสมบูรณ์
```

---

## 🚀 วิธีการเริ่มใช้งานและการ Deploy (Running & Deployment)

### วิธีที่ 1: รันในเครื่องคอมพิวเตอร์ (Local Development)
```bash
# 1. ติดตั้ง Dependencies
pip install -r requirements.txt

# 2. รันเซิร์ฟเวอร์
python run.py
```
เปิดเว็บเบราว์เซอร์ไปที่:
* บนคอมพิวเตอร์เครื่องนี้: **[http://localhost:8000](http://localhost:8000)**
* บนคอมพิวเตอร์เครื่องอื่นใน Wi-Fi เดียวกัน: **`http://<IP-เครื่อง>:8000`**

### วิธีที่ 2: แชร์ออนไลน์ผ่าน Cloudflare Tunnel (ไม่ต้องเปิดพอร์ต)
ดับเบิลคลิกไฟล์ **`share_online.bat`** เพื่อสร้างลิงก์ HTTPS ชั่วคราวส่งให้เพื่อนได้ทันที

### วิธีที่ 3: Deploy ออนไลน์ 24 ชั่วโมงบน Render.com (ฟรี ไม่ต้องเปิดคอมทิ้งไว้)
1. ดันโค้ดขึ้น GitHub: `git push origin main`
2. เข้าสู่ระบบ [render.com](https://render.com) ด้วยบัญชี GitHub
3. เลือก **New +** ➔ **Web Service** ➔ เลือก Repository `project_BP_group8`
4. ตั้งค่า:
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. กด **Create Web Service** จะได้ลิงก์ถาวร เช่น `https://<ชื่อเว็บ>.onrender.com` ใช้งานได้ตลอดเวลา

---

### 🧪 รันชุดทดสอบอัตโนมัติ (Automated Tests)
```bash
python -m pytest -v
```
**ผลลัพธ์การทดสอบ: ผ่าน 19/19 การทดสอบ (100% Passed)** ครอบคลุมทั้ง Data Pipeline, ความถูกต้องของงบประมาณปี 2566, สถิติสหสัมพันธ์, และ API ทุก Endpoint
