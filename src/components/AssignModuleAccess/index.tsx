'use client';
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Permissions {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const AssignModuleAccess: React.FC = () => {
  const [adminId, setAdminId] = useState<string>('');
  const [moduleId, setModuleId] = useState<string>('');
  const [permissions, setPermissions] = useState<Permissions>({
    can_create: false,
    can_read: true,
    can_update: false,
    can_delete: false,
  });

  const handleAssign = async () => {
    if (!adminId || !moduleId) {
      alert('Admin ID and Module ID are required.');
      return;
    }
    try {
      // Dummy API call
      await axios.post('/api/admin/assign-module', {
        admin: adminId,
        module: moduleId,
        ...permissions,
      });
      alert(`Permissions for module ${moduleId} assigned to admin ${adminId}.`);
      setAdminId('');
      setModuleId('');
      setPermissions({
        can_create: false,
        can_read: true,
        can_update: false,
        can_delete: false,
      });
    } catch (error) {
      console.error('Error assigning permissions:', error);
      alert('Failed to assign permissions.');
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions({ ...permissions, [name]: checked });
  };

  return (
    <div>
      <h3>Assign Module to Admin</h3>
      <input
        type="text"
        value={adminId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminId(e.target.value)}
        placeholder="Admin ID"
      />
      <input
        type="text"
        value={moduleId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setModuleId(e.target.value)}
        placeholder="Module ID"
      />
      <div>
        <label>
          <input
            type="checkbox"
            name="can_create"
            checked={permissions.can_create}
            onChange={handleCheckboxChange}
          />
          Create
        </label>
        <label>
          <input
            type="checkbox"
            name="can_update"
            checked={permissions.can_update}
            onChange={handleCheckboxChange}
          />
          Update
        </label>
        <label>
          <input
            type="checkbox"
            name="can_delete"
            checked={permissions.can_delete}
            onChange={handleCheckboxChange}
          />
          Delete
        </label>
      </div>
      <button onClick={handleAssign}>Assign</button>
    </div>
  );
};

export default AssignModuleAccess;
