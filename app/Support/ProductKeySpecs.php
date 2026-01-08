<?php

namespace App\Support;

class ProductKeySpecs
{
    /**
     * Compute key specs from overview_specs selections and specifications data.
     *
     * @param  array|null  $overviewSpecs  Array of {section: string, label: string}
     * @param  array|null  $specifications  Flat specifications map
     * @return array Array of {label: string, value: string}
     */
    public static function compute(?array $overviewSpecs, ?array $specifications): array
    {
        if (empty($overviewSpecs) || empty($specifications)) {
            return [];
        }

        $keySpecs = [];

        // Decode specifications into structured format
        $decoded = self::decodeSpecifications($specifications);

        // For each selected overview spec, find matching row
        foreach ($overviewSpecs as $selection) {
            $sectionLabel = $selection['section'] ?? null;
            $rowLabel = $selection['label'] ?? null;

            if (! $sectionLabel || ! $rowLabel) {
                continue;
            }

            // Find matching section
            $section = collect($decoded)->first(function ($s) use ($sectionLabel) {
                return isset($s['label']) && $s['label'] === $sectionLabel;
            });

            if (! $section) {
                continue;
            }

            // Find matching row within section
            $row = collect($section['rows'] ?? [])->first(function ($r) use ($rowLabel) {
                return isset($r['label']) && $r['label'] === $rowLabel;
            });

            if ($row && isset($row['value']) && $row['value'] !== '') {
                $keySpecs[] = [
                    'label' => $rowLabel,
                    'value' => $row['value'],
                ];
            }
        }

        return $keySpecs;
    }

    /**
     * Decode flat specifications format into structured sections/rows.
     *
     * @return array Array of {label: string, rows: [{label: string, value: string}]}
     */
    private static function decodeSpecifications(array $flatSpecs): array
    {
        $sectionsMap = [];

        foreach ($flatSpecs as $key => $value) {
            // Section label
            if (str_starts_with($key, 'spec_section_label__')) {
                $sectionSlug = str_replace('spec_section_label__', '', $key);
                if (! isset($sectionsMap[$sectionSlug])) {
                    $sectionsMap[$sectionSlug] = [
                        'slug' => $sectionSlug,
                        'label' => $value,
                        'rows' => [],
                    ];
                } else {
                    $sectionsMap[$sectionSlug]['label'] = $value;
                }
            }
            // Row label
            elseif (str_starts_with($key, 'spec_label__')) {
                $parts = explode('__', str_replace('spec_label__', '', $key));
                if (count($parts) === 2) {
                    [$sectionSlug, $rowSlug] = $parts;
                    if (! isset($sectionsMap[$sectionSlug])) {
                        $sectionsMap[$sectionSlug] = [
                            'slug' => $sectionSlug,
                            'label' => '',
                            'rows' => [],
                        ];
                    }
                    $section = &$sectionsMap[$sectionSlug];
                    $existingRowIndex = collect($section['rows'])->search(function ($r) use ($rowSlug) {
                        return ($r['slug'] ?? null) === $rowSlug;
                    });
                    if ($existingRowIndex !== false) {
                        $section['rows'][$existingRowIndex]['label'] = $value;
                    } else {
                        $section['rows'][] = [
                            'slug' => $rowSlug,
                            'label' => $value,
                            'value' => '',
                        ];
                    }
                }
            }
            // Row value
            elseif (str_starts_with($key, 'spec__')) {
                $parts = explode('__', str_replace('spec__', '', $key));
                if (count($parts) === 2) {
                    [$sectionSlug, $rowSlug] = $parts;
                    if (! isset($sectionsMap[$sectionSlug])) {
                        $sectionsMap[$sectionSlug] = [
                            'slug' => $sectionSlug,
                            'label' => '',
                            'rows' => [],
                        ];
                    }
                    $section = &$sectionsMap[$sectionSlug];
                    $existingRowIndex = collect($section['rows'])->search(function ($r) use ($rowSlug) {
                        return ($r['slug'] ?? null) === $rowSlug;
                    });
                    if ($existingRowIndex !== false) {
                        $section['rows'][$existingRowIndex]['value'] = $value;
                    } else {
                        $section['rows'][] = [
                            'slug' => $rowSlug,
                            'label' => '',
                            'value' => $value,
                        ];
                    }
                }
            }
        }

        // Filter out sections with no rows and return as array
        return collect($sectionsMap)
            ->filter(function ($section) {
                return ! empty($section['rows']);
            })
            ->map(function ($section) {
                return [
                    'label' => $section['label'] ?? '',
                    'rows' => collect($section['rows'])
                        ->filter(function ($row) {
                            return ! empty($row['label']) || ! empty($row['value']);
                        })
                        ->map(function ($row) {
                            return [
                                'label' => $row['label'] ?? '',
                                'value' => $row['value'] ?? '',
                            ];
                        })
                        ->values()
                        ->toArray(),
                ];
            })
            ->filter(function ($section) {
                return ! empty($section['rows']);
            })
            ->values()
            ->toArray();
    }
}
