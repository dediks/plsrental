<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Gallery::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $galleries = $query->orderBy('order')->orderBy('created_at', 'desc')->paginate(15);

        $categories = Gallery::distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('admin/gallery/Index', [
            'galleries' => $galleries,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        $categories = Gallery::distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('admin/gallery/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreGalleryRequest $request)
    {
        Gallery::create($request->validated());

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery item created successfully.');
    }

    public function edit(Gallery $gallery)
    {
        $categories = Gallery::distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('admin/gallery/Edit', [
            'gallery' => $gallery,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateGalleryRequest $request, Gallery $gallery)
    {
        $gallery->update($request->validated());

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gallery item deleted successfully.');
    }
}

