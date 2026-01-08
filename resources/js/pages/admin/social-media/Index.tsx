import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { toastSuccess, toastError } from '@/lib/toast';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Social Media', href: '/dashboard/admin/social-media' },
];

export default function Index({ socialMedia, filters }: any) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [socialMediaToDelete, setSocialMediaToDelete] = useState<any>(null);

    const handleDeleteClick = (item: any) => {
        setSocialMediaToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!socialMediaToDelete) return;

        router.delete(`/dashboard/admin/social-media/${socialMediaToDelete.id}`, {
            onSuccess: () => {
                toastSuccess('Social media link deleted successfully!');
                setDeleteDialogOpen(false);
                setSocialMediaToDelete(null);
            },
            onError: (errors) => {
                const errorMessage =
                    errors.message ||
                    Object.values(errors).flat().join(', ') ||
                    'Failed to delete social media link. Please try again.';
                toastError(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Social Media" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Social Media</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your social media links
                    </p>
                </div>

                <DataTable
                    data={socialMedia}
                    columns={[
                        {
                            header: 'Name',
                            accessor: 'name',
                        },
                        {
                            header: 'Platform',
                            accessor: (row) => (
                                <Badge variant="outline">
                                    {row.platform}
                                </Badge>
                            ),
                        },
                        {
                            header: 'URL',
                            accessor: (row) => (
                                <a
                                    href={row.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline truncate max-w-xs block"
                                >
                                    {row.url}
                                </a>
                            ),
                        },
                        {
                            header: 'Order',
                            accessor: 'order',
                        },
                        {
                            header: 'Status',
                            accessor: (row) => (
                                <Badge
                                    variant={row.is_active ? 'default' : 'secondary'}
                                >
                                    {row.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            ),
                        },
                    ]}
                    createUrl="/dashboard/admin/social-media/create"
                    createLabel="New Social Media Link"
                    editUrl={(row) =>
                        `/dashboard/admin/social-media/${row.id}/edit`
                    }
                    onDelete={handleDeleteClick}
                />

                <ConfirmationDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Social Media Link"
                    description={
                        socialMediaToDelete
                            ? `Are you sure you want to delete "${socialMediaToDelete.name}"? This action cannot be undone.`
                            : 'Are you sure you want to delete this social media link? This action cannot be undone.'
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

