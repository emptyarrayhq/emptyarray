import React from "react"

import { Icon } from "@iconify-icon/react"
import { Link2Icon } from "lucide-react"

import ImageWithFallback from "../ui/ImageWithFallback"
import { useAuth } from "@/src/contexts/AuthContext"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"
import useReadingStore from "@/src/lib/store/reading.store"
import { truncateString } from "@/src/utils/helpers"

interface ItemsListProps {
  blockId: string | null
  spaceId: string
}

const ItemsList: React.FC<ItemsListProps> = ({ blockId, spaceId }) => {
  const { session } = useAuth()
  const { readingItems, deleteItem: deleteItemFromStore } = useReadingStore()

  const deleteItem = async (itemId: string) => {
    if (!blockId) return

    try {
      await deleteItemFromStore(session, spaceId, blockId, itemId)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (readingItems.length === 0) {
    return <p>Reading list is empty </p>
  }

  return (
    <div className="flex w-3/4 flex-col gap-4">
      {[...readingItems].reverse().map((item: ReadingItem) => {
        const url = item.metadata?.url
        const favicon = item.metadata?.favicon
        console.log("ulr: ", item.metadata?.url)
        return (
          <div
            key={item._id}
            className="group flex flex-col justify-center gap-2 rounded-lg py-1"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block ${url ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-center gap-2">
                {favicon ? (
                  <ImageWithFallback
                    src={favicon}
                    FallbackIcon={Link2Icon}
                    alt="Favicon"
                    width={16}
                    height={16}
                    className="size-5 shrink-0"
                  />
                ) : (
                  <Icon
                    icon="ph:circle-bold"
                    className="ml-[3px] shrink-0 text-[16px] text-secondary-foreground"
                  />
                )}
                <div className="grow overflow-hidden">
                  <h3 className="flex flex-wrap items-center text-lg font-semibold text-foreground">
                    <span className="break-all">
                      {truncateString(item.title, 50)}
                    </span>
                  </h3>
                </div>
              </div>
              {item.description && (
                <p className="text-base text-secondary-foreground">
                  {item.description}
                </p>
              )}
              {item?.type === "link" && (
                <p className="ml-7 text-sm text-secondary-foreground">
                  {truncateString(
                    (item?.metadata?.url || "").replace(
                      /^https?:\/\/(www\.)?/,
                      ""
                    ),
                    30
                  )}
                </p>
              )}
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default ItemsList
