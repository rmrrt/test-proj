# Heat Input & Hardness Calculators Specification

**Date**: 2026-04-13  
**Sprint**: dev-sprint-2  
**Status**: In Implementation  

---

## Overview

Two complementary tools for predicting and understanding thermal effects on welds:
1. **Heat Input Calculator** — calculates thermal energy input during welding
2. **Hardness Predictor** — predicts hardness in HAZ (heat-affected zone) based on CE and cooling rate

Both use simplified engineering formulas suitable for field use and training.

---

## 1. Heat Input Calculator

### Purpose
Welders need to understand that thermal input affects:
- Risk of cracking (too hot → coarse grain in HAZ)
- Deformation (too hot = more warping)
- Cooling rate (thin sections cool fast, thick cool slow)

### Input Parameters
- **Voltage (U)**: 18–40 V (typical inverter range)
- **Current (I)**: 50–350 A
- **Travel Speed (v)**: 0.1–1.0 m/min (linear travel speed)
- **Arc Efficiency (η)**: 0.7–0.9 depending on process
  - MMA (covered electrode): ~0.75
  - MIG/MAG: ~0.85
  - TIG: ~0.65

### Formula
```
Q = (U × I × η) / v  [MJ/mm]
```

Where:
- Q = heat input in MJ/mm
- U = voltage (V)
- I = current (A)
- η = arc efficiency (dimensionless)
- v = travel speed (m/min) → convert to mm/min = v × 1000

Simplified:
```
Q = (U × I × η × 60) / (v × 1000)  [MJ/mm]
```

### Output Interpretation
| Q (MJ/mm) | Risk | Action |
|---|---|---|
| < 1.0 | Too fast, risk of lack of fusion | Slow down, check penetration |
| 1.0–2.5 | Optimal for thin sheets (< 5mm) | Standard for structures |
| 2.5–4.0 | Optimal for medium (5–15mm) | Typical production range |
| 4.0–6.0 | Optimal for thick (> 15mm) | Slow pass, high HAZ risk |
| > 6.0 | Risk of grain coarsening, cracking | Reduce current or speed up |

### UI Elements
- Sliders for U, I, v with realistic ranges
- Dropdown for process (MMA, MIG, TIG) → auto-set η
- Real-time Q calculation and color-coded status
- Warning if Q > 5.0 (HAZ risk)
- Practical note: "Higher Q = more thermal stress on thin sheets"

---

## 2. Hardness Predictor Calculator

### Purpose
Predicts maximum hardness in HAZ. Critical for:
- Identifying risk of cold cracking (HV > 350 often → brittle)
- Deciding preheating strategy
- Assessing post-weld heat treatment need

### Input Parameters
1. **Carbon Equivalent (CE)**: 0.3–1.2
   - Formula: CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
   - Pre-calculated by CarbonEquivalentCalculator or manual entry
2. **Cooling Time t8/5**: 5–100 seconds
   - Time to cool from 800°C to 500°C
   - Function of:
     - Heat input Q (MJ/mm)
     - Plate thickness (t)
     - Preheat temperature (Tp)
3. **Preheat Temperature (Tp)**: 0–300°C
   - Only relevant for steels with CE > 0.4

### Simplified Predictive Formula
Based on Graville and IIW diagrams, simplified version:

```
HV_max ≈ 980 × CE + 70 × log(t8/5) + 360
```

Where:
- HV_max = estimated peak hardness in HAZ
- CE = carbon equivalent
- t8/5 = cooling time 800–500°C (seconds)
- log() = natural logarithm

Adjustments:
- If Tp > 200°C: subtract 0.5 × (Tp - 200) from HV_max
- If HV_max > 450: "COLD CRACK RISK" warning

### Cooling Time (t8/5) Estimation
From heat input and thickness:

```
t8/5 ≈ (2000 × Q × t) / (Tp + 20)^2  [seconds]
```

Where:
- Q = heat input (MJ/mm)
- t = plate thickness (mm)
- Tp = preheat (°C)

Or: provide manual t8/5 entry (measured from cooling curves)

### Output Interpretation
| HV Range | Status | Action |
|---|---|---|
| < 250 | Safe | Standard cooling acceptable |
| 250–350 | Caution | Monitor with UT or hardness testing |
| 350–450 | High Risk | Preheat Tp > 150°C, slow cooling |
| > 450 | Critical | Preheat + PWHT mandatory, stress relief |

### UI Elements
- CE field (manual or linked to CarbonEquivalentCalculator)
- Sliders for thickness (1–100 mm), preheat (0–300°C)
- Toggle: "Use measured t8/5" (manual entry) or "Calculate from Q & thickness"
- Real-time HV_max display with color coding (green ✓ → red ⚠️)
- Hardness scale visualization (0–500 HV)
- Practical note: "HV > 350 in cold conditions (< 0°C ambient) → embrittlement risk"

---

## 3. Integration Points

### With Existing Tools
- **CarbonEquivalentCalculator**: Hardness Predictor can import CE directly
- **ModeCalculator**: Can pass U, I, v → HeatInputCalculator auto-populates
- **ToolsView**: Both tools appear in the Tools tab alongside existing calculators

### With Content
- **module-3 lesson-3-4**: "Сварочные напряжения и трещины" → link to HeatInputCalculator
- **module-3 lesson-3-5**: "Контроль твёрдости в ЗТВ" → link to HardnessPredictorCalculator

---

## 4. Technical Architecture

### Component Structure
```
src/components/tools/
├── HeatInputCalculator.vue
├── HardnessPredictorCalculator.vue
└── (existing tools...)

src/services/
├── weldingCalculations.ts  # Shared formulas
└── (existing services...)

src/types/
└── calculator.ts  # Types for calculator inputs/outputs
```

### Shared Utilities (weldingCalculations.ts)
```typescript
export function calculateHeatInput(
  voltage: number,
  current: number,
  efficiency: number,
  travelSpeed: number  // m/min
): number  // MJ/mm

export function estimateCoolingTime(
  heatInput: number,
  thickness: number,
  preheat: number
): number  // t8/5 in seconds

export function predictHAZHardness(
  carbonEquivalent: number,
  coolingTime: number,
  preheatTemp: number
): number  // HV hardness
```

---

## 5. Testing & Validation

### Unit Tests
- Heat input calculation against known values (ASME, AWS standards)
- Hardness prediction against published Graville data
- Boundary conditions (extreme CE, t8/5, preheat)

### Manual Testing
- Field-realistic scenarios (structural steel, 10mm plate)
- Edge cases (thin sheet, high strength steel)
- Visual validation of color codes and warnings

---

## 6. Known Limitations

1. **Simplified formulas**: Real hardness varies with microstructure, cooling environment (still air vs. water cooled fixture). Formulae are ~±10%.
2. **No consideration of**: restraint conditions, residual stress, multi-pass effects
3. **CE calculation**: User must know alloy composition or use CarbonEquivalentCalculator
4. **t8/5 estimation**: Simplified; users should measure if possible

---

## 7. Practical Notes (for UI)

- "Heat input ≥ 4 MJ/mm on thin sheets → verify cooling, risk of distortion"
- "HV > 380 in HAZ → cold cracks possible in sub-zero. Preheat mandatory."
- "Preheat works by slowing cooling. Higher Tp → longer t8/5 → lower peak HV"
- "Both tools assume single-pass or similar passes. Multi-pass work changes t8/5."

