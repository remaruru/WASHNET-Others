<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Use string for PostgreSQL compatibility
            $table->string('role')->default('employee');
        });
        
        // Add check constraint for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'employee'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop constraint first for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
        }
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
