import axios from "axios"
import { create } from "zustand"

import { BACKEND_URL } from "../constants/urls"
import { type ReadingItem } from "@/src/lib/@types/Items/Reading"

export interface ReadingStoreType {
  readingItems: ReadingItem[]
  currentItem: ReadingItem | null
  setCurrentItem: (item: ReadingItem | null) => void
  isFetched: boolean

  setIsFetched: (isFetched: boolean) => void
  fetchReadingList: (
    session: string,
    spaceId: string,
    blockId: string
  ) => Promise<void>
  setReadingItems: (items: ReadingItem[]) => void
  addItem: (
    session: string,
    blockId: string,
    spaceId: string,
    itemData: ItemData
  ) => Promise<void>
  updateItem: (
    session: string,
    blockId: string,
    spaceId: string,
    itemId: string,
    itemData: ItemData
  ) => Promise<void>
  deleteItem: (
    session: string,
    spaceId: string,
    blockId: string,
    itemId: string
  ) => Promise<void>
}

interface ItemData {
  title?: string
  type?: string
  description?: string
  status?: string
  dueDate?: Date | null
  cycle?: {
    startsAt: string | null
    endsAt: string | null
  }
  metadata?: {
    url: string
  }
}

const useReadingStore = create<ReadingStoreType>((set, get) => ({
  readingItems: [],
  currentItem: null,
  isFetched: false,

  setCurrentItem: (item: ReadingItem | null) => {
    set({ currentItem: item })
  },

  setIsFetched: (isFetched: boolean) => set({ isFetched }),

  fetchReadingList: async (
    session: string,
    spaceId: string,
    blockId: string
  ) => {
    if (!blockId || !spaceId) {
      console.warn("fetchReadingList: No blockId or spaceId provided")
      set({ isFetched: true, readingItems: [] })
      return
    }

    set({ isFetched: false })

    try {
      const response = await axios.get(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )

      set({
        readingItems: response.data.items,
        isFetched: true,
      })
    } catch (error) {
      console.error("Error fetching reading list:", error)
      set({ isFetched: true, readingItems: [] })
    }
  },

  setReadingItems: (items: ReadingItem[]) => set({ readingItems: items }),
  addItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    itemData: ItemData
  ) => {
    const { readingItems } = get()
    try {
      const createResponse = await axios.post(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/`,
        itemData,
        { headers: { Authorization: `Bearer ${session}` } }
      )

      const createdItem = createResponse.data.item
      const updatedItems = readingItems.map((item) => item._id)

      updatedItems.push(createdItem._id)

      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/`,
        { data: { items: updatedItems } },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      set((state) => ({
        readingItems: [...state.readingItems, createdItem],
      }))
    } catch (error) {
      console.error("Error adding item:", error)
    }
  },
  updateItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    itemId: string,
    itemData: ItemData
  ) => {
    try {
      console.log(`itemId: ${itemId}`)
      const updateResponse = await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${itemId}`,
        itemData,
        { headers: { Authorization: `Bearer ${session}` } }
      )
      const updatedItem = updateResponse.data.item
      if (updatedItem) {
        set((state) => ({
          readingItems: state.readingItems.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }))
      }
    } catch (error) {
      console.error("Error updating item:", error)
    }
  },
  deleteItem: async (
    session: string,
    spaceId: string,
    blockId: string,
    itemId: string
  ) => {
    const { readingItems } = get()
    try {
      // Perform the delete operation on the server
      await axios.put(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items/${itemId}/`,
        { isDeleted: true },
        { headers: { Authorization: `Bearer ${session}` } }
      )

      // After successful deletion, update the local state
      set((state) => ({
        readingItems: state.readingItems.filter((item) => item._id !== itemId),
      }))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  },
}))

export default useReadingStore
