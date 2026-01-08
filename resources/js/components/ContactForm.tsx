import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Loader2 } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import { useState, useEffect, useRef } from 'react';

interface ContactFormProps {
    errors?: {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
    };
    recaptchaSiteKey?: string;
}

declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

interface ValidationErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export function ContactForm({ errors = {}, recaptchaSiteKey }: ContactFormProps) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        recaptcha_token: '', // Always include in form data
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const scriptLoaded = useRef(false);

    // Load reCAPTCHA script
    useEffect(() => {
        if (!recaptchaSiteKey || scriptLoaded.current) return;

        // Check if script already exists
        const existingScript = document.querySelector(`script[src*="recaptcha"]`);
        if (existingScript) {
            scriptLoaded.current = true;
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
            console.error('Failed to load reCAPTCHA script');
        };
        
        document.head.appendChild(script);
        scriptLoaded.current = true;

        return () => {
            // Don't remove script on unmount as it might be used by other components
        };
    }, [recaptchaSiteKey]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Name validation
        if (!data.name.trim()) {
            newErrors.name = 'Please provide your name.';
        } else if (data.name.length > 255) {
            newErrors.name = 'Name must not exceed 255 characters.';
        }

        // Email validation
        if (!data.email.trim()) {
            newErrors.email = 'Please provide your email address.';
        } else if (!validateEmail(data.email)) {
            newErrors.email = 'Please provide a valid email address.';
        } else if (data.email.length > 255) {
            newErrors.email = 'Email must not exceed 255 characters.';
        }

        // Subject validation (optional but has max length)
        if (data.subject && data.subject.length > 255) {
            newErrors.subject = 'Subject must not exceed 255 characters.';
        }

        // Message validation
        if (!data.message.trim()) {
            newErrors.message = 'Please provide a message.';
        } else if (data.message.length > 5000) {
            newErrors.message = 'Your message is too long. Maximum 5000 characters.';
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const waitForRecaptcha = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!recaptchaSiteKey) {
                resolve();
                return;
            }

            // Check if already loaded
            if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
                window.grecaptcha.ready(() => resolve());
                return;
            }

            // Wait for script to load
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max (50 * 100ms)
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
                    clearInterval(checkInterval);
                    window.grecaptcha.ready(() => resolve());
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('reCAPTCHA script failed to load after 5 seconds'));
                }
            }, 100);
        });
    };

    const getRecaptchaToken = async (): Promise<string | null> => {
        if (!recaptchaSiteKey || !window.grecaptcha) {
            return null;
        }

        try {
            return await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
        } catch (error) {
            console.error('reCAPTCHA error:', error);
            return null;
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous validation errors
        setValidationErrors({});

        // Client-side validation
        if (!validate()) {
            toastError('Please fix the errors in the form before submitting.');
            return;
        }

        // Get reCAPTCHA token if configured
        let recaptchaToken = '';
        if (recaptchaSiteKey) {
            try {
                // Wait for reCAPTCHA to be ready
                await waitForRecaptcha();
                
                if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
                    console.error('reCAPTCHA not available after waiting');
                    toastError('reCAPTCHA is not available. Please refresh the page and try again.');
                    return;
                }
                
                recaptchaToken = await getRecaptchaToken() || '';
                if (!recaptchaToken) {
                    console.error('Failed to get reCAPTCHA token');
                    toastError('reCAPTCHA verification failed. Please refresh the page and try again.');
                    return;
                }
            } catch (error) {
                console.error('reCAPTCHA error:', error);
                toastError('reCAPTCHA is not available. Please refresh the page and try again.');
                return;
            }
        }

        // Submit with reCAPTCHA token included - use router.post with complete data
        const formDataWithToken = {
            ...data,
            recaptcha_token: recaptchaToken || '',
        };
        router.post('/contact', formDataWithToken, {
            onSuccess: () => {
                // Reset form and show success toast after successful submission
                reset();
                setValidationErrors({});
                toastSuccess('Thank you for your message. We will get back to you soon.');
            },
            onError: (errors) => {
                // Show toast for general errors
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toastError(errorMessages.join(', ') || 'Please check the form and try again.');
                }
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                        setData('name', e.target.value);
                        if (validationErrors.name) {
                            setValidationErrors(prev => ({ ...prev, name: undefined }));
                        }
                    }}
                    maxLength={255}
                    required
                    className="mt-1"
                    autoComplete="name"
                />
                <InputError message={validationErrors.name || errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => {
                        setData('email', e.target.value);
                        if (validationErrors.email) {
                            setValidationErrors(prev => ({ ...prev, email: undefined }));
                        }
                    }}
                    maxLength={255}
                    required
                    className="mt-1"
                    autoComplete="email"
                />
                <InputError message={validationErrors.email || errors.email} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={data.subject}
                    onChange={(e) => {
                        setData('subject', e.target.value);
                        if (validationErrors.subject) {
                            setValidationErrors(prev => ({ ...prev, subject: undefined }));
                        }
                    }}
                    maxLength={255}
                    className="mt-1"
                />
                <InputError message={validationErrors.subject || errors.subject} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    value={data.message}
                    onChange={(e) => {
                        setData('message', e.target.value);
                        if (validationErrors.message) {
                            setValidationErrors(prev => ({ ...prev, message: undefined }));
                        }
                    }}
                    maxLength={5000}
                    required
                    rows={6}
                    className="mt-1"
                />
                <div className="flex justify-between items-center mt-1">
                    <InputError message={validationErrors.message || errors.message} className="mt-0" />
                    <span className="text-xs text-muted-foreground ml-auto">
                        {data.message.length}/5000
                    </span>
                </div>
            </div>

            <div>
                <Button type="submit" disabled={processing} className="min-w-[140px]">
                    {processing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                </Button>
            </div>
        </form>
    );
}
