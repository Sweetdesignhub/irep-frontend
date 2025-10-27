
import { createContext, useState } from "react";

const DbConfigContext = createContext();

const DbConfigProvider = ({ children }) => {
  const [dbConfig, setDbConfig] = useState();
  const [isSourceConfigured, setIsSourceConfigured] = useState(false);

  const setConfig = (data) => {
    setDbConfig(data);
    console.log("Changed");
  };

  const gotDatabaseDetails = () => {
    console.log("-------Changed----------");
    setIsSourceConfigured(true);
  };

  return (
    <DbConfigContext.Provider
      value={{
        dbConfig,
        setConfig,
        gotDatabaseDetails,
        isSourceConfigured
      }}
    >
      {children}
    </DbConfigContext.Provider>
  );
};

export { DbConfigContext, DbConfigProvider };
