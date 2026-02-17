'use client'

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { BlurFade } from "@/components/animations/BlurFade"
import { X, ChevronLeft, ChevronRight, Maximize2, Filter, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryItem {
  id: string
  title: string
  url: string
  category: string
  eventMonth?: string | null
  eventYear?: string | null
  alt?: string | null
}

interface GalleryGridProps {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [filter, setFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState("All")
  const [monthFilter, setMonthFilter] = useState("All")

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.category)))], [items])
  const years = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.eventYear).filter(Boolean))).sort().reverse()], [items])
  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = filter === "All" || item.category === filter
      const yearMatch = yearFilter === "All" || item.eventYear === yearFilter
      const monthMatch = monthFilter === "All" || item.eventMonth === monthFilter
      return categoryMatch && yearMatch && monthMatch
    })
  }, [items, filter, yearFilter, monthFilter])

  const openLightbox = (index: number) => {
    setSelectedItem(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedItem(null)
    document.body.style.overflow = 'auto'
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedItem === null) return
    setSelectedItem((selectedItem + 1) % filteredItems.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedItem === null) return
    setSelectedItem((selectedItem - 1 + filteredItems.length) % filteredItems.length)
  }

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border shrink-0",
                filter === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 items-center text-sm">
          <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-xl border border-border">
            <Calendar className="h-4 w-4 text-primary" />
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-wider outline-none"
            >
              <option value="All">All Years</option>
              {years.filter(y => y !== "All").map(y => (
                <option key={y} value={y!}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-xl border border-border">
            <Filter className="h-4 w-4 text-primary" />
            <select 
              value={monthFilter} 
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-wider outline-none"
            >
              <option value="All">All Months</option>
              {months.filter(m => m !== "All").map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid"
            >
              <div 
                className="relative group rounded-[2rem] overflow-hidden bg-secondary/30 border border-border cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={item.url}
                  alt={item.alt || item.title}
                  width={800}
                  height={1000}
                  className="w-full h-auto transition-all duration-700 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">{item.category}</span>
                    {item.eventYear && (
                      <>
                        <div className="h-1 w-1 rounded-full bg-blue-400/50" />
                        <span className="text-blue-400/70 text-[10px] font-black uppercase tracking-[0.3em]">{item.eventMonth} {item.eventYear}</span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    <h3 className="text-white text-xl font-black uppercase tracking-tight">{item.title}</h3>
                    <Maximize2 className="h-5 w-5 text-white/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground italic">No milestones found for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-2xl p-4 md:p-10"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-8 right-8 text-foreground/50 hover:text-foreground z-[110]"
              onClick={closeLightbox}
            >
              <X className="h-10 w-10" />
            </button>

            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground z-[110] bg-secondary/50 p-4 rounded-full backdrop-blur-md"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground z-[110] bg-secondary/50 p-4 rounded-full backdrop-blur-md"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
              <motion.div 
                key={selectedItem}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="relative max-w-5xl w-full h-[70vh] md:h-[80vh]"
              >
                <Image
                  src={filteredItems[selectedItem].url}
                  alt={filteredItems[selectedItem].alt || filteredItems[selectedItem].title}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              
              <div className="mt-8 text-center max-w-2xl">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-blue-500 text-xs font-black uppercase tracking-[0.3em]">{filteredItems[selectedItem].category}</span>
                  {filteredItems[selectedItem].eventYear && (
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                      • {filteredItems[selectedItem].eventMonth} {filteredItems[selectedItem].eventYear}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                  {filteredItems[selectedItem].title}
                </h2>
              </div>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
                {selectedItem + 1} / {filteredItems.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
