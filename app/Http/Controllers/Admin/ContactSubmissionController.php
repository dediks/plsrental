<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactSubmissionRequest;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactSubmission::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by read status
        if ($request->has('read') && $request->read !== null) {
            if ($request->read) {
                $query->whereNotNull('read_at');
            } else {
                $query->whereNull('read_at');
            }
        }

        $submissions = $query->latest('created_at')->paginate(15);

        return Inertia::render('admin/contact-submissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['search', 'read']),
        ]);
    }

    public function show(ContactSubmission $contactSubmission)
    {
        // Mark as read when viewing
        if (!$contactSubmission->read_at) {
            $contactSubmission->update(['read_at' => now()]);
        }

        return Inertia::render('admin/contact-submissions/Show', [
            'submission' => $contactSubmission,
        ]);
    }

    public function update(UpdateContactSubmissionRequest $request, ContactSubmission $contactSubmission)
    {
        $validated = $request->validated();

        if (isset($validated['read_at'])) {
            $contactSubmission->update([
                'read_at' => $validated['read_at'] ? now() : null,
            ]);
        }

        return redirect()->back()->with('success', 'Submission updated successfully.');
    }

    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();

        return redirect()->route('admin.contact-submissions.index')
            ->with('success', 'Submission deleted successfully.');
    }
}

