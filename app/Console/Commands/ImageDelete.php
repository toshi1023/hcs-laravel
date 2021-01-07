<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImageDelete extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'image:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'DBに存在しない画像をストレージから削除します';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            // ユーザ情報の取得
            $users = \App\Model\User::all();

            // 画像の削除処理
            $user_images = [];
            $article_images = [];
            foreach($users as $value) {
                // ユーザ名をキーにして、画像名を2次元配列で取得
                // $user_images[$value->name] = [basename(Storage::disk('s3')->files(config('const.aws_user_bucket').'/'.$value->name.'/'))];
                // $article_images[$value->name] = [basename(Storage::disk('s3')->files(config('const.aws_article_bucket').'/'.$value->name.'/'))];

                $user_images[$value->name] = [$value->id, $value->name, $value->prefecture];
            }

            // 画像をユーザ名と画像名で分別
            foreach ($user_images as $key => $value) {
                // S3のストレージに保存されている画像名がDBに存在するか確認
                foreach ($value as $image) {
                    if (!DB::table('users')->where('users_photo_name', $image)->exists()) {
                        // 存在しない場合は画像を削除する
                        Storage::disk('s3')->delete(config('const.aws_user_bucket').'/'.$key.'/'.$image);
                    }
                }
            }
            // 記事用の画像の削除処理
            foreach ($article_images as $key => $value) {
                // S3のストレージに保存されている画像名がDBに存在するか確認
                foreach ($value as $image) {
                    if (!DB::table('article_images')->where('articles_photo_name', $image)->exists()) {
                        // 存在しない場合は画像を削除する
                        Storage::disk('s3')->delete(config('const.aws_article_bucket').'/'.$key.'/'.$image);
                    }
                }
            }

            // Logにメッセージを出力
            logger()->info('All images delete Completed!');
            // ターミナルにメッセージを出力
            $this->info('All images delete Completed!');

        } catch(\Exception $e) {
            // Logにエラーメッセージを出力
            logger()->error($e->getMessage());
            // ターミナルにエラーメッセージを出力
            $this->error($e->getMessage());
        }
    }
}
