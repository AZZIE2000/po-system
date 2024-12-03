"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import React, { useEffect } from "react";
const initState = {
  semantic: {
    chunking_strategy: "semantic",
    breakpoint_threshold_type: "percentile",
  },
};
const formObj = [
  {
    name: "chunking_strategy",
    type: "select",
    values: [
      {
        semantic: [
          {
            type: "select",
            name: "breakpoint_threshold_type",
            values: [
              "percentile", // default
              "standard_deviation",
              "interquartile",
              "gradient",
            ],
          },
        ],
        CharacterTextSplitter: [
          {
            type: "number",
            name: "chunk_size",
            value: 1000,
          },
          {
            type: "number",
            name: "chunk_overlap",
            value: 1000,
          },
          {
            type: "string",
            name: "separator",
            value: "\n\n",
          },
        ],
        RecursiveCharacterTextSplitter: [
          {
            type: "number",
            name: "chunk_size",
            value: 1000,
          },
          {
            type: "number",
            name: "chunk_overlap",
            value: 1000,
          },
          {
            type: "multi-select",
            name: "separators",
            value: [],
          },
          {
            type: "select",
            name: "keep_separator",
            values: [true, false, "start", "end"],
          },
        ],
        SentenceTransformersTokenTextSplitter: [
          {
            type: "number",
            name: "chunk_size",
            value: 1000,
          },
          {
            type: "number",
            name: "chunk_overlap",
            value: 50,
          },
          {
            type: "number",
            name: "tokens_per_chunk",
            value: 0,
          },
          {
            type: "select",
            name: "model_name",
            values: ["sentence-transformers/all-mpnet-base-v2"],
          },
        ],
        TokenTextSplitter: [
          {
            type: "number",
            name: "chunk_size",
            value: 1000,
          },
          {
            type: "number",
            name: "chunk_overlap",
            value: 200,
          },
        ],
      },
    ],
  },
];

interface DynamicFormI {
  form: any;
  tempState: Record<string, string | number>;
  //   setState: (value: string | number, key: string) => void;
}

const Page = ({ tempState = {} }: DynamicFormI) => {
  const [state, setState] = React.useState(tempState);
  useEffect(() => {
    setState(tempState);
  }, []);
  useEffect(() => {
    console.log(state);
  }, [state]);
  const setMainState = (value: string | number, key: string) => {
    console.log(value, key);

    setState({
      ...state,
      [key]: value,
    });
  };
  return (
    <div className="grid grid-cols-1">
      <RenderForm arrObj={formObj} setState={setMainState} state={state} />
    </div>
  );
};

const RenderForm = ({
  arrObj,
  setState,
  state,
}: {
  arrObj: any[];
  state: Record<string, string | number>;
  setState: (value: string | number, key: string) => void;
}) => {
  if (!arrObj || !arrObj.length) {
    return null;
  }

  return (
    <div className="col-span-1 grid grid-cols-1">
      {arrObj.map((obj, i) => {
        console.log(obj);
        if (
          obj.type === "select" &&
          "values" in obj &&
          typeof obj?.values[0] === "object"
        ) {
          console.count();
          console.log(obj);
          console.log(state[obj.name]);
          console.log(obj.values[0]?.[state[obj.name] || ""]);

          return (
            <div>
              <Label>{obj.name.split("_").join(" ").toUpperCase()}</Label>
              <Select
                value={state?.[obj.name] as any}
                onValueChange={(value) => {
                  setState(value, obj.name);
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={"Select " + obj.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(obj.values[0])?.map((val, i) => (
                      <SelectItem key={i} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {state[obj.name] && (
                <>
                  <RenderForm
                    arrObj={obj.values[0]?.[state[obj.name] || ""] || []}
                    setState={setState}
                    state={state}
                  />
                </>
              )}
            </div>
          );
        }
        if (obj.type === "select" && typeof obj.values[0] !== "object") {
          return (
            <div>
              <Label>{obj.name.split("_").join(" ").toUpperCase()}</Label>
              <Select
                value={state[obj.name] as any}
                onValueChange={(value) => {
                  setState(value, obj.name);
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={"Select " + obj.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {obj.name.split("_").join(" ").toUpperCase()}
                    </SelectLabel>
                    {obj.values?.map((val: any, i: number) => (
                      <SelectItem key={i} value={val}>
                        {val.toString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          );
        }
        if (obj.type === "string" || obj.type === "number") {
          return (
            <div>
              <Label>{obj.name.split("_").join(" ").toUpperCase()}</Label>
              <Input
                type={obj.type}
                value={
                  typeof state[obj.name] === "string"
                    ? state[obj.name] || ""
                    : state[obj.name] || 0
                }
                onChange={(e) => {
                  setState(e.target.value, obj.name);
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default Page;
