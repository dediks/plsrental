<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Gallery::query();

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $galleries = $query->orderBy('order')->orderBy('created_at', 'desc')->paginate(24);

        $categories = Gallery::distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->sort()
            ->values();

        return Inertia::render('Gallery/Index', [
            'galleries' => $galleries,
            'categories' => $categories,
            'filters' => $request->only(['category']),
            'seo' => SeoService::forGallery(),
        ]);
    }
}
