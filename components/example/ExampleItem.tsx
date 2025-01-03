import IdeaSvg from "../svg/IdeaSvg";

const ExampleItem = ({}) => {
  return (
    <button className="relative flex w-40 flex-col gap-2 rounded-2xl border border-token-border-light px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-xxs transition enabled:hover:bg-secondary disabled:cursor-not-allowed">
      <IdeaSvg />
      <div className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-gray-500 break-all">
        用我最喜欢的体裁写一个故事
      </div>
    </button>
  );
};

export default ExampleItem;
