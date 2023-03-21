import React, { useReducer } from 'react';
import Container from './scripts/container/container';
import './styles/store.css';

import reducer from './scripts/reducers/storeReducer';

export const StoreContext = React.createContext();

function App() {

  const initValue = {
    pageSize: 10,
    products: [],
    filteredProduct: [],
    tableViewProducts: [],
    header: [],
    showTable: false,
    editTable: false,
    selectedProduct: {},
    currentPage: 1,
    tableSize: 0
  };

  const [store, dispatch] = useReducer(reducer, initValue);

  return (
    <StoreContext.Provider value={{store, dispatch}}>
      <div className="App">
        <Container />
        {/* {store.pageSize} */}
      </div>
    </StoreContext.Provider>
  );
}

export default App;
