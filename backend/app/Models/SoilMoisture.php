<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoilMoisture extends Model
{
    use HasFactory;

    protected $fillable = [
        'moisture_1',
        'moisture_2',
        'sensor_1',
        'sensor_2',
        'status_1',
        'status_2'
    ];
}