
# Laravel API Structure for the ATS Application

This document outlines the Laravel backend API structure that connects to this React application for full CRUD operations.

## Project Setup

1. Set up a new Laravel project:
```bash
composer create-project laravel/laravel ats-backend
cd ats-backend
```

2. Create database connection in `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ats_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

## Models

### App/Models/Candidate.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'position',
        'status',
        'date',
        'initials',
        'application_stage_id',
    ];

    public function applicationStage(): BelongsTo
    {
        return $this->belongsTo(ApplicationStage::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }
}
```

### App/Models/Job.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'department',
        'location',
        'type',
        'status',
        'applicants',
        'posted_date',
        'description',
        'requirements',
        'responsibilities',
        'min_salary',
        'max_salary',
        'salary_currency',
    ];

    protected $casts = [
        'requirements' => 'array',
        'responsibilities' => 'array',
    ];

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}
```

### App/Models/ApplicationStage.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order',
    ];

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}
```

### App/Models/Interview.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'job_id',
        'date',
        'time',
        'interviewer',
        'type',
        'status',
        'notes',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
```

## Controllers

### App/Http/Controllers/CandidateController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CandidateController extends Controller
{
    public function index(): JsonResponse
    {
        $candidates = Candidate::with('applicationStage')->get();
        return response()->json($candidates);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'position' => 'required|string|max:255',
            'status' => 'required|string|in:new,reviewing,interview,offer,rejected',
            'application_stage_id' => 'nullable|exists:application_stages,id',
        ]);

        $nameParts = explode(' ', $validated['name']);
        $initials = count($nameParts) > 1 
            ? strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[count($nameParts) - 1], 0, 1))
            : strtoupper(substr($validated['name'], 0, 2));

        $candidate = Candidate::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'position' => $validated['position'],
            'status' => $validated['status'],
            'date' => now()->format('F j, Y'),
            'initials' => $initials,
            'application_stage_id' => $validated['application_stage_id'] ?? null,
        ]);

        return response()->json($candidate, 201);
    }

    public function show(Candidate $candidate): JsonResponse
    {
        return response()->json($candidate->load('applicationStage'));
    }

    public function update(Request $request, Candidate $candidate): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:candidates,email,' . $candidate->id,
            'position' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:new,reviewing,interview,offer,rejected',
            'application_stage_id' => 'nullable|exists:application_stages,id',
        ]);

        $candidate->update($validated);
        return response()->json($candidate);
    }

    public function destroy(Candidate $candidate): JsonResponse
    {
        $candidate->delete();
        return response()->json(null, 204);
    }

    public function updateStage(Request $request, Candidate $candidate): JsonResponse
    {
        $validated = $request->validate([
            'application_stage_id' => 'required|exists:application_stages,id',
        ]);

        $candidate->update([
            'application_stage_id' => $validated['application_stage_id']
        ]);

        return response()->json($candidate->load('applicationStage'));
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'candidates' => 'required|array',
            'candidates.*.name' => 'required|string|max:255',
            'candidates.*.email' => 'required|email',
            'candidates.*.position' => 'required|string|max:255',
            'candidates.*.status' => 'required|string|in:new,reviewing,interview,offer,rejected',
        ]);

        $importedCandidates = [];
        foreach ($request->candidates as $candidateData) {
            $nameParts = explode(' ', $candidateData['name']);
            $initials = count($nameParts) > 1 
                ? strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[count($nameParts) - 1], 0, 1))
                : strtoupper(substr($candidateData['name'], 0, 2));

            $candidate = Candidate::create([
                'name' => $candidateData['name'],
                'email' => $candidateData['email'],
                'position' => $candidateData['position'],
                'status' => $candidateData['status'],
                'date' => now()->format('F j, Y'),
                'initials' => $initials,
            ]);
            
            $importedCandidates[] = $candidate;
        }

        return response()->json($importedCandidates, 201);
    }

    public function bulkExport(Request $request): JsonResponse
    {
        $request->validate([
            'candidateIds' => 'required|array',
            'candidateIds.*' => 'exists:candidates,id',
        ]);

        $candidates = Candidate::whereIn('id', $request->candidateIds)->get();
        return response()->json($candidates);
    }
}
```

