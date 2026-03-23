"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn, getLogoSrc } from "@/lib/utils";
import { Network } from "@/app/constants";


export interface NetworkSearchSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  networks: Network[];
  disabled?: boolean;
  placeholder?: string;
}

export function NetworkSearchSelect({
  value = "",
  onValueChange,
  networks,
  disabled = false,
  placeholder = "Select a network",
}: NetworkSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const getOptionId = (index: number) => `${uid}-option-${index}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedNetwork = useMemo(
    () => networks.find((n) => n.value === value),
    [networks, value]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return networks;
    return networks.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.chainId.toString().includes(q)
    );
  }, [networks, search]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [search]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      inputRef.current?.focus();

      const selectedIdx = filtered.findIndex((n) => n.value === value);
      if (selectedIdx !== -1 && listRef.current) {
        const item = listRef.current.children[selectedIdx] as HTMLElement;
        item?.scrollIntoView({ block: "nearest" });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch("");
    setActiveIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (networkValue: string) => {
      onValueChange(networkValue);
      closeDropdown();
      triggerRef.current?.focus();
    },
    [onValueChange, closeDropdown]
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleSelect(filtered[activeIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
        break;
      case "Tab":
        closeDropdown();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-white dark:text-gray-900",
          open && "ring-2 ring-ring ring-offset-2"
        )}
      >
        {selectedNetwork ? (
          <div className="flex items-center min-w-0">
            <img
              src={getLogoSrc(selectedNetwork.logo)}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 mr-2 flex-shrink-0 object-contain"
            />
            <span className="truncate">{selectedNetwork.label}</span>
          </div>
        ) : (
          <span className="text-muted-foreground dark:text-gray-400">
            {placeholder}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "ml-2 h-4 w-4 flex-shrink-0 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border border-input bg-popover text-popover-foreground shadow-md",
            "dark:bg-white dark:text-gray-900",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {/* Search bar */}
          <div className="flex items-center border-b border-input px-3 py-2">
            <Search
              aria-hidden="true"
              className="mr-2 h-4 w-4 flex-shrink-0 opacity-50"
            />
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                activeIndex >= 0 ? getOptionId(activeIndex) : undefined
              }
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "flex-1 bg-transparent text-sm outline-none",
                "placeholder:text-muted-foreground dark:placeholder:text-gray-400",
                "dark:text-gray-900"
              )}
              placeholder="Search by name or Chain ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Clear search"
                className="ml-1 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearch("");
                  inputRef.current?.focus();
                }}
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Networks"
            className="max-h-64 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li
                role="status"
                className="px-3 py-2 text-sm text-muted-foreground"
              >
                No networks found.
              </li>
            ) : (
              filtered.map((network, index) => (
                <li
                  key={network.value}
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={network.value === value}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm cursor-pointer select-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    network.value === value && "bg-accent/40",
                    index === activeIndex &&
                      "bg-accent text-accent-foreground"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(network.value);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <img
                    src={getLogoSrc(network.logo)}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 mr-2 flex-shrink-0 object-contain"
                  />
                  <span className="flex-1 min-w-0 truncate">
                    {network.label}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground dark:text-gray-500 flex-shrink-0 tabular-nums">
                    {network.chainId}
                  </span>
                  {network.value === value && (
                    <Check
                      aria-hidden="true"
                      className="ml-2 h-4 w-4 flex-shrink-0 text-primary"
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
