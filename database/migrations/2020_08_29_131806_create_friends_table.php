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
            $table->increments('id')->comment('ID');
            $table->integer('user_id')->unsigned()->comment('申請者');                          // 申請者
            $table->integer('user_id_target')->unsigned()->comment('対象');                     // 対象
            $table->tinyInteger('status')->unsigned()->default(1)->comment('申請ステータス');    // 1: 申請中, 2: 承認済み, 3: 却下
            $table->boolean('delete_flg')->default(false)->comment('削除フラグ');                // 0: noフラグ, 1: 削除
            $table->timestamps();
        
            // 外部キー制約
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('user_id_target')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
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
