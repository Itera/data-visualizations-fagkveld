import React, { FC } from "react";
import { Navigation } from "./Navigation";

export const ExamplePage: FC = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};
