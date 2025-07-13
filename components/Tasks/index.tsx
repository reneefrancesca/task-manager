import clsx from 'clsx';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { CustomTable } from '../ui/custom-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TasksTypeProps } from '@/app/types/task';
import { Trash2 } from 'lucide-react';

const Tasks = ({tasks, onCompleteTask, onDeleteTask, getPriorityIndicator}: TasksTypeProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <CustomTable className="table-fixed">
        <colgroup>
          <col className="w-[40px]" />
          <col className="w-[200px]" />
          <col className="w-[120px]" />
          <col className="w-[60px]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 z-10 bg-white shadow-sm p-3" />
            <TableHead className="sticky top-0 z-10 bg-white shadow-sm p-3">Task</TableHead>
            <TableHead className="sticky top-0 z-10 bg-white shadow-sm p-3">Priority Level</TableHead>
            <TableHead className="sticky top-0 z-10 bg-white shadow-sm p-3" />
          </TableRow>
        </TableHeader>
      </CustomTable>

      <div className="max-h-[460px] overflow-y-auto">
        <CustomTable className="table-fixed">
          <colgroup>
            <col className="w-[40px]" />
            <col className="w-[200px]" />
            <col className="w-[120px]" />
            <col className="w-[60px]" />
          </colgroup>
          <TableBody>
            {tasks.map(task => (
              <TableRow
                key={task.id}
                className={task.completed ? "bg-stone-100 hover:bg-stone-100 text-muted-foreground opacity-70" : ""}
              >
                <TableCell className="p-5">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onCompleteTask(task.id)}/>
                </TableCell>
                <TableCell className="capitalize">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate w-[250px] cursor-default">{task.title}</div>
                    </TooltipTrigger>
                    <TooltipContent>{task.title}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <span className={clsx(
                      "capitalize px-2 py-px text-white text-center", getPriorityIndicator(task.priority, task.completed)
                    )}
                  >
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onDeleteTask(task.id)}
                        size="icon"
                        className="bg-red-500 hover:bg-red-300"
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Task</p>
                    </TooltipContent>
                  </Tooltip> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable>
      </div>
    </div>
  )
}

export default Tasks;