<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
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
            'hero' => ['required', 'array'],
            'hero.title' => ['nullable', 'string', 'max:255'],
            'form' => ['required', 'array'],
            'form.heading' => ['nullable', 'string', 'max:255'],
            'form.description' => ['nullable', 'string', 'max:500'],
            'contactInfo' => ['required', 'array'],
            'contactInfo.heading' => ['nullable', 'string', 'max:255'],
            'contactInfo.address' => ['nullable', 'string', 'max:500'],
            'contactInfo.phone' => ['nullable', 'string', 'max:50'],
            'contactInfo.email' => ['nullable', 'email', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'hero.required' => 'The hero section is required.',
            'hero.title.max' => 'The hero title must not exceed 255 characters.',
            'form.required' => 'The form section is required.',
            'form.heading.max' => 'The form heading must not exceed 255 characters.',
            'form.description.max' => 'The form description must not exceed 500 characters.',
            'contactInfo.required' => 'The contact info section is required.',
            'contactInfo.heading.max' => 'The contact info heading must not exceed 255 characters.',
            'contactInfo.address.max' => 'The address must not exceed 500 characters.',
            'contactInfo.phone.max' => 'The phone must not exceed 50 characters.',
            'contactInfo.email.email' => 'The email must be a valid email address.',
            'contactInfo.email.max' => 'The email must not exceed 255 characters.',
        ];
    }
}

