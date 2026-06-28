"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseSelectProps } from "./types";

export const SearchableSelect = ({
  options,
  selectedOption,
  onChange,
  maxVisible,
  optionLabel,
  disabled,
}: BaseSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") closeDropdown();
  };

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [options, searchTerm],
  );

  const visibleOptions = filteredOptions.slice(0, maxVisible);
  const hiddenCount = filteredOptions.length - visibleOptions.length;

  const selectPlaceholder = optionLabel ? `Select ${optionLabel}` : "Select";
  const searchPlaceholder = optionLabel ? `Search by ${optionLabel}` : "Search";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center sm:w-auto w-full"
      onKeyDown={handleKeyDown}
    >
      <button
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="ticker-listbox"
        aria-label={selectPlaceholder}
        className={`flex items-center justify-between gap-3 rounded ov-border bg-ov-control/50 px-3 py-1.5 ov-mono-xs text-ov-default min-w-44 sm:w-auto w-full ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {selectedOption?.label || selectPlaceholder}
        <ChevronDown size={14} className="text-ov-default shrink-0" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-full w-full bg-ov-dropdown ov-border rounded z-2 overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              value={searchTerm}
              aria-label={searchPlaceholder}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-1.5 text-sm bg-transparent focus:outline-none ov-border-b text-ov-default"
            />
            <ul
              role="listbox"
              id="ticker-listbox"
              className="max-h-96 overflow-y-auto"
            >
              {visibleOptions.length === 0 ? (
                <li className="flex flex-col items-center py-4 text-ov-subtitle gap-2">
                  <Search size={16} />
                  <span className="text-xs">No results found.</span>
                </li>
              ) : (
                <>
                  {visibleOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        onChange(option);
                        closeDropdown();
                      }}
                      role="option"
                      aria-selected={option.value === selectedOption?.value}
                      className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-ov-control text-ov-default ov-mono-sm"
                    >
                      {option.label}
                      {option.value === selectedOption?.value && (
                        <Check size={12} className="text-ov-default shrink-0" />
                      )}
                    </li>
                  ))}

                  {hiddenCount > 0 && (
                    <li
                      role="note"
                      className="px-3 py-1.5 ov-mono-xs text-ov-subtitle ov-border-t"
                    >
                      Showing {maxVisible} of {filteredOptions.length} total{" "}
                      {optionLabel || "option"}s — refine your search.
                    </li>
                  )}
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
