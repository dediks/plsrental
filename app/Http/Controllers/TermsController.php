<?php

namespace App\Http\Controllers;

use App\Services\SeoService;
use Inertia\Inertia;

class TermsController extends Controller
{
    public function index()
    {
        $sections = [
            [
                'title' => 'Introduction',
                'content' => 'These Terms of Service ("Terms") govern your access to and use of the UAProfessional website (the "Service") operated by UAProfessional ("we", "us", or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.',
            ],
            [
                'title' => 'Acceptance of Terms',
                'content' => 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
            ],
            [
                'title' => 'Use License',
                'content' => 'Permission is granted to temporarily access the materials on UAProfessional\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

• Modify or copy the materials
• Use the materials for any commercial purpose or for any public display (commercial or non-commercial)
• Attempt to decompile or reverse engineer any software contained on the website
• Remove any copyright or other proprietary notations from the materials
• Transfer the materials to another person or "mirror" the materials on any other server

This license shall automatically terminate if you violate any of these restrictions and may be terminated by UAProfessional at any time.',
            ],
            [
                'title' => 'Intellectual Property Rights',
                'content' => 'The Service and its original content, features, and functionality are and will remain the exclusive property of UAProfessional and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.',
            ],
            [
                'title' => 'User Accounts',
                'content' => 'Our Service provides user accounts for authorized personnel to manage website content. If you are granted access to create an account, you are responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account. Account access is granted at our sole discretion and may be revoked at any time.',
            ],
            [
                'title' => 'User Conduct',
                'content' => 'You agree not to use the Service:

• In any way that violates any applicable national or international law or regulation
• To transmit, or procure the sending of, any advertising or promotional material, spam, or unsolicited communications without our prior written consent
• To impersonate or attempt to impersonate UAProfessional, a company employee, another user, or any other person or entity
• To submit false, misleading, or fraudulent information through our contact form
• In any way that infringes upon the rights of others, including intellectual property rights
• To engage in any activity that is illegal, threatening, fraudulent, harmful, or that could damage, disable, or impair the website
• To attempt to gain unauthorized access to any portion of the website, accounts, computer systems, or networks
• To use automated systems, bots, or scrapers to access or collect data from the website without our prior written consent
• To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the website',
            ],
            [
                'title' => 'Website Content and Information',
                'content' => 'This website provides informational content about our professional audio equipment, including product catalogs, articles, news, supplier directories, rental information, and gallery images. All information on this website is provided on an "as is" basis for informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information contained on the website for any purpose.',
            ],
            [
                'title' => 'Product Information',
                'content' => 'The product information displayed on this website, including specifications, features, images, and descriptions, is provided for informational purposes only. We make every effort to display this information as accurately as possible, but we do not warrant that product descriptions, specifications, colors, images, or other content are accurate, complete, reliable, current, or error-free. Product availability, pricing, and specifications may change without notice. This website does not facilitate online purchases or transactions.',
            ],
            [
                'title' => 'Contact Form Submissions',
                'content' => 'When you submit information through our contact form, you agree to provide accurate and truthful information. We use the information you provide solely to respond to your inquiries and provide customer support. By submitting the contact form, you consent to us processing and storing your information as described in our Privacy Policy.',
            ],
            [
                'title' => 'Supplier and Rental Directory Information',
                'content' => 'The supplier and rental directory information provided on this website is for informational purposes only. We do not endorse, guarantee, or assume responsibility for the services, products, or business practices of any suppliers or rental companies listed on our website. Any business relationship you enter into with a supplier or rental company is solely between you and that third party.',
            ],
            [
                'title' => 'Limitation of Liability',
                'content' => 'In no event shall UAProfessional, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.',
            ],
            [
                'title' => 'Indemnification',
                'content' => 'You agree to defend, indemnify, and hold harmless UAProfessional and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney\'s fees).',
            ],
            [
                'title' => 'Links to Other Websites',
                'content' => 'Our Service may contain links to third-party websites or services that are not owned or controlled by UAProfessional. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that UAProfessional shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.',
            ],
            [
                'title' => 'Termination',
                'content' => 'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.',
            ],
            [
                'title' => 'Governing Law',
                'content' => 'These Terms shall be interpreted and governed by the laws of the Republic of Indonesia, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of the Republic of Indonesia.',
            ],
            [
                'title' => 'Changes to Terms',
                'content' => 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.',
            ],
            [
                'title' => 'Contact Information',
                'content' => 'If you have any questions about these Terms of Service, please contact us at:

UAProfessional
Indonesia
Email: uapsound@yahoo.com',
            ],
        ];

        $lastUpdated = 'January 2025';

        return Inertia::render('Terms/Index', [
            'sections' => $sections,
            'lastUpdated' => $lastUpdated,
            'seo' => SeoService::forTerms(),
        ]);
    }
}
