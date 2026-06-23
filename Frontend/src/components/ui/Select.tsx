import { useState, useEffect, useLayoutEffect, useRef, forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      className,
      id,
      isRequired,
      error,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(
      (value as string) || (defaultValue as string) || ""
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    const [coords, setCoords] = useState<{
      top?: number;
      bottom?: number;
      left: number;
      width: number;
    } | null>(null);

    // Keep selected value in sync with controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);

    // Close on click outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        const clickedInsideContainer = containerRef.current && containerRef.current.contains(target);
        const clickedInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);

        if (!clickedInsideContainer && !clickedInsideDropdown) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calculate coordinates for the portal dropdown
    useLayoutEffect(() => {
      if (isOpen) {
        const updateCoords = () => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 250; // max height threshold
            const placeAbove = spaceBelow < dropdownHeight && rect.top > spaceBelow;

            if (placeAbove) {
              setCoords({
                bottom: window.innerHeight - rect.top + 6,
                left: rect.left,
                width: rect.width,
              });
            } else {
              setCoords({
                top: rect.bottom + 6,
                left: rect.left,
                width: rect.width,
              });
            }
          }
        };

        updateCoords();
        window.addEventListener("resize", updateCoords);
        window.addEventListener("scroll", updateCoords, true);

        return () => {
          window.removeEventListener("resize", updateCoords);
          window.removeEventListener("scroll", updateCoords, true);
        };
      } else {
        setCoords(null);
      }
    }, [isOpen, options.length]);

    const handleSelectOption = (optValue: string) => {
      setSelectedValue(optValue);
      setIsOpen(false);

      if (selectRef.current) {
        // Set value on the hidden native select element
        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
          HTMLSelectElement.prototype,
          "value"
        )?.set;
        nativeSelectValueSetter?.call(selectRef.current, optValue);

        // Dispatch a native change event so React Hook Form captures the update
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }
    };

    // Determine current label to show on trigger
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const triggerLabel = selectedOption
      ? selectedOption.label
      : placeholder || (options[0] ? options[0].label : "");

    return (
      <div className="flex flex-col gap-2 w-full" ref={containerRef} dir="rtl">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-dark flex items-center">
            {label}
            {isRequired && <span className="text-red-500 font-bold mr-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Hidden native select for react-hook-form integration */}
          <select
            ref={(node) => {
              selectRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            id={id}
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              if (onChange) onChange(e);
            }}
            className="hidden"
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "flex h-10 w-full items-center justify-between rounded-xl border border-accent-light bg-white px-4 py-2 text-sm text-text-dark outline-none transition-all duration-200 cursor-pointer select-none",
              error && "border-red-500! focus:border-red-500! focus:ring-red-500/30!",
              isOpen && "border-primary ring-2 ring-primary/30",
              className
            )}
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown
              className={clsx(
                "h-4 w-4 text-text-muted transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {/* Custom Dropdown Overlay */}
          {isOpen && coords && createPortal(
            <div 
              ref={dropdownRef}
              dir="rtl"
              className="fixed z-50 bg-white border border-accent-light/60 rounded-xl shadow-xl p-1.5 flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150"
              style={{
                top: coords.top !== undefined ? `${coords.top}px` : "auto",
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : "auto",
                left: `${coords.left}px`,
                width: `${coords.width}px`,
              }}
            >
              {/* Custom scrollbar styling */}
              <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #CBD5E1 transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #CBD5E1;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #94A3B8;
                }
              `}} />

              {placeholder && (
                <div
                  onClick={() => handleSelectOption("")}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors duration-150",
                    selectedValue === ""
                      ? "bg-accent text-white font-medium"
                      : "text-text-muted hover:bg-bg-cream"
                  )}
                >
                  <span>{placeholder}</span>
                  {selectedValue === "" && <Check className="h-4 w-4 text-white" />}
                </div>
              )}
              {options.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 text-sm rounded-lg cursor-pointer transition-colors duration-150",
                      isSelected
                        ? "bg-accent text-white font-medium"
                        : "text-text-dark hover:bg-bg-cream"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                );
              })}
            </div>,
            document.body
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
