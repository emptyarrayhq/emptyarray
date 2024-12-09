import { NoteLink } from "../NoteLink"
import NoteDetails from "@/src/components/header/note-details"
import { formatDateHeader } from "@/src/utils/datetime"

interface SimplifiedNote {
  id: string
  title: string
  href: string
  createdAt: string
  isActive: boolean
  onDelete?: (id: string) => void
}

interface ModalProps {
  notes: SimplifiedNote[]
  handleClose: () => void
}

export const StackModal = ({ notes, handleClose }: ModalProps) => {
  return (
    <div>
      <div
        className="fixed inset-0 z-50 cursor-default"
        role="button"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Esc") {
            handleClose()
          }
        }}
        tabIndex={0}
      />
      <div className="fixed right-[150px] top-[38%] z-50 h-[535px] w-[371px] -translate-y-1/2 overflow-y-scroll rounded-lg border border-border bg-background p-6">
        <div className="flex flex-col gap-2">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col items-start justify-between"
            >
              <NoteLink note={note} isActive={note.isActive} />
              <div className="pl-5 text-secondary-foreground">
                <NoteDetails
                  createdAt={note.createdAt}
                  formatDateHeader={formatDateHeader}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
