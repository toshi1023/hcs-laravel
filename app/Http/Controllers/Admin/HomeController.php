<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index()
    {
        // dd(\Auth::guard());
        return view('admin/home');
    }

    public function welcome()
    {
        return view('welcome');
    }
}
