<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

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
]

const kitItems = [
  { icon: '⚡', label: 'Инвертор 160А' },
  { icon: '😷', label: 'Маска-хамелеон' },
  { icon: '🔩', label: 'Электроды АНО-21 Ø3' },
  { icon: '🧤', label: 'Краги спилковые' },
  { icon: '🔥', label: 'Огнетушитель' },
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div class="gost-tag">Российский рынок</div>
      <h2>Снаряжение</h2>
      <p class="subtitle">Что покупать, на что смотреть, где брать</p>
    </div>

    <!-- Starter kit -->
    <div class="starter-kit card animate-fade-in-up">
      <div class="kit-title">
        <span class="kit-emoji">🎒</span>
        <h3>Минимальный стартовый комплект</h3>
      </div>
      <div class="kit-items">
        <div v-for="item in kitItems" :key="item.label" class="kit-item">
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </div>
      </div>
      <p class="kit-total">Итого от <strong>~7 000–12 000 ₽</strong></p>
    </div>

    <!-- Categories -->
    <div class="categories">
      <div
        v-for="(cat, idx) in categories"
        :key="cat.title"
        class="category card animate-fade-in-up"
        :style="{ animationDelay: `${(idx + 1) * 60}ms` }"
      >
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <div>
            <h3>{{ cat.title }}</h3>
            <p class="cat-desc">{{ cat.description }}</p>
          </div>
        </div>

        <!-- Params grid -->
        <div class="params">
          <div v-for="p in cat.params" :key="p.label" class="param">
            <span class="param-label">{{ p.label }}</span>
            <span class="param-value">{{ p.value }}</span>
          </div>
        </div>

        <!-- Tiers -->
        <div class="tiers">
          <div v-for="tier in cat.tiers" :key="tier.name" class="tier">
            <div class="tier-header">
              <span class="tier-name">{{ tier.name }}</span>
              <span class="tier-price">{{ tier.price }}</span>
            </div>
            <p class="tier-example">{{ tier.example }}</p>
          </div>
        </div>

        <!-- Links -->
        <div class="links">
          <a
            v-for="link in cat.links"
            :key="link.label"
            :href="link.url"
            target="_blank"
            class="link-btn"
          >
            {{ link.label }}
            <ExternalLink :size="11" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtitle { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }

/* Starter kit */
.starter-kit { margin-bottom: 16px; }

.kit-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.kit-emoji { font-size: 20px; }

.kit-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.kit-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-light);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  font-size: 13px;
}

.kit-total {
  font-size: 13px;
  color: var(--text-secondary);
}
.kit-total strong { color: var(--accent); font-weight: 700; }

/* Categories */
.categories { display: flex; flex-direction: column; gap: 12px; }

.category { display: flex; flex-direction: column; gap: 12px; }

.cat-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.cat-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }
.cat-desc { font-size: 12px; color: var(--text-secondary); margin-top: 3px; line-height: 1.4; }

/* Params */
.params {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.param {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  padding: 8px;
}

.param-label {
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 600;
}

.param-value { font-size: 12px; font-weight: 700; color: var(--text-primary); }

/* Tiers */
.tiers { display: flex; flex-direction: column; gap: 6px; }

.tier {
  padding: 9px 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  border-left: 3px solid transparent;
  transition: border-color 0.15s;
}

.tier:first-child { border-left-color: var(--text-muted); }
.tier:nth-child(2) { border-left-color: var(--accent); }
.tier:last-child   { border-left-color: var(--success); }

.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.tier-name  { font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
.tier-price { font-size: 12px; color: var(--text-primary); font-weight: 600; }
.tier-example { font-size: 12px; color: var(--text-secondary); }

/* Links */
.links { display: flex; gap: 8px; flex-wrap: wrap; }

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  background: var(--accent-light);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  transition: background 0.15s;
}
.link-btn:hover { background: rgba(255, 107, 0, 0.2); }
</style>
