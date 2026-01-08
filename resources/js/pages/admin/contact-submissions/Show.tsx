import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toastSuccess, toastError } from '@/lib/toast';
import { ArrowLeft, Mail, Trash2, Check, X } from 'lucide-react';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact Submissions', href: '/dashboard/admin/contact-submissions' },
    { title: 'View Submission', href: '#' },
];

interface ShowProps {
    submission: {
        id: number;
        name: string;
        email: string;
        subject?: string;
        message: string;
        read_at?: string;
        created_at: string;
        updated_at: string;
    };
}

export default function Show({ submission }: ShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [markReadDialogOpen, setMarkReadDialogOpen] = useState(false);

    const { put, delete: deleteMethod, processing } = useForm();

    const handleMarkAsRead = () => {
        put(`/dashboard/admin/contact-submissions/${submission.id}`, {
            read_at: !submission.read_at,
            onSuccess: () => {
                toastSuccess(submission.read_at ? 'Marked as unread' : 'Marked as read');
                setMarkReadDialogOpen(false);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update submission';
                toastError(errorMessage);
            },
        });
    };

    const handleDelete = () => {
        deleteMethod(`/dashboard/admin/contact-submissions/${submission.id}`, {
            onSuccess: () => {
                toastSuccess('Submission deleted successfully!');
                router.visit('/dashboard/admin/contact-submissions');
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to delete submission';
                toastError(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Contact Submission from ${submission.name}`} />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            aria-label="Go back to contact submissions"
                        >
                            <a href="/dashboard/admin/contact-submissions">
                                <ArrowLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Contact Submission</h1>
                            <p className="text-muted-foreground mt-1">
                                View submission details
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={submission.read_at ? "outline" : "default"}
                            onClick={() => setMarkReadDialogOpen(true)}
                            disabled={processing}
                        >
                            {submission.read_at ? (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Mark as Unread
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Read
                                </>
                            )}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={processing}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Name</label>
                                <p className="mt-1 text-lg">{submission.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="mt-1">
                                    <a 
                                        href={`mailto:${submission.email}`}
                                        className="text-primary hover:underline flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        {submission.email}
                                    </a>
                                </p>
                            </div>
                            {submission.subject && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                                    <p className="mt-1">{submission.subject}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <div className="mt-1">
                                    {submission.read_at ? (
                                        <Badge variant="secondary">Read</Badge>
                                    ) : (
                                        <Badge>New</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Submission Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                                <p className="mt-1">
                                    {new Date(submission.created_at).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {submission.read_at && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Read At</label>
                                    <p className="mt-1">
                                        {new Date(submission.read_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{submission.message}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmationDialog
                    open={markReadDialogOpen}
                    onOpenChange={setMarkReadDialogOpen}
                    onConfirm={handleMarkAsRead}
                    title={submission.read_at ? "Mark as Unread" : "Mark as Read"}
                    description={submission.read_at 
                        ? "Are you sure you want to mark this submission as unread?"
                        : "Are you sure you want to mark this submission as read?"
                    }
                />

                <ConfirmationDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    title="Delete Submission"
                    description="Are you sure you want to delete this submission? This action cannot be undone."
                />
            </div>
        </AppLayout>
    );
}

