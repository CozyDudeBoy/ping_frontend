export const ISSUE_TAXONOMY = [
  {
    groupKey: "information_structure",
    groupLabel: "INFORMATION STRUCTURE",
    groupKo: "정보구조",
    desc: "정보가 어떻게 조직되고, 이해되는가",
    items: [
      { key: "info_hierarchy", label: "정보 위계", en: "Information Hierarchy", help: "핵심 정보와 보조 정보의 우선순위가 명확한가" },
      { key: "nav_structure", label: "내비게이션 구조", en: "Navigation Structure", help: "사용자가 현재 위치와 이동 경로를 쉽게 인지하는가" },
      { key: "content_organization", label: "콘텐츠 조직", en: "Content Organization", help: "관련 정보가 논리적으로 묶여 있는가" },
      { key: "labeling_naming", label: "라벨링 / 명명", en: "Labeling & Naming", help: "메뉴·버튼·용어가 사용자의 언어로 명확한가" },
    ],
  },
  {
    groupKey: "interaction",
    groupLabel: "INTERACTION",
    groupKo: "인터랙션",
    desc: "사용자의 행동에 시스템이 어떻게 반응하는가",
    items: [
      { key: "user_flow", label: "사용자 플로우", en: "User Flow", help: "목표까지의 흐름이 끊기지 않고 자연스러운가" },
      { key: "feedback_response", label: "피드백/응답", en: "Feedback & Response", help: "입력·행동에 대한 시스템 반응이 즉각적이고 명확한가" },
      { key: "gestures_actions", label: "제스처/동작", en: "Gestures & Actions", help: "터치·스와이프 등 모바일 동작이 직관적인가" },
      { key: "micro_interaction", label: "마이크로 인터랙션", en: "Micro-interaction", help: "작은 변화(애니메이션, 상태 변화)가 행동을 안내하는가" },
    ],
  },
  {
    groupKey: "usability",
    groupLabel: "USABILITY",
    groupKo: "사용성",
    desc: "사용자가 얼마나 편하고 실수 없이 사용할 수 있는가",
    items: [
      { key: "accessibility", label: "접근성", en: "Accessibility", help: "다양한 사용자·환경에서도 사용 가능한가" },
      { key: "readability", label: "가독성", en: "Readability", help: "텍스트와 정보가 쉽게 읽히는가" },
      { key: "error_prevention", label: "오류 방지", en: "Error Prevention", help: "실수를 사전에 막는 구조인가" },
      { key: "consistency", label: "일관성", en: "Consistency", help: "조작 방식과 UI 패턴이 예측 가능한가" },
    ],
  },
  {
    groupKey: "visual_design",
    groupLabel: "VISUAL DESIGN",
    groupKo: "비주얼 디자인",
    desc: "시각 요소가 행동과 이해를 돕는가",
    items: [
      { key: "layout_grid", label: "레이아웃/그리드", en: "Layout & Grid", help: "정보 배치가 안정적이고 이해하기 쉬운가" },
      { key: "typography", label: "타이포그래피", en: "Typography", help: "위계와 가독성이 잘 표현되는가" },
      { key: "color_usage", label: "색상 사용", en: "Color Usage", help: "의미 있는 강조와 상태 표현이 되는가" },
      { key: "spacing", label: "여백/간격", en: "Spacing", help: "정보 간 구분과 시선 흐름이 자연스러운가" },
      { key: "visual_hierarchy", label: "시각적 위계", en: "Visual Hierarchy", help: "어디부터 봐야 할지 명확한가" },
    ],
  },
];

// 그룹별 포인트 컬러(캡쳐톤)
export const GROUP_COLOR = {
  information_structure: "green",
  interaction: "blue",
  usability: "purple",
  visual_design: "red",
};
