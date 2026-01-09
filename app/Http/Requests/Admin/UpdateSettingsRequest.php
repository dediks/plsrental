<?php

namespace App\Http\Requests\Admin;

use App\Models\Media;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
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
            'logoLight' => [
                'nullable',
                'integer',
                Rule::exists('media_metadata', 'id'),
            ],

            'maintenanceMode' => ['nullable', 'boolean'],
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
            'logoLight.integer' => 'The light logo must be a valid media ID.',
            'logoLight.exists' => 'The selected light logo media does not exist or is not a valid logo.',
            'logoDark.integer' => 'The dark logo must be a valid media ID.',
            'logoDark.exists' => 'The selected dark logo media does not exist or is not a valid logo.',
        ];
    }
}

