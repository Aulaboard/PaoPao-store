import React from "react";

/**
 * Renders plain text normally. When `editing` is true, renders an
 * input/textarea in its place so any visitor in edit mode can change
 * that exact piece of copy — hero title, a category name, a badge label,
 * the footer line, etc.
 */
export default function EditableText({
  value,
  onChange,
  editing,
  as: Tag = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  placeholder = "",
}) {
  if (!editing) {
    return <Tag className={className}>{value}</Tag>;
  }

  const baseInput =
    "bg-white border border-dashed border-[#FF5A1F] rounded-md px-2 py-1 outline-none focus:border-solid w-full";

  if (multiline) {
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className={`${baseInput} ${inputClassName || className}`}
      />
    );
  }

  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseInput} ${inputClassName || className}`}
    />
  );
}
