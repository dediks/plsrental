<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutRequest extends FormRequest
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
            'intro' => ['required', 'array'],
            'intro.heading' => ['nullable', 'string'],
            'intro.paragraph' => ['nullable', 'string'],
            'image' => ['required', 'array'],
            'image.image' => ['nullable', 'string'],
            'image.alt' => ['nullable', 'string', 'max:255'],
            'philosophy' => ['required', 'array'],
            'philosophy.heading' => ['nullable', 'string'],
            'philosophy.intro' => ['nullable', 'string'],
            'philosophy.subsections' => ['nullable', 'array'],
            'philosophy.subsections.*.title' => ['nullable', 'string'],
            'philosophy.subsections.*.content' => ['nullable', 'string'],
            'philosophy.subsections.*.image' => ['nullable', 'string'],
            'philosophy.subsections.*.alt' => ['nullable', 'string', 'max:255'],
            'founder' => ['required', 'array'],
            'founder.heading' => ['nullable', 'string'],
            'founder.paragraphs' => ['nullable', 'array'],
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
            'intro.required' => 'The intro section is required.',
            'image.required' => 'The image section is required.',
            'image.alt.max' => 'The image alt text must not exceed 255 characters.',
            'philosophy.required' => 'The philosophy section is required.',
            'philosophy.subsections.*.alt.max' => 'Each subsection image alt text must not exceed 255 characters.',
            'founder.required' => 'The founder section is required.',
        ];
    }
}

