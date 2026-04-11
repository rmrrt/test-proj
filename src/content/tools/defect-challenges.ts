import type { DefectChallenge } from '@/types/content'

export const defectChallenges: DefectChallenge[] = [
  {
    id: 'defect-1',
    title: 'Найди дефекты шва',
    svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Металл -->
      <rect x="0" y="100" width="400" height="100" fill="#4a4a4a"/>
      <!-- Шов -->
      <path d="M 20 100 Q 80 88 120 100 Q 160 112 200 100 Q 240 88 280 96 Q 320 104 360 100 Q 380 98 390 100" stroke="#8a6a3a" stroke-width="18" fill="none" stroke-linecap="round"/>
      <!-- Поры -->
      <circle cx="155" cy="97" r="5" fill="#2a2a2a" stroke="#666" stroke-width="1"/>
      <circle cx="162" cy="103" r="3.5" fill="#2a2a2a" stroke="#666" stroke-width="1"/>
      <!-- Подрез -->
      <path d="M 270 100 L 295 93" stroke="#333" stroke-width="3"/>
      <!-- Кратер (не заваренный конец) -->
      <circle cx="370" cy="100" r="7" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/>
      <!-- Подписи зон (невидимые — только для разработки) -->
    </svg>`,
    zones: [
      {
        id: 'pores',
        label: 'Поры',
        description: 'Поры — круглые полости в шве. Причина: влажные электроды, ржавчина на металле, длинная дуга. По ГОСТ 30242-97: недопустимы в несущих конструкциях.',
        x: 135,
        y: 85,
        width: 50,
        height: 35,
      },
      {
        id: 'undercut',
        label: 'Подрез',
        description: 'Подрез — канавка вдоль границы шва. Причина: слишком большой ток или длинная дуга. Ослабляет сечение металла — критический дефект по ГОСТ 30242-97.',
        x: 258,
        y: 85,
        width: 50,
        height: 30,
      },
      {
        id: 'crater',
        label: 'Кратер',
        description: 'Кратер — углубление в конце шва. Причина: резкий обрыв дуги без заполнения. Требуется заварить возвратным движением или функцией Crater Fill на инверторе.',
        x: 350,
        y: 85,
        width: 45,
        height: 35,
      },
    ],
  },
  {
    id: 'defect-2',
    title: 'Дефекты стыкового шва',
    svgContent: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Металл -->
      <rect x="0" y="90" width="185" height="110" fill="#4a4a4a"/>
      <rect x="215" y="90" width="185" height="110" fill="#4a4a4a"/>
      <!-- Зазор -->
      <rect x="185" y="90" width="30" height="110" fill="#2a2a2a"/>
      <!-- Шов с дефектами -->
      <path d="M 20 90 L 370 90" stroke="#8a6a3a" stroke-width="20" fill="none"/>
      <!-- Непровар (нет провара в корне) -->
      <rect x="170" y="100" width="60" height="8" fill="#1a1a1a"/>
      <!-- Наплыв -->
      <ellipse cx="100" cy="88" rx="25" ry="10" fill="#9a7a4a"/>
      <!-- Трещина -->
      <path d="M 290 82 L 305 98 L 315 90" stroke="#111" stroke-width="2" fill="none"/>
    </svg>`,
    zones: [
      {
        id: 'lack-of-fusion',
        label: 'Непровар',
        description: 'Непровар — отсутствие сплавления в корне шва или между слоями. Причина: малый ток, большая скорость, неверная разделка. Критический дефект — резко снижает прочность.',
        x: 155,
        y: 92,
        width: 90,
        height: 25,
      },
      {
        id: 'overlap',
        label: 'Наплыв',
        description: 'Наплыв — натёкший металл без сплавления с основным. Причина: малый ток, слишком медленное движение. Дефект по ГОСТ 30242-97 — ухудшает внешний вид и может скрывать трещины.',
        x: 65,
        y: 72,
        width: 70,
        height: 25,
      },
      {
        id: 'crack',
        label: 'Трещина',
        description: 'Трещина — разрыв металла шва или зоны термического влияния. Самый опасный дефект. Причины: быстрое охлаждение, неверный режим, загрязнение. Ремонт: вырубить и переварить.',
        x: 278,
        y: 75,
        width: 50,
        height: 35,
      },
    ],
  },
]
