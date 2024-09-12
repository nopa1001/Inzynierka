import { Department } from "@/hooks/api/departments/use-departments";
import { createContext, useContext, useReducer } from "react";

export type DepartmentsContextState = {
  isModalOpen: boolean;
  department?: Department;
  mode: "create" | "edit";
};

export type DepartmentsContextAction =
  | {
      type: "OPEN_MODAL";
    }
  | {
      type: "CLOSE_MODAL";
    }
  | {
      type: "OPEN_EDIT_MODAL";
      payload: Department;
    };

export type DepartmentsContextProviderProps = {
  children: React.ReactNode;
};

export type DepartmentsContextType = {
  isModalOpen: boolean;
  openModal: (
    mode: DepartmentsContextState["mode"],
    department?: Department
  ) => void;
  closeModal: () => void;
  department?: Department;
  mode: DepartmentsContextState["mode"];
};

export const DepartmentsContext = createContext<DepartmentsContextType | null>(
  null
);

const initialArg: DepartmentsContextState = {
  isModalOpen: false,
  department: undefined,
  mode: "create",
};

const reducer = (
  state: DepartmentsContextState,
  action: DepartmentsContextAction
): DepartmentsContextState => {
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
        department: undefined,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isModalOpen: true,
        department: action.payload,
        mode: "edit",
      };
    default:
      return state;
  }
};

export const DepartmentsContextProvider: React.FC<
  DepartmentsContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const handleModalOpen = (
    mode: DepartmentsContextState["mode"],
    department?: Department
  ) => {
    if (mode === "edit" && department) {
      dispatch({ type: "OPEN_EDIT_MODAL", payload: department });
      return;
    }

    dispatch({ type: "OPEN_MODAL" });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const value: DepartmentsContextType = {
    isModalOpen: state.isModalOpen,
    openModal: handleModalOpen,
    closeModal: handleModalClose,
    department: state.department,
    mode: state.mode,
  };

  return (
    <DepartmentsContext.Provider value={value}>
      {children}
    </DepartmentsContext.Provider>
  );
};

export const useDepartmentsContext = () => {
  const context = useContext(DepartmentsContext);

  if (!context) {
    throw new Error(
      "useDepartmentsContext must be used within a DepartmentsContextProvider"
    );
  }

  return context;
};
