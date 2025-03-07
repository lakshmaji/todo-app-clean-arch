import TaskForm from "./TaskForm";
import { useCreateTask } from "../../../../application/use-cases/task/useCreateTask";
import { useMe } from "../../../../application/use-cases/user/useMe";

const AddTask = () => {
  const {
    register,
    onClickAddTodo,
    handleSubmit,
    openAddTask,
    errors,
    isPending,
    isValid,
    open,
    modalsetOpen,
  } = useCreateTask();

  const { user } = useMe();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <span className="font-extralight pr-1 text-sm">Hi</span>
          <span className="truncate text-base font-medium leading-7 text-slate-900">
            {user?.first_name},
          </span>
        </div>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={openAddTask}
          disabled={open}
        >
          Add Todo
        </button>
      </div>
      <TaskForm
        open={open}
        setOpen={modalsetOpen}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onClickAddTodo}
        isValid={isValid}
        loading={isPending}
      />
    </>
  );
};

export default AddTask;
