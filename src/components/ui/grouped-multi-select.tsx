import * as React from "react"
import { X, ChevronsUpDown, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/lib/search"

const multiSelectVariants = cva(
  "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GroupedOption {
  label: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export interface OptionGroup {
  [groupName: string]: GroupedOption[]
}

interface GroupedMultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'>,
    VariantProps<typeof multiSelectVariants> {
  optionGroups: OptionGroup
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  onValueChange?: (value: (string | number)[]) => void
  placeholder?: string
  animation?: number
  maxCount?: number
  maxSelected?: number
  onMaxSelectedReached?: (max: number) => void
  modalPopover?: boolean
  asChild?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  filterFn?: (option: GroupedOption, groupName: string, query: string) => boolean
  debounceMs?: number
  clearable?: boolean
  loading?: boolean
  noResultsText?: string
  renderOption?: (option: GroupedOption, selected: boolean, group: string) => React.ReactNode
  onInputChange?: (query: string) => void
}

function useMediaQuery(query: string) {
  const getInitial = React.useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return false
    return window.matchMedia(query).matches
  }, [query])
  const [value, setValue] = React.useState<boolean>(getInitial)
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setValue(e.matches)
    setValue(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])
  return value
}

function useControllableArray({
  value,
  defaultValue,
  onChange,
}: {
  value?: string[]
  defaultValue?: string[]
  onChange?: (next: string[]) => void
}) {
  const [internal, setInternal] = React.useState<(string | number)[]>(defaultValue ?? [])
  const isControlled = value !== undefined
  const current = isControlled ? (value as (string | number)[]) : internal
  const setValue = React.useCallback(
    (next: (string | number)[] | ((prev: (string | number)[]) => (string | number)[])) => {
      const resolved = typeof next === "function" ? (next as (p: (string | number)[]) => (string | number)[])(current) : next
      if (!isControlled) setInternal(resolved)
      onChange?.(resolved)
    },
    [isControlled, onChange, current]
  )
  React.useEffect(() => {
    if (isControlled) return
    setInternal(defaultValue ?? [])
  }, [defaultValue, isControlled])
  return [current, setValue] as const
}

export const GroupedMultiSelect = React.forwardRef<
  HTMLButtonElement,
  GroupedMultiSelectProps
