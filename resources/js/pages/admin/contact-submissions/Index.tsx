import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { DataTable } from '@/components/admin/DataTable';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { toastSuccess, toastError } from '@/lib/toast';
import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact Submissions', href: '/dashboard/admin/contact-submissions' },
];

export default function Index({ submissions, filters }: any) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [submissionToDelete, setSubmissionToDelete] = useState<any>(null);

    const handleDeleteClick = (submission: any) => {
        setSubmissionToDelete(submission);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!submissionToDelete) return;

        router.delete(`/dashboard/admin/contact-submissions/${submissionToDelete.id}`, {
            onSuccess: () => {
                toastSuccess('Submission deleted successfully!');
                setDeleteDialogOpen(false);
                setSubmissionToDelete(null);
            },
            onError: (errors) => {
                const errorMessage = 
                    errors.message || 
                    Object.values(errors).flat().join(', ') || 
                    'Failed to delete submission. Please try again.';
                toastError(errorMessage);
            },
        });
    };

    const handleFilterChange = (name: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value && value !== 'all') {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        router.get(`/dashboard/admin/contact-submissions?${params.toString()}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Submissions" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Contact Submissions</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage contact form submissions
                    </p>
                </div>

                <DataTable
                    data={submissions}
                    columns={[
                        {
                            header: 'Name',
                            accessor: (row) => (row as any).name,
                        },
                        {
                            header: 'Email',
                            accessor: (row) => (
                                <a 
                                    href={`mailto:${(row as any).email}`}
                                    className="text-primary hover:underline"
                                >
                                    {(row as any).email}
                                </a>
                            ),
                        },
                        {
                            header: 'Subject',
                            accessor: (row) => (row as any).subject || (
                                <span className="text-muted-foreground italic">No subject</span>
                            ),
                        },
                        {
                            header: 'Status',
                            accessor: (row) => (row as any).read_at ? (
                                <Badge variant="secondary">Read</Badge>
                            ) : (
                                <Badge>New</Badge>
                            ),
                        },
                        {
                            header: 'Submitted',
                            accessor: (row) => new Date((row as any).created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        },
                        {
                            header: 'Actions',
                            accessor: (row) => (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                        aria-label="View submission"
                                    >
                                        <Link href={`/dashboard/admin/contact-submissions/${row.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteClick(row)}
                                        aria-label="Delete submission"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    filters={
                        <Select
                            value={filters?.read !== undefined ? String(filters.read) : 'all'}
                            onValueChange={(value) => handleFilterChange('read', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="0">Unread</SelectItem>
                                <SelectItem value="1">Read</SelectItem>
                            </SelectContent>
                        </Select>
                    }
                    searchPlaceholder="Search by name, email, subject, or message..."
                />

                <ConfirmationDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Submission"
                    description={
                        submissionToDelete
                            ? `Are you sure you want to delete the submission from "${submissionToDelete.name}"? This action cannot be undone.`
                            : 'Are you sure you want to delete this submission? This action cannot be undone.'
                    }
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    variant="destructive"
                    onConfirm={handleDeleteConfirm}
                />
            </div>
        </AppLayout>
    );
}

