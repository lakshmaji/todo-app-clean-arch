import { useDeleteTask } from "../../../../application/use-cases/task/useDeleteTask";
import { ITask, TaskStatus } from "../../../../domain/models/Task";
import EditTask from "./EditTask";
import { TrashIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import TaskStatusAction from "./TaskStatusAction";
import { useDeleteConfirmation } from "../../../../application/hooks/useDeleteConfirmation";
import DeleteConfirmDialog from "../../../common/DeleteConfirmDialog";
import { TaskStatusColors } from "./constants";

interface Props {
  task: ITask;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const removeTask = useDeleteTask(task.id);

  const deleteConfirmation = useDeleteConfirmation({
    title: `Delete ${task.title}`,
    description: `Are you sure you want to delete ${task.title}? This will be permanently removed. This action cannot be undone.`,
    onConfirm: removeTask,
  });

  return (
    <div
      className="flex gap-4 border-b border-gray-200 p-4 dark:border-slate-500 items-center"
      data-testid="todo-item"
      role="listitem"
    >
      <TaskStatusAction task={task} />
      <p
        className={clsx(
          "grow",
          task.status === TaskStatus.COMPLETED
            ? "text-gray-300 line-through transition-all duration-700 dark:text-slate-500"
            : "text-gray-500 transition-all duration-700 dark:text-slate-400"
        )}
      >
        {task.title}
      </p>

      <span
        className={clsx(
          "inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-[2px] text-xs font-medium text-blue-700 capitalize",
          TaskStatusColors[task.status].c
        )}
        data-testid="todo-status"
      >
        <svg
          className={clsx(
            "h-1.5 w-1.5 fill-blue-500",
            TaskStatusColors[task.status].i
          )}
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
        {task.status_human_readable}
      </span>

      <EditTask task={task} />
      <button onClick={deleteConfirmation.openDialog} data-testid="delete-btn">
        <TrashIcon className="size-6 text-gray-500" />
      </button>
      <DeleteConfirmDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.closeDialog}
        onConfirm={deleteConfirmation.handleConfirm}
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
      />
    </div>
  );
};
export default TaskItem;
