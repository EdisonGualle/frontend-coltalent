import React from 'react';

const AppWrapper = ({ children }) => (
  <div className="backdrop-blur-sm">{children}</div>
);

export default AppWrapper;