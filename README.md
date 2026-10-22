# Provincial Budget Intelligence Dashboard (Thailand FY 2566)
### ระบบวิเคราะห์งบประมาณรายจังหวัด ผลิตภัณฑ์มวลรวม (GPP) และเศรษฐกิจการเมืองไทยเชิงพื้นที่
**พัฒนาตามข้อกำหนด HANDOFF ADDENDUM: เทคโนโลยี FastAPI + Modern Glassmorphism Frontend + Plotly.js (ไม่ใช้ Streamlit)**

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35+-3F4F75.svg)](https://plotly.com/javascript/)
[![Tests](https://img.shields.io/badge/Tests-18%20Passed-success.svg)]()

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
- **Frontend**: **Modern Vanilla HTML5, CSS3 และ JavaScript (ES6+)**
  - ไม่พึ่งพาเฟรมเวิร์กขนาดใหญ่ โหลดเร็วและลื่นไหล
  - ดีไซน์ระบบ **Glassmorphism บนพื้นหลังสีกรมท่าเข้ม (Deep Navy & Indigo Glow)**
  - การ์ดโปร่งแสง (Translucent Cards) พร้อมเส้นขอบเรืองแสงสี Cyan (`#06b6d4`) และ Teal (`#14b8a6`)
  - ฟอนต์ภาษาไทย **Sarabun** รองรับทุกขนาดหน้าจอ (Desktop, Tablet, Mobile)
- **Interactive Visualizations**: **Plotly.js**
  - กราฟทุกกราฟตอบสนองต่อการคลิก (Click Events) และมี Tooltip ภาษาไทยสมบูรณ์
- **State Management**: **Shared Filter State Bus (`static/js/state.js`)**
  - จัดการสถานะตัวกรองส่วนกลาง และอัปเดตกราฟที่เกี่ยวข้องพร้อมกันโดยไม่กะพริบหน้าจอ

---

## 🗺️ เมนูและโครงสร้างการวิเคราะห์ 5 หน้า (Thai Navigation Views)

### 1. 📊 ภาพรวมงบประมาณ (Budget Overview)
- การ์ดสรุป KPI ระดับชาติ: งบประมาณรวมแผ่นดิน 3.18 ล้านล้านบาท, งบส่วนกลาง 5.90 แสนล้านบาท (18.55%), งบระดับจังหวัด 2.59 ล้านล้านบาท (81.45%)
- กราฟแท่งแนวนอน (Horizontal Bar Chart) แสดง 10 อันดับจังหวัดที่ได้รับงบสูงสุดและต่ำสุด **(คลิกแท่งเพื่อเจาะลึกจังหวัดนั้น)**
- กราฟโดนัทแสดงโครงสร้างประเภทงบรายจ่าย 5 หมวด **(คลิกเสี้ยวเพื่อกรอง)**
- กราฟแท่ง 10 อันดับกระทรวงที่ได้รับงบสูงสุด **(คลิกแท่งเพื่อกรอง)**
- แถบแจ้งเตือนจังหวัดที่กำลังเลือก พร้อมปุ่ม *"ล้างการเลือกจังหวัด"* เพื่อกลับสู่ภาพรวมระดับประเทศ

### 2. 🔎 วิเคราะห์รายจังหวัด (Provincial Deep Dive)
- กล่องค้นหาและเลือกจังหวัดแบบ Dropdown (77 จังหวัด)
- การ์ด 5 ตัวชี้วัดสำคัญของจังหวัด: งบที่ได้รับ, งบต่อหัว (บาท/คน), ผลิตภัณฑ์มวลรวม (GPP), GPP ต่อหัว, และพรรคการเมืองที่ชนะ
- กราฟโดนัทแสดงสัดส่วนงบรายจ่ายของจังหวัดนี้
- กราฟเส้นแนวโน้ม GPP ย้อนหลัง 29 ปี (พ.ศ. 2538 - 2566)
- กราฟเปรียบเทียบในกลุ่มจังหวัดใกล้เคียง (Peer Comparison) พร้อมเส้นค่าเฉลี่ยของภูมิภาค
- กราฟหน่วยงานที่ได้รับงบสูงสุดในจังหวัด และตารางสืบค้นรายการโครงการงบประมาณ

### 3. 📈 งบประมาณและเศรษฐกิจจังหวัด (Budget × GPP)
- แผนภาพการกระจายตัว (Interactive Scatter Plot) พร้อมเส้นอ้างอิงค่ามัธยฐานแบ่ง 4 Quadrant:
  - **Q1 (Core Hub)**: ศักยภาพสูง - งบประมาณสูง
  - **Q2 (High Efficiency)**: ศักยภาพสูง - งบประมาณต่ำ
  - **Q3 (Emerging Area)**: ศักยภาพพื้นฐาน - งบประมาณต่ำ
  - **Q4 (Special Support)**: ศักยภาพพื้นฐาน - งบประมาณสูง
- สวิตช์ควบคุม:
  - `⚡ ไม่รวม กรุงเทพฯ และ นนทบุรี`: คัดกรองค่าผิดปกติจากที่ตั้งกระทรวงส่วนกลาง
  - `👤 ต่อหัวประชากร`: สลับระหว่างยอดรวมกับตัวเลขต่อหัวประชากร
  - `📐 Logarithmic Scale`: ปรับสเกลกราฟให้กระจายตัวชัดเจน
- ตัวชี้วัดสหสัมพันธ์: Pearson correlation ($r$), Spearman correlation ($r$), และ $p$-value
- **การเชื่อมโยง**: คลิกจุดจังหวัดใดบนกราฟ ระบบจะไฮไลต์และส่งไปเจาะลึกจังหวัดนั้นทันที

### 4. 🗳️ พรรคการเมืองและเศรษฐกิจจังหวัด (Party × GPP)
- **กล่องข้อความเตือนทางวิชาการ (Methodological Notice)**:
  - ระบุชัดเจนว่า **Correlation $\neq$ Causation** เนื่องจาก พ.ร.บ. งบประมาณ 2566 จัดทำขึ้นล่วงหน้าในปี 2565 ก่อนการเลือกตั้งทั่วไปในเดือน พ.ค. 2566
- ตารางสรุปสถิติเชิงพรรณนาตามพรรคการเมือง: จำนวนจังหวัดที่ชนะ, งบประมาณรวม, ค่ามัธยฐานงบประมาณ, ค่ามัธยฐาน GPP, และอัตราการเติบโตทางเศรษฐกิจ
- Box Plot การกระจายตัวของ GPP และงบประมาณจำแนกตามพรรคการเมือง **(คลิกเพื่อกรองพรรค)**
- Bubble Scatter Plot จำแนกสีตามพรรคการเมือง

### 5. 🛡️ คุณภาพข้อมูลและวิธีวิเคราะห์ (Data Quality & Methodology)
- ตารางตรวจสอบคุณภาพข้อมูล 10 มิติ (Data Quality Checklist) ผ่านการประเมิน 100%
- การตรวจสอบความถูกต้องของยอดงบประมาณ (Reconciliation Audit):
  - ยอดงบจังหวัดก่อนและหลัง Join ต่างกัน `0.00 บาท` (ไม่มีงบประมาณบวมจากการคูณซ้ำ)
- รายงานข้อจำกัดเชิงโครงสร้างและเวลาของชุดข้อมูล

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)
```text
project_BP_group8/
├── main.py                     # FastAPI Application (API Endpoints & Static Mounting)
├── run.py                      # One-click Runner (python run.py)
├── data/                       # โฟลเดอร์ชุดข้อมูล CSV จริง 3 ชุด
│   ├── provincial_budget.csv   # ข้อมูลงบประมาณ พ.ศ. 2566 (Delimiter: |)
│   ├── gdp.csv                 # ข้อมูล GPP, ประชากร, GPP ต่อหัว (2538-2566)
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
│   └── js/
│       ├── state.js            # Shared Filter State Bus (Cross-Filtering)
│       ├── api.js              # Fetch API wrappers
│       ├── charts.js           # Plotly.js chart renderers with linked click events
│       └── app.js              # UI controller, routing, and DOM bindings
├── tests/                      # ชุดทดสอบอัตโนมัติ (Automated Test Suite)
│   ├── __init__.py
│   ├── test_data_pipeline.py   # ทดสอบ Data Cleaning, Reconciliation, Formulas
│   └── test_api.py             # ทดสอบ FastAPI Endpoints (TestClient)
├── requirements.txt            # รายการไลบรารี Python (fastapi, uvicorn, pandas, ...)
├── .gitignore
└── README.md                   # คู่มือระบบฉบับสมบูรณ์
```

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Installation & Setup)

### 1. ความต้องการของระบบ
- Python: เวอร์ชัน 3.10 ขึ้นไป (แนะนำ Python 3.12)
- ระบบปฏิบัติการ: Windows, macOS หรือ Linux

### 2. ติดตั้ง Dependencies
เปิด Terminal หรือ Command Prompt ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่ง:
```bash
pip install -r requirements.txt
```

### 3. รันระบบ Dashboard
รันคำสั่ง:
```bash
python run.py
```
*(หรือใช้คำสั่ง: `uvicorn main:app --reload --port 8000`)*

ระบบจะเปิด Web Server ให้เปิดเว็บเบราว์เซอร์ไปที่:
👉 **[http://localhost:8000](http://localhost:8000)**

### 4. รันชุดทดสอบอัตโนมัติ (Run Tests)
```bash
python -m pytest -v
```
**ผลลัพธ์การทดสอบ: ผ่าน 18/18 การทดสอบ (100% Passed)** ครอบคลุมทั้ง Data Pipeline, การเชื่อมโยงข้อมูล, สูตรสถิติ และการเรียกใช้งาน API ทุก Endpoint

---

## ⚡ การเชื่อมโยงข้อมูลข้ามกราฟ (Cross-Chart Interactions)
1. **คลิกแท่งจังหวัดในหน้าภาพรวม**: กราฟจะส่งชื่อจังหวัดเข้าสู่ Shared State และเปิดหน้าเจาะลึกจังหวัดนั้นทันที พร้อมปุ่มล้างการเลือก
2. **คลิกเสี้ยวประเภทงบใน Donut**: ตัวกรองส่วนกลางจะอัปเดตเป็นประเภทงบนั้น และปรับตัวเลข KPI พร้อมกราฟกระทรวงทันที
3. **คลิกจุดใน Scatter Plot**: ไฮไลต์จังหวัดที่เลือกและแสดงข้อมูลเศรษฐกิจเปรียบเทียบ
4. **คลิกกล่องพรรคการเมืองใน Box Plot**: กรองข้อมูลเฉพาะจังหวัดที่พรรคนั้นชนะการเลือกตั้ง
5. **ปุ่ม "ล้างตัวกรองทั้งหมด" ใน Sidebar**: รีเซ็ตค่าทั้งหมดกลับสู่ภาพรวมระดับประเทศอย่างราบรื่น
