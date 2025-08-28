import * as React from "react"
import { X, ChevronsUpDown } from "lucide-react"
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
import { useVirtualizer } from "@tanstack/react-virtual"
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

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: Option[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
  modalPopover?: boolean
  asChild?: boolean
  className?: string
}

function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select items",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      defaultValue
    )
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!debouncedSearchQuery.trim()) {
        return options
      }
      const query = debouncedSearchQuery.toLowerCase()
      return options.filter(option => 
        option.label.toLowerCase().includes(query) ||
        String(option.value).toLowerCase().includes(query)
      )
    }, [options, debouncedSearchQuery])

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(defaultValue || [])
      }
    }, [defaultValue]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true)
      } else if (event.key === "Backspace" && !event.currentTarget.getAttribute('value')) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const handleSearchChange = (search: string) => {
      setSearchQuery(search)
    }

    const toggleOption = (option: Option) => {
      const newSelectedValues = selectedValues.includes(option.value)
        ? selectedValues.filter((value) => value !== option.value)
        : [...selectedValues, option.value]
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
      onValueChange([])
    }

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev)
    }

    const toggleAll = () => {
      const filteredValues = filteredOptions.map(option => option.value)
      const allFilteredSelected = filteredValues.every(value => selectedValues.includes(value))
      
      if (allFilteredSelected) {
        // Deselect all filtered options
        const newSelectedValues = selectedValues.filter(value => !filteredValues.includes(value))
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      } else {
        // Select all filtered options
        const newSelectedValues = [...new Set([...selectedValues, ...filteredValues])]
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const TriggerButton = (
      <Button
        ref={ref}
        {...props}
        onClick={(e) => {
          // Don't open if clicking on the clear all X button
          if ((e.target as HTMLElement).closest('[data-remove-item]')) {
            return
          }
          handleTogglePopover()
        }}
        className={cn(
          "flex w-full p-2 rounded-md border min-h-12 md:min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit touch-manipulation",
          className
        )}
      >
        {selectedValues.length > 0 ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-wrap items-center gap-1">
              {selectedValues.slice(0, maxCount).map((value) => {
                const option = options.find((o) => o.value === value)
                const IconComponent = option?.icon
                return (
                  <Badge
                    key={value}
                    className={cn(
                      "text-xs py-1 px-2 max-w-[150px] truncate flex items-center gap-1",
                      isAnimating ? "animate-bounce" : ""
                    )}
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
                  className={cn(
                    "text-xs",
                    isAnimating ? "animate-bounce" : ""
                  )}
                  style={{ animationDuration: `${animation}s` }}
                >
                  {`+${selectedValues.length - maxCount} more`}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between ml-2">
              <X
                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0"
                data-remove-item
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleClear()
                }}
              />
            </div>
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

    const filteredValues = filteredOptions.map(option => option.value)
    const allFilteredSelected = filteredValues.every(value => selectedValues.includes(value))
    const someFilteredSelected = filteredValues.some(value => selectedValues.includes(value))

    // Virtualization setup for large lists
    const parentRef = React.useRef<HTMLDivElement | null>(null)
    const hasSelectAllRow = filteredOptions.length > 1
    const rowsCount = filteredOptions.length + (hasSelectAllRow ? 1 : 0)
    const rowVirtualizer = useVirtualizer({
      count: rowsCount,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 40,
      overscan: 8,
    })

    const CommandContent = (
      <Command className="w-full" shouldFilter={false}>
        <CommandInput
          placeholder="Enhanced search..."
          onValueChange={handleSearchChange}
          value={searchQuery}
          onKeyDown={handleInputKeyDown}
          className="h-12 md:h-9"
        />
        <CommandList ref={parentRef as unknown as React.Ref<HTMLDivElement>} className="max-h-[300px] md:max-h-[200px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isSelectAllRow = hasSelectAllRow && virtualRow.index === 0
              const optionIndex = virtualRow.index - (hasSelectAllRow ? 1 : 0)
              const option = isSelectAllRow ? null : filteredOptions[optionIndex]

              return (
                <div
                  key={isSelectAllRow ? '__select_all__' : option?.value}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                >
                  {isSelectAllRow ? (
                    <CommandItem
                      onSelect={() => toggleAll()}
                      className="cursor-pointer py-3 md:py-2 touch-manipulation"
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
                        <X className="h-4 w-4" />
                      </div>
                      <span className="text-sm md:text-sm">
                        {searchQuery ? `(Select All ${filteredOptions.length} filtered)` : "(Select All)"}
                      </span>
                    </CommandItem>
                  ) : option ? (
                    <CommandItem
                      onSelect={() => toggleOption(option)}
                      className="cursor-pointer py-3 md:py-2 touch-manipulation"
                    >
                      <div
                        className={cn(
                          "mr-3 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValues.includes(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <X className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm md:text-sm">{option.label}</span>
                    </CommandItem>
                  ) : null}
                </div>
              )
            })}
          </div>
        </CommandList>
      </Command>
    )

    if (isDesktop) {
      return (
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={modalPopover}
        >
          <PopoverTrigger asChild>
            {TriggerButton}
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            {CommandContent}
          </PopoverContent>
        </Popover>
      )
    }

    return (
      <Drawer open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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

MultiSelect.displayName = "MultiSelect"
