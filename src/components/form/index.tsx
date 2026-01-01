import { useState } from "react";
import { Tab } from "./components/tab";
import { useForm } from "react-hook-form";

export const Form = () => {
  const [selectedTab, setSelectedTab] = useState("buy");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ name: string; email: string; age: number }>()
  const onSubmit = (data:any) => console.log(data)

  return (
    <div className="w-96 m-auto my-10 border rounded-lg p-3 flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="flex flex-col gap-4">
          <input className="border rounded-lg p-2" />
          <input className="border rounded-lg p-2" />
          <input className="border rounded-lg p-2" />
        </div>
      </form>
    </div>
  );
};
