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
        Schema::table('orders', function (Blueprint $table) {
            // PostgreSQL doesn't support 'after', and enum handling is different
            $table->string('service_type')->default('wash_dry');
        });
        
        // Add check constraint for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_service_type_check CHECK (service_type IN ('wash_dry', 'wash_only', 'dry_only'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop constraint first for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_service_type_check');
        }
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('service_type');
        });
    }
};
