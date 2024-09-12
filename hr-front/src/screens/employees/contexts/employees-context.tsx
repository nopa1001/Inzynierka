import { UserResponse } from "@/hooks/api/user/use-user";
import { createContext, useContext, useReducer } from "react";

export type EmployeesContextState = {
  isModalOpen: boolean;
  employee?: UserResponse;
  mode: "create" | "edit";
};

export type EmployeesContextAction =
  | {
      type: "OPEN_MODAL";
    }
  | {
      type: "CLOSE_MODAL";
    }
  | {
      type: "OPEN_EDIT_MODAL";
      payload: UserResponse;
    };

export type EmployeesContextProviderProps = {
  children: React.ReactNode;
};

export type EmployeesContextType = {
  isModalOpen: boolean;
  openModal: (
    mode: EmployeesContextState["mode"],
    employee?: UserResponse
  ) => void;
  closeModal: () => void;
  employee?: UserResponse;
  mode: EmployeesContextState["mode"];
};

export const EmployeesContext = createContext<EmployeesContextType | null>(
  null
);

const initialArg: EmployeesContextState = {
  isModalOpen: false,
  employee: undefined,
  mode: "create",
};

const reducer = (
  state: EmployeesContextState,
  action: EmployeesContextAction
): EmployeesContextState => {
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
        employee: undefined,
      };
    case "OPEN_EDIT_MODAL":
      return {
        ...state,
        isModalOpen: true,
        employee: action.payload,
        mode: "edit",
      };
    default:
      return state;
  }
};

export const EmployeesContextProvider: React.FC<
  EmployeesContextProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialArg);

  const handleModalOpen = (
    mode: EmployeesContextState["mode"],
    employee?: UserResponse
  ) => {
    if (mode === "edit" && employee) {
      dispatch({ type: "OPEN_EDIT_MODAL", payload: employee });
      return;
    }

    dispatch({ type: "OPEN_MODAL" });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const value: EmployeesContextType = {
    isModalOpen: state.isModalOpen,
    openModal: handleModalOpen,
    closeModal: handleModalClose,
    employee: state.employee,
    mode: state.mode,
  };

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployeesContext = () => {
  const context = useContext(EmployeesContext);

  if (!context) {
    throw new Error(
      "useEmployeesContext must be used within a EmployeesContextProvider"
    );
  }

  return context;
};
