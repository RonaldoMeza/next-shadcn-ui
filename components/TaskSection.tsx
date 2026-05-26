"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Project, Task, TaskStatus, Priority, TeamMember } from "@/types"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TaskSectionProps {
    tasks: Task[]
    projects: Project[]
    team: TeamMember[]
    rowsPerPage: number
    loadingAction: boolean
    onSaveTask: (task: Omit<Task, "id">, id?: number) => void
    onDeleteTask: (id: number) => void
    getProjectName: (id: number) => string
    getMemberName: (id: number) => string
}

export default function TaskSection({
    tasks,
    projects,
    team,
    rowsPerPage,
    loadingAction,
    onSaveTask,
    onDeleteTask,
    getProjectName,
    getMemberName
}: TaskSectionProps) {
    const [taskDialog, setTaskDialog] = useState(false)
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [taskForm, setTaskForm] = useState<Omit<Task, "id">>({
        description: "",
        projectId: projects[0]?.id ?? 1,
        status: "Pendiente",
        priority: "Media",
        userId: team[0]?.userId ?? 1,
        dateline: "",
    })
    const [taskPage, setTaskPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(tasks.length / rowsPerPage))
    const paginatedTasks = useMemo(() => {
        const start = (taskPage - 1) * rowsPerPage
        return tasks.slice(start, start + rowsPerPage)
    }, [tasks, taskPage, rowsPerPage])

    const statusVariant = (status: string) => {
        if (status === "Completado") return "default"
        if (status === "En progreso") return "secondary"
        return "outline"
    }

    const priorityVariant = (priority: string) => {
        if (priority === "Urgente") return "destructive"
        if (priority === "Alta") return "default"
        if (priority === "Media") return "secondary"
        return "outline"
    }

    const openCreateTask = () => {
        setEditingTaskId(null)
        setTaskForm({
            description: "",
            projectId: projects[0]?.id ?? 1,
            status: "Pendiente",
            priority: "Media",
            userId: team[0]?.userId ?? 1,
            dateline: "",
        })
        setTaskDialog(true)
    }

    const openEditTask = (task: Task) => {
        setEditingTaskId(task.id)
        setTaskForm({
            description: task.description,
            projectId: task.projectId,
            status: task.status,
            priority: task.priority,
            userId: task.userId,
            dateline: task.dateline,
        })
        setTaskDialog(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSaveTask(taskForm, editingTaskId ?? undefined)
        setTaskDialog(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateTask} disabled={loadingAction}>Nueva Tarea</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>CRUD de tareas</CardTitle>
                    <CardDescription>
                        Incluye descripción, proyecto, estado, prioridad, usuario asignado, fecha límite y paginación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableCaption>Página {taskPage} de {totalPages}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"><Checkbox /></TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Proyecto</TableHead>
                                    <TableHead>Asignado</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Prioridad</TableHead>
                                    <TableHead>Fecha límite</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell><Checkbox checked={task.status === "Completado"} /></TableCell>
                                        <TableCell className="font-medium">{task.description}</TableCell>
                                        <TableCell>{getProjectName(task.projectId)}</TableCell>
                                        <TableCell>{getMemberName(task.userId)}</TableCell>
                                        <TableCell><Badge variant={statusVariant(task.status)}>{task.status}</Badge></TableCell>
                                        <TableCell><Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                                        <TableCell>{task.dateline}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button size="sm" variant="outline" onClick={() => openEditTask(task)}>Editar</Button>
                                            <Button size="sm" variant="destructive" onClick={() => onDeleteTask(task.id)} disabled={loadingAction}>Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setTaskPage((page) => Math.max(1, page - 1))
                                        }}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href="#"
                                            isActive={taskPage === index + 1}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setTaskPage(index + 1)
                                            }}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setTaskPage((page) => Math.min(totalPages, page + 1))
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingTaskId ? "Editar tarea" : "Crear tarea"}</DialogTitle>
                            <DialogDescription>
                                Completa la información de la tarea.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Input
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    placeholder="Ej: Implementar login"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Proyecto</Label>
                                    <Select
                                        value={String(taskForm.projectId)}
                                        onValueChange={(value) => setTaskForm({ ...taskForm, projectId: Number(value ?? 1) })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Asignado a</Label>
                                    <Select
                                        value={String(taskForm.userId)}
                                        onValueChange={(value) => setTaskForm({ ...taskForm, userId: Number(value ?? 1) })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {team.map((m) => (
                                                <SelectItem key={m.userId} value={String(m.userId)}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Estado</Label>
                                    <Select
                                        value={taskForm.status}
                                        onValueChange={(value) => setTaskForm({ ...taskForm, status: (value ?? "Pendiente") as TaskStatus })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="En progreso">En progreso</SelectItem>
                                            <SelectItem value="Completado">Completado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Prioridad</Label>
                                    <Select
                                        value={taskForm.priority}
                                        onValueChange={(value) => setTaskForm({ ...taskForm, priority: (value ?? "Media") as Priority })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Alta">Alta</SelectItem>
                                            <SelectItem value="Urgente">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Fecha límite</Label>
                                <Popover>
                                    <PopoverTrigger
                                    render={
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !taskForm.dateline && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {taskForm.dateline ? format(new Date(taskForm.dateline + "T00:00:00"), "PPP") : <span>Seleccionar fecha</span>}
                                        </Button>
                                    }
                                />
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={taskForm.dateline ? new Date(taskForm.dateline + "T00:00:00") : undefined}
                                            onSelect={(date) => setTaskForm({ ...taskForm, dateline: date ? format(date, "yyyy-MM-dd") : "" })}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setTaskDialog(false)}>Cancelar</Button>
                            <Button type="submit" disabled={loadingAction}>
                                {loadingAction ? <Spinner className="mr-2 size-4" /> : null}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
