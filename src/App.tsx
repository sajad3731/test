import type { FC } from "react";
import { Button } from "./components/button";
import { Form } from "./components/form";

export const App: FC = () => {
  return (
    <div className="">
      <Button />
      <hr />
      <Form />
    </div>
  );
};
