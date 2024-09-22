import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, memo, useState, FC, SetStateAction } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-react";
import ArrowTooltip from "../ui/ArrowTooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/constant/queryKey.enum";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

interface TitleProps {
  id: string;
  title: string;
  isCurrent: boolean;
}

const Title = forwardRef<HTMLDivElement, TitleProps>(({ id, title, isCurrent }, ref) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelDialogOpen, setIsDelDialogOpen] = useState(false);
  const isActive = isCurrent || isMenuOpen;
  const queryClient = useQueryClient();

  const deleteConversation = () =>
    fetch(`/api/conversation/${id}`, {
      method: "DELETE",
    });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Conversations] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  return (
    <>
      <div
        ref={ref}
        onDoubleClick={handleDoubleClick}
        className={cn(
          "group relative rounded-lg active:opacity-90",
          isActive ? "bg-secondary" : "hover:bg-secondary",
        )}
      >
        <Link href={`/c/${id}`} className="flex items-center gap-2 p-2">
          <div className="relative grow overflow-hidden whitespace-nowrap" dir="auto">
            {currentTitle}
            <div
              className={cn(
                "absolute bottom-0 top-0 to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r w-10 ",
                isActive
                  ? "from-[hsl(var(--secondary))] from-50%"
                  : "from-[hsl(var(--background))] from-20% group-hover:from-[hsl(var(--secondary))] group-hover:from-50%",
              )}
            ></div>
          </div>
        </Link>
        <div
          className={cn(
            "absolute bottom-0 top-0 items-center gap-1.5 pr-2 ltr:right-0 rtl:left-0",
            isActive ? "flex" : "hidden group-hover:flex",
            isEdit && "flex left-0",
          )}
        >
          {isEdit ? (
            <div className="absolute bottom-0 left-[7px] right-2 top-0 flex items-center">
              <TitleEdit
                id={id}
                title={currentTitle}
                setIsEdit={setIsEdit}
                setCurrentTitle={setCurrentTitle}
              />
            </div>
          ) : (
            <DropdownMenu onOpenChange={(newVal) => setIsMenuOpen(newVal)}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="hover:bg-transparent absolute ltr:right-0 rtl:left-0 flex items-center justify-center text-muted-foreground transition hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <ArrowTooltip title="选项" side="top">
                    <Ellipsis size={20} />
                  </ArrowTooltip>
                </Button>
              </DropdownMenuTrigger>
              {
                <DropdownMenuContent
                  align="start"
                  className={isMenuOpen ? "" : "opacity-0"}
                  onCloseAutoFocus={() => setIsMenuOpen(false)}
                >
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEdit(true)}>
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive data-[highlighted]:text-destructive"
                    onClick={() => setIsDelDialogOpen(true)}
                  >
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              }
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="absolute">
        <DeleteDialog
          open={isDelDialogOpen}
          setOpen={setIsDelDialogOpen}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
});

Title.displayName = "Title";
export default memo(Title);

interface DeleteDialogProps {
  open?: boolean;
  setOpen: (open: boolean) => void;
  handleDelete?: () => void;
}

const DeleteDialog: FC<DeleteDialogProps> = ({ open, setOpen, handleDelete }) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger />
    <AlertDialogContent setOpen={setOpen}>
      <AlertDialogHeader>
        <AlertDialogTitle>删除聊天？</AlertDialogTitle>
        <AlertDialogDescription>这将会删除此聊天，且不可恢复。</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const TitleEdit: FC<{
  title: string;
  id: string;
  setIsEdit: (value: SetStateAction<boolean>) => void;
  setCurrentTitle: (value: SetStateAction<string>) => void;
}> = ({ title, id, setIsEdit, setCurrentTitle }) => {
  const [inputValue, setInputValue] = useState(title);
  const queryClient = useQueryClient();

  const updateTitle = (title: string) =>
    fetch(`/api/conversation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

  const updateTitleMutation = useMutation({
    mutationFn: updateTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Conversations] });
    },
  });

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEdit(false);
    if (inputValue === title) {
      return;
    } else {
      setCurrentTitle(inputValue);
      try {
        updateTitleMutation.mutate(inputValue);
      } catch (error) {
        setCurrentTitle(title);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" || e.key === "Escape") {
      target.blur();
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleInputKeyDown}
      onBlur={handleBlur}
      autoFocus={true}
      className="h-auto w-full p-0 focus:border focus:border-chart-2 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
    />
  );
};
