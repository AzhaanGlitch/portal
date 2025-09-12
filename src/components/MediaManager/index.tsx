'use client';
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const MediaManager: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Dummy API call
            await axios.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('File uploaded!');
            setFile(null); // Clear the selected file
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    const handleDelete = async (mediaId: number) => {
        try {
            // Dummy API call
            await axios.delete(`/api/media/delete/${mediaId}`);
            alert(`Media ${mediaId} deleted!`);
        } catch (error) {
            console.error('Error deleting media:', error);
            alert('Failed to delete media');
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div>
            <h3>Media Upload</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>

            {/* Example of deleting a media file */}
            <button onClick={() => handleDelete(1)}>Delete Media ID 1</button>
        </div>
    );
};

export default MediaManager;
