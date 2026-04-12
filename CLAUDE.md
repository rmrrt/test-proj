# CLAUDE.md — Welding Tutorial App

## Проект
Мобильный обучающий туториал по сварке. Vue 3 SPA, русскоязычный, ориентирован на практиков.
Репозиторий: https://github.com/rmrrt/test-proj
Активная ветка разработки: `dev`

## Стек
- Vue 3 + Vite 8 + TypeScript + Pinia + Vue Router
- Node.js 22+ (обязательно — Vite 8 не работает на Node < 20.19)
- Планируется: Capacitor (iOS/Android)

## Структура проекта
src/
  components/
    lesson/         # TheoryStep.vue, QuizStep.vue
    tools/          # ModeCalculator.vue, DefectChallenge.vue, WeldingChecklist.vue
  composables/
    useDevMode.ts   # Dev-режим через ?dev=true
  content/
    modules/        # module-0..4 — контент уроков как TS-объекты
  services/
    checklistService.ts  # Абстракция хранилища (сейчас localStorage, готово к API)
  stores/
    content.ts      # Регистрация модулей
    progress.ts     # Прогресс пользователя
  types/
    content.ts      # Lesson, Module, VideoRef, ChecklistItem и др.
  views/            # ModulesView, LessonView, GearView, ToolsView, ChecklistListView, CustomChecklistView...
docs/
  superpowers/
    specs/          # Актуальная спека проекта

## Модули (текущее состояние)
| ID | Название | Уроков | Зависит от |
|----|----------|--------|------------|
| module-0 | Азы сварки | 7 | — |
| module-1 | Оборудование | 2 | module-0 |
| module-2 | Первый шов | 6 | module-1 |
| module-3 | Металловедение | 5 | module-0 |
| module-4 | Разделка кромок | 5 | module-0, module-2 |

## Структура урока (обязательные поля)
Каждый урок содержит: theory, quiz (3 вопроса, порог 80%), practicalNote, videos.

quiz: объяснения ошибок обязательны.

practicalNote: { summary: string, examples?: string[] }

videos: [{ platform, url, title, channel }] — YouTube + RuTube

## Правила добавления контента
- Новый модуль → новый файл src/content/modules/module-N-*.ts + регистрация в src/stores/content.ts
- Ссылки на ГОСТы где применимо (5264-80, 9467-75, 12.3.003-86, 2.312-72, 30242-97)
- Видео YouTube: канал Школа Сварки РВТ. RuTube: FUBAG, СВАРГО, SIKE и др.

## Сервисный слой — паттерн
checklistService.ts — все методы async, localStorage сейчас, API потом.
При добавлении новых сервисов — тот же паттерн.
TODO-комментарии с ожидаемыми REST эндпоинтами обязательны.

## Dev-режим
Активация: ?dev=true в URL → сохраняется в localStorage (ключ welding-dev-mode).
Эффекты: все уроки разблокированы, правильные ответы подсвечены в квизах.
Деактивация: удалить ключ welding-dev-mode из localStorage.

## Git
- Активная ветка разработки: dev (не пушить напрямую в main)
- Коммиты: feat / fix / docs / refactor + описание на английском

## Dev-сервер
npm run dev -- --host   # доступ по сети (ngrok)
vite.config.ts: server.allowedHosts: ['all'] — уже настроено.

## Дорожная карта
1. Расширение module-3 "Металловедение": сварочные напряжения, микроструктура шва, термообработка, расчёт углеродного эквивалента
2. module-5 "Металловедение: продвинутый": цветные металлы (Al, Cu, Ti), разнородные соединения, испытания по ГОСТ
3. Инструменты: калькулятор углеродного эквивалента, таблица совместимости металлов
4. Аутентификация + бэк: миграция checklistService на REST API
5. Capacitor: мобильное приложение (iOS/Android)