### App/Http/Controllers/JobController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JobController extends Controller
{
    public function index(): JsonResponse
    {
        $jobs = Job::all();
        return response()->json($jobs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|string|in:full-time,part-time,contract,remote',
            'status' => 'required|string|in:active,draft,closed,on-hold',
            'description' => 'required|string',
            'requirements' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'min_salary' => 'nullable|numeric',
            'max_salary' => 'nullable|numeric',
            'salary_currency' => 'nullable|string|size:3',
        ]);

        $job = Job::create([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'type' => $validated['type'],
            'status' => $validated['status'],
            'applicants' => 0,
            'posted_date' => $validated['status'] === 'draft' ? 'Draft' : 'Posted ' . now()->format('F j, Y'),
            'description' => $validated['description'],
            'requirements' => $validated['requirements'] ?? [],
            'responsibilities' => $validated['responsibilities'] ?? [],
            'min_salary' => $validated['min_salary'] ?? null,
            'max_salary' => $validated['max_salary'] ?? null,
            'salary_currency' => $validated['salary_currency'] ?? 'USD',
        ]);

        return response()->json($job, 201);
    }

    public function show(Job $job): JsonResponse
    {
        return response()->json($job);
    }

    public function update(Request $request, Job $job): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:full-time,part-time,contract,remote',
            'status' => 'sometimes|string|in:active,draft,closed,on-hold',
            'description' => 'sometimes|string',
            'requirements' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'min_salary' => 'nullable|numeric',
            'max_salary' => 'nullable|numeric',
            'salary_currency' => 'nullable|string|size:3',
        ]);

        $job->update($validated);
        return response()->json($job);
    }

    public function destroy(Job $job): JsonResponse
    {
        $job->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q');
        
        $jobs = Job::where('title', 'like', "%{$query}%")
            ->orWhere('department', 'like', "%{$query}%")
            ->orWhere('location', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();
            
        return response()->json($jobs);
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'jobs' => 'required|array',
            'jobs.*.title' => 'required|string|max:255',
            'jobs.*.department' => 'required|string|max:255',
            'jobs.*.location' => 'required|string|max:255',
            'jobs.*.type' => 'required|string|in:full-time,part-time,contract,remote',
            'jobs.*.status' => 'required|string|in:active,draft,closed,on-hold',
            'jobs.*.description' => 'required|string',
        ]);

        $importedJobs = [];
        foreach ($request->jobs as $jobData) {
            $job = Job::create([
                'title' => $jobData['title'],
                'department' => $jobData['department'],
                'location' => $jobData['location'],
                'type' => $jobData['type'],
                'status' => $jobData['status'],
                'applicants' => 0,
                'posted_date' => $jobData['status'] === 'draft' ? 'Draft' : 'Posted ' . now()->format('F j, Y'),
                'description' => $jobData['description'],
                'requirements' => $jobData['requirements'] ?? [],
                'responsibilities' => $jobData['responsibilities'] ?? [],
            ]);
            
            $importedJobs[] = $job;
        }

        return response()->json($importedJobs, 201);
    }

    public function bulkExport(Request $request): JsonResponse
    {
        $request->validate([
            'jobIds' => 'required|array',
            'jobIds.*' => 'exists:jobs,id',
        ]);

        $jobs = Job::whereIn('id', $request->jobIds)->get();
        return response()->json($jobs);
    }
}
```

### App/Http/Controllers/JobPortalController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class JobPortalController extends Controller
{
    public function getSources(): JsonResponse
    {
        // In a real app, these would likely come from the database
        $sources = ['LinkedIn', 'Indeed', 'Glassdoor', 'Monster'];
        return response()->json($sources);
    }

    public function importJobs(Request $request): JsonResponse
    {
        $request->validate([
            'source' => 'required|string',
        ]);

        // In a real app, you would integrate with the respective API
        // This is a mock implementation
        $importedJobs = [];
        
        // Mock data for demonstration purposes
        $jobTitles = [
            'Frontend Developer', 
            'Backend Engineer', 
            'UI/UX Designer', 
            'Product Manager'
        ];
        
        $locations = ['Remote', 'New York', 'San Francisco', 'Austin'];
        
        // Create 2 mock jobs
        for ($i = 0; $i < 2; $i++) {
            $title = $jobTitles[array_rand($jobTitles)] . ' (' . $request->source . ')';
            $department = ['Engineering', 'Design', 'Product'][array_rand(['Engineering', 'Design', 'Product'])];
            $location = $locations[array_rand($locations)];
            
            $job = Job::create([
                'title' => $title,
                'department' => $department,
                'location' => $location,
                'type' => 'full-time',
                'status' => 'active',
                'applicants' => 0,
                'posted_date' => 'Posted ' . now()->format('F j, Y') . ' - Imported from ' . $request->source,
                'description' => 'This is a job imported from ' . $request->source,
            ]);
            
            $importedJobs[] = $job;
        }

        return response()->json($importedJobs);
    }

    public function exportJobs(Request $request): JsonResponse
    {
        $request->validate([
            'jobIds' => 'required|array',
            'jobIds.*' => 'exists:jobs,id',
            'destination' => 'required|string',
        ]);

        $jobs = Job::whereIn('id', $request->jobIds)->get();
        
        // In a real app, you would call the API of the job portal
        // This is just a mock implementation

        // Log the export for demonstration
        \Log::info('Exporting ' . count($jobs) . ' jobs to ' . $request->destination);

        return response()->json(['success' => true]);
    }

    public function importCandidates(Request $request): JsonResponse
    {
        $request->validate([
            'source' => 'required|string',
        ]);

        // In a real app, you would integrate with the respective API
        // This is a mock implementation
        $importedCandidates = [];
        
        $firstNames = ['John', 'Jane', 'Alex', 'Taylor', 'Morgan'];
        $lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
        $positions = ['Frontend Developer', 'Designer', 'Product Manager', 'DevOps Engineer'];
        
        // Create 2 mock candidates
        for ($i = 0; $i < 2; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $fullName = $firstName . ' ' . $lastName;
            $email = strtolower($firstName) . '.' . strtolower($lastName) . '@example.com';
            $position = $positions[array_rand($positions)];
            
            $candidate = Candidate::create([
                'name' => $fullName,
                'email' => $email,
                'position' => $position,
                'status' => 'new',
                'date' => now()->format('F j, Y'),
                'initials' => strtoupper(substr($firstName, 0, 1) . substr($lastName, 0, 1)),
            ]);
            
            $importedCandidates[] = $candidate;
        }

        return response()->json($importedCandidates);
    }

    public function exportCandidates(Request $request): JsonResponse
    {
        $request->validate([
            'candidateIds' => 'required|array',
            'candidateIds.*' => 'exists:candidates,id',
            'destination' => 'required|string',
        ]);

        $candidates = Candidate::whereIn('id', $request->candidateIds)->get();
        
        // In a real app, you would call the API of the job portal
        // This is just a mock implementation

        // Log the export for demonstration
        \Log::info('Exporting ' . count($candidates) . ' candidates to ' . $request->destination);

        return response()->json(['success' => true]);
    }
}
```

