// Таблицы режимов по ГОСТ 5264-80

export type JointType = 'butt' | 'corner' | 'lap'
export type ElectrodeGrade = 'АНО-21' | 'МР-3' | 'УОНИ 13/55'

export type ModeResult = {
  electrodeDiameter: number // мм
  currentMin: number        // А
  currentMax: number        // А
  passes: number
  note?: string
}

interface TableKey {
  thicknessMin: number
  thicknessMax: number
  joint: JointType
}

// Упрощённая таблица режимов РДС по ГОСТ 5264-80
const modeTable: Array<TableKey & ModeResult> = [
  { thicknessMin: 1, thicknessMax: 2,  joint: 'butt',   electrodeDiameter: 2, currentMin: 45,  currentMax: 75,  passes: 1 },
  { thicknessMin: 1, thicknessMax: 2,  joint: 'corner', electrodeDiameter: 2, currentMin: 40,  currentMax: 70,  passes: 1 },
  { thicknessMin: 1, thicknessMax: 2,  joint: 'lap',    electrodeDiameter: 2, currentMin: 45,  currentMax: 75,  passes: 1 },

  { thicknessMin: 3, thicknessMax: 4,  joint: 'butt',   electrodeDiameter: 3, currentMin: 90,  currentMax: 120, passes: 1 },
  { thicknessMin: 3, thicknessMax: 4,  joint: 'corner', electrodeDiameter: 3, currentMin: 80,  currentMax: 110, passes: 1 },
  { thicknessMin: 3, thicknessMax: 4,  joint: 'lap',    electrodeDiameter: 3, currentMin: 85,  currentMax: 115, passes: 1 },

  { thicknessMin: 5, thicknessMax: 6,  joint: 'butt',   electrodeDiameter: 4, currentMin: 130, currentMax: 160, passes: 1, note: 'Рекомендуется разделка кромок' },
  { thicknessMin: 5, thicknessMax: 6,  joint: 'corner', electrodeDiameter: 4, currentMin: 120, currentMax: 150, passes: 1 },
  { thicknessMin: 5, thicknessMax: 6,  joint: 'lap',    electrodeDiameter: 4, currentMin: 125, currentMax: 155, passes: 1 },

  { thicknessMin: 7, thicknessMax: 9,  joint: 'butt',   electrodeDiameter: 4, currentMin: 150, currentMax: 180, passes: 2, note: 'V-образная разделка 30–35°, зазор 2 мм' },
  { thicknessMin: 7, thicknessMax: 9,  joint: 'corner', electrodeDiameter: 4, currentMin: 140, currentMax: 170, passes: 2 },
  { thicknessMin: 7, thicknessMax: 9,  joint: 'lap',    electrodeDiameter: 4, currentMin: 145, currentMax: 175, passes: 2 },

  { thicknessMin: 10, thicknessMax: 12, joint: 'butt',   electrodeDiameter: 5, currentMin: 180, currentMax: 220, passes: 3, note: 'V-образная разделка, зазор 2–3 мм, 3 прохода' },
  { thicknessMin: 10, thicknessMax: 12, joint: 'corner', electrodeDiameter: 5, currentMin: 170, currentMax: 210, passes: 2 },
  { thicknessMin: 10, thicknessMax: 12, joint: 'lap',    electrodeDiameter: 5, currentMin: 175, currentMax: 215, passes: 2 },
]

export function calculateMode(
  thicknessMm: number,
  joint: JointType,
): ModeResult | null {
  const row = modeTable.find(
    (r) => thicknessMm >= r.thicknessMin && thicknessMm <= r.thicknessMax && r.joint === joint,
  )
  if (!row) return null
  return {
    electrodeDiameter: row.electrodeDiameter,
    currentMin: row.currentMin,
    currentMax: row.currentMax,
    passes: row.passes,
    note: row.note,
  }
}

export const jointLabels: Record<JointType, string> = {
  butt: 'Стыковое',
  corner: 'Угловое',
  lap: 'Нахлёсточное',
}
