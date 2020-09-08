<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:user');
    }

    public function index()
    {
        return view('home');
    }

    public function welcome()
    {
        return view('welcome');
    }
}
