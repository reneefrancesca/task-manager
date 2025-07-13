'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { TaskType, PriorityType, SortByType } from './types/task';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Tasks from '@/components/Tasks';
import { seedTasks } from './utils/seed-tasks';

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTaskInput, setNewTaskInput] = useState<string>('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [sortBy, setSortBy] = useState<SortByType>('priority');
  const [error, setError] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [storedTasks, setStoredTasks] = useLocalStorage("storedTasks", "")

  useEffect(() => {
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      } catch (err) {
        console.error("Failed to parse stored tasks", err);
      }

      return;
    }
    
    // When storedTasks does not exists on LocalStorage.
    setStoredTasks(JSON.stringify(seedTasks));
  }, [storedTasks]);

  useEffect(() => {
    const count = tasks.reduce((acc, task) => acc + (task.completed ? 1 : 0), 0);
    setCompletedCount(count);
  }, [tasks]);

  const addTask = () => {
    const trimmedTaskName = newTaskInput.trim();

    if (!trimmedTaskName) return;

    const isDuplicate = tasks.some(
      (task) => task.title.toLowerCase() === trimmedTaskName.toLowerCase()
    );

    if (isDuplicate) {
      setError('Task already exists.');
      return;
    }

    const task: TaskType = {
      id: Date.now(),
      title: trimmedTaskName,
      completed: false,
      priority,
    };

    const updatedTasks = [...tasks, task];
    setStoredTasks(JSON.stringify(updatedTasks));

    setNewTaskInput('');
    setPriority('medium');
    setError(null);
  };

  const completeTask = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setStoredTasks(JSON.stringify(updatedTasks));
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setStoredTasks(JSON.stringify(updatedTasks));
  };

  const handleNewTaskInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskInput(e.target.value);
  };

  const handleSortTask = (value: string) => {
    setSortBy(value as SortByType)
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy !== 'priority') return a.title.localeCompare(b.title);

    const order = { high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  const getPriorityIndicator = (priority: PriorityType, completed: boolean): string => {
    if(completed) return "bg-gray-400";

    const priorityIndicator = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500"
    };

    return priorityIndicator[priority];
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <form
        onSubmit = {(e) => {
          e.preventDefault();
          addTask();
        }}
        className="flex flex-col sm:flex-row gap-2 mb-2"
      >
        <Input
          type="text"
          placeholder="Task name"
          className="border px-3 py-2 rounded w-full"
          value={newTaskInput}
          onChange={handleNewTaskInput}
        />
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as PriorityType)}
        >
          <SelectTrigger className="w-full rounded border px-3 text-left">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">Add</Button>
      </form>
      {error && (
        <div className="bg-red-500 text-white text-sm mb-4 py-2 px-2">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Select
          value={sortBy}
          onValueChange={handleSortTask}
        >
          <SelectTrigger className="ml-1 w-[180px]">
            <SelectValue>Sort By: </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">
          Completed: {completedCount} / {tasks.length} tasks
        </p>
      </div>

      <Tasks
        tasks={sortedTasks}
        onCompleteTask={completeTask}
        onDeleteTask={deleteTask}
        getPriorityIndicator={getPriorityIndicator}
      />
    </main>
  );
}