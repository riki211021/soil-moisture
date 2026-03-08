<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SoilMoisture;
use Carbon\Carbon;

class DeleteOldMoisture extends Command
{
    protected $signature = 'moisture:cleanup';
    protected $description = 'Delete old soil moisture data';

    public function handle()
    {
        SoilMoisture::where('created_at', '<', Carbon::now()->subMinutes(2))->delete();
        //subMinutes(10)
        //subHours(1)
        //subDays(1)

        $this->info('Old moisture data deleted');
    }
}
