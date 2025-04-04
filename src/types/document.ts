export type DocumentType = 'folder' | 'file';
export type DocumentStatus = 'placeholder' | 'uploaded';
export type UserRole = 'admin' | 'worker' | 'viewer';

export interface DocumentItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    status?: 'placeholder' | 'uploaded';
    file_url?: string;
    parent_id?: string;
    order: number;
    project_id: string;
    children?: DocumentItem[];
    created_at?: string;
    uploaded_at?: string;
    uploaded_by?: string;
}

export interface DocumentAction {
    type: 'CREATE_FOLDER' | 'CREATE_FILE' | 'RENAME' | 'MOVE' | 'DELETE' | 'REORDER' | 'UPLOAD';
    payload: any;
}

export interface CreateDocumentData {
    name: string;
    type: 'folder' | 'file';
    status?: 'placeholder' | 'uploaded';
    file_url?: string;
    parent_id?: string;
    order: number;
    project_id: string;
} 