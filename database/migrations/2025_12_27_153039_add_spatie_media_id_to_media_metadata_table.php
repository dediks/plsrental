<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('media_metadata', function (Blueprint $table) {
            $table->unsignedBigInteger('spatie_media_id')->nullable()->after('id');
            $table->foreign('spatie_media_id')->references('id')->on('media')->onDelete('cascade');
            $table->index('spatie_media_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_metadata', function (Blueprint $table) {
            $table->dropForeign(['spatie_media_id']);
            $table->dropIndex(['spatie_media_id']);
            $table->dropColumn('spatie_media_id');
        });
    }
};
