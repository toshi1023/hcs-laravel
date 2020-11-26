<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    protected $database;
    protected $service;

    public function __construct()
    {
      Parent::__construct();
    }

}
