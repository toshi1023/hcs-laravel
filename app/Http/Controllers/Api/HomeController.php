<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('home');
    }

    public function welcome()
    {
        return view('welcome');
    }
}
