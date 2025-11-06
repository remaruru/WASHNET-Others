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
        // For PostgreSQL, drop existing constraint if exists, then add new one
        if (DB::getDriverName() === 'pgsql') {
            // Drop existing constraint if it exists
            DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_service_type_check');
            // Add new constraint with 'mixed' included
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_service_type_check CHECK (service_type IN ('wash_dry', 'wash_only', 'dry_only', 'mixed'))");
            // Update default if needed
            DB::statement("ALTER TABLE orders ALTER COLUMN service_type SET DEFAULT 'wash_dry'");
        } else {
            // MySQL syntax (for backward compatibility)
            DB::statement("ALTER TABLE orders MODIFY COLUMN service_type ENUM('wash_dry', 'wash_only', 'dry_only', 'mixed') DEFAULT 'wash_dry'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For PostgreSQL, drop constraint and recreate with original values
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_service_type_check');
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_service_type_check CHECK (service_type IN ('wash_dry', 'wash_only', 'dry_only'))");
        } else {
            // MySQL syntax
            DB::statement("ALTER TABLE orders MODIFY COLUMN service_type ENUM('wash_dry', 'wash_only', 'dry_only') DEFAULT 'wash_dry'");
        }
    }
};
