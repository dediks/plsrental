<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Http\Requests\Admin\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        // Search (case-insensitive)
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(city) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(country) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
            });
        }

        // Type filter
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Published filter
        if ($request->has('published') && $request->published !== null) {
            if ($request->published === '1' || $request->published === 'true') {
                $query->where('is_published', true);
            } elseif ($request->published === '0' || $request->published === 'false') {
                $query->where('is_published', false);
            }
        }

        $suppliers = $query->orderBy('name')->paginate(15);

        return Inertia::render('admin/suppliers/Index', [
            'suppliers' => $suppliers,
            'types' => Supplier::getTypes(),
            'filters' => $request->only(['search', 'type', 'published']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/suppliers/Create', [
            'types' => Supplier::getTypes(),
        ]);
    }

    public function store(StoreSupplierRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Supplier::create($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier created successfully.');
    }

    public function show(Supplier $supplier)
    {
        return Inertia::render('admin/suppliers/Show', [
            'supplier' => $supplier,
            'types' => Supplier::getTypes(),
        ]);
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('admin/suppliers/Edit', [
            'supplier' => $supplier,
            'types' => Supplier::getTypes(),
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $supplier->update($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('admin.suppliers.index')
            ->with('success', 'Supplier deleted successfully.');
    }
}
