"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

import Image from "next/image"

import TextEditor from "../atoms/Editor"
import ChevronLeftIcon from "@/public/icons/chevronleft.svg"
import { useAuth } from "@/src/contexts/AuthContext"
import useEditorHook from "@/src/hooks/useEditor.hook"
import useReadingStore from "@/src/lib/store/reading.store"
import { formatDateYear, fromNow } from "@/src/utils/datetime"

interface EditedItem {
  title: string
}

interface TimeoutRefs {
  title: ReturnType<typeof setTimeout> | null
  editor: ReturnType<typeof setTimeout> | null
}

const SAVE_DELAY = {
  TITLE: 500,
  CONTENT: 500,
} as const

interface ModalProps {
  blockId: string
  spaceId: string
}

export const ReadingExpandModal: React.FC<ModalProps> = ({
  blockId,
  spaceId,
}) => {
  const { session } = useAuth()
  const { currentItem, setCurrentItem, deleteItem, updateItem } =
    useReadingStore()

  const textareaRefTitle = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const timeoutRefs = useRef<TimeoutRefs>({
    title: null,
    editor: null,
  })
  const lastSavedContent = useRef(currentItem?.description || "<p></p>")

  // state
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [editedItem, setEditedItem] = useState<EditedItem>({ title: "" })
  const [content, setContent] = useState(currentItem?.description || "<p></p>")
  const [isSaved, setIsSaved] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // memoized handlers
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    const hasChanged = newContent !== lastSavedContent.current
    setHasUnsavedChanges(hasChanged)
    setIsSaved(!hasChanged)
  }, [])

  const handleClose = useCallback(() => {
    setCurrentItem(null)
    setEditItemId(null)
    setEditedItem({ title: "" })
  }, [setCurrentItem])

  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      if (id) {
        deleteItem(session, spaceId, blockId, id)
        handleClose()
      }
    },
    [deleteItem, session, handleClose]
  )

  const handleSaveEditedItem = useCallback(
    async (item: typeof currentItem) => {
      if (!item?._id || !editItemId) return

      try {
        await updateItem(session, spaceId, blockId, item._id, {
          title: editedItem.title,
        })
      } catch (error) {
        console.error("Error updating item:", error)
      }
    },
    [session, updateItem, editItemId, editedItem.title]
  )

  // editor setup
  const editor = useEditorHook({
    content,
    setContent: handleContentChange,
    setIsSaved,
  })

  // handle editor content updates with debounce
  const saveContent = useCallback(() => {
    if (!currentItem?._id || content === lastSavedContent.current) return

    updateItem(session, spaceId, blockId, currentItem._id, {
      description: content,
    })
    lastSavedContent.current = content
    setHasUnsavedChanges(false)
    setIsSaved(true)
  }, [content, currentItem, session, updateItem])

  // effect to handle content auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return

    if (timeoutRefs.current.editor) {
      clearTimeout(timeoutRefs.current.editor)
    }

    timeoutRefs.current.editor = setTimeout(saveContent, SAVE_DELAY.CONTENT)

    return () => {
      if (timeoutRefs.current.editor) {
        clearTimeout(timeoutRefs.current.editor)
      }
    }
  }, [hasUnsavedChanges, saveContent])

  // effect to initialize editor when currentItem changes
  useEffect(() => {
    if (!currentItem) return

    const newContent = currentItem.description || "<p></p>"

    if (currentItem._id !== editItemId) {
      setEditItemId(currentItem._id)
      setEditedItem({ title: currentItem.title || "" })
      setContent(newContent)
      lastSavedContent.current = newContent

      if (editor?.commands) {
        editor.commands.setContent(newContent)
        editor.commands.focus()
      }
    }
  }, [currentItem, editItemId, editor])

  // effect to handle title auto-save
  useEffect(() => {
    if (!currentItem || editedItem.title === currentItem.title) return

    if (timeoutRefs.current.title) {
      clearTimeout(timeoutRefs.current.title)
    }

    timeoutRefs.current.title = setTimeout(() => {
      handleSaveEditedItem(currentItem)
    }, SAVE_DELAY.TITLE)

    return () => {
      if (timeoutRefs.current.title) {
        clearTimeout(timeoutRefs.current.title)
      }
    }
  }, [editedItem.title, currentItem, handleSaveEditedItem])

  // effect to handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRefTitle.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [editedItem.title])

  // effect to handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isClickOnItem = target.closest("[data-item-id]") !== null
      const isTipTapClick = [".tippy-box", ".tiptap", "[data-tippy-root]"].some(
        (selector) => target.closest(selector) !== null
      )

      if (
        divRef.current &&
        !divRef.current.contains(target) &&
        !isClickOnItem &&
        !isTipTapClick
      ) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClose])

  // memoized handler for textarea keydown
  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter") return

      e.preventDefault()

      if (e.shiftKey) {
        const textarea = e.currentTarget
        const cursorPosition = textarea.selectionStart
        const newValue =
          editedItem.title.slice(0, cursorPosition) +
          "\n" +
          editedItem.title.slice(cursorPosition)

        setEditedItem((prev) => ({ ...prev, title: newValue }))

        requestAnimationFrame(() => {
          textarea.selectionStart = cursorPosition + 1
          textarea.selectionEnd = cursorPosition + 1
        })
      } else if (editor) {
        editor.commands.focus()
        editor.commands.setTextSelection(0)
      }
    },
    [editedItem.title, editor]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditedItem((prev) => ({
        ...prev,
        title: e.target.value,
      }))
    },
    []
  )

  if (currentItem) {
    return (
      <div>
        <div
          className="fixed inset-0 z-50 cursor-default bg-black/80"
          role="button"
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Esc") {
              handleClose()
            }
          }}
          tabIndex={0}
        ></div>
        <div className="fixed left-1/2 top-1/2 z-50 h-4/5 w-3/5 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg bg-background p-10 shadow-lg">
          <div>
            <div
              ref={divRef}
              className="flex size-full flex-col gap-4 text-foreground"
            >
              <div className="flex items-center gap-4 text-xs text-secondary-foreground">
                <button
                  className="group/button flex items-center"
                  onClick={handleClose}
                >
                  <Image
                    src={ChevronLeftIcon}
                    alt="chevron left icon"
                    width={16}
                    height={16}
                    className="opacity-50 group-hover/button:opacity-100"
                  />
                </button>
                {/* <p className="flex items-center">
                  {formatDateYear(currentItem.createdAt)}
                </p>
                <p>edited {fromNow(currentItem.updatedAt)}</p> */}
                <button
                  className="hover-text flex w-fit items-center"
                  onClick={(e) => handleDelete(e, currentItem._id)}
                >
                  <span>del</span>
                </button>
              </div>
              <div className="flex items-center">
                <textarea
                  ref={textareaRefTitle}
                  value={editedItem.title}
                  onChange={(e) => handleTitleChange(e)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="title"
                  className="w-full resize-none overflow-hidden truncate whitespace-pre-wrap break-words bg-background text-base font-semibold text-foreground outline-none placeholder:text-secondary-foreground focus:outline-none"
                  rows={1}
                />
              </div>
              <div className="mt-1 text-foreground">
                <TextEditor editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
