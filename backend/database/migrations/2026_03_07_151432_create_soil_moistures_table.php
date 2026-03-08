<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('soil_moistures', function (Blueprint $table) {
            $table->id();

            $table->float('moisture_1');
            $table->float('moisture_2');

            $table->integer('sensor_1');
            $table->integer('sensor_2');

            $table->string('status_1');
            $table->string('status_2');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('soil_moistures');
    }
};