import { Schedule } from "@/hooks/api/schedules/use-schedules";
import { createContext, useContext, useReducer } from "react";

export type ScheduleContextState = {
  isModalOpen: boolean;
  schedule?: Schedule;
  mode: "create" | "edit";
};

export type ScheduleContextAction =
  | {
      type: "OPEN_MODAL";
    }
  | {
      type: "CLOSE_MODAL";
    }
  | {
      type: "OPEN_EDIT_MODAL";
      payload: Schedule;
    };

export type ScheduleContextProviderProps = {
  children: React.ReactNode;
};

export type ScheduleContextType = {
  isModalOpen: boolean;
  openModal: (mode: ScheduleContextState["mode"], schedule?: Schedule) => void;
  closeModal: () => void;
  schedule?: Schedule;
  mode: ScheduleContextState["mode"];
};

export const ScheduleContext = createContext<ScheduleContextType | null>(null);

const initialArg: ScheduleContextState = {
  isModalOpen: false,
  schedule: undefined,
  mode: "create",
};

const reducer = (
  state: ScheduleContextState,
  action: ScheduleContextAction
): ScheduleContextState => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        mode: "create",
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        schedule: undefined,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isModalOpen: true,
        schedule: action.payload,
        mode: "edit",
      };
    default:
      return state;
  }
};

export const ScheduleContextProvider: React.FC<
  ScheduleContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const handleModalOpen = (
    mode: ScheduleContextState["mode"],
    schedule?: Schedule
  ) => {
    if (mode === "edit" && schedule) {
      dispatch({ type: "OPEN_EDIT_MODAL", payload: schedule });
      return;
    }

    dispatch({ type: "OPEN_MODAL" });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const value: ScheduleContextType = {
    isModalOpen: state.isModalOpen,
    openModal: handleModalOpen,
    closeModal: handleModalClose,
    schedule: state.schedule,
    mode: state.mode,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error(
      "useScheduleContext must be used within a ScheduleContextProvider"
    );
  }

  return context;
};
