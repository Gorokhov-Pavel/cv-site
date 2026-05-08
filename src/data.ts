import type { Project } from "./components/ProjectCard/ProjectCard";
import p1s1 from './assets/projects/project-1/screen-1.svg'
import p1s2 from './assets/projects/project-1/screen-2.svg'
import p1s3 from './assets/projects/project-1/screen-3.svg'
import p2s1 from './assets/projects/project-2/screen-1.svg'
import p2s2 from './assets/projects/project-2/screen-2.svg'
import p2s3 from './assets/projects/project-2/screen-3.svg'

export const projects: Project[] = [
  {
    title: 'SportBaza',
    description:
      'Ноябрь 2025 - март 2026. Веб-приложение для ведения базы спортсменов Федерации Карате г Москвы, формирования заявок на  соревнования, учет членских взносов и тд. ',
    team: 'Команда проекта: 3 человека: PM, фронтенд разработчик, разработчик бэкенда.',
    outro: 'Использовался antd, некоторая сложность была во встраивании поиска и страниц в select элементы из antd, анимации прокрутки для смартфонов в селектах, небольшая часть бизнес логики была на стороне клиента - группировка взносов по возрастам с нюансами - тоже составила некоторую сложность.',
    stack: ['React', 'TypeScript', 'antd', "Redux"],
    links: [
      { label: 'sportbaza.moswkf.ru', href: 'https://sportbaza.moswkf.ru' },
    ],
    screenshots: [
      { src: p1s1, alt: 'Экран 1' },
      { src: p1s2, alt: 'Экран 2' },
      { src: p1s3, alt: 'Экран 3' },
      { src: p1s3, alt: 'Экран 4' },
    ],
  },
  {
    title: 'Stroynee',
    description:
      'Март 2025 – ноябрь 2025. Цифровой помощник по борьбе с лишним весом от компании Герофарм: персональный план похудения, рекомендации по питанию и активности, ведение дневника и т.п. Занимался визуальной составляющей, реализацией бизнес-логики, проигрыванием медиа-контента, отрисовкой интерактивного графика.',
    team: 'Команда проекта: 7 человек: PM, дизайнер, тестировщик, 2 мобильных разработчика, 2 разработчика бэкенда.',
    outro: 'Интересно было поработать с графиком на skia, сложность составило масштабирование графика, чтобы поверх него правильно располагать компонент. Долго пробовали использовать более простые библиотеки управления открытием клавиатуры, но всё-таки пришли к react native keyboard controller. Ещё интересно было открытие pdf и скачивание их. Ещё полезно было проходить частые код ревью от более опытного разработчика.',
    stack: ['React Native', 'TypeScript', 'Expo', 'Redux', 'Skia'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/ru/app/stroynee/id6743705033' },
      { label: 'RuStore', href: 'https://www.rustore.ru/catalog/app/com.m.kuchaev.stroynee' },
    ],
    screenshots: [
      { src: p2s1, alt: 'Экран 1' },
      { src: p2s2, alt: 'Экран 2' },
      { src: p2s3, alt: 'Экран 3' },
    ],
  },
  {
    title: 'Fizzio',
    description:
      'Август 2024 - февраль 2025. Мобильное приложение для проведения восстанавливающих тренировок после травм. Занимался визуальной составляющей, реализацией бизнес-логики, проигрыванием медиа-контента, анимациями.',
    team: 'Команда проекта: 4-6 человек: дизайнер, тестировщик, 2 мобильных разработчика, команда бэкенда.',
    outro: 'Сложность была в анимации таймера с аудио отсчётом перед видео. Интересно было добавлять пуш уведомления. Ещё тень в одном месте была через svg библиотеку для этого, анимация была с появлением элемента с этой тенью.',
    stack: ['React Native', 'TypeScript', 'Expo', 'Redux'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/ru/app/fizzio/id6738578323' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.fizzio' },
    ],
    screenshots: [
      { src: p1s1, alt: 'Экран 1' },
      { src: p1s2, alt: 'Экран 2' },
      { src: p1s3, alt: 'Экран 3' },
      { src: p1s3, alt: 'Экран 4' },
    ],
  },
  {
    title: 'Близнецы',
    description:
      'Январь 2024 - май 2024. Проект в сфере ecommerce. Приложение представляет собой виртуальную карту лояльности, для предъявления в магазинах и получения бонусов и скидок. Содержит информацию об актуальных акциях и распродажах. Вёрстка, роутинг, взаимодействие с бэком через Rest api.',
    team: 'Команда проекта: 3 человека: PM, фронтенд разработчик, разработчик бэкенда.',
    outro: 'Добавлял конвертирование локальных svg в tsx компоненты при сборке в webpack, когда это было актуально. Использовался jivochat, было интересно его встраивать, при обновлении, последняя версия ios sdk правильно не заработала, пришлось возвращаться на предыдущую версию ios sdk jivochat. Добавлял сохранение истории покупок на стороне приложения с мерджем последних покупок при запросе их.',
    stack: ['React Native', 'TypeScript', 'Redux', "Webpack", "JivoChat"],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/ru/app/stroynee/id6743705033' },
      { label: 'RuStore', href: 'https://www.rustore.ru/catalog/app/com.m.kuchaev.stroynee' },
    ],
    screenshots: [
      { src: p1s1, alt: 'Экран 1' },
      { src: p1s2, alt: 'Экран 2' },
      { src: p1s3, alt: 'Экран 3' },
      { src: p1s3, alt: 'Экран 4' },
    ],
  },
  {
    title: 'Humansignals',
    description:
      'Март 2023 - июль 2023, апрель 2024 - июнь 2024. Проект в сфере бизнес аналитики. Платформа HumanSignals предназначена для сбора и анализа первичных (first-party) пользовательских данных с целью построения единого портрета клиента, анализа продуктовых и маркетинговых метрик, сегментации клиентов и реализации персонализированных коммуникаций. Проект представляет собой русскоязычную адаптацию сервиса Posthog, реализован  на React и kea, далее перенесен на next.js и redux.',
    team: 'Команда проекта: 4 человека: 2 фронтендера, 1 девопс, дизайнер.',
    //outro: '',
    stack: ["TypeScript", "React", "kea", "next.js", "Tailwind", "scss", "antdisign", "Redux", "Webpack", "masonry layout"],
    screenshots: [],
  },
  {
    title: 'SocialProfiler',
    description:
      'Декабрь 2022 - март 2023. Проект в сфере Big Data. Веб-интерфейс сервиса по сбору и анализу пользовательских данных, собранных из социальных сетей (Instagram, Twitter, Facebook). Занимался разработкой визуальных компонентов, анимациями.',
    team: 'Команда проекта: 5 человек: 1 девопс, 2 бекендера, 2 фронтенд.',
    //outro: '',
    stack: ['React', 'TypeScript', 'scss', "Chart.js"],
    screenshots: [],
  },
]

export const projectsHead = {
  title: "Последние проекты",
  descriptions: [
    {
      text: "В компании IVOLGA Technologies, апрель 2022 - март 2026",
      insideLinks: [
        {
          label: "IVOLGA Technologies",
          href: "https://ivolga.tech/",
        },  
      ]
    },
  ]
}
