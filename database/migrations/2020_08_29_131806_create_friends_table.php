<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('friends', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id_requester')->unsigned();                // 申請者
            $table->integer('user_id_target')->unsigned();                   // 対象
            $table->tinyInteger('status')->unsigned()->default(1);           // 1: 申請中, 2: 承認済み, 3: 却下
            $table->tinyInteger('delete_flg')->unsigned()->default(0);;      // 0: noフラグ, 1: 削除
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('friends');
    }
}
