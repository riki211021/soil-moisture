<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class MoistureController extends Controller
{

    public function controlPump(Request $request)
    {

        if ($request->has('pump1_mode')) {
            Cache::put('pump1_mode', $request->pump1_mode);
        }

        if ($request->has('pump2_mode')) {
            Cache::put('pump2_mode', $request->pump2_mode);
        }

        if ($request->has('pump1_status')) {
            Cache::put('pump1_status', $request->pump1_status);
        }

        if ($request->has('pump2_status')) {
            Cache::put('pump2_status', $request->pump2_status);
        }

        return response()->json([
            'pump1_mode' => Cache::get('pump1_mode','auto'),
            'pump1_status' => Cache::get('pump1_status',0),
            'pump2_mode' => Cache::get('pump2_mode','auto'),
            'pump2_status' => Cache::get('pump2_status',0),
        ]);
    }


    public function pumpStatus()
    {

        return response()->json([
            'pump1_mode' => Cache::get('pump1_mode','auto'),
            'pump1_status' => Cache::get('pump1_status',0),
            'pump2_mode' => Cache::get('pump2_mode','auto'),
            'pump2_status' => Cache::get('pump2_status',0),
        ]);

    }

}