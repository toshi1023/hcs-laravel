<?php 

namespace App\SubValidation;

class SubValidation
{
    // 編集時のパスワードをバリデート
    public function passwordValidation($request)
    {
        $request->validate([
            'password' => ['required', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'min:6'],
        ]);
    }
}