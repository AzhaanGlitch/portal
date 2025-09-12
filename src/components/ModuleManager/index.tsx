'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import api from '@/lib/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from '../ui/textarea';

interface Module {
    id: number;
    name: string;
    description: string;
}

const ModuleManager: React.FC = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [moduleName, setModuleName] = useState<string>('');
    const [moduleDesc, setModuleDesc] = useState<string>('');
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [editFormError, setEditFormError] = useState<string | null>(null);


    useEffect(() => {
        api.get<Module[]>('/modules/list/')
            .then(response => setModules(response.data))
            .catch(error => console.error('Error fetching modules:', error));
    }, []);

    const handleCreateModule = async () => {
        if (!moduleName.trim() || !moduleDesc.trim()) {
            setFormError('Both module name and description are required.');
            return;
        }

        try {
            const response = await api.post<Module>('/modules/create/', {
                name: moduleName,
                description: moduleDesc,
            });
            setModules([...modules, response.data]);
            setModuleName('');
            setModuleDesc('');
            setFormError(null);
        } catch (error) {
            console.error('Error creating module:', error);
            setFormError('Failed to create module. Please try again.');
        }
    };

    const handleUpdateModule = async (id: number) => {
        if (!editingModule || !editingModule.name.trim() || !editingModule.description.trim()) {
            setEditFormError('Both module name and description are required for an update.');
            return;
        }
        try {
            const response = await api.put<Module>(`/modules/update/${id}/`, {
                name: editingModule.name,
                description: editingModule.description,
            });
            setModules(modules.map(m => (m.id === id ? response.data : m)));
            setEditingModule(null);
            setEditFormError(null);
        } catch (error) {
            console.error('Error updating module:', error);
            setEditFormError('Failed to update module. Please try again.');
        }
    };

    const handleDeleteModule = async (id: number) => {
        try {
            await api.delete(`/modules/delete/${id}/`);
            setModules(modules.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingModule(null);
        setEditFormError(null);
    };


    return (
        <div className="space-y-6 p-6">
            <Card className="p-4">
                <CardHeader>
                    <h3 className="text-xl font-semibold">Module Management</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        type="text"
                        value={moduleName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setModuleName(e.target.value);
                            if (formError) setFormError(null);
                        }}
                        placeholder="Module Name"
                    />
                    <Textarea
                        value={moduleDesc}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setModuleDesc(e.target.value);
                            if (formError) setFormError(null);
                        }}
                        placeholder="Module Description"
                    />
                    {formError && <p className="text-red-500 text-sm">{formError}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreateModule}>Add Module</Button>
                </CardFooter>
            </Card>

            <div className="space-y-4">
                {modules.map(module => (
                    <Card key={module.id} className="p-4">
                        <CardContent className="flex flex-col gap-2">
                            {editingModule && editingModule.id === module.id ? (
                                <>
                                    <Input
                                        type="text"
                                        value={editingModule.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setEditingModule({ ...editingModule, name: e.target.value });
                                            if (editFormError) setEditFormError(null);
                                        }}
                                    />
                                    <Textarea
                                        value={editingModule.description}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                            setEditingModule({ ...editingModule, description: e.target.value });
                                            if (editFormError) setEditFormError(null);
                                        }}
                                    />
                                    {editFormError && <p className="text-red-500 text-sm">{editFormError}</p>}
                                </>
                            ) : (
                                <>
                                    <p className="font-medium">{module.name}</p>
                                    <p className="text-sm text-gray-500">{module.description}</p>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {editingModule && editingModule.id === module.id ? (
                                <>
                                    <Button onClick={() => handleUpdateModule(module.id)}>Save</Button>
                                    <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setEditingModule(module)}>Edit</Button>
                                    <Button variant="destructive" onClick={() => handleDeleteModule(module.id)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ModuleManager;