## Routes

### routes/api.php
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\JobPortalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check route
Route::get('/health-check', function () {
    return response()->json(['status' => 'ok']);
});

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Candidates
    Route::apiResource('candidates', CandidateController::class);
    Route::patch('/candidates/{candidate}/stage', [CandidateController::class, 'updateStage']);
    Route::post('/candidates/bulk-import', [CandidateController::class, 'bulkImport']);
    Route::post('/candidates/bulk-export', [CandidateController::class, 'bulkExport']);
    
    // Jobs
    Route::apiResource('jobs', JobController::class);
    Route::get('/jobs/search', [JobController::class, 'search']);
    Route::post('/jobs/bulk-import', [JobController::class, 'bulkImport']);
    Route::post('/jobs/bulk-export', [JobController::class, 'bulkExport']);
    
    // Interviews
    Route::apiResource('interviews', InterviewController::class);
    
    // Job portal integrations
    Route::get('/job-portals/sources', [JobPortalController::class, 'getSources']);
    Route::post('/job-portals/import', [JobPortalController::class, 'importJobs']);
    Route::post('/job-portals/export-jobs', [JobPortalController::class, 'exportJobs']);
    Route::post('/job-portals/import-candidates', [JobPortalController::class, 'importCandidates']);
    Route::post('/job-portals/export-candidates', [JobPortalController::class, 'exportCandidates']);
});
```

## Database Migrations

### database/migrations/2025_05_08_000001_create_application_stages_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('application_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('application_stages');
    }
};
```