>(
  (
    {
      optionGroups,
      value,
      defaultValue = [],
      onValueChange,
      variant,
      placeholder = "Select items",
      animation = 0,
      maxCount = 3,
      maxSelected,
      onMaxSelectedReached,
      modalPopover = false,
      asChild = false,
      className,
      open,
      defaultOpen,
      onOpenChange,
      filterFn,
      debounceMs = 300,
      clearable = true,
      loading = false,
      noResultsText = "No ingredients found.",
      renderOption,
      onInputChange,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useControllableArray({
      value,
      defaultValue,
      onChange: onValueChange,
    })
    const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(defaultOpen ?? false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const listboxId = React.useId()

    // Flatten options for easier lookups
    const allOptions = React.useMemo(() => {
      return Object.values(optionGroups).flat()
    }, [optionGroups])

    const valueToOption = React.useMemo(() => {
      const map = new Map<string | number, GroupedOption>()
      for (const opt of allOptions) map.set(opt.value, opt)
      return map
    }, [allOptions])

    // Filter groups and options based on search query
    const defaultFilter = React.useCallback((option: GroupedOption, groupName: string, q: string) => {
      const query = q.toLowerCase()
      return (
        option.label.toLowerCase().includes(query) ||
        String(option.value).toLowerCase().includes(query) ||
        groupName.toLowerCase().includes(query)
      )
    }, [])

    const effectiveFilter = filterFn ?? defaultFilter

    const filteredGroups = React.useMemo(() => {
      const q = debouncedSearchQuery.trim()
      if (!q) return optionGroups
      const filtered: OptionGroup = {}
      Object.entries(optionGroups).forEach(([groupName, options]) => {
        const inGroup = options.filter((opt) => effectiveFilter(opt, groupName, q))
        if (inGroup.length > 0) filtered[groupName] = inGroup
      })
      return filtered
    }, [optionGroups, debouncedSearchQuery, effectiveFilter])

    // Get all filtered options for global operations
    const allFilteredOptions = React.useMemo(() => {
      return Object.values(filteredGroups).flat()
    }, [filteredGroups])

    React.useEffect(() => {
      if (open === undefined) return
      setIsPopoverOpen(open)
    }, [open])

    const setOpen = React.useCallback((next: boolean) => {
      if (open === undefined) setIsPopoverOpen(next)
      onOpenChange?.(next)
    }, [open, onOpenChange])

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        setOpen(true)
      } else if (event.key === "Backspace" && searchQuery.length === 0) {
        if (selectedValues.length === 0) return
        const newSelectedValues = selectedValues.slice(0, -1)
        setSelectedValues(newSelectedValues)
      }
    }

    const handleSearchChange = (search: string) => {
      setSearchQuery(search)
      onInputChange?.(search)
    }

    const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues])

    const toggleOption = (option: GroupedOption) => {
      if (option.disabled) return
      const isSelected = selectedSet.has(option.value)
      if (!isSelected && typeof maxSelected === "number" && maxSelected > 0 && selectedValues.length >= maxSelected) {
        onMaxSelectedReached?.(maxSelected)
        return
      }
      const newSelectedValues = isSelected
        ? selectedValues.filter((value) => value !== option.value)
        : [...selectedValues, option.value]
      setSelectedValues(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
    }

    const handleTogglePopover = () => {
      setOpen(!isPopoverOpen)
    }

    const toggleAll = () => {
      const filteredValues = allFilteredOptions.map(option => option.value)
      const allFilteredSelected = filteredValues.every(value => selectedSet.has(value))
      if (allFilteredSelected) {
        const newSelectedValues = selectedValues.filter(value => !filteredValues.includes(value))
        setSelectedValues(newSelectedValues)
      } else {
        const merged = [...selectedValues]
        for (const v of filteredValues) {
          if (!selectedSet.has(v)) {
            if (typeof maxSelected === "number" && maxSelected > 0 && merged.length >= maxSelected) {
              onMaxSelectedReached?.(maxSelected)
              break
            }
            merged.push(v)
          }
        }
        setSelectedValues([...new Set(merged)])
      }
    }

    const toggleGroup = (groupName: string) => {
      // Use filtered group options if we're in search mode
      const groupOptions = filteredGroups[groupName] || []
      const groupValues = groupOptions.map(option => option.value)
      const allGroupSelected = groupValues.every(value => selectedSet.has(value))
      
      if (allGroupSelected) {
        // Deselect all items in this group
        const newSelectedValues = selectedValues.filter(value => !groupValues.includes(value))
        setSelectedValues(newSelectedValues)
      } else {
        // Select all items in this group
        const merged = [...selectedValues]
        for (const v of groupValues) {
          if (!selectedSet.has(v)) {
            if (typeof maxSelected === "number" && maxSelected > 0 && merged.length >= maxSelected) {
              onMaxSelectedReached?.(maxSelected)
              break
            }
            merged.push(v)
          }
        }
        setSelectedValues([...new Set(merged)])
      }
    }

    const userOnClick = props.onClick
    const TriggerButton = (
      <Button
        ref={ref}
        {...props}
        onClick={(e) => {
          userOnClick?.(e)
          if (e.defaultPrevented) return
          // Don't open if clicking on the clear all X button
          if ((e.target as HTMLElement).closest('[data-remove-item]')) {
            return
          }
          handleTogglePopover()
        }}
        aria-haspopup="listbox"
        aria-expanded={isPopoverOpen}
        aria-controls={listboxId}
        className={cn(
          multiSelectVariants({ variant }),
          "flex w-full p-2 min-h-12 md:min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit touch-manipulation",
          className
        )}
      >
        {selectedValues.length > 0 ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-wrap items-center gap-1">
              {selectedValues.slice(0, maxCount).map((value) => {
                const option = valueToOption.get(value)
                const IconComponent = option?.icon
                return (
                  <Badge
                    key={value}
                    className={cn("text-xs py-1 px-2 max-w-[150px] truncate flex items-center gap-1")}
                    style={{ animationDuration: `${animation}s` }}
                  >
                    {IconComponent && (
                      <IconComponent className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span className="truncate">{option?.label}</span>
                  </Badge>
                )
              })}
              {selectedValues.length > maxCount && (
                <Badge
                  variant="outline"
                  className={cn("text-xs")}
                  style={{ animationDuration: `${animation}s` }}
                >
                  {`+${selectedValues.length - maxCount} more`}
                </Badge>
              )}
            </div>
            {clearable && (
              <div className="flex items-center justify-between ml-2">
                <button
                  type="button"
                  aria-label="Clear selection"
                  className="p-1 text-muted-foreground hover:text-foreground"
                  data-remove-item
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleClear()
                  }}
                >
                  <X className="h-4 w-4 flex-shrink-0" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </div>
        )}
      </Button>
    )

    const filteredValues = allFilteredOptions.map(option => option.value)
    const allFilteredSelected = filteredValues.every(value => selectedSet.has(value))
    const someFilteredSelected = !allFilteredSelected && filteredValues.some(value => selectedSet.has(value))

    const CommandContent = (
      <Command className="w-full" shouldFilter={false}>
        <CommandInput
          placeholder="Enhanced ingredient search..."
          onValueChange={handleSearchChange}
          value={searchQuery}
          onKeyDown={handleInputKeyDown}
          className="h-12 md:h-9"
        />
        <CommandList
          className="max-h-[300px] md:max-h-[200px]"
          role="listbox"
          aria-multiselectable="true"
          id={listboxId}
        >
          <CommandEmpty>{noResultsText}</CommandEmpty>
          <CommandGroup>
            {allFilteredOptions.length > 1 && !loading && (
              <CommandItem
                key="all"
                onSelect={(value) => {
                  // Prevent the default command behavior and use our toggle
                  toggleAll()
                }}
                className="cursor-pointer py-3 md:py-2 touch-manipulation"
                role="option"
                aria-selected={allFilteredSelected}
              >
                <div
                  className={cn(
                    "mr-3 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    allFilteredSelected
                      ? "bg-primary text-primary-foreground"
                      : someFilteredSelected
                      ? "bg-primary/50 text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm md:text-sm">
                  {searchQuery ? `(Select All ${allFilteredOptions.length} filtered)` : "(Select All)"}
                </span>
              </CommandItem>
            )}
          </CommandGroup>
          {loading && (
            <div className="py-2 px-2 text-sm text-muted-foreground">Loading...</div>
          )}
          {Object.entries(filteredGroups)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([groupName, options]) => {
              const groupValues = options.map(option => option.value)
              const allGroupSelected = groupValues.every(value => selectedSet.has(value))
              const someGroupSelected = !allGroupSelected && groupValues.some(value => selectedSet.has(value))
              
              return (
            <CommandGroup key={groupName} heading={`${groupName}${searchQuery ? ` (${options.length})` : ''}`}>
              <CommandItem
                key={`${groupName}-select-all`}
                onSelect={(value) => {
                  // Prevent the default command behavior and use our toggle
                  toggleGroup(groupName)
                }}
                className="cursor-pointer py-2 text-xs font-medium text-muted-foreground hover:text-foreground touch-manipulation"
                role="option"
                aria-selected={allGroupSelected}
              >
                <div
                  className={cn(
                    "mr-3 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    allGroupSelected
                      ? "bg-primary text-primary-foreground"
                      : someGroupSelected
                      ? "bg-primary/50 text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="italic">
                  Select all {groupName.toLowerCase()} 
                  {searchQuery && ` (${options.length})`}
                </span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={(value) => {
                      // Prevent the default command behavior and use our toggle
                      toggleOption(option)
                    }}
                    className="cursor-pointer py-3 md:py-2 touch-manipulation"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                  >
                    <div
                      className={cn(
                        "mr-3 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {renderOption ? (
                      renderOption(option, isSelected, groupName)
                    ) : (
                      <>
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm md:text-sm">{option.label}</span>
                      </>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
              )
            })}
        </CommandList>
      </Command>
    )

    if (isDesktop) {
      return (
        <Popover
          open={isPopoverOpen}
          onOpenChange={setOpen}
          modal={modalPopover}
        >
          <PopoverTrigger asChild>
            {TriggerButton}
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            onEscapeKeyDown={() => setOpen(false)}
          >
            {CommandContent}
          </PopoverContent>
        </Popover>
      )
    }

    return (
      <Drawer open={isPopoverOpen} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <div className="p-4 pb-8">
            {CommandContent}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }
)

GroupedMultiSelect.displayName = "GroupedMultiSelect"
