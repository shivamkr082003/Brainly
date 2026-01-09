import { useContext, createContext,useState } from "react";

interface FilterType {
  filter: string;
  setFilter: (filter: string) => void;
}

const FilterContext = createContext<FilterType | undefined>(undefined);

export const FilterProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [filter, setFilter] = useState<string>("all"); 
  
    return (
      <FilterContext.Provider value={{ filter, setFilter }}>
        {children}
      </FilterContext.Provider>
    );
  };


  export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
      throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
  };