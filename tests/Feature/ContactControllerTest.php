<?php

it('displays the contact page', function () {
    $response = $this->get('/contact');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Contact/Index'));
});

it('stores a contact submission', function () {
    $data = [
        'name' => 'John Doe',
        'email' => 'john@admin@uapsound.com',
        'subject' => 'Test Subject',
        'message' => 'This is a test message',
    ];

    $response = $this->post('/contact', $data);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('contact_submissions', [
        'name' => 'John Doe',
        'email' => 'john@admin@uapsound.com',
        'subject' => 'Test Subject',
        'message' => 'This is a test message',
    ]);
});

it('validates required fields when submitting contact form', function () {
    $response = $this->post('/contact', []);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
});

it('validates email format', function () {
    $response = $this->post('/contact', [
        'name' => 'John Doe',
        'email' => 'invalid-email',
        'message' => 'Test message',
    ]);

    $response->assertSessionHasErrors(['email']);
});
