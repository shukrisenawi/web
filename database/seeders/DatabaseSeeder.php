<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\BlogPost;
use App\Models\FileUpload;
use App\Models\Invoice;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\Ticket;
use App\Models\FrontpageContent;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@kenju.tech'],
            [
                'name' => 'Kenju Admin',
                'password' => Hash::make('password'),
                'company' => 'Kenju Tech',
                'role' => User::ROLE_ADMIN,
                'avatar' => null,
            ]
        );
        $user->update(['role' => User::ROLE_ADMIN]);

        $client = User::firstOrCreate(
            ['email' => 'client@kenju.tech'],
            [
                'name' => 'Demo Client',
                'password' => Hash::make('password'),
                'company' => 'Acme Corporation',
                'role' => User::ROLE_CLIENT,
                'avatar' => null,
            ]
        );

        FrontpageContent::firstOrCreate([], FrontpageContent::defaultRecord());

        $projectsData = [
            ['title' => 'Fintech Mobile App', 'category' => 'Mobile App Development', 'progress' => 75, 'status' => 'in_progress', 'icon_color' => '#2563eb'],
            ['title' => 'School Management System', 'category' => 'Web System', 'progress' => 90, 'status' => 'in_progress', 'icon_color' => '#10b981'],
            ['title' => 'Food Delivery Website', 'category' => 'Website Development', 'progress' => 100, 'status' => 'completed', 'icon_color' => '#f59e0b'],
            ['title' => 'Digital Marketing Campaign', 'category' => 'Digital Marketing', 'progress' => 40, 'status' => 'in_progress', 'icon_color' => '#ec4899'],
            ['title' => 'IT Equipment Supply & Setup', 'category' => 'IT Solutions', 'progress' => 0, 'status' => 'on_hold', 'icon_color' => '#64748b'],
        ];

        $projects = collect();
        foreach ($projectsData as $index => $data) {
            $projects->push(Project::factory()->create([
                'user_id' => $client->id,
                'title' => $data['title'],
                'category' => $data['category'],
                'progress' => $data['progress'],
                'status' => $data['status'],
                'icon_color' => $data['icon_color'],
            ]));
        }

        $milestones = [
            ['project_id' => $projects[0]->id, 'title' => 'Fintech Mobile App', 'note' => 'Beta Testing', 'due_date' => '2025-05-25', 'is_active' => true],
            ['project_id' => $projects[1]->id, 'title' => 'School Management System', 'note' => 'User Acceptance Test', 'due_date' => '2025-05-30', 'is_active' => false],
            ['project_id' => $projects[3]->id, 'title' => 'Digital Marketing Campaign', 'note' => 'Campaign Launch', 'due_date' => '2025-06-05', 'is_active' => false],
        ];
        foreach ($milestones as $milestone) {
            Milestone::factory()->create($milestone);
        }

        $existingInvoiceNos = Invoice::pluck('invoice_no')->toArray();
        $invoicesData = [
            ['project_id' => $projects[1]->id, 'invoice_no' => 'INV-2025-005', 'issue_date' => '2025-05-01', 'amount' => 2850.00, 'status' => 'paid'],
            ['project_id' => $projects[0]->id, 'invoice_no' => 'INV-2025-004', 'issue_date' => '2025-04-15', 'amount' => 6500.00, 'status' => 'paid'],
            ['project_id' => $projects[2]->id, 'invoice_no' => 'INV-2025-003', 'issue_date' => '2025-04-01', 'amount' => 3200.00, 'status' => 'paid'],
            ['project_id' => $projects[3]->id, 'invoice_no' => 'INV-2025-002', 'issue_date' => '2025-03-20', 'amount' => 1850.00, 'status' => 'paid'],
            ['project_id' => $projects[4]->id, 'invoice_no' => 'INV-2025-001', 'issue_date' => '2025-03-10', 'amount' => 4250.00, 'status' => 'paid'],
        ];
        foreach ($invoicesData as $invoice) {
            if (in_array($invoice['invoice_no'], $existingInvoiceNos, true)) {
                continue;
            }
            Invoice::factory()->create([
                'user_id' => $client->id,
                'invoice_no' => $invoice['invoice_no'],
                'issue_date' => $invoice['issue_date'],
                'amount' => $invoice['amount'],
                'status' => $invoice['status'],
                'project_id' => $invoice['project_id'],
            ]);
        }

        $existingTicketNos = Ticket::pluck('ticket_no')->toArray();
        $ticketsData = [
            ['project_id' => $projects[0]->id, 'ticket_no' => 'TKT-2025-008', 'subject' => 'Login issue on mobile app', 'status' => 'open', 'priority' => 'high'],
            ['project_id' => $projects[0]->id, 'ticket_no' => 'TKT-2025-007', 'subject' => 'Feature request: Dark mode', 'status' => 'in_progress', 'priority' => 'low'],
            ['project_id' => $projects[2]->id, 'ticket_no' => 'TKT-2025-006', 'subject' => 'Website loading slowly', 'status' => 'open', 'priority' => 'medium'],
            ['project_id' => $projects[0]->id, 'ticket_no' => 'TKT-2025-005', 'subject' => 'Payment gateway error', 'status' => 'resolved', 'priority' => 'high'],
        ];
        foreach ($ticketsData as $ticket) {
            if (in_array($ticket['ticket_no'], $existingTicketNos, true)) {
                continue;
            }
            Ticket::factory()->create([
                'user_id' => $client->id,
                'description' => 'Sample support ticket description.',
                ...$ticket,
            ]);
        }

        $filesData = [
            ['project_id' => $projects[1]->id, 'filename' => 'Project Proposal.pdf', 'size' => '2.4 MB'],
            ['project_id' => $projects[1]->id, 'filename' => 'Wireframes.zip', 'size' => '5.7 MB'],
            ['project_id' => $projects[1]->id, 'filename' => 'Brand Guidelines.pdf', 'size' => '3.1 MB'],
        ];
        foreach ($filesData as $file) {
            FileUpload::factory()->create([
                'uploaded_by' => $client->id,
                'path' => 'uploads/' . $file['filename'],
                'mime_type' => 'application/pdf',
                ...$file,
            ]);
        }

        $activityData = [
            ['type' => 'milestone', 'description' => 'New milestone "Beta Testing" added to Fintech Mobile App'],
            ['type' => 'invoice', 'description' => 'Invoice INV-2025-005 has been paid'],
            ['type' => 'file', 'description' => 'New file uploaded to School Management System'],
            ['type' => 'ticket', 'description' => 'Your ticket TKT-2025-007 status changed to In Progress'],
            ['type' => 'project', 'description' => 'Project Food Delivery Website marked as Completed'],
            ['type' => 'project', 'description' => 'New comment on Digital Marketing Campaign'],
        ];
        foreach ($activityData as $activity) {
            ActivityLog::factory()->create([
                'user_id' => $client->id,
                ...$activity,
            ]);
        }

        $blogPostsData = [
            [
                'title' => '5 Signs Your Business Needs a Custom Web System',
                'slug' => 'signs-your-business-needs-custom-web-system',
                'category' => 'Web System',
                'author' => 'Kenju Tech Team',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                'excerpt' => 'Is your team spending too much time on manual tasks? Here are the signs that a tailored web system can transform your operations.',
                'content' => "Custom web systems are no longer a luxury reserved for large enterprises. Small and medium businesses in Malaysia are now adopting tailored digital solutions to stay competitive, reduce manual work, and improve customer experience.\n\nIf your team is still copying data between spreadsheets, chasing paper approvals, or relying on disconnected apps, it may be time to consider a custom web system.\n\nHere are five clear signs your business is ready:\n\n1. Repetitive Manual Tasks Are Slowing You Down\nIf staff spend hours each week entering the same data into multiple systems, automation through a custom web system can give them back valuable time.\n\n2. You Use Multiple Tools That Don't Talk to Each Other\nA single integrated platform can replace scattered spreadsheets, chat-based orders and standalone apps, giving everyone one source of truth.\n\n3. Errors and Miscommunication Are Common\nManual processes invite mistakes. A tailored system with defined workflows and validations helps reduce human error and keeps operations consistent.\n\n4. Your Business Is Growing But Your Systems Are Not\nOff-the-shelf software often becomes a bottleneck. A custom system grows with your business and adapts to your changing processes.\n\n5. You Need Better Reporting and Decision Making\nReal-time dashboards and reports built around your KPIs help you make informed decisions faster.\n\nAt Kenju Tech, we design web systems that match how your business actually works. If any of these signs sound familiar, let's talk about how we can help.",
                'published_at' => '2025-06-10',
                'is_published' => true,
            ],
            [
                'title' => 'Why Mobile Apps Are Essential for Malaysian Businesses in 2025',
                'slug' => 'mobile-apps-essential-malaysian-businesses-2025',
                'category' => 'Mobile Apps',
                'author' => 'Kenju Tech Team',
                'image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
                'excerpt' => 'With smartphone usage at an all-time high, discover how a mobile app can help you engage customers and boost revenue.',
                'content' => "Malaysians spend more time on smartphones than ever before. For businesses, this means one thing: being on mobile is no longer optional.\n\nA well-designed mobile app can help you build loyalty, simplify bookings and purchases, and reach customers directly through push notifications.\n\nWhether you run a retail shop, a service business, or a growing startup, a mobile app can give your customers a faster and more convenient way to connect with you.\n\nIn 2025, the businesses that win will be the ones that meet customers where they already are, on their phones.",
                'published_at' => '2025-05-28',
                'is_published' => true,
            ],
            [
                'title' => 'How to Choose the Right Digital Marketing Strategy',
                'slug' => 'choose-right-digital-marketing-strategy',
                'category' => 'Digital Marketing',
                'author' => 'Kenju Tech Team',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
                'excerpt' => 'Not every channel works for every business. Learn how to pick the strategy that matches your goals and budget.',
                'content' => "Digital marketing offers endless options, from social media and search ads to email campaigns and content marketing. But more channels do not always mean better results.\n\nThe right strategy starts with understanding your audience. Where do they spend time online? What problems are they trying to solve? What motivates them to buy?\n\nOnce you know your audience, match your channels to your goals. Brand awareness may call for social media and video, while lead generation may rely more on search ads and landing pages.\n\nStart small, measure results, and scale what works. A focused strategy almost always beats a scattered one.",
                'published_at' => '2025-05-15',
                'is_published' => true,
            ],
            [
                'title' => 'Game Development Trends to Watch This Year',
                'slug' => 'game-development-trends-this-year',
                'category' => 'Game Development',
                'author' => 'Kenju Tech Team',
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
                'excerpt' => 'From cross-platform play to AI-powered NPCs, here are the trends shaping the future of game development.',
                'content' => "The game development industry continues to evolve rapidly. This year, a few key trends are shaping how games are built and played.\n\nCross-platform play is now expected by players, allowing friends to play together regardless of device.\n\nArtificial intelligence is also making its mark, from smarter NPCs to tools that help developers create content faster.\n\nCloud gaming and live service models are changing how games are distributed and monetised, while mobile gaming remains the largest and most accessible market.\n\nFor developers, staying current with these trends is essential to building games that players love and businesses can sustain.",
                'published_at' => '2025-04-30',
                'is_published' => true,
            ],
        ];

        $existingSlugs = BlogPost::pluck('slug')->toArray();
        foreach ($blogPostsData as $post) {
            if (in_array($post['slug'], $existingSlugs, true)) {
                continue;
            }
            BlogPost::factory()->create($post);
        }
    }
}
