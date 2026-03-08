<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SoilController;
use App\Http\Controllers\Api\MoistureController;

Route::post('/moisture', [SoilController::class, 'store']);
Route::get('/moisture', [SoilController::class, 'index']);
Route::post('/pump/control', [MoistureController::class,'controlPump']);
Route::get('/pump/status', [MoistureController::class,'pumpStatus']);
