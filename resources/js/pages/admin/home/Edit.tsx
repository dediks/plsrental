import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/admin/FormField';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toastSuccess, toastError } from '@/lib/toast';
import { HomeProps, HeroConfig, StatsConfig, ServicesConfig, WhyChooseConfig, PortfolioConfig, ProcessConfig, TestimonialsConfig, FinalCTAConfig, FooterConfig, AboutConfig, PartnersConfig } from '@/types/home';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Home Page', href: '#' },
];

type EditProps = HomeProps;

// Define strict form data type where optional fields are required (because we initialize them)
// and exclude fields like seo which are not edited here and cause type issues.
interface HomeFormData {
    hero: HeroConfig;
    stats: StatsConfig;
    services: ServicesConfig;
    whyChoose: WhyChooseConfig;
    portfolio: PortfolioConfig;
    process: ProcessConfig;
    testimonials: TestimonialsConfig;
    finalCTA: FinalCTAConfig;
    footer: FooterConfig;
    about: AboutConfig;
    partners: PartnersConfig;
}

interface MediaItem {
    id: number;
    path: string;
    url: string;
    alt_text?: string;
    caption?: string;
    order: number;
    is_featured: boolean;
}

interface VideoItem {
    id: number;
    path: string;
    url: string;
    mime_type?: string;
    size?: number;
    duration?: number;
}

