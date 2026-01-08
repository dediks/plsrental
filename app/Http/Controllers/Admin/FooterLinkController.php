<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FooterLink::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('href', 'like', "%{$search}%");
            });
        }

        // Section filter
        if ($request->has('section') && $request->section) {
            $query->where('section', $request->section);
        }

        $footerLinks = $query->orderBy('section')->orderBy('order')->paginate(15);

        return Inertia::render('admin/footer-links/Index', [
            'footerLinks' => $footerLinks,
            'sections' => ['products', 'company', 'support'],
            'filters' => $request->only(['search', 'section']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/footer-links/Create', [
            'sections' => ['products', 'company', 'support'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'href' => 'required|string|max:255',
            'section' => 'required|string|in:products,company,support',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        FooterLink::create($validated);

        return redirect()->route('admin.footer-links.index')
            ->with('success', 'Footer link created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FooterLink $footerLink)
    {
        return Inertia::render('admin/footer-links/Edit', [
            'footerLink' => $footerLink,
            'sections' => ['products', 'company', 'support'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FooterLink $footerLink)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'href' => 'required|string|max:255',
            'section' => 'required|string|in:products,company,support',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $footerLink->update($validated);

        return redirect()->route('admin.footer-links.index')
            ->with('success', 'Footer link updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FooterLink $footerLink)
    {
        $footerLink->delete();

        return redirect()->route('admin.footer-links.index')
            ->with('success', 'Footer link deleted successfully.');
    }
}
