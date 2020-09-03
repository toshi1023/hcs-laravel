<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use App\Model\Admin;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class AdminRepository extends BaseRepository implements AdminDatabaseInterface
{
    public function __construct (Admin $admin)
    {
        // Adminモデルをインスタンス化
        $this->model = $admin;
    }

}