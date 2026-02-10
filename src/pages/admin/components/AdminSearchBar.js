import React from 'react';

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "검색...",
  onSubmit,
  className = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className="admin-search" onSubmit={handleSubmit}>
      <span className="admin-search__icon">⌕</span>
      <input
        className="admin-search__input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  );
}

