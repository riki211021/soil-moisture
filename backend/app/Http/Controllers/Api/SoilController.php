<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SoilMoisture;
use Illuminate\Support\Facades\DB;

class SoilController extends Controller
{
public function store(Request $request)
{

SoilMoisture::create([
    'moisture_1' => $request->input('moisture1'),
    'moisture_2' => $request->input('moisture2'),
    'sensor_1' => $request->input('sensor1'),
    'sensor_2' => $request->input('sensor2'),
    'status_1' => $request->input('status1'),
    'status_2' => $request->input('status2')
]);

DB::statement("
DELETE FROM soil_moistures
WHERE id NOT IN (
SELECT id FROM (
SELECT id FROM soil_moistures ORDER BY id DESC LIMIT 200
) temp
)
");

return response()->json([
'status' => 'success'
]); 

}

public function index()
{
    return SoilMoisture::latest()
        ->limit(15)
        ->get()
        ->map(function($item){

            $item->time = $item->created_at->format('H:i:s');
            $item->date = $item->created_at->format('d-m-Y');

            return $item;
        });
}
}