### database/migrations/2025_05_08_000002_create_jobs_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('department');
            $table->string('location');
            $table->enum('type', ['full-time', 'part-time', 'contract', 'remote']);
            $table->enum('status', ['active', 'draft', 'closed', 'on-hold']);
            $table->integer('applicants')->default(0);
            $table->string('posted_date');
            $table->text('description');
            $table->json('requirements')->nullable();
            $table->json('responsibilities')->nullable();
            $table->decimal('min_salary', 10, 2)->nullable();
            $table->decimal('max_salary', 10, 2)->nullable();
            $table->string('salary_currency', 3)->default('USD');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};
```

### database/migrations/2025_05_08_000003_create_candidates_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('position');
            $table->enum('status', ['new', 'reviewing', 'interview', 'offer', 'rejected']);
            $table->string('date');
            $table->string('initials', 10);
            $table->foreignId('application_stage_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates');
    }
};
```

### database/migrations/2025_05_08_000004_create_interviews_table.php
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_id')->nullable()->constrained()->onDelete('set null');
            $table->date('date');
            $table->time('time');
            $table->string('interviewer');
            $table->enum('type', ['phone', 'video', 'in-person']);
            $table->enum('status', ['scheduled', 'completed', 'cancelled', 'no-show']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('interviews');
    }
};
```

## Database Seeders

### database/seeders/ApplicationStageSeeder.php
```php
<?php

namespace Database\Seeders;

use App\Models\ApplicationStage;
use Illuminate\Database\Seeder;

class ApplicationStageSeeder extends Seeder
{
    public function run()
    {
        $stages = [
            ['name' => 'Applied', 'order' => 1],
            ['name' => 'Resume Screening', 'order' => 2],
            ['name' => 'Phone Screen', 'order' => 3],
            ['name' => 'Skills Assessment', 'order' => 4],
            ['name' => 'First Interview', 'order' => 5],
            ['name' => 'Second Interview', 'order' => 6],
            ['name' => 'Reference Check', 'order' => 7],
            ['name' => 'Offer', 'order' => 8],
            ['name' => 'Hired', 'order' => 9],
            ['name' => 'Rejected', 'order' => 10],
        ];

        foreach ($stages as $stage) {
            ApplicationStage::create($stage);
        }
    }
}
```

### database/seeders/DatabaseSeeder.php
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ApplicationStageSeeder::class,
        ]);
    }
}
```

## Running the Laravel API Server

After setting up the code, you'll need to:

1. Run migrations:
```bash
php artisan migrate
```

2. Seed the database:
```bash
php artisan db:seed
```

3. Generate the application key:
```bash
php artisan key:generate
```

4. Set up Laravel Sanctum for authentication:
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

5. Run the API server:
```bash
php artisan serve
```

## API Documentation

API endpoints follow RESTful conventions:

- `GET /api/candidates` - List all candidates
- `GET /api/candidates/{id}` - Get a specific candidate
- `POST /api/candidates` - Create a new candidate 
- `PUT /api/candidates/{id}` - Update a candidate
- `DELETE /api/candidates/{id}` - Delete a candidate
- `POST /api/candidates/bulk-import` - Import multiple candidates
- `POST /api/candidates/bulk-export` - Export selected candidates

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get a specific job
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/{id}` - Update a job
- `DELETE /api/jobs/{id}` - Delete a job
- `GET /api/jobs/search?q={query}` - Search jobs
- `POST /api/jobs/bulk-import` - Import multiple jobs
- `POST /api/jobs/bulk-export` - Export selected jobs

- `GET /api/job-portals/sources` - Get available job portal sources
- `POST /api/job-portals/import` - Import jobs from external job portal
- `POST /api/job-portals/export-jobs` - Export jobs to external job portal
- `POST /api/job-portals/import-candidates` - Import candidates from external job portal
- `POST /api/job-portals/export-candidates` - Export candidates to external job portal
