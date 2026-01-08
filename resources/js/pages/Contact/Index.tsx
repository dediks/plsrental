import { ContactForm } from '@/components/ContactForm';
import { PageHero } from '@/components/PageHero';
import MainLayout from '@/layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import { Seo } from '@/components/Seo';

interface ContactIndexProps {
    hero?: {
        title?: string;
    };
    form?: {
        heading?: string;
        description?: string;
    };
    contactInfo?: {
        heading?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
    errors?: {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
    };
    success?: string;
    recaptchaSiteKey?: string;
    seo?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        canonical?: string;
        type?: string;
        siteName?: string;
        twitterHandle?: string;
        ogTitle?: string;
        ogDescription?: string;
        structuredData?: Array<Record<string, unknown>> | Record<string, unknown>;
    };
}

export default function Contact({ hero, form, contactInfo, errors, success, recaptchaSiteKey, seo }: ContactIndexProps) {
    const page = usePage();
    const flashSuccess = success || (page.props as any).flash?.success;
    
    const heroTitle = hero?.title || 'Contact Us';
    const formHeading = form?.heading || 'Send us a message';
    const formDescription = form?.description || 'Fill out the form below and we\'ll get back to you as soon as possible.';
    const contactInfoHeading = contactInfo?.heading || 'Get in touch';
    const address = contactInfo?.address || '';
    const phone = contactInfo?.phone || '';
    const email = contactInfo?.email || '';

    return (
        <MainLayout>
            {seo && <Seo {...seo} />}

            <PageHero title={heroTitle} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">

                {flashSuccess && (
                    <div className="mt-6 rounded-md border border-green-500 bg-green-50 dark:bg-green-900/20 p-4">
                        <p className="body-sm text-green-800 dark:text-green-200 font-medium">{flashSuccess}</p>
                    </div>
                )}

                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 max-w-5xl">
                    {/* Contact Form */}
                    <div>
                        <h2 className="h3 text-foreground">
                            {formHeading}
                        </h2>
                        <p className="mt-2 body text-muted-foreground">
                            {formDescription}
                        </p>
                        <div className="mt-6">
                            <ContactForm errors={errors} recaptchaSiteKey={recaptchaSiteKey} />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h2 className="h3 text-foreground">
                            {contactInfoHeading}
                        </h2>
                        <div className="mt-6 space-y-6">
                            {address && (
                                <div>
                                    <h3 className="h5 text-foreground">
                                        Address
                                    </h3>
                                    <p className="mt-2 body text-muted-foreground whitespace-pre-line">
                                        {address}
                                    </p>
                                </div>
                            )}

                            {phone && (
                                <div>
                                    <h3 className="h5 text-foreground">
                                        Phone
                                    </h3>
                                    <p className="mt-2 body text-muted-foreground">
                                        <a
                                            href={`tel:${phone.replace(/\s/g, '')}`}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {phone}
                                        </a>
                                    </p>
                                </div>
                            )}

                            {email && (
                                <div>
                                    <h3 className="h5 text-foreground">
                                        Email
                                    </h3>
                                    <p className="mt-2 body text-muted-foreground">
                                        <a
                                            href={`mailto:${email}`}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {email}
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
