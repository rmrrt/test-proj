<script setup lang="ts">
const categories = [
  {
    title: 'Сварочный инвертор',
    icon: '⚡',
    description: 'Основа сварочного поста. Для старта достаточно 160А.',
    params: [
      { label: 'Ток', value: 'от 160А' },
      { label: 'ПВ%', value: '≥40% при макс. токе' },
      { label: 'Вес', value: '3–5 кг' },
    ],
    tiers: [
      { name: 'Бюджет', price: '4 000–8 000 ₽', example: 'РЕСАНТА САИ-160, PATRIOT DC 180C' },
      { name: 'Норм', price: '8 000–18 000 ₽', example: 'FUBAG IN 160, ESAB Buddy 160' },
      { name: 'Профи', price: '18 000+ ₽', example: 'Kemppi Minarc, Lincoln Electric' },
    ],
    links: [
      { label: 'Ozon', url: 'https://www.ozon.ru/category/svarochnye-invertory/' },
      { label: 'Wildberries', url: 'https://www.wildberries.ru/catalog/elektronika/svarochnoe-oborudovanie' },
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/svarka/apparaty/' },
    ],
  },
  {
    title: 'Сварочная маска',
    icon: '😷',
    description: '"Хамелеон" с автозатемнением — обязателен для начинающих.',
    params: [
      { label: 'Затемнение', value: 'DIN 9–13 (авто)' },
      { label: 'Скорость', value: '≤1/25000 сек' },
      { label: 'Питание', value: 'солнечная + батарея' },
    ],
    tiers: [
      { name: 'Бюджет', price: '1 500–3 000 ₽', example: 'РЕСАНТА МСА-90, Fubag ULTIMA 5' },
      { name: 'Норм', price: '3 000–7 000 ₽', example: 'ESAB Savage A40, Optrel Vegaview' },
      { name: 'Профи', price: '7 000+ ₽', example: '3M Speedglas, Lincoln Viking' },
    ],
    links: [
      { label: 'Ozon', url: 'https://www.ozon.ru/category/svarochnye-maski/' },
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/svarka/maski/' },
    ],
  },
  {
    title: 'Электроды',
    icon: '🔩',
    description: 'Для начала: АНО-21 Ø3 мм — легко поджигаются, прощают ошибки.',
    brands: [
      { mark: 'МР-3', type: 'рутиловое', note: 'Универсальный старт, лёгкий розжиг, AC/DC, углеродистая сталь' },
      { mark: 'АНО-21', type: 'рутиловое', note: 'Для начинающих, очень лёгкий розжиг, AC/DC' },
      { mark: 'УОНИ-13/55', type: 'основное', note: 'Ответственные швы, только DC, прочность выше, капризен к розжигу' },
      { mark: 'ОЗЛ-8', type: 'нержавейка', note: 'Нержавеющая сталь, DC обратная полярность' },
      { mark: 'ОЗА-1/ОЗА-2', type: 'алюминий', note: 'Алюминий и его сплавы' },
    ],
    params: [
      { label: 'Диаметр', value: '3 мм (для старта)' },
      { label: 'Марка', value: 'АНО-21 или МР-3' },
      { label: 'Ток', value: 'AC/DC' },
    ],
    tiers: [
      { name: 'Старт', price: '200–400 ₽/кг', example: 'АНО-21 Ø3 мм, МР-3 Ø3 мм' },
      { name: 'Качество', price: '400–700 ₽/кг', example: 'УОНИ 13/55 Ø3 мм' },
      { name: 'Спецсплавы', price: '700+ ₽/кг', example: 'ОК-63, ЦЛ-11 (нержавейка)' },
    ],
    links: [
      { label: 'Ozon', url: 'https://www.ozon.ru/category/elektrody-svarochnye/' },
      { label: 'Wildberries', url: 'https://www.wildberries.ru/catalog/instrumenty/svarochnye-materily' },
    ],
  },
  {
    title: 'Защитная одежда',
    icon: '🧤',
    description: 'Только натуральные материалы — кожа, брезент, спилок.',
    params: [
      { label: 'Перчатки', value: 'Краги спилковые' },
      { label: 'Куртка', value: 'Хлопок или спилок' },
      { label: 'Обувь', value: 'Кожа, закрытая' },
    ],
    tiers: [
      { name: 'Минимум', price: '500–1 500 ₽', example: 'Краги брезентовые + хлопковая роба' },
      { name: 'Норм', price: '1 500–4 000 ₽', example: 'Краги спилковые + сварочная куртка' },
      { name: 'Профи', price: '4 000+ ₽', example: 'Полный комплект Weldas, Portwest' },
    ],
    links: [
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/svarka/spetsodezhda/' },
      { label: 'Ozon', url: 'https://www.ozon.ru/category/svarochnaya-odezhda/' },
    ],
  },
  {
    title: 'Инструмент подготовки кромок',
    icon: '⚙️',
    description: 'Инструмент для снятия фасок, зачистки и формирования кромок перед сваркой.',
    params: [
      { label: 'Назначение', value: 'Снятие фасок, зачистка' },
      { label: 'Точность', value: '±1–2°' },
      { label: 'Производительность', value: 'Ручная / Эл.' },
    ],
    tiers: [
      { name: 'Бюджет', price: '1 000–3 000 ₽', example: 'УШМ 125мм + зачистной диск, напильник по металлу, зубило' },
      { name: 'Средний', price: '3 000–8 000 ₽', example: 'Фаскосниматель ручной (30/45°), набор напильников, абразивные диски' },
      { name: 'Профи', price: '8 000–25 000 ₽', example: 'Электрический фаскосниматель, торцефрезерный станок, пневмозачистная машина' },
    ],
    links: [
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/instrument/shlifmashiny/uglovye/' },
      { label: 'Ozon', url: 'https://www.ozon.ru/category/uglovye-shlifovalnye-mashiny/' },
    ],
  },
  {
    title: 'Вспомогательный инструмент',
    icon: '🔧',
    description: 'Инструмент для сборки, фиксации и разметки деталей перед и во время сварки.',
    params: [
      { label: 'Тип фиксации', value: 'Магнит / Зажим' },
      { label: 'Материал', value: 'Сталь / Чугун' },
      { label: 'Диапазон', value: 'До 200 мм' },
    ],
    tiers: [
      { name: 'Бюджет', price: '500–2 000 ₽', example: 'Магнитный угольник 45/90°, 2–3 G-образные струбцины, молоток-шлакоотбойник, металлическая щётка' },
      { name: 'Средний', price: '2 000–5 000 ₽', example: 'Набор магнитных угольников (несколько углов), быстрозажимные струбцины, кернер, угольник слесарный' },
      { name: 'Профи', price: '5 000–15 000 ₽', example: 'Сборочно-сварочный стол или приспособления, комплект фиксаторов, центратор для труб' },
    ],
    links: [
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/instrument/strubtsiny/' },
      { label: 'Ozon', url: 'https://www.ozon.ru/category/strubtsiny/' },
    ],
  },
  {
    title: 'Средства контроля шва',
    icon: '📐',
    description: 'Инструменты для проверки геометрии шва, зазоров и углов соединений.',
    params: [
      { label: 'Метод контроля', value: 'Визуальный / УЗК' },
      { label: 'Точность', value: '0.1–1 мм' },
      { label: 'Соответствие', value: 'ГОСТ' },
    ],
    tiers: [
      { name: 'Бюджет', price: '500–1 500 ₽', example: 'Шаблон сварщика УШС-3 (катет, высота усиления, зазор), металлическая линейка, угломер' },
      { name: 'Средний', price: '1 500–4 000 ₽', example: 'Набор щупов для зазоров, штангенциркуль, угломер цифровой' },
      { name: 'Профи', price: '4 000–15 000 ₽', example: 'Профилометр шва, ультразвуковой толщиномер, эндоскоп для внутреннего контроля' },
    ],
    links: [
      { label: 'ВсеИнструменты', url: 'https://www.vseinstrumenti.ru/izmeritelnye-instrumenty/' },
      { label: 'Ozon', url: 'https://www.ozon.ru/category/shablony-svarshhika/' },
    ],
  },
]
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="gost-tag">РОССИЙСКИЙ РЫНОК</div>
      <h2>Снаряжение</h2>
      <p class="subtitle">Что покупать, на что смотреть, где брать</p>
    </div>

    <div class="starter-kit card">
      <h3>🎒 Минимальный стартовый комплект</h3>
      <div class="kit-items">
        <div class="kit-item">⚡ Инвертор 160А</div>
        <div class="kit-item">😷 Маска-хамелеон</div>
        <div class="kit-item">🔩 Электроды АНО-21 Ø3</div>
        <div class="kit-item">🧤 Краги спилковые</div>
        <div class="kit-item">🔥 Огнетушитель</div>
      </div>
      <p class="kit-total">Итого от <strong>~7 000–12 000 ₽</strong></p>
    </div>

    <div class="categories">
      <div v-for="cat in categories" :key="cat.title" class="category card">
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <div>
            <h3>{{ cat.title }}</h3>
            <p class="cat-desc">{{ cat.description }}</p>
          </div>
        </div>

        <div v-if="cat.brands" class="brands">
          <div class="brands-header">
            <span class="brands-col brands-col-mark">Марка</span>
            <span class="brands-col brands-col-type">Тип</span>
            <span class="brands-col brands-col-note">Применение</span>
          </div>
          <div v-for="b in cat.brands" :key="b.mark" class="brands-row">
            <span class="brands-col brands-col-mark brand-mark">{{ b.mark }}</span>
            <span class="brands-col brands-col-type brand-type">{{ b.type }}</span>
            <span class="brands-col brands-col-note">{{ b.note }}</span>
          </div>
        </div>

        <div class="params">
          <div v-for="p in cat.params" :key="p.label" class="param">
            <span class="param-label">{{ p.label }}</span>
            <span class="param-value">{{ p.value }}</span>
          </div>
        </div>

        <div class="tiers">
          <div v-for="tier in cat.tiers" :key="tier.name" class="tier">
            <div class="tier-header">
              <span class="tier-name">{{ tier.name }}</span>
              <span class="tier-price">{{ tier.price }}</span>
            </div>
            <p class="tier-example">{{ tier.example }}</p>
          </div>
        </div>

        <div class="links">
          <a v-for="link in cat.links" :key="link.label" :href="link.url" target="_blank" class="link-btn">
            {{ link.label }} →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }
.subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }

.starter-kit {
  margin-bottom: 16px;
}

.starter-kit h3 { margin-bottom: 12px; }

.kit-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.kit-item {
  background: rgba(233,69,96,0.08);
  border: 1px solid rgba(233,69,96,0.2);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
}

.kit-total {
  font-size: 13px;
  color: var(--text-secondary);
}

.kit-total strong { color: var(--accent); }

.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category { display: flex; flex-direction: column; gap: 12px; }

.cat-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.cat-icon { font-size: 28px; flex-shrink: 0; }
.cat-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.params {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.param {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  padding: 8px;
}

.param-label { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.param-value { font-size: 12px; font-weight: 600; }

.tiers {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tier {
  padding: 8px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
}

.tier-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.tier-name { font-size: 12px; font-weight: 700; color: var(--accent); }
.tier-price { font-size: 12px; color: var(--text-primary); font-weight: 600; }
.tier-example { font-size: 12px; color: var(--text-secondary); }

.links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.link-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-link);
  text-decoration: none;
  background: rgba(88,166,255,0.08);
  border: 1px solid rgba(88,166,255,0.2);
  border-radius: 6px;
  padding: 4px 10px;
}

.link-btn:hover { background: rgba(88,166,255,0.15); }

.brands {
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  overflow: hidden;
}

.brands-header {
  display: flex;
  background: rgba(255,255,255,0.06);
  padding: 4px 8px;
  gap: 8px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.brands-row {
  display: flex;
  padding: 5px 8px;
  gap: 8px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.brands-col { overflow: hidden; }
.brands-col-mark { flex: 0 0 90px; }
.brands-col-type { flex: 0 0 80px; color: var(--text-secondary); }
.brands-col-note { flex: 1; color: var(--text-secondary); }

.brand-mark { font-weight: 700; color: var(--text-primary); }
.brand-type { font-style: italic; }
</style>
