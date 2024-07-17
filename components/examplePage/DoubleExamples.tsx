import { FC } from "react";
import Example from "./Example";

interface DoubleExamplesProps {}

const DoubleExamples: FC<DoubleExamplesProps> = ({}) => {
  return (
    <div className="flex max-w-3xl flex-wrap items-stretch justify-center gap-4">
      <Example />
      <Example />
    </div>
  );
};

export default DoubleExamples;
