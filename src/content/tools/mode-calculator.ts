// Таблицы режимов по ГОСТ 5264-80 / ГОСТ 14771-76

export type JointType = 'butt' | 'corner' | 'lap'
export type MetalType = 'carbon' | 'low_alloy' | 'stainless' | 'aluminum'
export type WeldPosition = 'flat' | 'horizontal' | 'vertical' | 'overhead'
export type CoatingType = 'rutile' | 'basic'

export type ModeResult = {
  electrodeDiameter: number
  currentMin: number
  currentMax: number
  passes: number
  polarity: string
  weldSpeedMin: number  // мм/мин
  weldSpeedMax: number  // мм/мин
  preheat: string
  electrodeGrade: string
  note?: string
}

interface BaseRow {
  thicknessMin: number
  thicknessMax: number
  joint: JointType
  electrodeDiameter: number
  currentMin: number
  currentMax: number
  passes: number
  note?: string
}

// Базовая таблица режимов РДС по ГОСТ 5264-80 (углеродистая сталь, нижнее положение, рутиловое)
const baseTable: BaseRow[] = [
  { thicknessMin: 1,  thicknessMax: 2,  joint: 'butt',   electrodeDiameter: 2, currentMin: 45,  currentMax: 75,  passes: 1 },
  { thicknessMin: 1,  thicknessMax: 2,  joint: 'corner', electrodeDiameter: 2, currentMin: 40,  currentMax: 70,  passes: 1 },
  { thicknessMin: 1,  thicknessMax: 2,  joint: 'lap',    electrodeDiameter: 2, currentMin: 45,  currentMax: 75,  passes: 1 },

  { thicknessMin: 3,  thicknessMax: 4,  joint: 'butt',   electrodeDiameter: 3, currentMin: 90,  currentMax: 120, passes: 1 },
  { thicknessMin: 3,  thicknessMax: 4,  joint: 'corner', electrodeDiameter: 3, currentMin: 80,  currentMax: 110, passes: 1 },
  { thicknessMin: 3,  thicknessMax: 4,  joint: 'lap',    electrodeDiameter: 3, currentMin: 85,  currentMax: 115, passes: 1 },

  { thicknessMin: 5,  thicknessMax: 6,  joint: 'butt',   electrodeDiameter: 4, currentMin: 130, currentMax: 160, passes: 1, note: 'Рекомендуется разделка кромок' },
  { thicknessMin: 5,  thicknessMax: 6,  joint: 'corner', electrodeDiameter: 4, currentMin: 120, currentMax: 150, passes: 1 },
  { thicknessMin: 5,  thicknessMax: 6,  joint: 'lap',    electrodeDiameter: 4, currentMin: 125, currentMax: 155, passes: 1 },

  { thicknessMin: 7,  thicknessMax: 9,  joint: 'butt',   electrodeDiameter: 4, currentMin: 150, currentMax: 180, passes: 2, note: 'V-образная разделка 30–35°, зазор 2 мм' },
  { thicknessMin: 7,  thicknessMax: 9,  joint: 'corner', electrodeDiameter: 4, currentMin: 140, currentMax: 170, passes: 2 },
  { thicknessMin: 7,  thicknessMax: 9,  joint: 'lap',    electrodeDiameter: 4, currentMin: 145, currentMax: 175, passes: 2 },

  { thicknessMin: 10, thicknessMax: 12, joint: 'butt',   electrodeDiameter: 5, currentMin: 180, currentMax: 220, passes: 3, note: 'V-образная разделка, зазор 2–3 мм' },
  { thicknessMin: 10, thicknessMax: 12, joint: 'corner', electrodeDiameter: 5, currentMin: 170, currentMax: 210, passes: 2 },
  { thicknessMin: 10, thicknessMax: 12, joint: 'lap',    electrodeDiameter: 5, currentMin: 175, currentMax: 215, passes: 2 },
]

