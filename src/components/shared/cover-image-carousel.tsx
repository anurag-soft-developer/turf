"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ImagePlus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CoverImageCarouselProps {
  images: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  uploading?: boolean;
  maxImages?: number;
  emptyLabel?: string;
  className?: string;
}

export function CoverImageCarousel({
  images,
  onAdd,
  onRemove,
  uploading = false,
  maxImages,
  emptyLabel = "Add cover photos",
  className,
}: CoverImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const previousCount = useRef(images.length);
  const atLimit = maxImages != null && images.length >= maxImages;
  const canAdd = !atLimit && !uploading;
  const frameClassName = cn("h-52", className);

  useEffect(() => {
    if (!api) return undefined;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (images.length > previousCount.current) {
      api.scrollTo(images.length - 1);
    }
    previousCount.current = images.length;
  }, [api, images.length]);

  if (images.length === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white disabled:opacity-70",
          frameClassName,
        )}
      >
        <ImagePlus className="h-10 w-10 text-white/80" />
        <span className="text-sm font-semibold">
          {uploading ? "Uploading…" : emptyLabel}
        </span>
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-900">
      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-0">
          {images.map((url, index) => (
            <CarouselItem key={`${url}-${index}`} className="basis-full pl-0">
              <img src={url} alt="" className={cn("w-full object-cover", frameClassName)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 ? (
          <>
            <CarouselPrevious
              type="button"
              className="left-2 border-0 bg-black/50 text-white hover:bg-black/70 hover:text-white"
            />
            <CarouselNext
              type="button"
              className="right-2 border-0 bg-black/50 text-white hover:bg-black/70 hover:text-white"
            />
          </>
        ) : null}
      </Carousel>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-2">
        <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
          {current + 1}/{images.length}
        </span>
        <div className="pointer-events-auto flex gap-2">
          {atLimit ? null : (
            <button
              type="button"
              onClick={onAdd}
              disabled={!canAdd}
              aria-label="Add cover photo"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(current)}
            aria-label="Remove cover photo"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {images.map((url, index) => (
            <button
              key={`${url}-dot-${index}`}
              type="button"
              aria-label={`Go to cover ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
