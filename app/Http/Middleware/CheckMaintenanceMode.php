<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if maintenance mode is enabled
        $maintenanceModeValue = Setting::get('maintenance_mode', false);
        $maintenanceMode = filter_var($maintenanceModeValue, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;

        if (!$maintenanceMode) {
            return $next($request);
        }

        // Allow access to maintenance page itself
        if ($request->is('maintenance')) {
            return $next($request);
        }

        // Allow Laravel's built-in maintenance bypass route
        // if ($request->is('bypass-maintenance')) {
        //     return $next($request);
        // }

        // Allow authenticated users (admins) to bypass maintenance mode
        if ($request->user()) {
            return $next($request);
        }

        // Allow access to authentication routes (login, register, etc.)
        $authRoutes = [
            'login',
            'register',
            'forgot-password',
            'reset-password/*',
            'two-factor-challenge',
            'email/verify/*',
        ];

        foreach ($authRoutes as $route) {
            if ($request->is($route)) {
                return $next($request);
            }
        }

        // Redirect all other requests to maintenance page
        return redirect()->route('maintenance');
    }
}

