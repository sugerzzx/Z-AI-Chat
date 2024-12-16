import PageHeader from "../page/PageHeader";
import ExampleArea from "./ExampleArea";

const ExampleComp = ({}) => {
  return (
    <div className="relative h-full">
      <div className="absolute left-0 right-0">
        <PageHeader />
      </div>
      <ExampleArea />
    </div>
  );
};

export default ExampleComp;
