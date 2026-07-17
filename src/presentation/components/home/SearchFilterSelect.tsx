import { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

import type { SearchFilterOption } from '@/domain/home/PropertySearch'
import { cn } from '@/shared/lib/cn'

type SearchFilterSelectProps = {
  id: string
  label: string
  value: string
  options: SearchFilterOption[]
  placeholder: string
  onChange: (value: string) => void
}

/**
 * Custom filter dropdown 
 */
export function SearchFilterSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: SearchFilterSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((option) => option.value === value)
  const displayText = selectedLabel ? t(selectedLabel.labelKey) : placeholder

  // Close when clicking outside
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const selectOption = (nextValue: string) => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="search-filter-select">
      <span className="sr-only" id={`${id}-label`}>
        {label}
      </span>

      <button
        id={id}
        type="button"
        className={cn(
          'search-filter-select-field',
          !value && 'search-filter-select-field--placeholder',
          open && 'search-filter-select-field--open',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="search-filter-select-value">{displayText}</span>
        <FaChevronDown
          className={cn(
            'search-filter-select-icon',
            open && 'search-filter-select-icon--open',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="search-filter-select-list"
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              className={cn(
                'search-filter-select-option',
                !value && 'search-filter-select-option--active',
              )}
              onClick={() => selectOption('')}
            >
              {placeholder}
            </button>
          </li>

          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
            >
              <button
                type="button"
                className={cn(
                  'search-filter-select-option',
                  value === option.value &&
                    'search-filter-select-option--active',
                )}
                onClick={() => selectOption(option.value)}
              >
                {t(option.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
