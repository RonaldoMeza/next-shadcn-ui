"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Project, ProjectStatus, TeamMember } from "@/types"
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

interface ProjectSectionProps {
    projects: Project[]
    team: TeamMember[]
    loadingAction: boolean
    onSaveProject: (project: Omit<Project, "id">, id?: number) => void
    onDeleteProject: (id: number) => void
    getMemberName: (id: number) => string
}

export default function ProjectSection({
    projects,
    team,
    loadingAction,
    onSaveProject,
    onDeleteProject,
    getMemberName
}: ProjectSectionProps) {
    const [projectDialog, setProjectDialog] = useState(false)
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
    const [projectForm, setProjectForm] = useState<Omit<Project, "id">>({
        title: "",
        description: "",
        status: "Planificado",
        progress: 0,
        teamMemberIds: [],
    })
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    const statusVariant = (status: string) => {
        if (status === "Completado") return "default"
        if (status === "En progreso" || status === "En revisión") return "secondary"
        return "outline"
    }

    const openCreateProject = () => {
        setEditingProjectId(null)
        setProjectForm({
            title: "",
            description: "",
            status: "Planificado",
            progress: 0,
            teamMemberIds: [],
        })
        setProjectDialog(true)
    }

    const openEditProject = (project: Project) => {
        setEditingProjectId(project.id)
        setProjectForm({
            title: project.title,
            description: project.description,
            status: project.status,
            progress: project.progress,
            teamMemberIds: project.teamMemberIds,
        })
        setProjectDialog(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSaveProject(projectForm, editingProjectId ?? undefined)
        setProjectDialog(false)
    }

    const toggleProjectMember = (userId: number) => {
        setProjectForm((prev) => {
            const exists = prev.teamMemberIds.includes(userId)
            return {
                ...prev,
                teamMemberIds: exists
                    ? prev.teamMemberIds.filter((id) => id !== userId)
                    : [...prev.teamMemberIds, userId],
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateProject} disabled={loadingAction}>
                    {loadingAction ? <Spinner className="mr-2 size-4" /> : null}
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </div>
                                <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progreso</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium">Miembros asignados</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.teamMemberIds.length ? (
                                        project.teamMemberIds.map((id) => (
                                            <Badge key={id} variant="outline">
                                                {getMemberName(id)}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Sin miembros asignados</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSelectedProject(project)}>
                                    Ver detalles
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => openEditProject(project)}>
                                    Editar
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => onDeleteProject(project.id)} disabled={loadingAction}>
                                    Eliminar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={projectDialog} onOpenChange={setProjectDialog}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingProjectId ? "Editar proyecto" : "Crear proyecto"}</DialogTitle>
                            <DialogDescription>
                                Completa la información del proyecto y asigna miembros del equipo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nombre del proyecto</Label>
                                <Input
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    placeholder="Sistema de inventario"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Input
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    placeholder="Breve descripción del proyecto"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Estado</Label>
                                    <Select
                                        value={projectForm.status}
                                        onValueChange={(value) => setProjectForm({ ...projectForm, status: (value ?? "Planificado") as ProjectStatus })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Planificado">Planificado</SelectItem>
                                            <SelectItem value="En progreso">En progreso</SelectItem>
                                            <SelectItem value="En revisión">En revisión</SelectItem>
                                            <SelectItem value="Completado">Completado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Progreso</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={projectForm.progress}
                                        onChange={(e) => setProjectForm({ ...projectForm, progress: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Miembros del equipo</Label>
                                <div className="grid gap-2 rounded-lg border p-3">
                                    {team.map((member) => (
                                        <label key={member.userId} className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={projectForm.teamMemberIds.includes(member.userId)}
                                                onCheckedChange={() => toggleProjectMember(member.userId)}
                                            />
                                            {member.name} - {member.position}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setProjectDialog(false)}>Cancelar</Button>
                            <Button type="submit" disabled={loadingAction}>
                                {loadingAction ? <Spinner className="mr-2 size-4" /> : null}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProject?.title}</DialogTitle>
                        <DialogDescription>{selectedProject?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Estado:</span>
                            <Badge variant={selectedProject ? statusVariant(selectedProject.status) : "outline"}>
                                {selectedProject?.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Progreso:</span>
                            <span>{selectedProject?.progress}%</span>
                        </div>
                        <div>
                            <span className="font-semibold">Miembros:</span>
                            <ul className="mt-2 list-inside list-disc">
                                {selectedProject?.teamMemberIds.map(id => (
                                    <li key={id}>{getMemberName(id)}</li>
                                ))}
                                {selectedProject?.teamMemberIds.length === 0 && <li>Sin miembros</li>}
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setSelectedProject(null)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
