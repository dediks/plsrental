<?php

namespace App\View\Composers;

use App\Models\Setting;
use Illuminate\View\View;

class LogoComposer
{
    /**
     * Bind data to the view.
     */
    public function compose(View $view): void
    {
        $view->with('logoSettings', [
            'logoLight' => $this->getLogoUrl('logo_light', '/images/black-logo.svg')
        ]);
    }

    /**
     * Get logo URL from settings.
     */
    private function getLogoUrl(string $key, string $fallbackPath): string
    {
        $url = Setting::getMediaUrl($key, $fallbackPath);

        if (!$url) {
            return $fallbackPath;
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            return $parsed['path'] ?? $url;
        }

        if (str_starts_with($url, '/')) {
            return $url;
        }

        return '/storage/' . ltrim($url, '/');
    }
}
