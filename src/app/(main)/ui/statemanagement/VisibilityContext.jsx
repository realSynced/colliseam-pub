// app/home/statemanagement/VisibilityContext.js
'use client';

import { createContext, useContext, useState } from 'react';

const VisibilityContext = createContext();

export function VisibilityProvider({ children }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = (visibility) => {
        setIsVisible(visibility);
    };
    return (
        <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
            {children}
        </VisibilityContext.Provider>
    );
}

export function useVisibility() {
    return useContext(VisibilityContext);
}
