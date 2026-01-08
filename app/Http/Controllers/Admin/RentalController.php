<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRentalRequest;
use App\Http\Requests\Admin\UpdateRentalRequest;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RentalController extends Controller
{
    /**
     * Get list of all Indonesian provinces.
     */
    private function getIndonesianProvinces(): array
    {
        return [
            'Aceh',
            'Bali',
            'Banten',
            'Bengkulu',
            'DI Yogyakarta',
            'DKI Jakarta',
            'Gorontalo',
            'Jambi',
            'Jawa Barat',
            'Jawa Tengah',
            'Jawa Timur',
            'Kalimantan Barat',
            'Kalimantan Selatan',
            'Kalimantan Tengah',
            'Kalimantan Timur',
            'Kalimantan Utara',
            'Kepulauan Bangka Belitung',
            'Kepulauan Riau',
            'Lampung',
            'Maluku',
            'Maluku Utara',
            'Nusa Tenggara Barat',
            'Nusa Tenggara Timur',
            'Papua',
            'Papua Barat',
            'Papua Selatan',
            'Papua Tengah',
            'Papua Pegunungan',
            'Riau',
            'Sulawesi Barat',
            'Sulawesi Selatan',
            'Sulawesi Tengah',
            'Sulawesi Tenggara',
            'Sulawesi Utara',
            'Sumatera Barat',
            'Sumatera Selatan',
            'Sumatera Utara',
        ];
    }

    /**
     * Get cities mapped by province.
     */
    private function getCitiesByProvince(): array
    {
        return [
            'Aceh' => ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Meulaboh', 'Sabang'],
            'Bali' => ['Denpasar', 'Singaraja', 'Tabanan', 'Gianyar', 'Badung'],
            'Banten' => ['Serang', 'Tangerang', 'Tangerang Selatan', 'Cilegon', 'Pandeglang'],
            'Bengkulu' => ['Bengkulu', 'Curup', 'Muko-Muko'],
            'DI Yogyakarta' => ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'],
            'DKI Jakarta' => ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Barat'],
            'Gorontalo' => ['Gorontalo', 'Limboro', 'Tilamuta'],
            'Jambi' => ['Jambi', 'Sungai Penuh', 'Muaro Bungo'],
            'Jawa Barat' => ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cirebon', 'Sukabumi', 'Tasikmalaya', 'Cimahi', 'Banjar'],
            'Jawa Tengah' => ['Semarang', 'Surakarta', 'Salatiga', 'Magelang', 'Pekalongan', 'Tegal', 'Kudus', 'Jepara', 'Purwokerto', 'Cilacap'],
            'Jawa Timur' => ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Madiun', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Batu', 'Lumajang'],
            'Kalimantan Barat' => ['Pontianak', 'Singkawang', 'Ketapang', 'Sambas'],
            'Kalimantan Selatan' => ['Banjarmasin', 'Banjarbaru', 'Martapura', 'Barabai'],
            'Kalimantan Tengah' => ['Palangka Raya', 'Sampit', 'Pangkalan Bun'],
            'Kalimantan Timur' => ['Samarinda', 'Balikpapan', 'Bontang', 'Tarakan'],
            'Kalimantan Utara' => ['Tanjung Selor', 'Tarakan'],
            'Kepulauan Bangka Belitung' => ['Pangkalpinang', 'Tanjungpandan'],
            'Kepulauan Riau' => ['Tanjung Pinang', 'Batam', 'Tanjung Balai Karimun'],
            'Lampung' => ['Bandar Lampung', 'Metro', 'Kotabumi'],
            'Maluku' => ['Ambon', 'Tual', 'Masohi'],
            'Maluku Utara' => ['Ternate', 'Tidore', 'Tobelo'],
            'Nusa Tenggara Barat' => ['Mataram', 'Praya', 'Selong', 'Sumbawa Besar'],
            'Nusa Tenggara Timur' => ['Kupang', 'Atambua', 'Soe', 'Kefamenanu'],
            'Papua' => ['Jayapura', 'Abepura', 'Sentani', 'Biak'],
            'Papua Barat' => ['Manokwari', 'Sorong', 'Fakfak'],
            'Papua Selatan' => ['Merauke', 'Tanah Merah'],
            'Papua Tengah' => ['Nabire', 'Timika'],
            'Papua Pegunungan' => ['Jayawijaya', 'Wamena'],
            'Riau' => ['Pekanbaru', 'Dumai', 'Duri', 'Bagansiapiapi'],
            'Sulawesi Barat' => ['Mamuju', 'Majene', 'Polewali'],
            'Sulawesi Selatan' => ['Makassar', 'Parepare', 'Palopo', 'Bulukumba'],
            'Sulawesi Tengah' => ['Palu', 'Poso', 'Donggala'],
            'Sulawesi Tenggara' => ['Kendari', 'Baubau', 'Kolaka'],
            'Sulawesi Utara' => ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu'],
            'Sumatera Barat' => ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Sijunjung'],
            'Sumatera Selatan' => ['Palembang', 'Prabumulih', 'Lubuklinggau', 'Baturaja'],
            'Sumatera Utara' => ['Medan', 'Binjai', 'Tebing Tinggi', 'Pematangsiantar', 'Sibolga'],
        ];
    }

    public function index(Request $request)
    {
        $query = Rental::query();

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

        $rentals = $query->orderBy('name')->paginate(15);

        return Inertia::render('admin/rentals/Index', [
            'rentals' => $rentals,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/rentals/Create', [
            'provinces' => $this->getIndonesianProvinces(),
            'citiesByProvince' => $this->getCitiesByProvince(),
        ]);
    }

    public function store(StoreRentalRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Rental::create($validated);

        return redirect()->route('admin.rentals.index')
            ->with('success', 'Rental created successfully.');
    }

    public function show(Rental $rental)
    {
        return Inertia::render('admin/rentals/Show', [
            'rental' => $rental,
        ]);
    }

    public function edit(Rental $rental)
    {
        return Inertia::render('admin/rentals/Edit', [
            'rental' => $rental,
            'provinces' => $this->getIndonesianProvinces(),
            'citiesByProvince' => $this->getCitiesByProvince(),
        ]);
    }

    public function update(UpdateRentalRequest $request, Rental $rental)
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $rental->update($validated);

        return redirect()->route('admin.rentals.index')
            ->with('success', 'Rental updated successfully.');
    }

    public function destroy(Rental $rental)
    {
        $rental->delete();

        return redirect()->route('admin.rentals.index')
            ->with('success', 'Rental deleted successfully.');
    }
}
