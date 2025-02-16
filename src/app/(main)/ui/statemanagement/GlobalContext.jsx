// GlobalStateContext.js
'use client'
import React, { createContext, useState } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [isToggled, setIsToggled] = useState(false);

    const toggleState = () => {
        setIsToggled(prevState => !prevState);
    };

    return (
        <GlobalStateContext.Provider value={{ isToggled, toggleState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
