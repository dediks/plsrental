<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSocialMediaRequest;
use App\Http\Requests\Admin\UpdateSocialMediaRequest;
use App\Models\SocialMedia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialMediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SocialMedia::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('platform', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            });
        }

        // Active filter
        if ($request->has('is_active') && $request->is_active !== null) {
            $query->where('is_active', $request->is_active);
        }

        $socialMedia = $query->orderBy('order')->orderBy('name')->paginate(15);

        return Inertia::render('admin/social-media/Index', [
            'socialMedia' => $socialMedia,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/social-media/Create', [
            'platforms' => ['youtube', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'twitter', 'linkedin'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSocialMediaRequest $request)
    {
        $validated = $request->validated();
        $validated['order'] = $validated['order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        SocialMedia::create($validated);

        return redirect()->route('admin.social-media.index')
            ->with('success', 'Social media link created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SocialMedia $socialMedium)
    {
        return Inertia::render('admin/social-media/Edit', [
            'socialMedia' => $socialMedium,
            'platforms' => ['youtube', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'twitter', 'linkedin'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSocialMediaRequest $request, SocialMedia $socialMedium)
    {
        $validated = $request->validated();
        $validated['order'] = $validated['order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $socialMedium->update($validated);

        return redirect()->route('admin.social-media.index')
            ->with('success', 'Social media link updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SocialMedia $socialMedium)
    {
        $socialMedium->delete();

        return redirect()->route('admin.social-media.index')
            ->with('success', 'Social media link deleted successfully.');
    }
}
