<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query()->where('is_published', true);

        // Supplier type filters (checkboxes) - apply first
        $typeFilters = [];
        if ($request->has('distributors') && ! empty($request->distributors)) {
            $typeFilters[] = Supplier::TYPE_DISTRIBUTOR;
        }
        if ($request->has('dealers') && ! empty($request->dealers)) {
            $typeFilters[] = Supplier::TYPE_DEALER;
        }

        // Check if filter parameters were explicitly provided in query string
        $hasExplicitFilters = array_key_exists('distributors', $request->query()) 
            || array_key_exists('dealers', $request->query());

        // Default to distributors only if no filter parameters were provided at all (first page load)
        $isDefaultFilter = empty($typeFilters) && ! $hasExplicitFilters;
        if ($isDefaultFilter) {
            $typeFilters[] = Supplier::TYPE_DISTRIBUTOR;
        }

        $hasSearch = $request->has('search') && ! empty($request->search);

        // Apply type filters
        $query->whereIn('type', $typeFilters);

        // Then apply search filter (if any) - this will filter within the selected types
        if ($hasSearch) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(city) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(country) LIKE ?', ["%{$search}%"]);
            });
        }

        $suppliers = $query->orderBy('name')->paginate(20);

        // Build filters array - include distributors: true when using default filter
        $filters = $request->only(['search', 'distributors', 'dealers']);
        if ($isDefaultFilter) {
            $filters['distributors'] = true;
        }

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $filters,
            'seo' => SeoService::forSuppliersIndex(),
        ]);
    }

    public function show(string $slug)
    {
        $supplier = Supplier::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier,
            'seo' => SeoService::forSupplier($supplier),
        ]);
    }
}
