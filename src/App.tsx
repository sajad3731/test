import type { FC } from "react";
import { Button } from "./components/button";
import { Form } from "./components/form";

export const App: FC = () => {
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="my-10">
        <Button />
      </div>
      <hr className="min-w-full" />
      <Form />
    </div>
  );
};
