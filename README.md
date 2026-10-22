# Provincial Budget Intelligence Dashboard (Thailand FY 2566)
### ระบบวิเคราะห์งบประมาณรายจังหวัด ผลิตภัณฑ์มวลรวม (GPP) และเศรษฐกิจการเมืองไทยเชิงพื้นที่
**สถาปัตยกรรมระดับองค์กร: FastAPI Backend + Modern Glassmorphism Single-Page Application (Plotly.js + Vanilla JS)**

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.35+-3F4F75.svg)](https://plotly.com/javascript/)
[![Data Year](https://img.shields.io/badge/Data%20Scope-FY%202566%20Only-emerald.svg)]()
[![Cloud Ready](https://img.shields.io/badge/Deploy-Render%20%7C%20Docker-purple.svg)]()

---

## 📌 ข้อมูลโครงงานและแหล่งอ้างอิง
- **ชุดข้อมูลต้นฉบับ**: [Google Drive Folder](https://drive.google.com/drive/folders/1m6hp8l6iMB1u-a1yNK4laewgrUTy_Bnl?usp=drive_link)
- **สไลด์นำเสนอโครงงาน**: [Canva Presentation](https://canva.link/ulpsfg5b8synm67)
- **สมาชิกกลุ่ม 8 (MONEY_knock_everyting)**:
  - ณิรดา อนุนิวัฒน์ — Data Engineering & Preparation
  - ธนพล — Data Analysis & Questions Formulation
  - อาทิติญา — Visualization Development & Presentation
  - สุพิชชา — Visualization Design & Layout Architecture

---

## 🎯 จุดเด่นและขอบเขตของระบบ (Key Features & Scope)

1. **เจาะจงข้อมูลปีงบประมาณ พ.ศ. 2566 (FY 2566 Strict Filtering)**:
   - กรองและใช้เฉพาะข้อมูลปี 2566 ทั้งงบประมาณแผ่นดิน (3.18 ล้านล้านบาท), ขนาดเศรษฐกิจ (GPP), ประชากร และผลการเลือกตั้งทั่วไปปี 2566
   - ปราศจากข้อมูลปีย้อนหลัง เพื่อให้การวิเคราะห์เชิงเปรียบเทียบในมิติต่าง ๆ อยู่บนฐานเวลาเดียวกัน 100%

2. **ระบบไฮไลต์เชื่อมโยงข้ามกราฟ (Cross-Chart Linked Highlighting)**:
   - เมื่อคลิกจังหวัดใดบนแผนที่ประเทศไทย หรือแท่งกราฟ Top 10 / Bottom 10 จังหวัดนั้นจะถูกเน้นด้วย **สีส้มทอง (Amber Gold `#f59e0b`)** พร้อมขอบสีขาวหนา
   - กล่องสรุปข้อมูลข้างแผนที่และแถบสถานะ (Selection Banner) จะเรืองแสงและอัปเดตข้อมูลของจังหวัดนั้นทันที พร้อมปุ่มลัดไปยังหน้าเจาะลึก
   - รองรับระบบ Toggle (คลิกซ้ำเพื่อยกเลิกการเลือก) คืนสู่สภาวะภาพรวมอย่างราบรื่น

3. **วิเคราะห์ 4 แดนเศรษฐกิจการคลัง (Budget vs GPP Quadrant Analysis)**:
   - ใช้ **ค่ามัธยฐาน (Median)** ของประเทศเป็นเส้นตัดกึ่งกลาง เพื่อป้องกันปัญหาค่าเฉลี่ยถูกดึงจากความเบ้ของข้อมูล (Skewness)
   - ขนาดของจุด (Bubble Size) แปรผันตรงกับจำนวนประชากรตามสูตร $\text{Size} = \frac{\sqrt{\text{Population}}}{75}$ สะท้อนมิติประชากรในพื้นที่จริง

4. **ข้อจำกัดเชิงระเบียบวิธีวิจัย (Academic Methodological Notice)**:
   - มีกล่องเตือนทางวิชาการระบุชัดเจนว่า **Correlation $\neq$ Causation** เนื่องจาก พ.ร.บ. งบประมาณ 2566 จัดทำขึ้นล่วงหน้าในปี 2565 ก่อนการเลือกตั้งทั่วไปในเดือน พ.ค. 2566

---

## 📖 สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

- **Backend**: **Python 3.12 + FastAPI + Uvicorn**
  - RESTful API แบบอะซิงโครนัส ประมวลผลรวดเร็วด้วย **Pandas**, **NumPy**, และ **SciPy**
  - รองรับ Cross-Origin Resource Sharing (CORS) และการเข้าถึงจากทั้ง Localhost, LAN IP และ Cloud
- **Frontend**: **Modern Vanilla HTML5, CSS3, JavaScript (ES6+)**
  - โครงสร้าง Single-Page Application (SPA) น้ำหนักเบา ไม่พึ่งพาเฟรมเวิร์กขนาดใหญ่
  - ธีม **Glassmorphism สีกรมท่าเข้ม (`#080d1a`)** พร้อมเส้นขอบเรืองแสง Cyan และ Amber
  - ฟอนต์ภาษาไทย **Sarabun** ออกแบบ Responsive รองรับทั้งคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน
- **Visualizations**: **Plotly.js**
  - กราฟทุกตัวรองรับการคลิกโต้ตอบ (Interactive Events) และมี Tooltip ภาษาไทยครบถ้วน
- **State Management**: **Shared Filter State Bus (`static/js/state.js`)**
  - จัดการสถานะตัวกรองส่วนกลาง และกระจาย Event ไปอัปเดตกราฟที่เกี่ยวข้องพร้อมกัน

---

## 🗺️ โครงสร้างการวิเคราะห์ 4 หน้าหลัก (Navigation Views)

### 1. 📊 ภาพรวมงบประมาณ (Budget Overview)
- การ์ดสรุป KPI ระดับชาติ: งบประมาณรวมแผ่นดิน 3.18 ล้านล้านบาท, งบส่วนกลาง 5.90 แสนล้านบาท (18.55%), งบระดับจังหวัด 2.59 ล้านล้านบาท (81.45%), และจังหวัดที่ได้รับงบสูงสุด
- **แผนที่ภูมิศาสตร์ประเทศไทย (Thailand Geographic Choropleth Map)**:
  - สลับดูตัวชี้วัดได้ 4 รูปแบบ: งบประมาณ, งบต่อหัว, GPP, และ GPP ต่อหัว
  - ระบบ Interactive Click & Highlight เชื่อมโยงสีส้มทอง
- **กล่องข้อมูลข้างแผนที่ (Side Info Card)**: แสดงรายละเอียดของจังหวัดที่ไฮไลต์ พร้อมปุ่มด่วนเจาะลึก
- **กราฟแท่งแนวนอน 10 อันดับงบสูงสุดและต่ำสุด**: เชื่อมโยงสถานะการเลือกกับแผนที่
- **กราฟโดนัทจำแนกตามประเภทงบรายจ่าย & กราฟแท่ง 10 อันดับกระทรวง**
- **แถบแจ้งเตือนสถานะการไฮไลต์ (Selection Banner)**: พร้อมปุ่มยกเลิกไฮไลต์และปุ่มเจาะลึก

### 2. 🔎 วิเคราะห์รายจังหวัด (Provincial Deep Dive)
- กล่องเลือกจังหวัด Dropdown (77 จังหวัด) พร้อมระบบ Auto-fill เมื่อคลิกมาจากหน้าอื่น
- การ์ด 5 ตัวชี้วัดสำคัญของจังหวัด: งบประมาณที่ได้รับ, งบต่อหัว (บาท/คน), ผลิตภัณฑ์มวลรวม (GPP), GPP ต่อหัว, และพรรคการเมืองที่ชนะ
- กราฟโดนัทแสดงสัดส่วนประเภทงบประมาณของจังหวัดนี้ (ปี 2566)
- กราฟแท่งสัดส่วนงบประมาณจำแนกตามกระทรวงในจังหวัดนี้ (ปี 2566)
- กราฟเปรียบเทียบในกลุ่มจังหวัดใกล้เคียง (Peer Comparison) พร้อมเส้นค่าเฉลี่ยภูมิภาคและมัธยฐานประเทศ
- กราฟหน่วยงานที่ได้รับงบสูงสุดในจังหวัด และตารางสืบค้นรายการโครงการงบประมาณ

### 3. 📈 งบประมาณและเศรษฐกิจจังหวัด (Budget × GPP)
- แผนภาพการกระจายตัว (Interactive Scatter Plot) พร้อมเส้นอ้างอิงค่ามัธยฐานแบ่ง 4 Quadrant:
  - **Q1: ศักยภาพสูง - งบประมาณสูง (Core Economic Hubs)** เช่น เชียงใหม่, นครราชสีมา, ชลบุรี
  - **Q2: ศักยภาพสูง - งบประมาณต่ำ (High Economic Efficiency)** เช่น ระยอง, สระบุรี, พระนครศรีอยุธยา
  - **Q3: ศักยภาพพื้นฐาน - งบประมาณต่ำ (Emerging / Developing)** เช่น แม่ฮ่องสอน, พะเยา, อุทัยธานี
  - **Q4: ศักยภาพพื้นฐาน - งบประมาณสูง (Targeted Support Area)** เช่น ปัตตานี, ยะลา, นราธิวาส, สุรินทร์
- **ขนาดจุด**: แปรผันตรงกับจำนวนประชากรของจังหวัด
- สวิตช์ควบคุม:
  - `⚡ ไม่รวม กรุงเทพฯ และ นนทบุรี`: ป้องกันการบิดเบือนจากที่ตั้งกระทรวงส่วนกลาง
  - `👤 ต่อหัวประชากร`: สลับเป็นตัวเลขต่อหัวประชากร
  - `📐 Logarithmic Scale`: ปรับสเกลให้อ่านจุดที่ซ้อนทับกันได้ชัดเจน
- ตัวชี้วัดสหสัมพันธ์: Pearson ($r$), Spearman ($r$), และ $p$-value พร้อมตารางจัดกลุ่มรายจังหวัด

### 4. 🗳️ พรรคการเมืองและเศรษฐกิจจังหวัด (Party × GPP)
- **กล่องข้อความเตือนทางวิชาการ (Methodological Notice)**: ป้องกันการตีความสหสัมพันธ์เป็นเหตุเป็นผล
- ตารางสรุปสถิติเชิงพรรณนาตามพรรคการเมือง: จำนวนจังหวัดที่ชนะ, งบรวม, มัธยฐานงบ, มัธยฐาน GPP
- Box Plot การกระจายตัวของ GPP และงบประมาณจำแนกตามพรรคการเมือง พร้อมระบบป้องกัน Sample Size ต่ำ
- Bubble Scatter Plot จำแนกสีตามพรรคการเมือง โดยขนาดจุดเท่ากับขนาดประชากร

---

## 📁 โครงสร้างโปรเจกต์ (Clean Project Architecture)

```text
project_BP_group8/
├── data/                               # ชุดข้อมูลจริงปี 2566
│   ├── provincial_budget.csv           # ข้อมูลงบประมาณ พ.ศ. 2566 (Delimiter: |)
│   ├── gdp.csv                         # ข้อมูล GPP, ประชากร, GPP ต่อหัว (ปี 2566)
│   └── partylist.csv                   # ข้อมูลผลการเลือกตั้งพรรคการเมืองรายจังหวัด
├── src/                                # โมดูลประมวลผลข้อมูล (Data Pipeline)
│   ├── __init__.py
│   ├── load_data.py                    # ตรวจจับ Delimiter และโหลดไฟล์ข้อมูล
│   ├── clean_data.py                   # ปรับมาตรฐานชื่อจังหวัด และจัด 6 ภูมิภาค
│   └── metrics.py                      # คำนวณ KPIs, สหสัมพันธ์, Quadrant, Party Profile
├── static/                             # หน้าเว็บ Frontend (Single-Page Application)
│   ├── index.html                      # โครงสร้างหน้าเว็บภาษาไทย Glassmorphism
│   ├── css/
│   │   └── style.css                   # สไตล์ชีท Deep Navy, Responsive Grid
│   ├── data/
│   │   └── thailand_provinces.geojson  # ข้อมูลพิกัดภูมิศาสตร์ 77 จังหวัด
│   └── js/
│       ├── state.js                    # ตัวจัดการ State ส่วนกลาง
│       ├── api.js                      # Fetch API เชื่อมต่อกับ Backend
│       ├── charts.js                   # ฟังก์ชันวาดกราฟ Plotly และ Linked Highlighting
│       └── app.js                      # ตัวควบคุม Event และ Routing ระหว่างหน้า
├── .gitignore                          # กำหนดการละเว้นไฟล์แคช/ไฟล์ขยะ
├── .python-version                     # ระบุ Python 3.12.7 สำหรับ Cloud Build
├── Dockerfile                          # คอนฟิก Container สำหรับรันบนคลาวด์
├── Procfile                            # คอนฟิก Web Process สำหรับ PaaS
├── render.yaml                         # Blueprint สำหรับ Deploy อัตโนมัติบน Render.com
├── requirements.txt                    # รายการไลบรารีเฉพาะที่จำเป็นสำหรับการรันเว็บ
├── main.py                             # จุดเชื่อมต่อหลัก FastAPI Backend
├── run.py                              # สคริปต์รันเซิร์ฟเวอร์ (รองรับทั้ง localhost และ IP ภายในวง LAN)
├── Project_Colab_group8.ipynb          # โน้ตบุ๊ก Google Colab สำหรับการวิเคราะห์เชิงลึกของทีม
└── README.md                           # เอกสารอธิบายโครงงานฉบับสมบูรณ์
```

---

## 🚀 วิธีการเริ่มใช้งานและการ Deploy (Running & Deployment)

### วิธีที่ 1: รันในเครื่องคอมพิวเตอร์ (Local / LAN)
```bash
# 1. ติดตั้งไลบรารี
pip install -r requirements.txt

# 2. เริ่มเซิร์ฟเวอร์
python run.py
```
* **เปิดจากคอมเครื่องนี้**: [http://localhost:8000](http://localhost:8000)
* **เปิดจากอุปกรณ์อื่นในวง Wi-Fi เดียวกัน**: `http://<IP-เครื่องนี้>:8000` *(ระบบจะแสดง IP ให้บนหน้าต่าง Terminal อัตโนมัติ)*

### วิธีที่ 2: รันผ่าน Docker Container
```bash
# Build Image
docker build -t budget-dashboard .

# Run Container
docker run -d -p 8000:8000 --name budget-dashboard budget-dashboard
```

### วิธีที่ 3: Deploy ออนไลน์ 24 ชั่วโมงบน Render.com (ฟรี เพื่อนเปิดได้ตลอดเวลา)
1. ส่งโค้ดขึ้น GitHub: `git push origin main`
2. เข้าสู่ระบบ [render.com](https://render.com) ด้วยบัญชี GitHub
3. เลือก **New +** ➔ **Web Service** ➔ เลือก Repository `project_BP_group8`
4. ตั้งค่า:
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. กดปุ่ม **Create Web Service** จะได้ลิงก์สาธารณะใช้งานได้ตลอด 24 ชั่วโมง เช่น `https://<ชื่อเว็บ>.onrender.com`
