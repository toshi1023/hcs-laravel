<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

class UserController extends Controller
{
    public function index()
    {

      $users = User::latest('updated_at')->get();

      return view('users.index',[ 'users' => $users ]);

    }

    public function show(User $user)
    {
      return view('users.show', [
        'user' => $user,
      ]);
    }
}
