<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    private ?string $secretKey;
    private ?string $siteKey;
    private float $scoreThreshold;

    public function __construct()
    {
        $this->secretKey = config('services.recaptcha.secret_key') ?: null;
        $this->siteKey = config('services.recaptcha.site_key') ?: null;
        $this->scoreThreshold = (float) config('services.recaptcha.score_threshold', 0.5);
    }

    /**
     * Verify reCAPTCHA v3 token
     *
     * @param string|null $token
     * @param string|null $action
     * @return array{success: bool, score: float|null, message: string}
     */
    public function verify(?string $token, ?string $action = 'contact'): array
    {
        if (empty($this->secretKey)) {
            // If no secret key is configured, skip verification (for development)
            return [
                'success' => true,
                'score' => 1.0,
                'message' => 'reCAPTCHA not configured',
            ];
        }

        if (empty($token)) {
            return [
                'success' => false,
                'score' => null,
                'message' => 'reCAPTCHA token is missing',
            ];
        }

        // Handle Google's test keys (always pass for localhost/development)
        $testSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuJJXNXqjKJ5';
        if ($this->secretKey === $testSecretKey) {
            return [
                'success' => true,
                'score' => 0.9,
                'message' => 'reCAPTCHA test key verified',
            ];
        }

        try {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $this->secretKey,
                'response' => $token,
            ]);

            $result = $response->json();

            if (!$result || !isset($result['success'])) {
                Log::warning('reCAPTCHA verification failed: Invalid response', ['response' => $result]);
                return [
                    'success' => false,
                    'score' => null,
                    'message' => 'Invalid reCAPTCHA response',
                ];
            }

            if (!$result['success']) {
                $errorCodes = $result['error-codes'] ?? [];
                Log::warning('reCAPTCHA verification failed', ['errors' => $errorCodes]);
                return [
                    'success' => false,
                    'score' => null,
                    'message' => 'reCAPTCHA verification failed: ' . implode(', ', $errorCodes),
                ];
            }

            $score = $result['score'] ?? 0;
            $actionMatch = !isset($result['action']) || $result['action'] === $action;

            if (!$actionMatch) {
                Log::warning('reCAPTCHA action mismatch', [
                    'expected' => $action,
                    'received' => $result['action'] ?? null,
                ]);
            }

            if ($score < $this->scoreThreshold) {
                Log::info('reCAPTCHA score below threshold', [
                    'score' => $score,
                    'threshold' => $this->scoreThreshold,
                ]);
                return [
                    'success' => false,
                    'score' => $score,
                    'message' => 'reCAPTCHA score too low',
                ];
            }

            return [
                'success' => true,
                'score' => $score,
                'message' => 'reCAPTCHA verification successful',
            ];
        } catch (\Exception $e) {
            Log::error('reCAPTCHA verification error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'score' => null,
                'message' => 'reCAPTCHA verification error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get the site key for frontend
     */
    public function getSiteKey(): string
    {
        return $this->siteKey ?? '';
    }

    /**
     * Check if reCAPTCHA is configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->secretKey) && !empty($this->siteKey);
    }
}

