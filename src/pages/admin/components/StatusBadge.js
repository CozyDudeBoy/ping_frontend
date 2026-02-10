import React from 'react';

export default function StatusBadge({ value }) {
  const map = {
    active: { text: "활성화", className: "badge badge--active" },
    flagged: { text: "플래그", className: "badge badge--flagged" },
  };
  const meta = map[value] || { text: value, className: "badge" };
  return <span className={meta.className}>{meta.text}</span>;
}