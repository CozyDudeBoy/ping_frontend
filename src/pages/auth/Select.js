import { useState } from "react";
import arrow from "../../assets/icon-chevron-down.svg";

function Select({ options, placeholder, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="custom-select">
      {/* 선택 영역 */}
      <div
        className="selected"
        onClick={() => setOpen(prev => !prev)}
      >
        {selected || placeholder}

        <span className="arrow">
          <img src={arrow} alt="arrow" className="select_arrow" />
        </span>
      </div>

      {/* 옵션 */}
      {open && (
        <ul className="options">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={(e) => {
                e.stopPropagation();     // ⭐ 중요
                setSelected(opt);
                onChange?.(opt);         // ⭐ 대문자 O
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;