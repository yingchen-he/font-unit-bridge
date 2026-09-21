# FontUnit Bridge: Unifying the Language of Font Size

**FontUnit Bridge** is an interactive web-based conversion tool designed to bridge the gap between typography, digital design, physical dimensions, and visual science. Developed by the Translational Vision Research Lab (Dr. Yingchen He, NC State University), it allows researchers, designers, clinicians, and educators to seamlessly convert font sizes across physical length, screen design, and visual angle/acuity units.

---

## 🌟 Key Features

* **Multi-Unit Synchronization**: Select any combination of physical, design, or visual angle units and see real-time updates across all visible input fields as you type.
* **Cross-Domain Conversion**: Bridge the gap between screen pixels (px), print points (pt), physical lengths (mm, in), and visual angle measurements (deg, min).
* **Viewing Distance & PPI Presets**: Adjust viewing distance ($D$) and pixels per inch ($PPI$), or use built-in estimates for common viewing scenarios (handheld mobile, desktop, signage).
* **Visual Acuity Integration**: Directly convert optotype/letter sizes to vision science metrics like LogMAR, Snellen fractions (e.g., 20/20), and Decimal Acuity.



## 📐 Supported Units

| Category | Units | Description / Basis |
| --- | --- | --- |
| **Traditional Length** | Millimeters (mm), Centimeters (cm), Meters (m), Inches (in), Feet (ft) | Physical dimensions ($1\text{ in} = 25.4\text{ mm}$). |
| **Design & Display** | PostScript Points (pt), Picas (pc), Screen Pixels (px) | Digital & print typography ($1\text{ pt} = 1/72\text{ in}$). Converts to physical units via $PPI$. |
| **Visual Angle** | Degrees (deg), Minutes (min), Seconds (sec) | Angular size subtended at the eye. Requires Viewing Distance ($D$). |
| **Visual Acuity** | Snellen (20/X), LogMAR, Decimal Acuity | Clinical vision metrics. 20/20 Snellen corresponds to 1 min MAR ($0.0\text{ LogMAR}$, $1.0\text{ Decimal}$). |



## 🎯 Example Use Cases

* **Academic Literature Reviews**: Standardize disparate font size units reported across ergonomics, psychology, and vision science studies into a unified visual angle or physical metric.
* **Multi-Device & Environmental Graphic Design**: Calculate necessary font sizes across desktop monitors, mobile screens, and printed signage to ensure consistent visual angle and legibility at target viewing distances.
* **Clinical & Assistive Technology Research**: Translate visual acuity requirements (e.g., 20/40 Snellen or 0.3 LogMAR) directly into target pt, px, or mm font sizes for visual impairment aids.

---

## 📬 Contact & Lab Information

* **Live Web App**: [FontUnit Bridge Application](https://yingchen-he.github.io/font-unit-bridge/?utm_source=gemini)
* **Lab**: [Translational Vision Research Lab](https://heylab.wordpress.ncsu.edu/), Department of Psychology, North Carolina State University
* **Principal Investigator**: Dr. Yingchen He ([yingchen_he@ncsu.edu](mailto:yingchen_he@ncsu.edu))

## 📄 License
This project is open-source under the GNU General Public License v3 (GPLv3). Anyone who uses this code in their software to make their entire project 100% open-source under GPLv3.
