<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'description',
        // 'experience_number',
        // 'experience_unit',
        'experience',
        'type',
        'location',
        'education_level',
        'requirements',
        'skills',
        'salary',
        'payment_unit',
        'payment_period'
    ];
}
