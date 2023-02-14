import { User } from "@mwelwa/server";
import React from "react";
import { useEffect, useState } from "react";
import { trpc } from "./utils";

type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  name: string;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({
  onChange,
  value,
  name = "",
  placeholder = `Enter your ${name}`,
}) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default function App() {
  const [data, setData] = useState<User[]>();
  const [newUser, setNewUser] = useState<User>(() => ({
    id: 0,
    age: 0,
    name: "",
  }));

  useEffect(() => {
    (async () => {
      try {
        const response = await trpc.sayNames.query();
        setData(response.users);
      } catch (error) {}
    })();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newUser) return alert("name ana age are required");

          const newReturnedUser = await trpc.addName.mutate({
            id: 0,
            name: newUser?.name!,
            age: newUser?.age!,
          });

          setNewUser({ id: 0, name: "", age: 0 });
          setData([...data, newReturnedUser]);
        }}
      >
        <Input
          name="name"
          value={newUser?.name!}
          onChange={(e) => {
            setNewUser((u) => ({
              id: 0,
              age: u?.age || 0,
              name: e.target.value,
            }));
          }}
        />
        <Input
          name="age"
          value={newUser?.age!}
          onChange={(e) => {
            setNewUser((u) => ({
              id: 0,
              age: parseInt(e.target.value || "0"),
              name: u.name,
            }));
          }}
        />
        <input type="submit" value="Send User" />
      </form>
      <h1>Current Value</h1>
      <pre className="App">{JSON.stringify(newUser, null, 2)}</pre>
      <h1>Server Values</h1>
      {data.map(({ id, age, name }) => (
        <div key={id}>
          <li>
            id:{id} {age} year old, @{name}
            <button
              onClick={async () => {
                await trpc.removeName.mutate({ id });
              }}
            >
              Delete
            </button>
          </li>
        </div>
      ))}
    </div>
  );
}
