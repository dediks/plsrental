<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate XML sitemap.
     */
    public function index(): Response
    {
        $urls = [];

        // Static pages
        $urls[] = [
            'loc' => route('home'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'daily',
            'priority' => '1.0',
        ];

        $urls[] = [
            'loc' => route('products.index'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'daily',
            'priority' => '0.9',
        ];

        $urls[] = [
            'loc' => route('articles.index'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'daily',
            'priority' => '0.9',
        ];

        $urls[] = [
            'loc' => route('suppliers.index'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ];

        $urls[] = [
            'loc' => route('gallery.index'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'weekly',
            'priority' => '0.7',
        ];

        $urls[] = [
            'loc' => route('contact.index'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'monthly',
            'priority' => '0.6',
        ];

        $urls[] = [
            'loc' => route('about'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'monthly',
            'priority' => '0.7',
        ];

        $urls[] = [
            'loc' => route('privacy'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'monthly',
            'priority' => '0.5',
        ];

        $urls[] = [
            'loc' => route('terms'),
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'monthly',
            'priority' => '0.5',
        ];

        // Products
        $products = Product::select('slug', 'updated_at')->get();
        foreach ($products as $product) {
            $urls[] = [
                'loc' => route('products.show', $product->slug),
                'lastmod' => $product->updated_at->toIso8601String(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        // Articles
        $articles = Article::whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->select('slug', 'updated_at', 'published_at')
            ->get();
        foreach ($articles as $article) {
            $urls[] = [
                'loc' => route('articles.show', $article->slug),
                'lastmod' => $article->updated_at->toIso8601String(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        }

        // Suppliers
        $suppliers = Supplier::select('slug', 'updated_at')->get();
        foreach ($suppliers as $supplier) {
            $urls[] = [
                'loc' => route('suppliers.show', $supplier->slug),
                'lastmod' => $supplier->updated_at->toIso8601String(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= '  <url>'."\n";
            $xml .= '    <loc>'.htmlspecialchars($url['loc'], ENT_XML1, 'UTF-8').'</loc>'."\n";
            $xml .= '    <lastmod>'.htmlspecialchars($url['lastmod'], ENT_XML1, 'UTF-8').'</lastmod>'."\n";
            $xml .= '    <changefreq>'.htmlspecialchars($url['changefreq'], ENT_XML1, 'UTF-8').'</changefreq>'."\n";
            $xml .= '    <priority>'.htmlspecialchars($url['priority'], ENT_XML1, 'UTF-8').'</priority>'."\n";
            $xml .= '  </url>'."\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}
