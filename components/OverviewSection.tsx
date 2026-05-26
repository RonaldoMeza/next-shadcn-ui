"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Project, Task, TeamMember } from "@/types"

interface OverviewSectionProps {
    projects: Project[]
    tasks: Task[]
    team: TeamMember[]
    getProjectName: (id: number) => string
    getMemberName: (id: number) => string
}

export default function OverviewSection({
    projects,
    tasks,
    team,
    getProjectName,
    getMemberName
}: OverviewSectionProps) {
    const completedTasks = tasks.filter((task) => task.status === "Completado").length
    const activeMembers = team.filter((member) => member.isActive).length
    const averageProgress = projects.length
        ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
        : 0

    const statusVariant = (status: string) => {
        if (status === "Completado") return "default"
        if (status === "En progreso" || status === "En revisión") return "secondary"
        return "outline"
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{projects.length}</div>
                        <p className="text-xs text-muted-foreground">Datos calculados desde memoria</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{completedTasks}</div>
                        <p className="text-xs text-muted-foreground">De {tasks.length} tareas registradas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{activeMembers}</div>
                        <p className="text-xs text-muted-foreground">De {team.length} miembros del equipo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{averageProgress}%</div>
                        <p className="text-xs text-muted-foreground">Promedio de avance de proyectos</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Actividad reciente simulada</CardTitle>
                    <CardDescription>
                        Esta sección se actualiza de forma visual a partir de los datos del dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {tasks.slice(0, 4).map((task) => (
                        <div key={task.id} className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-medium">{task.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {getProjectName(task.projectId)} · {getMemberName(task.userId)}
                                </p>
                            </div>
                            <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
