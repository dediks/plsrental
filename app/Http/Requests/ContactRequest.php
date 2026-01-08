<?php

namespace App\Http\Requests;

use App\Services\RecaptchaService;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'recaptcha_token' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $recaptchaService = app(RecaptchaService::class);

            // Skip reCAPTCHA validation if not configured
            if (! $recaptchaService->isConfigured()) {
                return;
            }

            $token = $this->input('recaptcha_token');

            // If token is missing but reCAPTCHA is configured, it's an error
            if (empty($token)) {
                $validator->errors()->add(
                    'recaptcha_token',
                    'reCAPTCHA verification is required. Please refresh the page and try again.'
                );

                return;
            }

            $result = $recaptchaService->verify($token, 'contact');

            if (! $result['success']) {
                $validator->errors()->add(
                    'recaptcha_token',
                    'reCAPTCHA verification failed. Please try again.'
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide your name.',
            'name.string' => 'Name must be a valid text.',
            'name.max' => 'Name must not exceed 255 characters.',
            'email.required' => 'Please provide your email address.',
            'email.email' => 'Please provide a valid email address.',
            'email.string' => 'Email must be a valid text.',
            'email.max' => 'Email must not exceed 255 characters.',
            'subject.string' => 'Subject must be a valid text.',
            'subject.max' => 'Subject must not exceed 255 characters.',
            'message.required' => 'Please provide a message.',
            'message.string' => 'Message must be a valid text.',
            'message.max' => 'Your message is too long. Maximum 5000 characters.',
            'recaptcha_token.required' => 'reCAPTCHA verification is required. Please refresh the page and try again.',
            'recaptcha_token.string' => 'reCAPTCHA token must be a valid string.',
        ];
    }
}
