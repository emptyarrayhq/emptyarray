import { Meet } from "@/src/lib/@types/Items/Meet"

export interface MeetState {
  meet: Meet | null
  title: string
  content: string
  isSaved: boolean
  isLoading: boolean
  notFound: boolean
  closeToggle: boolean
  isInitialLoad: boolean
  isEditingTitle: boolean
}

type Action =
  | { type: "SET_MEET"; payload: Meet }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_CONTENT"; payload: string }
  | { type: "SET_SAVED"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_NOT_FOUND"; payload: boolean }
  | { type: "SET_CLOSED"; payload: boolean }
  | { type: "SET_INITIAL_LOAD"; payload: boolean }
  | { type: "SET_EDITING_TITLE"; payload: boolean }

const initialState: MeetState = {
  meet: null,
  title: "",
  content: "<p></p>",
  isSaved: true,
  isLoading: false,
  notFound: false,
  closeToggle: true,
  isInitialLoad: true,
  isEditingTitle: false,
}

const meetsReducer = (state: MeetState, action: Action): MeetState => {
  switch (action.type) {
    case "SET_MEET":
      return { ...state, meet: action.payload }
    case "SET_TITLE":
      return { ...state, title: action.payload }
    case "SET_CONTENT":
      return { ...state, content: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_SAVED":
      return { ...state, isSaved: action.payload }
    case "SET_NOT_FOUND":
      return { ...state, notFound: action.payload }
    case "SET_CLOSED":
      return { ...state, closeToggle: action.payload }
    case "SET_INITIAL_LOAD":
      return { ...state, isInitialLoad: action.payload }
    case "SET_EDITING_TITLE":
      return { ...state, isEditingTitle: action.payload }
    default:
      return state
  }
}

export { initialState, meetsReducer }
