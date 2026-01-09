<?php

namespace App\Providers;

use App\View\Composers\LogoComposer;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share logo settings with landing layout
        View::composer('layouts.landing', LogoComposer::class);
    }
}
