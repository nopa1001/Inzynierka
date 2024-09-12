import { Position } from "@/hooks/api/positions/use-positions";
import { createContext, useContext, useReducer } from "react";

export type PositionsContextState = {
  isModalOpen: boolean;
  position?: Position;
  mode: "create" | "edit";
};

export type PositionsContextAction =
  | {
      type: "OPEN_MODAL";
    }
  | {
      type: "CLOSE_MODAL";
    }
  | {
      type: "OPEN_EDIT_MODAL";
      payload: Position;
    };

export type PositionsContextProviderProps = {
  children: React.ReactNode;
};

export type PositionsContextType = {
  isModalOpen: boolean;
  openModal: (mode: PositionsContextState["mode"], position?: Position) => void;
  closeModal: () => void;
  position?: Position;
  mode: PositionsContextState["mode"];
};

export const PositionsContext = createContext<PositionsContextType | null>(
  null
);

const initialArg: PositionsContextState = {
  isModalOpen: false,
  position: undefined,
  mode: "create",
};

const reducer = (
  state: PositionsContextState,
  action: PositionsContextAction
): PositionsContextState => {
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
        position: undefined,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isModalOpen: true,
        position: action.payload,
        mode: "edit",
      };
    default:
      return state;
  }
};

export const PositionsContextProvider: React.FC<
  PositionsContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const handleModalOpen = (
    mode: PositionsContextState["mode"],
    position?: Position
  ) => {
    if (mode === "edit" && position) {
      dispatch({ type: "OPEN_EDIT_MODAL", payload: position });
      return;
    }

    dispatch({ type: "OPEN_MODAL" });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const value: PositionsContextType = {
    isModalOpen: state.isModalOpen,
    openModal: handleModalOpen,
    closeModal: handleModalClose,
    position: state.position,
    mode: state.mode,
  };

  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
};

export const usePositionsContext = () => {
  const context = useContext(PositionsContext);

  if (!context) {
    throw new Error(
      "usePositionsContext must be used within a PositionsContextProvider"
    );
  }

  return context;
};
