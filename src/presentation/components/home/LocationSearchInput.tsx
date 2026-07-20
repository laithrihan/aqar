import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import type { LocationSuggestion } from '@/domain/home/PropertySearch'
import {
  filterLocationSuggestions,
  getLocationSuggestionLabel,
  resolveLocationInputDisplay,
} from '@/domain/home/filterLocationSuggestions'
import { useLocationSuggestions } from '@/presentation/hooks/useLocationSuggestions'
import { cn } from '@/shared/lib/cn'

const EMPTY_LOCATIONS: LocationSuggestion[] = []

type LocationSearchInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  onSuggestionSelect?: (location: LocationSuggestion) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  iconClassName?: string
}


export function LocationSearchInput({
  id,
  value,
  onChange,
  onSuggestionSelect,
  placeholder,
  className,
  inputClassName,
  iconClassName,
}: LocationSearchInputProps) {
  const { t, i18n } = useTranslation()
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const { data, isError } = useLocationSuggestions()
  const locations = data ?? EMPTY_LOCATIONS

  // Derive visible text: known suggestion keys show a localized label.
  const inputText = resolveLocationInputDisplay(
    value,
    locations,
    i18n.language,
  )
  const suggestions = filterLocationSuggestions(locations, inputText)
  const showList =
    open &&
    !isError &&
    inputText.trim().length > 0 &&
    suggestions.length > 0

  // Close when clicking outside
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const suggestionLabel = (location: LocationSuggestion) =>
    getLocationSuggestionLabel(location, i18n.language)

  const closeList = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const selectSuggestion = (location: LocationSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(location)
    } else {
      // Persist the stable English key for URLs / listing filters.
      onChange(location.value)
    }
    closeList()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showList) {
      if (event.key === 'Escape') closeList()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) =>
        index < suggestions.length - 1 ? index + 1 : 0,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      )
      return
    }

    // With the list open, Enter picks a suggestion instead of submitting the form.
    if (event.key === 'Enter') {
      event.preventDefault()
      const selected =
        activeIndex >= 0
          ? suggestions[activeIndex]
          : suggestions[0]
      if (selected) selectSuggestion(selected)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      closeList()
    }
  }

  return (
    <div ref={rootRef} className={cn('location-search', className)}>
      {/* Label restores icon-click → focus and ties the control to its id */}
      <label htmlFor={id} className="location-search-field">
        <HiOutlineSearch
          className={cn('location-search-icon', iconClassName)}
          aria-hidden
        />

        <input
          id={id}
          type="search"
          dir="auto"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          placeholder={placeholder ?? t('search.locationPlaceholder')}
          className={cn('location-search-input', inputClassName)}
          autoComplete="off"
          value={inputText}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </label>

      {showList ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('search.locationSuggestions')}
          className="location-search-list"
        >
          {suggestions.map((location, index) => (
            <li
              key={location.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              dir="auto"
              aria-selected={activeIndex === index}
              className={cn(
                'location-search-option',
                activeIndex === index && 'location-search-option--active',
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(location)}
            >
              {suggestionLabel(location)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