// Коэффициенты тока
const metalMultiplier: Record<MetalType, number> = {
  carbon:    1.0,
  low_alloy: 1.0,
  stainless: 0.85,
  aluminum:  1.2,
}

const positionMultiplier: Record<WeldPosition, number> = {
  flat:       1.0,
  horizontal: 0.9,
  vertical:   0.88,
  overhead:   0.82,
}

const coatingMultiplier: Record<CoatingType, number> = {
  rutile: 1.0,
  basic:  1.1,
}

// Диаметры электродов в порядке возрастания
const electrodeDiameters = [2, 3, 4, 5]

function roundTo5(n: number): number {
  return Math.round(n / 5) * 5
}

function calcPolarity(metal: MetalType, coating: CoatingType): string {
  if (metal === 'stainless') return 'DCEP (обратная, +)'
  if (metal === 'aluminum') return 'AC (переменный ток)'
  if (coating === 'basic') return 'DCEN (прямая, −)'
  return 'DC+ / AC'
}

function calcPreheat(metal: MetalType, thickness: number): string {
  if (metal === 'low_alloy' && thickness > 6)  return 'Подогрев 100–150°C (ГОСТ 14771-76)'
  if (metal === 'stainless')                   return 'Подогрев не требуется, контролируй межпроходную температуру < 150°C'
  if (metal === 'carbon' && thickness > 10)    return 'Подогрев 50–100°C рекомендован'
  if (metal === 'aluminum' && thickness > 4)   return 'Подогрев 100–200°C'
  return 'Не требуется'
}

function calcElectrodeGrade(metal: MetalType, coating: CoatingType): string {
  if (metal === 'carbon'    && coating === 'rutile') return 'МР-3, АНО-21'
  if (metal === 'carbon'    && coating === 'basic')  return 'УОНИ-13/55, LB-52U'
  if (metal === 'low_alloy' && coating === 'basic')  return 'УОНИ-13/65, ОК 53.70'
  if (metal === 'low_alloy' && coating === 'rutile') return 'МР-3С, АНО-21'
  if (metal === 'stainless')                         return 'ОЗЛ-8, ЦЛ-11'
  if (metal === 'aluminum')                          return 'ОЗА-1, ОЗА-2'
  return '—'
}

export function calculateMode(
  thicknessMm: number,
  joint: JointType,
  metal: MetalType,
  position: WeldPosition,
  coating: CoatingType,
): ModeResult | null {
  const base = baseTable.find(
    r => thicknessMm >= r.thicknessMin && thicknessMm <= r.thicknessMax && r.joint === joint,
  )
  if (!base) return null

  const k = metalMultiplier[metal] * positionMultiplier[position] * coatingMultiplier[coating]

  let diameter = base.electrodeDiameter
  if (metal === 'aluminum') {
    const idx = electrodeDiameters.indexOf(diameter)
    if (idx !== -1 && idx < electrodeDiameters.length - 1) {
      diameter = electrodeDiameters[idx + 1]!
    }
  }

  const currentMin = roundTo5(base.currentMin * k)
  const currentMax = roundTo5(base.currentMax * k)

  // v = (0.8 × I) / (d²) × 10, мм/мин, диапазон ±20%
  const avgCurrent = (currentMin + currentMax) / 2
  const speedBase = (0.8 * avgCurrent) / (diameter * diameter) * 10
  const weldSpeedMin = Math.round(speedBase * 0.8)
  const weldSpeedMax = Math.round(speedBase * 1.2)

  return {
    electrodeDiameter: diameter,
    currentMin,
    currentMax,
    passes: base.passes,
    polarity: calcPolarity(metal, coating),
    weldSpeedMin,
    weldSpeedMax,
    preheat: calcPreheat(metal, thicknessMm),
    electrodeGrade: calcElectrodeGrade(metal, coating),
    note: base.note,
  }
}

export const jointLabels: Record<JointType, string> = {
  butt: 'Стыковое',
  corner: 'Угловое',
  lap: 'Нахлёсточное',
}
