<?php

namespace App\Http\Middleware;


use App\Models\Setting;
use App\Models\SocialMedia;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $quotes = [
            'Sound is the foundation of human experience - We design systems that elevate it',
            'Engineering excellence meets acoustic artistry - PLSRental',
            'Every detail matters in sound reinforcement - Precision is our promise',
        ];

        $randomQuote = $quotes[array_rand($quotes)];

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => $randomQuote, 'author' => 'PLSRental'],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'socialMediaLinks' => SocialMedia::where('is_active', true)
                ->orderBy('order')
                ->get()
                ->map(fn ($link) => [
                    'name' => $link->name,
                    'platform' => $link->platform,
                    'url' => $link->url,
                ]),
            'footerCategories' => [],
            'logoSettings' => [
                'logoLight' => $this->getLogoUrl('logo_light', '/images/logo.png'),
                'logoDark' => $this->getLogoUrl('logo_dark', '/images/logo.png'),
            ],
        ];
    }

    /**
     * Get logo URL from settings (handles both media IDs and legacy paths).
     */
    private function getLogoUrl(string $key, string $fallbackPath): string
    {
        // Get media URL using the Setting model's helper method
        $url = Setting::getMediaUrl($key, $fallbackPath);

        // Ensure URL is properly formatted
        if (!$url) {
            return $fallbackPath;
        }

        // If it's an absolute URL, extract the path for frontend compatibility
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            return $parsed['path'] ?? $url;
        }

        // If it already starts with /, return as is
        if (str_starts_with($url, '/')) {
            return $url;
        }

        // Otherwise, assume it's a storage path
        return '/storage/' . ltrim($url, '/');
    }
}
