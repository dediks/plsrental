<?php

use App\Http\Controllers\Admin\ContactSubmissionController as AdminContactSubmissionController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Admin\MediaController;

use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SocialMediaController;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PrivacyController;

use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TermsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');


Route::get('/privacy', [PrivacyController::class, 'index'])->name('privacy');
Route::get('/terms', [TermsController::class, 'index'])->name('terms');
Route::get('/coming-soon', function () {
    return view('coming-soon');
})->name('coming-soon');
Route::get('/maintenance', function () {
    return Inertia::render('ComingSoon/Index');
})->name('maintenance');

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Robots.txt
Route::get('/robots.txt', function () {
    $content = "User-agent: *\n";
    $content .= "Disallow:\n\n";
    $content .= 'Sitemap: '.config('app.url')."/sitemap.xml\n";

    return response($content, 200)
        ->header('Content-Type', 'text/plain; charset=utf-8');
})->name('robots');

// Auth routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin routes
    Route::prefix('dashboard/admin')->name('admin.')->group(function () {

        Route::resource('social-media', SocialMediaController::class);

        // Media routes
        Route::post('media/upload', [MediaController::class, 'upload'])->name('media.upload');
        Route::post('media/upload-video', [MediaController::class, 'uploadVideo'])->name('media.upload-video');
        Route::get('media', [MediaController::class, 'index'])->name('media.index');
        Route::put('media/{media}', [MediaController::class, 'update'])->name('media.update');
        Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
        Route::post('media/batch-delete', [MediaController::class, 'batchDestroy'])->name('media.batch-destroy');

        // Home page sections
        Route::get('home/hero', [AdminHomeController::class, 'editHero'])->name('home.hero.edit');
        Route::put('home/hero', [AdminHomeController::class, 'updateHero'])->name('home.hero.update');
        
        Route::get('home/stats', [AdminHomeController::class, 'editStats'])->name('home.stats.edit');
        Route::put('home/stats', [AdminHomeController::class, 'updateStats'])->name('home.stats.update');
        
        Route::get('home/services', [AdminHomeController::class, 'editServices'])->name('home.services.edit');
        Route::put('home/services', [AdminHomeController::class, 'updateServices'])->name('home.services.update');
        
        Route::get('home/why-choose', [AdminHomeController::class, 'editWhyChoose'])->name('home.why-choose.edit');
        Route::put('home/why-choose', [AdminHomeController::class, 'updateWhyChoose'])->name('home.why-choose.update');
        
        Route::get('home/portfolio', [AdminHomeController::class, 'editPortfolio'])->name('home.portfolio.edit');
        Route::put('home/portfolio', [AdminHomeController::class, 'updatePortfolio'])->name('home.portfolio.update');
        
        Route::get('home/process', [AdminHomeController::class, 'editProcess'])->name('home.process.edit');
        Route::put('home/process', [AdminHomeController::class, 'updateProcess'])->name('home.process.update');
        
        Route::get('home/testimonials', [AdminHomeController::class, 'editTestimonials'])->name('home.testimonials.edit');
        Route::put('home/testimonials', [AdminHomeController::class, 'updateTestimonials'])->name('home.testimonials.update');
        
        Route::get('home/final-cta', [AdminHomeController::class, 'editFinalCTA'])->name('home.final-cta.edit');
        Route::put('home/final-cta', [AdminHomeController::class, 'updateFinalCTA'])->name('home.final-cta.update');
        
        Route::get('home/footer', [AdminHomeController::class, 'editFooter'])->name('home.footer.edit');
        Route::put('home/footer', [AdminHomeController::class, 'updateFooter'])->name('home.footer.update');

        // Contact submissions
        Route::get('contact-submissions', [AdminContactSubmissionController::class, 'index'])->name('contact-submissions.index');
        Route::get('contact-submissions/{contactSubmission}', [AdminContactSubmissionController::class, 'show'])->name('contact-submissions.show');
        Route::put('contact-submissions/{contactSubmission}', [AdminContactSubmissionController::class, 'update'])->name('contact-submissions.update');
        Route::delete('contact-submissions/{contactSubmission}', [AdminContactSubmissionController::class, 'destroy'])->name('contact-submissions.destroy');

        // Settings
        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
