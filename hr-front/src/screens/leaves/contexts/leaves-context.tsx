import { Leave } from "@/hooks/api/leaves/use-leaves";
import { createContext, useContext, useReducer } from "react";

export type LeavesContextState = {
  isModalOpen: boolean;
  leave?: Leave;
  mode: "create" | "edit";
};

export type LeavesContextAction =
  | {
      type: "OPEN_MODAL";
    }
  | {
      type: "CLOSE_MODAL";
    }
  | {
      type: "OPEN_EDIT_MODAL";
      payload: Leave;
    };

export type LeavesContextProviderProps = {
  children: React.ReactNode;
};

export type LeavesContextType = {
  isModalOpen: boolean;
  openModal: (mode: LeavesContextState["mode"], leave?: Leave) => void;
  closeModal: () => void;
  leave?: Leave;
  mode: LeavesContextState["mode"];
};

export const LeavesContext = createContext<LeavesContextType | null>(null);

const initialArg: LeavesContextState = {
  isModalOpen: false,
  leave: undefined,
  mode: "create",
};

const reducer = (
  state: LeavesContextState,
  action: LeavesContextAction
): LeavesContextState => {
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
        leave: undefined,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isModalOpen: true,
        leave: action.payload,
        mode: "edit",
      };
    default:
      return state;
  }
};

export const LeavesContextProvider: React.FC<LeavesContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const handleModalOpen = (mode: LeavesContextState["mode"], leave?: Leave) => {
    if (mode === "edit" && leave) {
      dispatch({ type: "OPEN_EDIT_MODAL", payload: leave });
      return;
    }

    dispatch({ type: "OPEN_MODAL" });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const value: LeavesContextType = {
    isModalOpen: state.isModalOpen,
    openModal: handleModalOpen,
    closeModal: handleModalClose,
    leave: state.leave,
    mode: state.mode,
  };

  return (
    <LeavesContext.Provider value={value}>{children}</LeavesContext.Provider>
  );
};

export const useLeavesContext = () => {
  const context = useContext(LeavesContext);

  if (!context) {
    throw new Error(
      "useLeavesContext must be used within a LeavesContextProvider"
    );
  }

  return context;
};