export default function Edit({ 
    hero, stats, services, whyChoose, portfolio, process, testimonials, finalCTA, footer, about, partners 
}: EditProps) {
    const [activeSection, setActiveSection] = useState<string>('hero');

    const { data, setData, put, processing, errors } = useForm<HomeFormData>({
        hero: hero || {},
        stats: stats || {},
        services: services || {},
        whyChoose: whyChoose || {},
        portfolio: portfolio || {},
        process: process || {},
        testimonials: testimonials || {},
        finalCTA: finalCTA || {},
        footer: footer || {},
        about: about || {},
        partners: partners || {},
    });

    // --- Helpers ---

    const convertUrlToMediaItem = (url: string, index: number = 0, idOffset: number = 0): MediaItem => {
         const path = url.startsWith('/storage/') 
            ? url.replace('/storage/', '') 
            : url.startsWith('/') 
                ? url.substring(1)
                : url;
        
        return {
            id: -(index + idOffset),
            path: path,
            url: url,
            alt_text: '',
            caption: '',
            order: index,
            is_featured: false,
        } as MediaItem;
    };

    const convertMediaItemToUrl = (item: MediaItem): string => {
        if (item.url) return item.url;
        if (item.path && !item.path.startsWith('/storage/') && !item.path.startsWith('http')) {
            return item.path.startsWith('/') ? item.path : `/storage/${item.path}`;
        }
        return item.path || '';
    };

    // --- Media Memos ---

    const heroMediaItems = useMemo(() => {
        return (data.hero.carouselImages || [])
            .map((url: string, index: number) => convertUrlToMediaItem(url, index, 1));
    }, [data.hero.carouselImages]);

    const splitLayoutMediaItem = useMemo(() => {
        if (!data.hero.splitLayoutImage) return [];
        return [convertUrlToMediaItem(data.hero.splitLayoutImage, 0, 999)];
    }, [data.hero.splitLayoutImage]);

    const trustedByAvatarItems = useMemo(() => {
        return (data.hero.trustedByAvatars || [])
            .map((url: string, index: number) => convertUrlToMediaItem(url, index, 2000));
    }, [data.hero.trustedByAvatars]);

    const backgroundVideoItem = useMemo(() => {
        if (!data.hero.backgroundVideo) return null;
        // Reuse logic but return VideoItem
        const m = convertUrlToMediaItem(data.hero.backgroundVideo, 0, 9999);
        return { ...m, mime_type: 'video/mp4' } as unknown as VideoItem;
    }, [data.hero.backgroundVideo]);

    const whyChooseImageItem = useMemo(() => {
        if (!data.whyChoose.image) return [];
        return [convertUrlToMediaItem(data.whyChoose.image, 0, 8888)];
    }, [data.whyChoose.image]);

    // --- Handlers ---

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/admin/home', {
            onSuccess: () => toastSuccess('Home page updated successfully!'),
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || 'Failed to update home page';
                toastError(errorMessage);
            },
        });
    };

    const sections = [
        { key: 'hero', label: 'Hero' },
        { key: 'stats', label: 'Stats' },
        { key: 'services', label: 'Services' },
        { key: 'whyChoose', label: 'Why Choose' },
        { key: 'portfolio', label: 'Portfolio' },
        { key: 'process', label: 'Process' },
        { key: 'testimonials', label: 'Testimonials' },
        { key: 'finalCTA', label: 'Final CTA' },
        { key: 'footer', label: 'Footer' },
    ];

    // Array manipulation helpers
    const addItem = (section: string, field: string, emptyItem: any) => {
        const sectionStr = section as keyof HomeFormData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentSection = data[sectionStr] as any;
        
        setData(sectionStr, {
            ...currentSection,
            [field]: [...(currentSection[field] || []), emptyItem]
        });
    };

    const removeItem = (section: string, field: string, index: number) => {
        const sectionStr = section as keyof HomeFormData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentSection = data[sectionStr] as any;
        const currentItems = currentSection[field] || [];
        
        setData(sectionStr, {
            ...currentSection,
            [field]: currentItems.filter((_: any, i: number) => i !== index)
        });
    };

    const updateItem = (section: string, field: string, index: number, key: string, value: any) => {
        const sectionStr = section as keyof HomeFormData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentSection = data[sectionStr] as any;
        const currentItems = [...(currentSection[field] || [])];
        
        currentItems[index] = { ...currentItems[index], [key]: value };
        
        setData(sectionStr, {
            ...currentSection,
            [field]: currentItems
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Home Page" />
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Home Page</h1>
                    <p className="text-muted-foreground mt-1">Manage content for the home page sections</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Section Navigation */}
                    <div className="flex flex-wrap gap-2 border-b">
                        {sections.map((section) => (
                            <button
                                key={section.key}
                                type="button"
                                onClick={() => setActiveSection(section.key)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                                    activeSection === section.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* Hero Section */}
                    {activeSection === 'hero' && (
                        <div className="space-y-6">
                             <FormField label="Heading" name="hero.heading" error={errors['hero.heading']}>
                                <Input value={data.hero.heading} onChange={e => setData('hero', { ...data.hero, heading: e.target.value })} />
                            </FormField>
                             <FormField label="Subheading" name="hero.subheading" error={errors['hero.subheading']}>
                                <Textarea value={data.hero.subheading} onChange={e => setData('hero', { ...data.hero, subheading: e.target.value })} />
                            </FormField>
                             <FormField label="Carousel Images" name="hero.carouselImages">
                                <MediaSelector 
                                    value={heroMediaItems} 
                                    onChange={items => setData('hero', { ...data.hero, carouselImages: items.map(convertMediaItemToUrl) })}
                                    maxImages={10} 
                                />
                            </FormField>
                            <FormField label="Split Layout Image" name="hero.splitLayoutImage">
                                <MediaSelector 
                                    value={splitLayoutMediaItem} 
                                    onChange={items => setData('hero', { ...data.hero, splitLayoutImage: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                    maxImages={1} 
                                />
                            </FormField>
                            {/* Additional simplified fields for brevity as seen in original file */}
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={data.hero.showCarousel} onCheckedChange={c => setData('hero', { ...data.hero, showCarousel: !!c })} />
                                <span>Show Carousel</span>
                            </div>
                        </div>
                    )}

                    {/* Stats Section */}
                    {activeSection === 'stats' && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Switch checked={data.stats.showStats} onCheckedChange={c => setData('stats', { ...data.stats, showStats: c })} />
                                <span>Show Stats Section</span>
                            </div>
                            
                            <div className="space-y-4">
                                {(data.stats.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-2 flex-1">
                                            <Input placeholder="Label (e.g. Years Experience)" value={item.label} onChange={e => updateItem('stats', 'items', index, 'label', e.target.value)} />
                                            <Input placeholder="Value (e.g. 10+)" value={item.value} onChange={e => updateItem('stats', 'items', index, 'value', e.target.value)} />
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('stats', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('stats', 'items', { label: '', value: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Stat
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Services Section */}
                    {activeSection === 'services' && (
                        <div className="space-y-6">
                            <FormField label="Heading" name="services.heading"><Input value={data.services.heading} onChange={e => setData('services', { ...data.services, heading: e.target.value })} /></FormField>
                            <FormField label="Subheading" name="services.subheading"><Textarea value={data.services.subheading} onChange={e => setData('services', { ...data.services, subheading: e.target.value })} /></FormField>

                            <div className="space-y-4">
                                {(data.services.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-3 flex-1">
                                            <Input placeholder="Service Title" value={item.title} onChange={e => updateItem('services', 'items', index, 'title', e.target.value)} />
                                            <Textarea placeholder="Description" value={item.description} onChange={e => updateItem('services', 'items', index, 'description', e.target.value)} />
                                            <Input placeholder="Icon Name (Lucide, e.g. Speaker)" value={item.icon} onChange={e => updateItem('services', 'items', index, 'icon', e.target.value)} />
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('services', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('services', 'items', { title: '', description: '', icon: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Service
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Why Choose Section */}
                    {activeSection === 'whyChoose' && (
                        <div className="space-y-6">
                            <FormField label="Subtitle" name="whyChoose.subtitle"><Input value={data.whyChoose.subtitle} onChange={e => setData('whyChoose', { ...data.whyChoose, subtitle: e.target.value })} /></FormField>
                            <FormField label="Heading" name="whyChoose.heading"><Input value={data.whyChoose.heading} onChange={e => setData('whyChoose', { ...data.whyChoose, heading: e.target.value })} /></FormField>
                            <FormField label="Description" name="whyChoose.description"><Textarea value={data.whyChoose.description} onChange={e => setData('whyChoose', { ...data.whyChoose, description: e.target.value })} /></FormField>
                            <FormField label="Quote" name="whyChoose.quote"><Input value={data.whyChoose.quote} onChange={e => setData('whyChoose', { ...data.whyChoose, quote: e.target.value })} /></FormField>
                            
                            <FormField label="Image" name="whyChoose.image">
                                <MediaSelector 
                                    value={whyChooseImageItem} 
                                    onChange={items => setData('whyChoose', { ...data.whyChoose, image: items.length ? convertMediaItemToUrl(items[0]) : '' })}
                                    maxImages={1} 
                                />
                            </FormField>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Reasons</h3>
                                {(data.whyChoose.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-2 flex-1">
                                            <Input placeholder="Title" value={item.title} onChange={e => updateItem('whyChoose', 'items', index, 'title', e.target.value)} />
                                            <Textarea placeholder="Text" value={item.text} onChange={e => updateItem('whyChoose', 'items', index, 'text', e.target.value)} />
                                            <Input placeholder="Icon (Lucide)" value={item.icon} onChange={e => updateItem('whyChoose', 'items', index, 'icon', e.target.value)} />
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('whyChoose', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('whyChoose', 'items', { title: '', text: '', icon: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Reason
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Portfolio Section */}
                    {activeSection === 'portfolio' && (
                        <div className="space-y-6">
                            <FormField label="Heading" name="portfolio.heading"><Input value={data.portfolio.heading} onChange={e => setData('portfolio', { ...data.portfolio, heading: e.target.value })} /></FormField>
                            <FormField label="Subheading" name="portfolio.subheading"><Textarea value={data.portfolio.subheading} onChange={e => setData('portfolio', { ...data.portfolio, subheading: e.target.value })} /></FormField>

                             <div className="space-y-4">
                                {(data.portfolio.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-3 flex-1">
                                            <Input placeholder="Project Title" value={item.title} onChange={e => updateItem('portfolio', 'items', index, 'title', e.target.value)} />
                                            <Input placeholder="Category" value={item.category} onChange={e => updateItem('portfolio', 'items', index, 'category', e.target.value)} />
                                            <div>
                                                <label className="text-xs mb-1 block">Image</label>
                                                <MediaSelector 
                                                    value={item.imageUrl ? [convertUrlToMediaItem(item.imageUrl, 0, 9000 + index)] : []}
                                                    onChange={items => updateItem('portfolio', 'items', index, 'imageUrl', items.length ? convertMediaItemToUrl(items[0]) : '')}
                                                    maxImages={1}
                                                />
                                            </div>
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('portfolio', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('portfolio', 'items', { title: '', category: '', imageUrl: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Portfolio Item
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Process Section */}
                    {activeSection === 'process' && (
                         <div className="space-y-6">
                            <FormField label="Heading" name="process.heading"><Input value={data.process.heading} onChange={e => setData('process', { ...data.process, heading: e.target.value })} /></FormField>
                            <FormField label="Subheading" name="process.subheading"><Textarea value={data.process.subheading} onChange={e => setData('process', { ...data.process, subheading: e.target.value })} /></FormField>

                             <div className="space-y-4">
                                {(data.process.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-3 flex-1">
                                            <div className="flex gap-2">
                                                 <Input className="w-20" placeholder="Num" value={item.num} onChange={e => updateItem('process', 'items', index, 'num', e.target.value)} />
                                                 <Input className="flex-1" placeholder="Step Title" value={item.title} onChange={e => updateItem('process', 'items', index, 'title', e.target.value)} />
                                            </div>
                                            <Textarea placeholder="Description" value={item.desc} onChange={e => updateItem('process', 'items', index, 'desc', e.target.value)} />
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('process', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('process', 'items', { num: '0' + ((data.process.items?.length || 0) + 1), title: '', desc: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Step
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Testimonials Section */}
                    {activeSection === 'testimonials' && (
                        <div className="space-y-6">
                            <FormField label="Heading" name="testimonials.heading"><Input value={data.testimonials.heading} onChange={e => setData('testimonials', { ...data.testimonials, heading: e.target.value })} /></FormField>

                             <div className="space-y-4">
                                {(data.testimonials.items || []).map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start border p-4 rounded-md">
                                        <div className="grid gap-3 flex-1">
                                            <Textarea placeholder="Review Text" value={item.text} onChange={e => updateItem('testimonials', 'items', index, 'text', e.target.value)} />
                                            <Input placeholder="Author Name" value={item.author} onChange={e => updateItem('testimonials', 'items', index, 'author', e.target.value)} />
                                            <div className="flex gap-2">
                                                <Input placeholder="Role" value={item.role} onChange={e => updateItem('testimonials', 'items', index, 'role', e.target.value)} />
                                                <Input placeholder="Company" value={item.company} onChange={e => updateItem('testimonials', 'items', index, 'company', e.target.value)} />
                                            </div>
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeItem('testimonials', 'items', index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => addItem('testimonials', 'items', { text: '', author: '', role: '', company: '' })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Final CTA Section */}
                    {activeSection === 'finalCTA' && (
                        <div className="space-y-6">
                            <FormField label="Heading" name="finalCTA.heading"><Input value={data.finalCTA.heading} onChange={e => setData('finalCTA', { ...data.finalCTA, heading: e.target.value })} /></FormField>
                            <FormField label="Subheading" name="finalCTA.subheading"><Textarea value={data.finalCTA.subheading} onChange={e => setData('finalCTA', { ...data.finalCTA, subheading: e.target.value })} /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Button Text" name="finalCTA.buttonText"><Input value={data.finalCTA.buttonText} onChange={e => setData('finalCTA', { ...data.finalCTA, buttonText: e.target.value })} /></FormField>
                                <FormField label="Button Link" name="finalCTA.buttonLink"><Input value={data.finalCTA.buttonLink} onChange={e => setData('finalCTA', { ...data.finalCTA, buttonLink: e.target.value })} /></FormField>
                            </div>
                            <FormField label="Phone Number" name="finalCTA.phoneNumber"><Input value={data.finalCTA.phoneNumber} onChange={e => setData('finalCTA', { ...data.finalCTA, phoneNumber: e.target.value })} /></FormField>
                        </div>
                    )}


                    {/* Footer Section */}
                    {activeSection === 'footer' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Brand Name" name="footer.brandName"><Input value={data.footer.brandName} onChange={e => setData('footer', { ...data.footer, brandName: e.target.value })} /></FormField>
                                {/* brandDescription */}
                                <FormField label="Brand Description" name="footer.brandDescription"><Textarea value={data.footer.brandDescription} onChange={e => setData('footer', { ...data.footer, brandDescription: e.target.value })} /></FormField>
                            </div>
                            
                            <h3 className="font-semibold pt-2">Social Links</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Instagram Link" name="footer.socialLinks.instagram">
                                    <Input 
                                        value={data.footer.socialLinks?.instagram || ''} 
                                        onChange={e => setData('footer', { 
                                            ...data.footer, 
                                            socialLinks: { ...data.footer.socialLinks, instagram: e.target.value } 
                                        })} 
                                    />
                                </FormField>
                                <FormField label="LinkedIn Link" name="footer.socialLinks.linkedin">
                                    <Input 
                                        value={data.footer.socialLinks?.linkedin || ''} 
                                        onChange={e => setData('footer', { 
                                            ...data.footer, 
                                            socialLinks: { ...data.footer.socialLinks, linkedin: e.target.value } 
                                        })} 
                                    />
                                </FormField>
                                <FormField label="Facebook Link" name="footer.socialLinks.facebook">
                                    <Input 
                                        value={data.footer.socialLinks?.facebook || ''} 
                                        onChange={e => setData('footer', { 
                                            ...data.footer, 
                                            socialLinks: { ...data.footer.socialLinks, facebook: e.target.value } 
                                        })} 
                                    />
                                </FormField>
                                <FormField label="Twitter Link" name="footer.socialLinks.twitter">
                                    <Input 
                                        value={data.footer.socialLinks?.twitter || ''} 
                                        onChange={e => setData('footer', { 
                                            ...data.footer, 
                                            socialLinks: { ...data.footer.socialLinks, twitter: e.target.value } 
                                        })} 
                                    />
                                </FormField>
                            </div>

                            <h3 className="font-semibold pt-2">Contact Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Phone" name="footer.phone"><Input value={data.footer.phone} onChange={e => setData('footer', { ...data.footer, phone: e.target.value })} /></FormField>
                                <FormField label="Email" name="footer.email"><Input value={data.footer.email} onChange={e => setData('footer', { ...data.footer, email: e.target.value })} /></FormField>
                            </div>
                            <FormField label="Address" name="footer.address"><Textarea value={data.footer.address} onChange={e => setData('footer', { ...data.footer, address: e.target.value })} /></FormField>
                            
                             <FormField label="Copyright Text" name="footer.copyrightText"><Input value={data.footer.copyrightText} onChange={e => setData('footer', { ...data.footer, copyrightText: e.target.value })} /></FormField>
                        </div>
                    )}

                    <div className="flex justify-end sticky bottom-0 bg-background pt-4 pb-4 border-t z-10">
                        <Button type="submit" disabled={processing} size="lg">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
