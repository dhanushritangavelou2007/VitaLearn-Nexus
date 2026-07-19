import { useContext } from "react";
import { StudentContext } from "../context/studentContextValue";

export function useStudents() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }

  return context;
}
